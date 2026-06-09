import { useWindowDimensions } from "react-native"
import { useMemo } from "react"

export const useResponsive = () => {
  const { width, height } = useWindowDimensions()

  return useMemo(
    () => ({
      isSmall: width < 600,
      isMedium: width >= 600 && width < 768,
      isLarge: width >= 768 && width < 1024,
      isXLarge: width >= 1024,
      width,
      height,
      isMobile: height > width, // portrait
      isTablet: width >= 768,
    }),
    [width, height]
  )
}

export const useKeyboardHeight = () => {
  // This will be handled by KeyboardAvoidingView typically
  // but we can add custom logic if needed
  const { height } = useWindowDimensions()
  return height
}

export const useScaledSize = (baseSize: number) => {
  const { width } = useWindowDimensions()
  const scale = width / 375 // iPhone base width

  return useMemo(() => {
    return Math.round(baseSize * scale)
  }, [baseSize, scale])
}

// Hook to check if we're on a small screen
export const useIsSmallScreen = () => {
  const { width } = useWindowDimensions()
  return width < 600
}
