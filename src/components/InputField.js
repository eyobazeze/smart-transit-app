import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';

export default function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  toggleSecure,
  isPassword,
  keyboardType,
}) {
  return (
    <View style={styles.field}>
      <Ionicons name={icon} size={18} color={colors.grey600} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.grey600}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || 'default'}
        autoCapitalize="none"
      />
      {isPassword && (
        <TouchableOpacity onPress={toggleSecure}>
          <Ionicons
            name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.grey600}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary50,
    borderWidth: 1,
    borderColor: colors.grey300,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    width: '100%',
  },
  icon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    ...typography.b3,
    color: colors.black,
  },
});
