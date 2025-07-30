import { useState, useEffect } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { supabase } from '../../src/utils/supabase';
import { Stack, useRouter, useGlobalSearchParams } from 'expo-router';
import { Button } from '@ui/atoms/Button';
import { Input } from '@ui/atoms/Input';
import { Typography } from '@ui/atoms/Typography';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { access_token, refresh_token } = useGlobalSearchParams();

  useEffect(() => {
    if (!access_token || !refresh_token) {
      return;
    }

    if (typeof access_token !== 'string' || typeof refresh_token !== 'string') {
      Alert.alert('Error', 'Invalid password reset link format.');
      router.replace('/(auth)/login');
      return;
    }

    const establishSession = async () => {
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        Alert.alert(
          'Error',
          'Failed to process password reset link. It may have expired. Please try again.'
        );
        console.error('Error setting session:', error.message);
        router.replace('/(auth)/login');
      }
    };

    establishSession();
  }, [access_token, refresh_token, router]);

  const handleResetPassword = async () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Password Not Strong Enough',
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: password });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setPassword(''); // Clear password from state
      Alert.alert('Success', 'Your password has been set successfully.', [
        { text: 'OK', onPress: () => router.replace('/') },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Set Password' }} />
      <Typography variant="h3" align="center" style={styles.title}>
        Choose a New Password
      </Typography>
      
      <Input
        label="New Password"
        placeholder="Enter new password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        helperText="Must be 8+ characters with uppercase, lowercase, number, and special character"
        leftIcon="lock-closed-outline"
      />
      
      <Button
        variant="primary"
        size="large"
        fullWidth
        onPress={handleResetPassword}
        disabled={loading}
        loading={loading}
        style={styles.button}
      >
        Set New Password
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  title: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});
