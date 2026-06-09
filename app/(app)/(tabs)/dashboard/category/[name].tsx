import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { apiService } from "@src/lib/apiClient";
import { EmptyCategoryState } from "../components/EmptyCategoryState";

type TimeRange =
  | "today"
  | "week"
  | "month";

export default function CategoryScreen() {
  const { name } =
    useLocalSearchParams<{
      name: string;
    }>();

  const [activeTab, setActiveTab] =
    useState<TimeRange>("today");

  const {
    data,
    isPending,
    refetch,
  } = useQuery({
    queryKey: [
      "category-events",
      name,
      activeTab,
    ],

    queryFn: () =>
      apiService.category.getEventsByCategoryName(
        name,
        1,
        50,
        activeTab
      ),
  });

  if (isPending) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const events = data?.events ?? [];

  if (!events.length) {
    return (
      <EmptyCategoryState
        categoryName={name}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {name} Events
      </Text>

      <View style={styles.tabs}>
        {(["today", "week", "month"] as const).map(
          (tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab &&
                styles.activeTab,
              ]}
              onPress={() =>
                setActiveTab(tab)
              }
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab &&
                  styles.activeTabText,
                ]}
              >
                {tab === "today"
                  ? "Today"
                  : tab === "week"
                    ? "Week"
                    : "Month"}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>
          Total Events
        </Text>

        <Text style={styles.statsValue}>
          {data?.eventsCount ?? 0}
        </Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item: any) =>
          item.id
        }
        refreshing={isPending}
        onRefresh={refetch}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.date}>
              {new Date(
                item.createdAt
              ).toLocaleString()}
            </Text>

            {Object.entries(
              item.fields ?? {}
            ).map(([key, value]) => (
              <View
                key={key}
                style={styles.fieldRow}
              >
                <Text
                  style={styles.fieldName}
                >
                  {key}
                </Text>

                <Text
                  style={styles.fieldValue}
                >
                  {String(value)}
                </Text>
              </View>
            ))}

            <View
              style={[
                styles.statusBadge,
                item.deliveryStatus ===
                  "DELIVERED"
                  ? styles.delivered
                  : item.deliveryStatus ===
                    "FAILED"
                    ? styles.failed
                    : styles.pending,
              ]}
            >
              <Text>
                {item.deliveryStatus}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },

  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  tabs: {
    flexDirection: "row",
    marginBottom: 16,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },

  activeTab: {
    backgroundColor: "#3B5CCC",
  },

  tabText: {
    color: "#64748B",
  },

  activeTabText: {
    color: "#FFF",
    fontWeight: "700",
  },

  statsCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },

  statsTitle: {
    color: "#64748B",
  },

  statsValue: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 8,
  },

  eventCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  date: {
    fontWeight: "700",
    marginBottom: 12,
  },

  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  fieldName: {
    color: "#64748B",
  },

  fieldValue: {
    fontWeight: "600",
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 12,
  },

  delivered: {
    backgroundColor: "#DCFCE7",
  },

  failed: {
    backgroundColor: "#FEE2E2",
  },

  pending: {
    backgroundColor: "#FEF3C7",
  },
});