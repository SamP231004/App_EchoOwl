// Constants
export const FREE_QUOTA = {
  maxEventsPerMonth: 100,
  maxEventCategories: 3,
} as const

export const PRO_QUOTA = {
  maxEventsPerMonth: 1000,
  maxEventCategories: 10,
} as const

export const PLANS = {
  FREE: FREE_QUOTA,
  PRO: PRO_QUOTA,
} as const

export type PlanKey = keyof typeof PLANS

export const COLOR_OPTIONS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#FDCB6E",
  "#6C5CE7",
  "#FF85A2",
  "#2ECC71",
  "#E17055",
]

export const EMOJI_OPTIONS = [
  { emoji: "\uD83D\uDCB0", label: "Money (Sale)" },
  { emoji: "\uD83D\uDC64", label: "User (Sign-up)" },
  { emoji: "\uD83C\uDF89", label: "Celebration" },
  { emoji: "\uD83D\uDCC5", label: "Calendar" },
  { emoji: "\uD83D\uDE80", label: "Launch" },
  { emoji: "\uD83D\uDCE2", label: "Announcement" },
  { emoji: "\uD83C\uDF93", label: "Graduation" },
  { emoji: "\uD83C\uDFC6", label: "Achievement" },
  { emoji: "\uD83D\uDCA1", label: "Idea" },
  { emoji: "\uD83D\uDD14", label: "Notification" },
]

// Helper functions
export const toDate = (value: string | Date | number): Date => {
  if (value instanceof Date) return value
  if (typeof value === "number") return new Date(value * 1000)
  return new Date(value)
}

export const formatDate = (date: Date | string | number): string => {
  const d = toDate(date)
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export const formatTime = (date: Date | string | number): string => {
  const d = toDate(date)
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const formatRelativeTime = (date: Date | string | number): string => {
  const d = toDate(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return formatDate(d)
}

export const hexToRGB = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return {
    r: parseInt(result?.[1] ?? "0", 16),
    g: parseInt(result?.[2] ?? "0", 16),
    b: parseInt(result?.[3] ?? "0", 16),
  }
}

export const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? "0" + hex : hex
      })
      .join("")
      .toUpperCase()
  )
}

export const truncateText = (text: string, length: number): string => {
  return text.length > length ? text.substring(0, length) + "..." : text
}

export const generateGradientStyle = (
  color: string
): { start: string; end: string } => {
  const rgb = hexToRGB(color)
  const lighter = {
    r: Math.min(rgb.r + 50, 255),
    g: Math.min(rgb.g + 50, 255),
    b: Math.min(rgb.b + 50, 255),
  }
  return {
    start: color,
    end: rgbToHex(lighter.r, lighter.g, lighter.b),
  }
}
