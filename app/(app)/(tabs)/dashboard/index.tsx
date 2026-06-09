import { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/expo";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { DashboardDrawer } from "@src/components/DashboardDrawer";
import { AppHeader } from "@src/components/AppHeader";

import { DashboardEmptyState } from "@src/components/DashboardEmptyState";
import {
  CategoryCard,
  Category,
} from "@src/components/CategoryCard";

import { apiService } from "@src/lib/apiClient";

export default function DashboardScreen() {
  const router = useRouter();

  const { isLoaded, isSignedIn } =
    useAuth();

  const queryClient =
    useQueryClient();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const {
    data: categories = [],
    isPending,
    refetch,
  } = useQuery<Category[]>({
    queryKey: [
      "user-event-categories",
    ],

    queryFn: async () => {
      const data =
        await apiService.category.getEventCategories();

      return data.categories;
    },

    enabled:
      isLoaded &&
      isSignedIn,
  });

  const quickstartMutation =
    useMutation({
      mutationFn: async () => {
        await apiService.category.insertQuickstartCategories();
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "user-event-categories",
          ],
        });
      },
    });

  const deleteMutation =
    useMutation({
      mutationFn: async (
        name: string
      ) => {
        return apiService.category.deleteCategory(
          name
        );
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "user-event-categories",
          ],
        });
      },
    });

  const handleDelete = (
    name: string
  ) => {
    Alert.alert(
      "Delete Category",
      `Delete "${name}" permanently?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            deleteMutation.mutate(
              name
            ),
        },
      ]
    );
  };

  if (
    !isLoaded ||
    isPending
  ) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#3B5CCC"
        />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView
        edges={["top"]}
        style={styles.container}
      >
        <AppHeader
          onMenu={() =>
            setMenuOpen(true)
          }
        />

        {!categories.length ? (
          <DashboardEmptyState
            loading={
              quickstartMutation.isPending
            }
            onQuickstart={() =>
              quickstartMutation.mutate()
            }
            onCreateCategory={() =>
              Alert.alert(
                "Coming Soon",
                "Create Category Modal"
              )
            }
          />
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(
              item
            ) => item.id}
            refreshing={
              isPending
            }
            onRefresh={
              refetch
            }
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingBottom: 40,
            }}
            renderItem={({
              item,
            }) => (
              <CategoryCard
                category={
                  item
                }
                onPress={() =>
                  router.push({
                    pathname:
                      "/(app)/(tabs)/dashboard/category/[name]",
                    params:
                    {
                      name:
                        item.name,
                    },
                  })
                }
                onDelete={() =>
                  handleDelete(
                    item.name
                  )
                }
              />
            )}
          />
        )}
      </SafeAreaView>

      <DashboardDrawer
        visible={menuOpen}
        onClose={() =>
          setMenuOpen(false)
        }
      />
    </>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#F8FAFC",
      paddingHorizontal: 20,
    },

    loader: {
      flex: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
      backgroundColor:
        "#F8FAFC",
    },
  });