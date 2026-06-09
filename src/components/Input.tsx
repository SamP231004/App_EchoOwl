import React from "react"
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from "react-native"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  containerStyle?: ViewStyle
  helpText?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  helpText,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        style={[
          styles.input,
          error ? styles.inputError : undefined,
          props.style,
        ]}
        placeholderTextColor="#9CA3AF"
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {helpText && !error && <Text style={styles.helpText}>{helpText}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#DC2626",
  },
  error: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 4,
  },
  helpText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
})
