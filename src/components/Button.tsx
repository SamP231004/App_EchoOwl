import React, { ReactNode } from "react"
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native"

interface ButtonProps {
  onPress?: () => void
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

const VARIANT_COLORS = {
  primary: {
    bg: "#2563EB",
    text: "#FFFFFF",
  },
  secondary: {
    bg: "#E5E7EB",
    text: "#1F2937",
  },
  ghost: {
    bg: "transparent",
    text: "#2563EB",
  },
  danger: {
    bg: "#DC2626",
    text: "#FFFFFF",
  },
}

const SIZE_STYLES = {
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 12,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    fontSize: 16,
  },
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const colors = VARIANT_COLORS[variant]
  const sizeStyle = SIZE_STYLES[size]

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: disabled || loading ? "#D1D5DB" : colors.bg,
          ...sizeStyle,
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: colors.text,
              fontSize: sizeStyle.fontSize,
            },
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
  },
})
