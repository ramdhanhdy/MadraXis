import { useState, useEffect } from 'react';
import { Alert, View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { supabase } from '../../src/utils/supabase';
import { Stack, useRouter, useGlobalSearchParams } from 'expo-router';

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
      router.replace('/(auth)/reset-password');
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
      <Text style={styles.title}>
        Choose a New Password
      </Text>
      <TextInput
        placeholder="New Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        autoCapitalize="none"
      />
      <Button
        title={loading ? 'Setting...' : 'Set New Password'}
        onPress={handleResetPassword}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});
