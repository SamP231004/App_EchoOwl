import React, {
    useState,
    useCallback,
    useEffect,
} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import { AppHeader } from "@src/components/AppHeader";
import { DashboardDrawer } from "@src/components/DashboardDrawer";

import {
    useUserPlan,
    useUsageStats,
    useCreateMobileCheckoutSession,
} from "@src/hooks/useApi";

import { formatDateTime } from "@src/lib/date";

import { useFocusEffect } from "expo-router";
import { RefreshControl } from "react-native";

export default function UpgradeScreen() {
    const router = useRouter();

    const [menuOpen, setMenuOpen] =
        useState(false);

    const {
        data: planData,
        refetch: refetchPlan,
    } = useUserPlan();

    const {
        data: usageData,
        isLoading,
        refetch: refetchUsage,
    } = useUsageStats();

    useFocusEffect(
        useCallback(() => {
            refetchPlan();
            refetchUsage();
        }, [refetchPlan, refetchUsage])
    );

    useEffect(() => {
        const subscription =
            Linking.addEventListener(
                "url",
                async ({ url }) => {
                    console.log(
                        "Deep Link:",
                        url
                    );

                    await refetchPlan();
                    await refetchUsage();

                    if (
                        url.includes(
                            "status=success"
                        )
                    ) {
                        Alert.alert(
                            "Payment Successful",
                            "Your account has been upgraded to Pro."
                        );
                    }

                    if (
                        url.includes(
                            "status=cancelled"
                        )
                    ) {
                        Alert.alert(
                            "Payment Cancelled",
                            "No charges were made."
                        );
                    }
                }
            );

        return () =>
            subscription.remove();
    }, [refetchPlan, refetchUsage]);

    const checkoutMutation =
        useCreateMobileCheckoutSession();

    const plan =
        planData?.plan ?? "FREE";

    const handleUpgrade = () => {
        checkoutMutation.mutate(
            undefined,
            {
                onSuccess: async (
                    data: any
                ) => {
                    try {
                        if (!data?.url) {
                            Alert.alert(
                                "Error",
                                "Invalid checkout URL."
                            );
                            return;
                        }

                        const result =
                            await WebBrowser.openAuthSessionAsync(
                                data.url,
                                "echoowl://upgrade"
                            );

                        console.log(
                            "Stripe Result:",
                            result
                        );

                        await refetchPlan();
                        await refetchUsage();
                    } catch (error) {
                        console.error(
                            error
                        );

                        Alert.alert(
                            "Error",
                            "Unable to open checkout."
                        );
                    }
                },

                onError: () => {
                    Alert.alert(
                        "Error",
                        "Unable to start checkout."
                    );
                },
            }
        );
    };

    const [refreshing, setRefreshing] =
        useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);

        await Promise.all([
            refetchPlan(),
            refetchUsage(),
        ]);

        setRefreshing(false);
    };

    if (isLoading) {
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

                <ScrollView
                    contentContainerStyle={[
                        styles.content,
                        { flexGrow: 1 },
                    ]}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                >
                    <View>
                        <Text
                            style={
                                styles.planTitle
                            }
                        >
                            Plan:{" "}
                            {plan === "PRO"
                                ? "Pro"
                                : "Free"}
                        </Text>

                        <Text
                            style={
                                styles.subtitle
                            }
                        >
                            {plan === "PRO"
                                ? "Thank you for supporting Echo Owl. Find your increased usage limits below."
                                : "Get access to more events, categories and premium support."}
                        </Text>
                    </View>

                    <View
                        style={
                            styles.statsContainer
                        }
                    >
                        <View
                            style={[
                                styles.statCard,
                                plan ===
                                "PRO" &&
                                styles.proCard,
                            ]}
                        >
                            <Text
                                style={
                                    styles.statLabel
                                }
                            >
                                Total Events
                            </Text>

                            <Text
                                style={
                                    styles.statValue
                                }
                            >
                                {
                                    usageData?.eventsUsed
                                }{" "}
                                of{" "}
                                {
                                    usageData?.eventsLimit
                                }
                            </Text>

                            <Text
                                style={
                                    styles.statSubtext
                                }
                            >
                                Events this
                                period
                            </Text>
                        </View>

                        <View
                            style={
                                styles.statCard
                            }
                        >
                            <Text
                                style={
                                    styles.statLabel
                                }
                            >
                                Categories
                            </Text>

                            <Text
                                style={
                                    styles.statValue
                                }
                            >
                                {
                                    usageData?.categoriesUsed
                                }{" "}
                                of{" "}
                                {
                                    usageData?.categoriesLimit
                                }
                            </Text>

                            <Text
                                style={
                                    styles.statSubtext
                                }
                            >
                                Active
                                categories
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.resetText}>
                        Usage will reset{" "}
                        {formatDateTime(
                            usageData?.resetDate
                        )}
                    </Text>

                    {plan !== "PRO" && (
                        <TouchableOpacity
                            style={
                                styles.upgradeButton
                            }
                            onPress={
                                handleUpgrade
                            }
                            disabled={
                                checkoutMutation.isPending
                            }
                        >
                            <Text
                                style={
                                    styles.upgradeButtonText
                                }
                            >
                                {checkoutMutation.isPending
                                    ? "Loading..."
                                    : "Upgrade to Pro"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
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
        },

        content: {
            padding: 20,
            gap: 20,
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
            fontSize: 30,
            fontWeight: "700",
            color: "#0F172A",
        },

        planTitle: {
            fontSize: 22,
            fontWeight: "700",
            color: "#0F172A",
        },

        subtitle: {
            marginTop: 6,
            color: "#64748B",
            lineHeight: 22,
        },

        statsContainer: {
            gap: 16,
        },

        statCard: {
            backgroundColor:
                "#FFFFFF",
            borderRadius: 18,
            padding: 20,
            borderWidth: 1,
            borderColor:
                "#E5E7EB",
        },

        proCard: {
            borderWidth: 2,
            borderColor:
                "#3B5CCC",
        },

        statLabel: {
            color: "#64748B",
            fontWeight: "600",
            marginBottom: 8,
        },

        statValue: {
            fontSize: 28,
            fontWeight: "700",
            color: "#0F172A",
        },

        statSubtext: {
            marginTop: 4,
            color: "#94A3B8",
        },

        resetText: {
            color: "#64748B",
            lineHeight: 22,
        },

        upgradeButton: {
            backgroundColor:
                "#3B5CCC",
            height: 56,
            borderRadius: 14,
            justifyContent:
                "center",
            alignItems:
                "center",
        },

        upgradeButtonText: {
            color: "#FFFFFF",
            fontWeight: "700",
            fontSize: 16,
        },
    });
