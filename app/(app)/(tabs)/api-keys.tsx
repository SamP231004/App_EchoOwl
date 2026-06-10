import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Linking,
    TouchableOpacity,
    ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { AppHeader } from "@src/components/AppHeader";
import { DashboardDrawer } from "@src/components/DashboardDrawer";

export default function ApiKeysScreen() {
    const router = useRouter();

    const [menuOpen, setMenuOpen] =
        useState(false);

    const openWebApp = () => {
        Linking.openURL(
            "https://echo-owl.vercel.app/"
        );
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
                        API Keys
                    </Text>

                    <View style={styles.card}>
                        <Text style={styles.title}>
                            Manage API Keys on the Web Dashboard
                        </Text>

                        <Text
                            style={
                                styles.description
                            }
                        >
                            API keys are currently
                            only available through
                            the Echo Owl web
                            dashboard. To view,
                            copy, or manage your
                            API key, please sign in
                            to the web application.
                        </Text>

                        <TouchableOpacity
                            style={
                                styles.button
                            }
                            onPress={
                                openWebApp
                            }
                        >
                            <Text
                                style={
                                    styles.buttonText
                                }
                            >
                                Open Web Dashboard
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={
                            styles.infoCard
                        }
                    >
                        <Text
                            style={
                                styles.infoTitle
                            }
                        >
                            Why can't I access my
                            API key here?
                        </Text>

                        <Text
                            style={
                                styles.infoText
                            }
                        >
                            For security reasons,
                            API key management is
                            currently supported
                            only on the web
                            dashboard.
                        </Text>
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

        title: {
            fontSize: 18,
            fontWeight: "700",
            color: "#0F172A",
            marginBottom: 12,
        },

        description: {
            fontSize: 15,
            color: "#64748B",
            lineHeight: 24,
        },

        button: {
            marginTop: 20,
            backgroundColor:
                "#3B5CCC",
            height: 52,
            borderRadius: 14,
            justifyContent:
                "center",
            alignItems:
                "center",
        },

        buttonText: {
            color: "#FFFFFF",
            fontWeight: "700",
            fontSize: 15,
        },

        infoCard: {
            backgroundColor:
                "#FFFFFF",
            borderRadius: 18,
            padding: 20,
            borderWidth: 1,
            borderColor:
                "#E5E7EB",
        },

        infoTitle: {
            fontSize: 16,
            fontWeight: "700",
            color: "#0F172A",
            marginBottom: 8,
        },

        infoText: {
            color: "#64748B",
            lineHeight: 22,
        },
    });