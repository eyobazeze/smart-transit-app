import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../components/InputField';
import { AuthLayout, SocialRow } from '../components/Auth';
import { Button, PressableScale } from '../components/ui';
import { colors, typography } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const pwRef = useRef(null);

  const submit = () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'Enter a valid email address';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    if (!Object.keys(e).length) navigation.replace('Main');
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to plan, track and ride smarter."
      footer={
        <>
          <SocialRow />
          <PressableScale onPress={() => navigation.navigate('SignUp')} haptic={false} style={styles.switchWrap}>
            <Text style={styles.switchText}>
              New here? <Text style={styles.link}>Create an account</Text>
            </Text>
          </PressableScale>
        </>
      }
    >
      <InputField
        icon="mail-outline"
        placeholder="Email address"
        value={email}
        onChangeText={(t) => { setEmail(t); if (errors.email) setErrors({ ...errors, email: null }); }}
        keyboardType="email-address"
        error={errors.email}
        returnKeyType="next"
        onSubmitEditing={() => pwRef.current && pwRef.current.focus()}
      />
      <InputField
        inputRef={pwRef}
        icon="lock-closed-outline"
        placeholder="Password"
        value={password}
        onChangeText={(t) => { setPassword(t); if (errors.password) setErrors({ ...errors, password: null }); }}
        secureTextEntry={secure}
        isPassword
        toggleSecure={() => setSecure(!secure)}
        error={errors.password}
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      <View style={styles.row}>
        <PressableScale onPress={() => setRemember(!remember)} haptic={false} scaleTo={0.98} style={styles.remember}>
          <Ionicons name={remember ? 'checkbox' : 'square-outline'} size={20} color={remember ? colors.primary800 : colors.grey500} />
          <Text style={styles.rememberText}>Remember me</Text>
        </PressableScale>
        <Text style={styles.forgot}>Forgot password?</Text>
      </View>
      <Button title="Sign In" onPress={submit} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  remember: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rememberText: { ...typography.b4, color: colors.grey600 },
  forgot: { ...typography.b4, color: colors.primary800 },
  switchWrap: { alignSelf: 'center', paddingVertical: 6 },
  switchText: { ...typography.b3, color: colors.grey600 },
  link: { ...typography.b4, color: colors.primary800 },
});
