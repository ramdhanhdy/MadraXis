import { logger } from '../../utils/logger';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClassService, ClassWithDetails } from '@/src/services/classService';
import { CreateClassData, UpdateClassData } from '@/src/types/class';
import { useAuth } from '@/src/hooks/useAuth';

interface ClassFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classData?: ClassWithDetails | null;
  schoolId: number;
}

export default function ClassFormModal({
  visible,
  onClose,
  onSuccess,
  classData,
  schoolId
}: ClassFormModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateClassData>({
    name: '',
    level: '',
    description: '',
    school_id: schoolId,
    student_capacity: 30,
    academic_year: new Date().getFullYear().toString(),
    semester: '1'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (classData) {
      setFormData({
        name: classData.name,
        level: classData.level,
        description: classData.description || '',
        school_id: classData.school_id,
        student_capacity: classData.student_capacity,
        academic_year: classData.academic_year,
        semester: classData.semester
      });
    } else {
      setFormData({
        name: '',
        level: '',
        description: '',
        school_id: schoolId,
        student_capacity: 30,
        academic_year: new Date().getFullYear().toString(),
        semester: '1'
      });
    }
    setErrors({});
  }, [classData, schoolId, visible]);

  const validateAcademicYear = (year: string): boolean => {
    // Validate format: YYYY or YYYY-YYYY
    const singleYear = /^\d{4}$/;
    const rangeYear = /^\d{4}-\d{4}$/;

    if (singleYear.test(year)) {
      const yearNum = parseInt(year);
      const currentYear = new Date().getFullYear();
      return yearNum >= 2000 && yearNum <= currentYear + 10;
    }

    if (rangeYear.test(year)) {
      const [startYear, endYear] = year.split('-').map((y) => parseInt(y));
      return startYear < endYear && endYear - startYear === 1;
    }

    return false;
  };

  const formatAcademicYear = (value: string): string => {
    // Remove non-numeric and non-dash characters
    let cleanValue = value.replace(/[^\d-]/g, '');

    // Handle auto-formatting for range
    if (cleanValue.length > 4 && !cleanValue.includes('-')) {
      const year = cleanValue.substring(0, 4);
      const nextYear = (parseInt(year) + 1).toString();
      return `${year}-${nextYear}`;
    }

    return cleanValue;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama kelas wajib diisi';
    }

    if (!formData.level.trim()) {
      newErrors.level = 'Tingkat kelas wajib diisi';
    }

    if (formData.student_capacity && formData.student_capacity < 1) {
      newErrors.student_capacity = 'Kapasitas siswa minimal 1';
    }

    if (!formData.academic_year.trim()) {
      newErrors.academic_year = 'Tahun akademik wajib diisi';
    } else if (!validateAcademicYear(formData.academic_year)) {
      newErrors.academic_year = 'Format tahun akademik tidak valid (YYYY atau YYYY-YYYY)';
    }

    if (!formData.semester.trim()) {
      newErrors.semester = 'Semester wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!user?.id) {
      Alert.alert('Error', 'User tidak terautentikasi');
      return;
    }

    try {
      setLoading(true);

      if (classData) {
        // Update existing class
        const updateData: UpdateClassData = {
          name: formData.name,
          level: formData.level,
          description: formData.description,
          student_capacity: formData.student_capacity,
          academic_year: formData.academic_year,
          semester: formData.semester
        };

        await ClassService.updateClass(classData.id, updateData, user.id);
        Alert.alert('Success', 'Kelas berhasil diperbarui');
        onSuccess();
      } else {
        // Create new class
        await ClassService.createClass(formData, user.id);
        Alert.alert('Success', 'Kelas berhasil dibuat');
        onSuccess();
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan kelas');
      logger.error('Error saving class', {
        error: error instanceof Error ? error.message : String(error),
        operation: classData ? 'update_class' : 'create_class',
        classId: classData?.id
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateClassData, value: string | number | '1' | '2') => {
    let processedValue = value;

    if (field === 'academic_year' && typeof value === 'string') {
      processedValue = formatAcademicYear(value);
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {classData ? 'Edit Kelas' : 'Tambah Kelas Baru'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nama Kelas *</Text>
              <TextInput
                style={[styles.textInput, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Contoh: Tahfidz Al-Baqarah"
                placeholderTextColor="#999999"
                maxLength={100} />
              
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tingkat *</Text>
              <TextInput
                style={[styles.textInput, errors.level && styles.inputError]}
                value={formData.level}
                onChangeText={(value) => handleInputChange('level', value)}
                placeholder="Contoh: Tingkat 1"
                placeholderTextColor="#999999"
                maxLength={50} />
              
              {errors.level && <Text style={styles.errorText}>{errors.level}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Deskripsi</Text>
              <TextInput
                style={[styles.textInput, styles.textArea, errors.description && styles.inputError]}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Deskripsi kelas..."
                placeholderTextColor="#999999"
                multiline
                numberOfLines={4}
                maxLength={500} />
              
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kapasitas Siswa *</Text>
              <TextInput
                style={[styles.textInput, errors.student_capacity && styles.inputError]}
                value={formData.student_capacity?.toString() || ''}
                onChangeText={(value) => handleInputChange('student_capacity', parseInt(value) || 0)}
                placeholder="30"
                placeholderTextColor="#999999"
                keyboardType="numeric"
                maxLength={3} />
              
              {errors.student_capacity && <Text style={styles.errorText}>{errors.student_capacity}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tahun Akademik *</Text>
              <TextInput
                style={[styles.textInput, errors.academic_year && styles.inputError]}
                value={formData.academic_year}
                onChangeText={(value) => handleInputChange('academic_year', value)}
                placeholder="2024-2025"
                placeholderTextColor="#999999"
                keyboardType="numeric"
                maxLength={9} />
              
              
              <Text style={styles.inputHelp}>
                Format: YYYY atau YYYY-YYYY (contoh: 2024 atau 2024-2025)
              </Text>
              {errors.academic_year && <Text style={styles.errorText}>{errors.academic_year}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Semester *</Text>
              <View style={styles.semesterContainer}>
                {['1', '2'].map((semester) =>
                <TouchableOpacity
                  key={semester}
                  style={[
                  styles.semesterOption,
                  formData.semester === semester && styles.selectedSemester]
                  }
                  onPress={() => handleInputChange('semester', semester as '1' | '2')}>
                  
                    <Text
                    style={[
                    styles.semesterText,
                    formData.semester === semester && styles.selectedSemesterText]
                    }>
                    
                      Semester {semester}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {errors.semester && <Text style={styles.errorText}>{errors.semester}</Text>}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.cancelButton, loading && styles.disabledButton]}
              onPress={onClose}
              disabled={loading}>
              
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}>
              
              {loading ?
              <ActivityIndicator size="small" color="#ffffff" /> :

              <Text style={styles.saveButtonText}>
                  {classData ? 'Update' : 'Simpan'}
                </Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>);

}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333'
  },
  closeButton: {
    padding: 4
  },
  modalBody: {
    padding: 20
  },
  inputGroup: {
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff'
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  inputError: {
    borderColor: '#ff3b30'
  },
  errorText: {
    fontSize: 14,
    color: '#ff3b30',
    marginTop: 4
  },
  inputHelp: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4
  },
  semesterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  semesterOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff'
  },
  selectedSemester: {
    backgroundColor: '#005e7a',
    borderColor: '#005e7a'
  },
  semesterText: {
    fontSize: 14,
    color: '#333333'
  },
  selectedSemesterText: {
    color: '#ffffff'
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#e0e0e0'
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666666'
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#005e7a'
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  disabledButton: {
    opacity: 0.5
  }
});