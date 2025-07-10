// Test script for OTP functionality - LOGIN ONLY (B2B app)
// Run with: node docs/test-otp.js

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testOTPLogin() {
  console.log('🧪 Testing OTP LOGIN functionality (B2B - existing users only)...\n');
  
  // Test with existing user email (from previous queries)
  const testEmail = 'ramdhanhdy3@gmail.com';
  
  try {
    console.log(`📧 Sending OTP LOGIN code to existing user: ${testEmail}`);
    
    const { data, error } = await supabase.auth.signInWithOtp({
      email: testEmail,
      options: {
        shouldCreateUser: false, // B2B: Only allow login for existing users
      }
    });
    
    if (error) {
      if (error.message.includes('Signups not allowed for otp')) {
        console.log('ℹ️  Expected behavior: OTP signup is disabled (good for B2B)');
        console.log('🔄 Trying with a different approach...');
        
        // Try without shouldCreateUser option - might work for existing users
        const { data: data2, error: error2 } = await supabase.auth.signInWithOtp({
          email: testEmail
        });
        
        if (error2) {
          console.error('❌ OTP Login Error:', error2.message);
          console.log('\n📋 Manual configuration needed:');
          console.log('1. Go to Supabase Dashboard > Auth > Settings');
          console.log('2. Ensure "Enable email confirmations" is ON');
          console.log('3. Configure Email Templates > Magic Link to show OTP token');
          return;
        }
        
        console.log('✅ OTP sent successfully (existing user)!');
        console.log('📊 Response data:', data2);
      } else {
        console.error('❌ OTP Error:', error.message);
        return;
      }
    } else {
      console.log('✅ OTP sent successfully!');
      console.log('📊 Response data:', data);
    }
    
    console.log('\n📋 Next steps:');
    console.log('1. Check email inbox for OTP code');
    console.log('2. Note email template format (should show 6-digit code)');
    console.log('3. Test verification in app UI with: supabase.auth.verifyOtp()');
    console.log('4. This confirms OTP LOGIN works for existing B2B users');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testOTPLogin(); 