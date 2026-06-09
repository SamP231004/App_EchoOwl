import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import {
    Menu,
    ArrowLeft,
} from "lucide-react-native";

interface Props {
    showBack?: boolean;
    onBack?: () => void;
    onMenu?: () => void;
}

export function AppHeader({
    showBack = false,
    onBack,
    onMenu,
}: Props) {
    return (
        <View style={styles.header}>
            <View style={styles.left}>
                {showBack && (
                    <TouchableOpacity
                        onPress={onBack}
                        style={styles.backButton}
                    >
                        <ArrowLeft
                            size={22}
                            color="#0F172A"
                        />
                    </TouchableOpacity>
                )}

                <Image
                    source={require("assets/images/brand-asset-profile-picture.png")}
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
                onPress={onMenu}
            >
                <Menu
                    size={28}
                    color="#0F172A"
                />
            </TouchableOpacity>
        </View>
    );
}

const styles =
    StyleSheet.create({
        header: {
            flexDirection: "row",
            justifyContent:
                "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 16,
            backgroundColor:
                "#F8FAFC",
        },

        left: {
            flexDirection: "row",
            alignItems: "center",
        },

        backButton: {
            marginRight: 12,
        },

        logoImage: {
            width: 36,
            height: 36,
            borderRadius: 18,
            marginRight: 10,
        },

        logo: {
            fontSize: 30,
            fontWeight: "700",
            color: "#111827",
        },

        logoBlue: {
            color: "#3B5CCC",
        },
    });