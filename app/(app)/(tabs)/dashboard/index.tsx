import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/expo";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import BottomSheet from "@gorhom/bottom-sheet";
import { Menu } from "lucide-react-native";

import { DashboardEmptyState } from "./components/DashboardEmptyState";
import {
  CategoryCard,
  Category,
} from "./components/CategoryCard";

import { DashboardDrawer } from "@src/components/DashboardDrawer";
import { apiService } from "@src/lib/apiClient";

export default function DashboardScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  const queryClient = useQueryClient();

  const bottomSheetRef =
    useRef<BottomSheet>(null);

  const {
    data: categories = [],
    isPending,
    refetch,
  } = useQuery<Category[]>({
    queryKey: ["user-event-categories"],

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
        {/* Header */}

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../../assets/images/brand-asset-profile-picture.png")}
              style={styles.logoImage}
            />

            <Text style={styles.logo}>
              Echo
              <Text style={styles.logoBlue}>
                Owl
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={
              styles.menuButton
            }
            onPress={() =>
              bottomSheetRef.current?.expand()
            }
          >
            <Menu
              size={30}
              color="#0F172A"
            />
          </TouchableOpacity>
        </View>

        {/* Content */}

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
            contentContainerStyle={
              styles.listContent
            }
            showsVerticalScrollIndicator={
              false
            }
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
        sheetRef={
          bottomSheetRef
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

    header: {
      flexDirection: "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      paddingTop: 8,
      marginBottom: 24,
    },

    logoContainer: {
      flexDirection: "row",
      alignItems: "center",
    },

    logoImage: {
      width: 42,
      height: 42,
      borderRadius: 21,
      marginRight: 10,
    },

    logo: {
      fontSize: 34,
      fontWeight: "700",
      color: "#111827",
    },

    logoBlue: {
      color: "#3B5CCC",
    },

    menuButton: {
      padding: 4,
    },

    listContent: {
      paddingBottom: 40,
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