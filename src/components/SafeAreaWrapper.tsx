import React, { ReactNode } from "react"
import { View, StyleSheet, ViewStyle, ScrollViewProps } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface SafeAreaWrapperProps {
  children: ReactNode
  style?: ViewStyle
  paddingHorizontal?: number
  paddingVertical?: number
}

export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  style,
  paddingHorizontal = 16,
  paddingVertical = 12,
}) => {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, paddingVertical),
          paddingBottom: Math.max(insets.bottom, paddingVertical),
          paddingLeft: Math.max(insets.left, paddingHorizontal),
          paddingRight: Math.max(insets.right, paddingHorizontal),
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
