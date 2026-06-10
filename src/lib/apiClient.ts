import axios, { AxiosInstance } from "axios"
import * as SecureStore from "expo-secure-store"
import superjson from "superjson"

type AuthTokenProvider = () => Promise<string | null>

let authTokenProvider: AuthTokenProvider | null = null

export const setAuthTokenProvider = (provider: AuthTokenProvider | null) => {
  authTokenProvider = provider
}

// Get the API base URL
export const getBaseURL = () => {
  return process.env.EXPO_PUBLIC_API_URL
}

// Helper to mimic the web client's serialization logic exactly
const serializeWithSuperJSON = (data: any): any => {
  if (typeof data !== "object" || data === null) {
    return data
  }
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      superjson.stringify(value),
    ])
  )
}

// Create axios instance
let apiClient: AxiosInstance | null = null

export const getApiClient = async (): Promise<AxiosInstance> => {
  if (!apiClient) {
    apiClient = axios.create({
      baseURL: getBaseURL(),
      headers: {
        "Content-Type": "application/json",
      },
      // Automatically handle superjson deserialization on incoming responses
      transformResponse: [
        (data, headers) => {
          if (!data) return data

          // Safely convert headers to string to avoid TypeScript compilation errors
          const contentType = String(headers?.["content-type"] || "")

          // Fallback check: even if content-type header is missed, check text structure
          if (contentType.includes("application/superjson") || (data.includes('"json":') && data.includes('"meta":'))) {
            try {
              return superjson.parse(data)
            } catch (e) {
              console.error("SuperJSON parsing failed:", e)
            }
          }

          try {
            return JSON.parse(data)
          } catch (error) {
            return data
          }
        },
      ],
    })

    // Add interceptor to include auth token and handle superjson serialization
    apiClient.interceptors.request.use(async (config) => {
      try {
        const token = authTokenProvider ? await authTokenProvider() : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        console.error(error);
      }

      return config;
    });

    // Handle responses and loudly log errors
    apiClient.interceptors.response.use(
      (response) => {
        console.log(`✅ [${response.config.method?.toUpperCase()}] ${response.config.url} - Status: ${response.status}`);
        return response;
      },
      (error) => {
        console.error(`❌ API Error [${error.config?.method?.toUpperCase()}] ${error.config?.url}`);

        if (error.response) {
          console.error("Error Status:", error.response.status);
          console.error("Error Data:", error.response.data);
        } else if (error.request) {
          console.error("No response received. Check your EXPO_PUBLIC_API_URL network configuration.");
        } else {
          console.error("Request Setup Error:", error.message);
        }
        return Promise.reject(error);
      }
    )
  }

  return apiClient
}

// API methods
export const apiService = {
  // Auth endpoints
  auth: {
    getDatabaseSyncStatus: async () => {
      const client = await getApiClient()
      const response = await client.get("/api/auth/getDatabaseSyncStatus")
      return response.data
    },
  },

  // Category endpoints
  category: {
    getEventCategories: async () => {
      const client = await getApiClient()
      const response = await client.get("/api/category/getEventCategories")
      return response.data
    },

    createEventCategory: async (data: { name: string; color: string; emoji?: string }) => {
      const client = await getApiClient()
      const response = await client.post("/api/category/createEventCategory", data)
      return response.data
    },

    deleteCategory: async (name: string) => {
      const client = await getApiClient()
      const response = await client.post("/api/category/deleteCategory", { name })
      return response.data
    },

    insertQuickstartCategories: async () => {
      const client = await getApiClient()
      const response = await client.post("/api/category/insertQuickstartCategories")
      return response.data
    },

    pollCategory: async (name: string) => {
      const client = await getApiClient()
      const response = await client.get("/api/category/pollCategory", {
        params: { name },
      })
      return response.data
    },

    getEventsByCategoryName: async (
      name: string,
      page = 1,
      limit = 20,
      timeRange: "today" | "week" | "month" = "month"
    ) => {
      const client = await getApiClient()
      const response = await client.get("/api/category/getEventsByCategoryName", {
        params: {
          name,
          page,
          limit,
          timeRange,
        },
      })
      return response.data
    },
  },

  // Payment endpoints
  payment: {
    createCheckoutSession: async () => {
      const client = await getApiClient()
      const response = await client.post("/api/payment/createCheckoutSession")
      return response.data
    },

    getUserPlan: async () => {
      const client = await getApiClient()
      const response = await client.get("/api/payment/getUserPlan")
      return response.data
    },
    createMobileCheckoutSession: async () => {
      const client = await getApiClient()
      const response = await client.post(
        "/api/payment/createMobileCheckoutSession"
      )
      return response.data
    },
  },

  // Project endpoints
  project: {
    getUsage: async () => {
      const client = await getApiClient()
      const response = await client.get("/api/project/getUsage")
      return response.data
    },

    setDiscordID: async (discordId: string) => {
      const client = await getApiClient()
      const response = await client.post("/api/project/setDiscordID", { discordId })
      return response.data
    },

    getDiscordID: async () => {
      const client = await getApiClient()
      const response = await client.get("/api/project/getDiscordID")
      return response.data
    },
  },

  // Event endpoints
  events: {
    createEvent: async (eventData: any) => {
      const client = await getApiClient()
      const response = await client.post("/api/events", eventData)
      return response.data
    },
  },

  // Webhook endpoints
  webhooks: {
    handleStripeWebhook: async (payload: any) => {
      const client = await getApiClient()
      const response = await client.post("/api/webhooks/stripe", payload)
      return response.data
    },
  },
}

// Export a function to reset the client (useful for sign out)
export const resetApiClient = () => {
  apiClient = null
}
