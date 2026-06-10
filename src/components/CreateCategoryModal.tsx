import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
} from "react-native";

import { X } from "lucide-react-native";

import { useCreateEventCategory } from "@src/hooks/useApi";

interface Props {
    visible: boolean;
    onClose: () => void;
}

const COLOR_OPTIONS = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#FDCB6E",
    "#6C5CE7",
    "#FF85A2",
    "#2ECC71",
    "#E17055",
];

const EMOJI_OPTIONS = [
    "💰",
    "👤",
    "🎉",
    "📅",
    "🚀",
    "📢",
    "🎓",
    "🏆",
    "💡",
    "🔔",
];

export function CreateCategoryModal({
    visible,
    onClose,
}: Props) {
    const [name, setName] =
        useState("");

    const [color, setColor] =
        useState(COLOR_OPTIONS[0]);

    const [emoji, setEmoji] =
        useState("");

    const createCategory =
        useCreateEventCategory();

    const handleCreate = () => {
        if (!name.trim()) {
            Alert.alert(
                "Error",
                "Category name is required."
            );
            return;
        }

        createCategory.mutate(
            {
                name,
                color,
                emoji:
                    emoji || undefined,
            },
            {
                onSuccess: () => {
                    setName("");
                    setEmoji("");
                    setColor(
                        COLOR_OPTIONS[0]
                    );

                    onClose();
                },

                onError: () => {
                    Alert.alert(
                        "Error",
                        "Failed to create category."
                    );
                },
            }
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
        >
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <View
                        style={styles.header}
                    >
                        <View>
                            <Text
                                style={
                                    styles.title
                                }
                            >
                                New Event Category
                            </Text>

                            <Text
                                style={
                                    styles.subtitle
                                }
                            >
                                Create a new
                                category to
                                organize events.
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={onClose}
                        >
                            <X size={22} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        <Text
                            style={styles.label}
                        >
                            Name
                        </Text>

                        <TextInput
                            value={name}
                            onChangeText={
                                setName
                            }
                            placeholder="e.g. user-signup"
                            style={
                                styles.input
                            }
                        />

                        <Text
                            style={styles.label}
                        >
                            Color
                        </Text>

                        <View
                            style={
                                styles.colors
                            }
                        >
                            {COLOR_OPTIONS.map(
                                (item) => (
                                    <TouchableOpacity
                                        key={item}
                                        onPress={() =>
                                            setColor(
                                                item
                                            )
                                        }
                                        style={[
                                            styles.color,
                                            {
                                                backgroundColor:
                                                    item,
                                            },
                                            color ===
                                            item &&
                                            styles.selectedColor,
                                        ]}
                                    />
                                )
                            )}
                        </View>

                        <Text
                            style={styles.label}
                        >
                            Emoji
                        </Text>

                        <View
                            style={
                                styles.emojis
                            }
                        >
                            {EMOJI_OPTIONS.map(
                                (item) => (
                                    <TouchableOpacity
                                        key={item}
                                        onPress={() =>
                                            setEmoji(
                                                item
                                            )
                                        }
                                        style={[
                                            styles.emoji,
                                            emoji ===
                                            item &&
                                            styles.selectedEmoji,
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 22,
                                            }}
                                        >
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            )}
                        </View>

                        <TouchableOpacity
                            style={
                                styles.button
                            }
                            onPress={
                                handleCreate
                            }
                            disabled={
                                createCategory.isPending
                            }
                        >
                            <Text
                                style={
                                    styles.buttonText
                                }
                            >
                                {createCategory.isPending
                                    ? "Creating..."
                                    : "Create Category"}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor:
            "rgba(0,0,0,0.4)",
        justifyContent:
            "flex-end",
    },

    sheet: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: "85%",
    },

    header: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        marginBottom: 20,
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
    },

    subtitle: {
        color: "#64748B",
        marginTop: 4,
    },

    label: {
        fontWeight: "600",
        marginBottom: 10,
        marginTop: 18,
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        paddingHorizontal: 14,
    },

    colors: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },

    color: {
        width: 42,
        height: 42,
        borderRadius: 21,
    },

    selectedColor: {
        borderWidth: 3,
        borderColor: "#111827",
    },

    emojis: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },

    emoji: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#F1F5F9",
        alignItems: "center",
        justifyContent: "center",
    },

    selectedEmoji: {
        borderWidth: 2,
        borderColor: "#3B5CCC",
    },

    button: {
        height: 52,
        borderRadius: 14,
        backgroundColor: "#3B5CCC",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 28,
        marginBottom: 12,
    },

    buttonText: {
        color: "#FFF",
        fontWeight: "700",
    },
});