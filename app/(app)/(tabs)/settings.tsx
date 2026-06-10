import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Linking,
    Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
    useClerk,
    useUser,
} from "@clerk/expo";

import { AppHeader } from "@src/components/AppHeader";
import { DashboardDrawer } from "@src/components/DashboardDrawer";

export default function SettingsScreen() {
    const router = useRouter();

    const { user } = useUser();
    const { signOut } = useClerk();

    const [menuOpen, setMenuOpen] =
        useState(false);

    const openDashboard = () => {
        Linking.openURL(
            "https://echo-owl.vercel.app/"
        );
    };

    const handleSignOut =
        async () => {
            try {
                await signOut();
                router.replace("/sign-in");
            } catch {
                Alert.alert(
                    "Error",
                    "Failed to sign out."
                );
            }
        };

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
                    contentContainerStyle={
                        styles.content
                    }
                >
                    <Text style={styles.heading}>
                        Account Settings
                    </Text>

                    <View style={styles.card}>
                        <View
                            style={styles.profileRow}
                        >
                            <Image
                                source={{
                                    uri:
                                        user?.imageUrl,
                                }}
                                style={
                                    styles.avatar
                                }
                            />

                            <View
                                style={
                                    styles.profileInfo
                                }
                            >
                                <Text
                                    style={
                                        styles.name
                                    }
                                >
                                    {user?.fullName ||
                                        user?.firstName ||
                                        "User"}
                                </Text>

                                <Text
                                    style={
                                        styles.email
                                    }
                                >
                                    {user
                                        ?.primaryEmailAddress
                                        ?.emailAddress ||
                                        ""}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text
                            style={styles.sectionTitle}
                        >
                            Discord Integration
                        </Text>

                        <Text
                            style={styles.description}
                        >
                            Discord ID management is
                            currently available only
                            through the Echo Owl web
                            dashboard.
                        </Text>

                        <TouchableOpacity
                            style={
                                styles.primaryButton
                            }
                            onPress={
                                openDashboard
                            }
                        >
                            <Text
                                style={
                                    styles.primaryButtonText
                                }
                            >
                                Open Web Dashboard
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.card}>
                        <Text
                            style={styles.dangerTitle}
                        >
                            Danger Zone
                        </Text>

                        <TouchableOpacity
                            style={
                                styles.signOutButton
                            }
                            onPress={
                                handleSignOut
                            }
                        >
                            <Text
                                style={
                                    styles.signOutText
                                }
                            >
                                Sign Out
                            </Text>
                        </TouchableOpacity>
                    </View>
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
            gap: 16,
        },

        heading: {
            fontSize: 30,
            fontWeight: "700",
            color: "#0F172A",
            marginBottom: 8,
        },

        card: {
            backgroundColor:
                "#FFFFFF",
            borderRadius: 18,
            padding: 20,
            borderWidth: 1,
            borderColor:
                "#E5E7EB",
        },

        profileRow: {
            flexDirection: "row",
            alignItems: "center",
        },

        avatar: {
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor:
                "#E5E7EB",
        },

        profileInfo: {
            marginLeft: 16,
            flex: 1,
        },

        name: {
            fontSize: 18,
            fontWeight: "700",
            color: "#0F172A",
        },

        email: {
            marginTop: 4,
            color: "#64748B",
            fontSize: 14,
        },

        sectionTitle: {
            fontSize: 18,
            fontWeight: "700",
            color: "#0F172A",
            marginBottom: 12,
        },

        description: {
            color: "#64748B",
            lineHeight: 22,
            marginBottom: 16,
        },

        primaryButton: {
            height: 52,
            borderRadius: 14,
            backgroundColor:
                "#3B5CCC",
            justifyContent:
                "center",
            alignItems:
                "center",
        },

        primaryButtonText: {
            color: "#FFF",
            fontWeight: "700",
            fontSize: 15,
        },

        dangerTitle: {
            fontSize: 18,
            fontWeight: "700",
            color: "#DC2626",
            marginBottom: 16,
        },

        signOutButton: {
            height: 52,
            borderRadius: 14,
            borderWidth: 1,
            borderColor:
                "#FCA5A5",
            justifyContent:
                "center",
            alignItems:
                "center",
        },

        signOutText: {
            color: "#DC2626",
            fontWeight: "700",
            fontSize: 15,
        },
    });