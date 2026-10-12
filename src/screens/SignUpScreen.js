import React, { useRef, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import InputField from '../components/InputField';
import { AuthLayout, SocialRow } from '../components/Auth';
import { Button, PressableScale } from '../components/ui';
import { colors, typography } from '../theme/colors';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [errors, setErrors] = useState({});
  const emailRef = useRef(null);
  const pwRef = useRef(null);

  const clear = (k) => errors[k] && setErrors({ ...errors, [k]: null });
  const submit = () => {
    const e = {};
    if (name.trim().length < 2) e.name = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'Enter a valid email address';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    if (!Object.keys(e).length) navigation.replace('Main');
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join to plan, track and ride smarter."
      footer={
        <>
          <SocialRow />
          <PressableScale onPress={() => navigation.navigate('Login')} haptic={false} style={styles.switchWrap}>
            <Text style={styles.switchText}>
              Already have an account? <Text style={styles.link}>Sign in</Text>
            </Text>
          </PressableScale>
        </>
      }
    >
      <InputField icon="person-outline" placeholder="Full name" value={name} onChangeText={(t) => { setName(t); clear('name'); }} autoCapitalize="words" error={errors.name} returnKeyType="next" onSubmitEditing={() => emailRef.current && emailRef.current.focus()} />
      <InputField inputRef={emailRef} icon="mail-outline" placeholder="Email address" value={email} onChangeText={(t) => { setEmail(t); clear('email'); }} keyboardType="email-address" error={errors.email} returnKeyType="next" onSubmitEditing={() => pwRef.current && pwRef.current.focus()} />
      <InputField inputRef={pwRef} icon="lock-closed-outline" placeholder="Password (6+ characters)" value={password} onChangeText={(t) => { setPassword(t); clear('password'); }} secureTextEntry={secure} isPassword toggleSecure={() => setSecure(!secure)} error={errors.password} returnKeyType="done" onSubmitEditing={submit} />
      <Button title="Create Account" onPress={submit} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  switchWrap: { alignSelf: 'center', paddingVertical: 6 },
  switchText: { ...typography.b3, color: colors.grey600 },
  link: { ...typography.b4, color: colors.primary800 },
});
