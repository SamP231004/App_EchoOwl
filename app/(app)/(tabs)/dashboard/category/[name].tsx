import React, {
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import { useQuery } from "@tanstack/react-query";

import { apiService } from "@src/lib/apiClient";
import { formatDateTime } from "@src/lib/date";

import { EmptyCategoryState } from "@src/components/EmptyCategoryState";
import { DashboardDrawer } from "@src/components/DashboardDrawer";
import { AppHeader } from "@src/components/AppHeader";

import {
  BarChart3,
  Calendar,
} from "lucide-react-native";

type TimeRange =
  | "today"
  | "week"
  | "month";

export default function CategoryScreen() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const { name, totalEvents: categoryTotalEventsParam } =
    useLocalSearchParams<{
      name: string;
      totalEvents: string;
    }>();

  const categoryTotalEvents = Number(
    categoryTotalEventsParam ?? 0
  );

  const [activeTab, setActiveTab] =
    useState<TimeRange>("month");

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

    enabled: !!name,
  });

  const events =
    data?.events ?? [];

  const totalEvents =
    data?.eventsCount ?? 0;

  const metrics = useMemo(
    () => [
      {
        title: "Events",
        value: totalEvents,
        subtitle: `${activeTab} events`,
      },
    ],
    [totalEvents, activeTab]
  );

  if (isPending) {
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
        style={styles.container}
        edges={["top"]}
      >
        <AppHeader
          showBack
          onBack={() =>
            router.back()
          }
          onMenu={() =>
            setMenuOpen(true)
          }
        />

        {!categoryTotalEvents ? (
          <EmptyCategoryState
            categoryName={
              name ?? ""
            }
          />
        ) : (
          <>
            {/* Title */}
            <Text style={styles.heading}>
              {name}
            </Text>

            {/* Tabs */}
            <View style={styles.tabs}>
              {(
                [
                  "today",
                  "week",
                  "month",
                ] as const
              ).map(
                (tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.tab,
                      activeTab ===
                      tab &&
                      styles.activeTab,
                    ]}
                    onPress={() =>
                      setActiveTab(
                        tab
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab ===
                        tab &&
                        styles.activeTabText,
                      ]}
                    >
                      {tab ===
                        "today"
                        ? "Today"
                        : tab ===
                          "week"
                          ? "This Week"
                          : "This Month"}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            {/* Metrics */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.metricsContainer
              }
            >
              {metrics.map(
                (metric) => (
                  <View
                    key={
                      metric.title
                    }
                    style={
                      styles.metricCard
                    }
                  >
                    <View
                      style={
                        styles.metricHeader
                      }
                    >
                      <Text
                        style={
                          styles.metricTitle
                        }
                      >
                        {
                          metric.title
                        }
                      </Text>

                      <BarChart3
                        size={
                          18
                        }
                        color="#64748B"
                      />
                    </View>

                    <Text
                      style={
                        styles.metricValue
                      }
                    >
                      {
                        metric.value
                      }
                    </Text>

                    <Text
                      style={
                        styles.metricSubtitle
                      }
                    >
                      {
                        metric.subtitle
                      }
                    </Text>
                  </View>
                )
              )}
            </ScrollView>

            {/* Event Overview */}
            <Text
              style={
                styles.sectionTitle
              }
            >
              Event Overview
            </Text>

            {events.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 20,
                  padding: 24,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                  marginBottom: 390,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#0F172A",
                  }}
                >
                  No events found
                </Text>

                <Text
                  style={{
                    marginTop: 8,
                    textAlign: "center",
                    color: "#64748B",
                  }}
                >
                  No events were recorded for this {activeTab} range.
                </Text>
              </View>
            ) : (
              <FlatList
                data={events}
                keyExtractor={(item: any) => item.id}
                refreshing={isPending}
                onRefresh={refetch}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 40,
                }}
                renderItem={({ item }: any) => (
                  <View style={styles.eventCard}>
                    <View style={styles.eventTopRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.eventName}>
                          {item.name}
                        </Text>

                        <View style={styles.eventDateRow}>
                          <Calendar
                            size={14}
                            color="#64748B"
                          />

                          <Text style={styles.eventDate}>
                            {formatDateTime(
                              item.createdAt
                            )}
                          </Text>
                        </View>
                      </View>

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
                        <Text
                          style={styles.statusText}
                        >
                          {item.deliveryStatus}
                        </Text>
                      </View>
                    </View>

                    {/* <Text style={styles.message}>
        {item.formattedMessage}
      </Text> */}

                    <View style={styles.divider} />

                    {Object.entries(
                      item.fields ?? {}
                    ).map(([key, value]) => (
                      <View
                        key={key}
                        style={styles.fieldRow}
                      >
                        <Text style={styles.fieldKey}>
                          {key}
                        </Text>

                        <Text style={styles.fieldValue}>
                          {String(value)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              />
            )}
          </>
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

    heading: {
      fontSize: 40,
      fontWeight: "700",
      color: "#0F172A",
      textTransform:
        "capitalize",
      marginBottom: 24,
    },

    tabs: {
      flexDirection: "row",
      marginBottom: 20,
    },

    tab: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 10,
      marginRight: 10,
    },

    activeTab: {
      backgroundColor:
        "#3B5CCC",
    },

    tabText: {
      color: "#64748B",
      fontWeight: "500",
    },

    activeTabText: {
      color: "#FFF",
      fontWeight: "700",
    },

    metricsContainer: {
      marginBottom: 20,
      height: 270,
    },

    metricCard: {
      width: 180,
      height: 150,
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      padding: 20,
      marginRight: 12,

      borderWidth: 1,
      borderColor: "#D9E2FF",

      shadowColor: "#3B5CCC",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 2,
      },

      elevation: 2,
    },
    metricHeader: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
    },

    metricTitle: {
      color: "#0F172A",
      fontWeight: "600",
      fontSize: 16,
    },

    metricValue: {
      fontSize: 42,
      fontWeight: "700",
      color: "#0F172A",
      marginTop: 12,
    },

    metricSubtitle: {
      color: "#64748B",
      marginTop: 6,
    },

    sectionTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: "#0F172A",
      marginBottom: 16,
    },

    eventCard: {
      backgroundColor: "#FFFFFF",

      borderRadius: 20,

      padding: 18,

      marginBottom: 16,

      borderWidth: 1,
      borderColor: "#E2E8F0",

      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 10,

      shadowOffset: {
        width: 0,
        height: 3,
      },

      elevation: 2,
    },

    eventHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
    },

    eventDate: {
      marginLeft: 6,
      color: "#64748B",
      fontSize: 13,
    },

    fieldRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#F8FAFC",
    },

    fieldKey: {
      color: "#64748B",
      fontWeight: "500",
      textTransform:
        "capitalize",
    },

    fieldValue: {
      color: "#0F172A",
      fontWeight: "600",
      maxWidth: "60%",
    },

    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
    },

    statusText: {
      fontWeight: "700",
      fontSize: 12,
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

    eventTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },

    eventName: {
      fontSize: 22,
      fontWeight: "700",
      color: "#0F172A",
      textTransform: "capitalize",
    },

    eventDateRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
    },

    message: {
      color: "#475569",
      lineHeight: 22,
      marginTop: 14,
      marginBottom: 14,
    },

    divider: {
      height: 1,
      backgroundColor: "#F1F5F9",
      marginBottom: 12,
    },
  });