import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import {
    Check,
    Copy,
} from "lucide-react-native";

interface Props {
    categoryName: string;
}

export function EmptyCategoryState({
    categoryName,
}: Props) {
    const [copied, setCopied] =
        useState(false);

    const codeSnippet = `await fetch('https://spring-boot-migration-echo-owl.vercel.app/api/events', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({
            category: '${categoryName}',
            fields: {
            field1: 'value1',
            field2: 'value2'
            }
        })
    })`;

    const copyCode =
        async () => {
            await Clipboard.setStringAsync(
                codeSnippet
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        };

    return (
        <ScrollView
            contentContainerStyle={
                styles.container
            }
            showsVerticalScrollIndicator={
                false
            }
        >
            <Text style={styles.title}>
                Create your first{" "}
                {categoryName} event
            </Text>

            <Text
                style={
                    styles.description
                }
            >
                Get started by sending a
                request to the EchoOwl
                tracking API. Once your
                first event arrives,
                analytics will begin
                appearing here.
            </Text>

            {/* Code Block */}

            <View
                style={
                    styles.codeContainer
                }
            >
                <View
                    style={
                        styles.codeHeader
                    }
                >
                    <Text
                        style={
                            styles.fileName
                        }
                    >
                        your-first-event.js
                    </Text>

                    <TouchableOpacity
                        style={
                            styles.copyButton
                        }
                        onPress={copyCode}
                    >
                        {copied ? (
                            <Check
                                size={16}
                                color="#22C55E"
                            />
                        ) : (
                            <Copy
                                size={16}
                                color="#CBD5E1"
                            />
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={
                        false
                    }
                >
                    <Text
                        style={styles.code}
                    >
                        {codeSnippet}
                    </Text>
                </ScrollView>
            </View>

            {/* Listening Status */}

            <View
                style={
                    styles.listeningCard
                }
            >
                <View
                    style={styles.dot}
                />

                <Text
                    style={
                        styles.listeningText
                    }
                >
                    Listening for incoming
                    events...
                </Text>
            </View>

            {/* Hint */}

            <View
                style={styles.tipCard}
            >
                <Text
                    style={styles.tipTitle}
                >
                    Next Step
                </Text>

                <Text
                    style={styles.tipText}
                >
                    Replace{" "}
                    <Text
                        style={
                            styles.highlight
                        }
                    >
                        YOUR_API_KEY
                    </Text>{" "}
                    with your API key and
                    send the request from
                    your application.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flexGrow: 1,
            justifyContent:
                "center",
            padding: 20,
        },

        title: {
            textAlign: "center",
            fontSize: 28,
            fontWeight: "700",
            marginBottom: 12,
            color: "#0F172A",
        },

        description: {
            textAlign: "center",
            color: "#64748B",
            lineHeight: 24,
            marginBottom: 28,
            fontSize: 15,
        },

        codeContainer: {
            backgroundColor:
                "#111827",
            borderRadius: 18,
            overflow: "hidden",
            marginBottom: 20,
        },

        codeHeader: {
            flexDirection: "row",
            justifyContent:
                "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor:
                "#374151",
        },

        fileName: {
            color: "#94A3B8",
            fontSize: 13,
            fontWeight: "600",
        },

        copyButton: {
            padding: 4,
        },

        code: {
            color: "#E2E8F0",
            padding: 16,
            fontFamily:
                "monospace",
            lineHeight: 24,
            fontSize: 13,
        },

        listeningCard: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent:
                "center",
            backgroundColor:
                "#FFFFFF",
            borderRadius: 14,
            paddingVertical: 14,

            borderWidth: 1,
            borderColor:
                "#E5E7EB",

            marginBottom: 20,
        },

        dot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor:
                "#22C55E",
            marginRight: 10,
        },

        listeningText: {
            color: "#475569",
            fontWeight: "500",
        },

        tipCard: {
            backgroundColor:
                "#FFFFFF",
            borderRadius: 16,
            padding: 18,

            borderWidth: 1,
            borderColor:
                "#E5E7EB",
        },

        tipTitle: {
            fontSize: 16,
            fontWeight: "700",
            color: "#0F172A",
            marginBottom: 8,
        },

        tipText: {
            color: "#64748B",
            lineHeight: 22,
        },

        highlight: {
            color: "#3B5CCC",
            fontWeight: "700",
        },
    });