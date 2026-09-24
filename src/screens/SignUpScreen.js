import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../components/InputField';
import { colors, typography } from '../theme/colors';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.subtitle}>Join to plan, track, and ride smarter.</Text>
        </View>

        <View style={styles.illustration}>
          <Ionicons name="people" size={64} color={colors.primary800} />
        </View>

        <View style={styles.form}>
          <InputField icon="person-outline" placeholder="Enter Full Name" value={name} onChangeText={setName} />
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

          <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.replace('Home')}>
            <Text style={styles.signUpText}>Sign Up</Text>
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

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.accountText}>
              Already have an account? <Text style={styles.accountLink}>Login</Text>
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
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  form: { gap: 20 },
  signUpButton: {
    backgroundColor: colors.primary800,
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  signUpText: { ...typography.s2, color: colors.white },
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
