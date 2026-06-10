import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiService } from "@src/lib/apiClient"
import { EventsByCategoryResponse, GetEventCategoriesResponse } from "@src/types"
import { useCategoryStore, useUsageStore } from "@src/store"

// Hook for getting event categories
export const useEventCategories = () => {
  const setCategories = useCategoryStore((state) => state.setCategories)
  const categories = useCategoryStore((state) => state.categories)

  const query = useQuery({
    queryKey: ["user-event-categories"],
    queryFn: async () => {
      const response = (await apiService.category.getEventCategories()) as GetEventCategoriesResponse
      const cats = response.categories
      setCategories(cats)
      return cats
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    categories: categories.length > 0 ? categories : (query.data || []),
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}

// Hook for creating an event category
export const useCreateEventCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { name: string; color: string; emoji?: string }) => {
      return await apiService.category.createEventCategory(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-event-categories"] })
    },
  })
}

// Hook for deleting an event category
export const useDeleteEventCategory = () => {
  const queryClient = useQueryClient()
  const removeCategory = useCategoryStore((state) => state.removeCategory)

  return useMutation({
    mutationFn: async (name: string) => {
      return await apiService.category.deleteCategory(name)
    },
    onSuccess: (_, name) => {
      removeCategory(name)
      queryClient.invalidateQueries({ queryKey: ["user-event-categories"] })
    },
  })
}

// Hook for getting events by category
export const useEventsByCategory = (
  categoryName: string | null,
  page = 1,
  limit = 20,
  timeRange: "today" | "week" | "month" = "month"
) => {
  return useQuery({
    queryKey: ["events-by-category", categoryName, page, limit, timeRange],
    queryFn: async () => {
      if (!categoryName) return { events: [], eventsCount: 0 }
      return (await apiService.category.getEventsByCategoryName(
        categoryName,
        page,
        limit,
        timeRange
      )) as EventsByCategoryResponse
    },
    enabled: !!categoryName,
    staleTime: 1000 * 60 * 1, // 1 minute
  })
}

// Hook for getting user plan
export const useUserPlan = () => {
  return useQuery({
    queryKey: ["user-plan"],
    queryFn: async () => {
      return await apiService.payment.getUserPlan()
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Hook for getting usage stats
export const useUsageStats = () => {
  const setUsage = useUsageStore((state) => state.setUsage)
  return useQuery({
    queryKey: ["usage-stats"],
    queryFn: async () => {
      const usage = await apiService.project.getUsage()
      setUsage(usage)
      return usage
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Hook for creating checkout session
export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: async () => {
      return await apiService.payment.createCheckoutSession()
    },
  })
}

export const useDiscordID = () => {
  return useQuery({
    queryKey: ["discord-id"],
    queryFn: async () => {
      return await apiService.project.getDiscordID();
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Hook for setting Discord ID
export const useSetDiscordID = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (discordId: string) => {
      return await apiService.project.setDiscordID(discordId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["discord-id"],
      });

      queryClient.invalidateQueries({
        queryKey: ["user-plan"],
      });
    },
  });
};
