import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Check, Copy } from "lucide-react-native";
import { useUsageStats } from "@src/hooks/useApi";

export default function ApiKeysScreen() {
    const [copied, setCopied] = useState(false);

    const { data, isLoading } = useUsageStats();

    const apiKey = data?.apiKey ?? "";

    const copyApiKey = async () => {
        try {
            await Clipboard.setStringAsync(apiKey);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            Alert.alert(
                "Error",
                "Failed to copy API key."
            );
        }
    };

    if (isLoading) {
        return (
            <View style={styles.center}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                API Key
            </Text>

            <View style={styles.card}>
                <Text style={styles.label}>
                    Your API Key
                </Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        value={apiKey}
                        editable={false}
                        secureTextEntry
                        style={styles.input}
                    />

                    <TouchableOpacity
                        style={styles.copyButton}
                        onPress={copyApiKey}
                    >
                        {copied ? (
                            <Check
                                size={18}
                                color="#3B5CCC"
                            />
                        ) : (
                            <Copy
                                size={18}
                                color="#3B5CCC"
                            />
                        )}
                    </TouchableOpacity>
                </View>

                <Text style={styles.helper}>
                    Keep your API key secret and
                    never share it publicly.
                </Text>
            </View>

            <View style={styles.exampleCard}>
                <Text style={styles.exampleTitle}>
                    Example Usage
                </Text>

                <Text style={styles.code}>
                    {`fetch("https://your-api.com/api/events", {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_API_KEY"
  }
})`}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        padding: 20,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    heading: {
        fontSize: 30,
        fontWeight: "700",
        color: "#0F172A",
        marginBottom: 24,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 20,

        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        color: "#0F172A",
        marginBottom: 10,
    },

    inputContainer: {
        position: "relative",
        justifyContent: "center",
    },

    input: {
        height: 56,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingRight: 55,
        color: "#64748B",
    },

    copyButton: {
        position: "absolute",
        right: 14,
    },

    helper: {
        marginTop: 12,
        color: "#64748B",
        lineHeight: 22,
    },

    exampleCard: {
        marginTop: 20,
        backgroundColor: "#111827",
        borderRadius: 16,
        padding: 16,
    },

    exampleTitle: {
        color: "#FFFFFF",
        fontWeight: "600",
        marginBottom: 12,
    },

    code: {
        color: "#CBD5E1",
        fontFamily: "monospace",
        lineHeight: 22,
    },
});