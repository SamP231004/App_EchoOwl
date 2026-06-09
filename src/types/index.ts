// Types for the API and app
export interface User {
  id: string
  externalId: string
  email: string
  apiKey: string
  plan: "FREE" | "PRO"
  quotaLimit: number
  discordId?: string
  createdAt: Date
  updatedAt: Date
}

export interface EventCategoryDTO {
  id: string
  name: string
  emoji: string | null
  color: number
  updatedAt: string | Date | number
  createdAt: string | Date | number
  uniqueFieldCount: number
  eventsCount: number
  lastPing: string | Date | number | null
}

export interface EventDTO {
  id: string
  name: string
  formattedMessage: string
  fields: Record<string, any>
  deliveryStatus: "PENDING" | "DELIVERED" | "FAILED"
  createdAt: Date
  updatedAt: Date
  eventCategoryId?: string
}

export interface EventsByCategoryResponse {
  events: EventDTO[]
  eventsCount: number
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
}

export interface GetEventCategoriesResponse {
  categories: EventCategoryDTO[]
}

export interface CreateEventCategoryPayload {
  name: string
  color: string
  emoji?: string
}

export interface CreateCheckoutSessionResponse {
  url: string
}

export interface UserPlan {
  plan: "FREE" | "PRO"
}

export interface UsageStats {
  categoriesUsed: number
  categoriesLimit: number
  eventsUsed: number
  eventsLimit: number
  resetDate: string | Date | number
}

export interface PlanInfo {
  FREE: {
    maxEventsPerMonth: number
    maxEventCategories: number
  }
  PRO: {
    maxEventsPerMonth: number
    maxEventCategories: number
  }
}
