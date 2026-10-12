import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../theme/colors';

export default function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  toggleSecure,
  isPassword,
  keyboardType,
  error,
  autoCapitalize = 'none',
  returnKeyType,
  onSubmitEditing,
  inputRef,
}) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.red500 : focused ? colors.primary800 : colors.grey200 || colors.grey300;
  return (
    <View style={{ width: '100%' }}>
      <View style={[styles.field, { borderColor }, focused && styles.focused, error && styles.errored]}>
        <Ionicons name={icon} size={19} color={focused ? colors.primary800 : colors.grey500 || colors.grey600} style={styles.icon} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.grey500 || colors.grey600}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType || 'default'}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {isPassword && (
          <TouchableOpacity onPress={toggleSecure} hitSlop={10}>
            <Ionicons name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.grey500 || colors.grey600} />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    height: 56,
    width: '100%',
  },
  focused: { backgroundColor: colors.white },
  errored: { backgroundColor: colors.redSoft },
  icon: { marginRight: 12 },
  input: { flex: 1, ...typography.b3, fontSize: 15, color: colors.ink, height: '100%', outlineStyle: 'none' },
  error: { ...typography.b4, fontSize: 12, color: colors.red500, marginTop: 6, marginLeft: 4 },
});
