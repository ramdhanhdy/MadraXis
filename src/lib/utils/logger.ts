type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  operation?: string;
  userId?: string;
  classId?: number;
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  private sanitizeData(data: any): any {
    if (!data) return data;
    
    const sensitiveFields = [
      // Authentication & Security
      'password', 'token', 'secret', 'key', 'auth', 'jwt', 'bearer', 'api_key', 'private_key',
      
      // Personal Information
      'email', 'phone', 'address', 'full_name', 'nama_lengkap', 'nik', 'no_ktp',
      
      // Indonesian Education System - Student Identifiers
      'nis', 'nisn', 'nomor_induk', 'student_id', 'siswa_id', 'peserta_didik_id',
      'nim', 'npm', 'nomor_mahasiswa',
      
      // Indonesian Education System - School Identifiers
      'npsn', 'sekolah_id', 'satuan_pendidikan_id', 'institution_id', 'school_id',
      'kode_sekolah', 'id_sekolah', 'kode_satuan_pendidikan',
      
      // Indonesian Regional Codes & Administrative
      'kode_wilayah', 'wilayah_id', 'provinsi_id', 'kabupaten_id', 'kode_kabupaten',
      'kecamatan_id', 'kode_kecamatan', 'kelurahan_id', 'kode_desa', 'desa_id',
      'kode_pos', 'postal_code',
      
      // Indonesian Education System - Employee/Tendik Identifiers
      'nuptk', 'nrg', 'nrg_ptk', 'ptk_id', 'guru_id', 'teacher_id', 'employee_id',
      'nip', 'nip_lama', 'nip_baru', 'karpeg', 'karis_karsu',
      
      // Exam & Assessment Identifiers
      'ujian_id', 'assessment_id', 'exam_id', 'test_id', 'kode_ujian', 'nomor_peserta',
      'no_registrasi', 'registration_number', 'no_peserta', 'nomor_registrasi',
      
      // Financial & Banking
      'rekening', 'no_rekening', 'bank_account', 'credit_card', 'debit_card',
      
      // Health & Medical
      'bpjs', 'no_bpjs', 'health_id', 'medical_record', 'no_rm', 'pasien_id',
      
      // Family Information
      'orang_tua_id', 'wali_id', 'parent_id', 'guardian_id', 'father_nik', 'mother_nik',
      
      // Indonesian National ID & Documents
      'kk', 'no_kk', 'kartu_keluarga', 'akte', 'akte_kelahiran', 'ijazah', 'skhun',
      
      // Device & Technology
      'imei', 'device_id', 'mac_address', 'ip_address', 'session_id', 'cookie', 'fcm_token',
      
      // Legacy & Common Variations
      'password_hash', 'hashed_password', 'encrypted_data', 'signature', 'hash', 'salt'
    ];
    
    const isSensitiveField = (key: string): boolean => {
      const lowerKey = key.toLowerCase();
      return sensitiveFields.some(field =>
        field.toLowerCase() === lowerKey ||
        lowerKey.includes(field.toLowerCase())
      );
    };
    
    const recursiveSanitize = (value: any): any => {
      if (value === null || value === undefined) {
        return value;
      }
      
      if (Array.isArray(value)) {
        return value.map(recursiveSanitize);
      }
      
      if (typeof value === 'object' && value !== null) {
        const sanitized: any = {};
        
        for (const [key, val] of Object.entries(value)) {
          if (isSensitiveField(key)) {
            sanitized[key] = '[REDACTED]';
          } else {
            sanitized[key] = recursiveSanitize(val);
          }
        }
        
        return sanitized;
      }
      
      return value;
    };
    
    return recursiveSanitize(data);
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.isDevelopment && level === 'debug') return;
    
    const timestamp = new Date().toISOString();
    const sanitizedContext = context ? this.sanitizeData(context) : undefined;
    
    const logEntry = {
      timestamp,
      level,
      message,
      ...(sanitizedContext && { context: sanitizedContext })
    };
    
    console[level === 'debug' ? 'log' : level](JSON.stringify(logEntry));
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }
}

export const logger = new Logger();
