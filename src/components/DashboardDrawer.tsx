import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import {
    Home,
    Diamond,
    KeyRound,
    Settings,
    X,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/expo";
import { Image } from "react-native";

interface Props {
    visible: boolean;
    onClose: () => void;
}

export function DashboardDrawer({
    visible,
    onClose,
}: Props) {
    const router = useRouter();

    const navigate = (path: string) => {
        onClose();
        router.push(path as any);
    };

    const { user } = useUser();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.sheet}>
                    <View style={styles.header}>
                        <Text style={styles.logo}>
                            Echo
                            <Text style={styles.logoBlue}>
                                Owl
                            </Text>
                        </Text>

                        <TouchableOpacity onPress={onClose}>
                            <X size={26} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.section}>
                        Overview
                    </Text>

                    <TouchableOpacity
                        style={styles.item}
                        onPress={() =>
                            navigate(
                                "/(app)/(tabs)/dashboard"
                            )
                        }
                    >
                        <Home size={20} />
                        <Text style={styles.itemText}>
                            Dashboard
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.section}>
                        Account
                    </Text>

                    <TouchableOpacity
                        style={styles.item}
                        onPress={() =>
                            navigate(
                                "/(app)/(tabs)/upgrade"
                            )
                        }
                    >
                        <Diamond size={20} />
                        <Text style={styles.itemText}>
                            Upgrade
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.section}>
                        Settings
                    </Text>

                    <TouchableOpacity
                        style={styles.item}
                        onPress={() =>
                            navigate(
                                "/(app)/(tabs)/api-keys"
                            )
                        }
                    >
                        <KeyRound size={20} />
                        <Text style={styles.itemText}>
                            API Key
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.item}
                        onPress={() =>
                            navigate(
                                "/(app)/(tabs)/settings"
                            )
                        }
                    >
                        <Settings size={20} />
                        <Text style={styles.itemText}>
                            Account Settings
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <View style={styles.divider} />

                        <View style={styles.userRow}>
                            <Image
                                source={{
                                    uri:
                                        user?.imageUrl ||
                                        "https://via.placeholder.com/40",
                                }}
                                style={styles.avatar}
                            />

                            <View style={styles.userInfo}>
                                <Text
                                    style={styles.userName}
                                    numberOfLines={1}
                                >
                                    {user?.fullName ||
                                        user?.firstName ||
                                        "User"}
                                </Text>

                                <Text
                                    style={styles.userEmail}
                                    numberOfLines={1}
                                >
                                    {user?.primaryEmailAddress
                                        ?.emailAddress || ""}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor:
            "rgba(0,0,0,0.25)",
        justifyContent: "flex-end",
    },

    sheet: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: "45%",
    },

    header: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        alignItems: "center",
        marginBottom: 24,
    },

    logo: {
        fontSize: 30,
        fontWeight: "700",
        color: "#111827",
    },

    logoBlue: {
        color: "#3B5CCC",
    },

    section: {
        color: "#94A3B8",
        marginTop: 20,
        marginBottom: 12,
        fontWeight: "600",
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
    },

    itemText: {
        fontSize: 16,
        color: "#0F172A",
    },
    footer: {
        marginTop: "auto",
        paddingTop: 20,
    },

    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginBottom: 16,
    },

    userRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },

    userInfo: {
        marginLeft: 12,
        flex: 1,
    },

    userName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },

    userEmail: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 2,
    },
});