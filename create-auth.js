const fs = require('fs');

const signInCode = "import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useSignIn } from '@clerk/expo';
import { useRouter } from 'expo-router';

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({ identifier: emailAddress, password });
      if (completeSignIn.status === 'complete') {
        await setActive({ session: completeSignIn.createdSessionId });
        router.replace('/dashboard');
      } else {
        console.error(JSON.stringify(completeSignIn, null, 2));
      }
    } catch (err) {
      Alert.alert('Error', err.errors?.[0]?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sign In</Text>
        <Input label='Email' value={emailAddress} onChangeText={setEmailAddress} autoCapitalize='none' keyboardType='email-address' />
        <Input label='Password' value={password} onChangeText={setPassword} secureTextEntry={true} />
        <Button onPress={onSignInPress} loading={loading} style={styles.button}>Sign In</Button>
        <Button variant='ghost' onPress={() => router.push('/sign-up')}>Don't have an account? Sign up</Button>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, flex: 1, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 32, textAlign: 'center', color: '#0F172A' },
  button: { marginTop: 16, marginBottom: 16 }
});";

const signUpCode = "import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useSignUp } from '@clerk/expo';
import { useRouter } from 'expo-router';

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err) {
      Alert.alert('Error', err.errors?.[0]?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/dashboard');
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err) {
      Alert.alert('Error', err.errors?.[0]?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sign Up</Text>
        {!pendingVerification && (
          <>
            <Input label='Email' value={emailAddress} onChangeText={setEmailAddress} autoCapitalize='none' keyboardType='email-address' />
            <Input label='Password' value={password} onChangeText={setPassword} secureTextEntry={true} />
            <Button onPress={onSignUpPress} loading={loading} style={styles.button}>Sign Up</Button>
            <Button variant='ghost' onPress={() => router.push('/sign-in')}>Already have an account? Sign in</Button>
          </>
        )}
        {pendingVerification && (
          <>
            <Input label='Verification Code' value={code} onChangeText={setCode} keyboardType='numeric' />
            <Button onPress={onPressVerify} loading={loading} style={styles.button}>Verify Email</Button>
          </>
        )}
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, flex: 1, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 32, textAlign: 'center', color: '#0F172A' },
  button: { marginTop: 16, marginBottom: 16 }
});";

fs.writeFileSync('app/(auth)/sign-in.tsx', signInCode);
fs.writeFileSync('app/(auth)/sign-up.tsx', signUpCode);
