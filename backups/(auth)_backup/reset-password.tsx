import { useState, useEffect } from 'react';
import { Alert, View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { supabase } from '../../src/utils/supabase';
import { Stack, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const establishSession = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        try {
          // Parse tokens from the query string (not hash fragment)
          const urlObj = new URL(url);
          const access_token = urlObj.searchParams.get('access_token');
          const refresh_token = urlObj.searchParams.get('refresh_token');
          
          if (access_token && refresh_token) {
            await supabase.auth.setSession({ access_token, refresh_token });
          }
        } catch (error) {
          console.error('Error parsing URL or setting session:', error);
        }
      }
    };
    establishSession();
  }, []);

  const handleResetPassword = async () => {
    if (password.length < 6) {
      Alert.alert('Password too short', 'Please enter a password that is at least 6 characters long.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: password });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Your password has been set successfully.', [
        { text: 'OK', onPress: () => router.replace('/') }
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
