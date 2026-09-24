import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../components/InputField';
import { colors, typography } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Access your trips and transport info in seconds.</Text>
        </View>

        <View style={styles.illustration}>
          <Ionicons name="bus" size={72} color={colors.primary800} />
        </View>

        <View style={styles.form}>
          <InputField
            icon="mail-outline"
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <InputField
            icon="lock-closed-outline"
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
            isPassword
            toggleSecure={() => setSecure(!secure)}
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.rememberRow} onPress={() => setRememberMe(!rememberMe)}>
              <Ionicons
                name={rememberMe ? 'checkbox' : 'square-outline'}
                size={16}
                color={colors.grey600}
              />
              <Text style={styles.rememberText}>Remember Me</Text>
            </TouchableOpacity>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </View>

          <TouchableOpacity style={styles.signInButton} onPress={() => navigation.replace('Home')}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialSection}>
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialIcons}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={24} color={colors.black} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={24} color={colors.black} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.accountText}>
              Don't have an account? <Text style={styles.accountLink}>Create Account</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { padding: 25, paddingTop: 40, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { ...typography.h4, color: colors.primary800, marginBottom: 5 },
  subtitle: { ...typography.b3, color: colors.grey600 },
  illustration: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  form: { gap: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  rememberText: { ...typography.b3, color: colors.grey600 },
  forgotText: { ...typography.b3, color: colors.red500 },
  signInButton: {
    backgroundColor: colors.primary800,
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  signInText: { ...typography.s2, color: colors.white },
  socialSection: { marginTop: 30, alignItems: 'center', gap: 15 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', width: '100%', gap: 16 },
  divider: { flex: 1, height: 1, backgroundColor: colors.grey300 },
  orText: { ...typography.b3, color: colors.black },
  socialIcons: { flexDirection: 'row', gap: 20 },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.grey300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountText: { ...typography.b3, color: colors.grey600 },
  accountLink: { ...typography.b4, color: colors.primary800 },
});
