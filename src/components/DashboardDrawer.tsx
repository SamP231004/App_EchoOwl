import BottomSheet from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import {
    Home,
    Diamond,
    KeyRound,
    Settings,
    X,
} from "lucide-react-native";
import { useRouter } from "expo-router";

export function DashboardDrawer({
    sheetRef,
}: any) {
    const router = useRouter();

    const snapPoints = useMemo(
        () => ["70%"],
        []
    );

    return (
        <BottomSheet
            ref={sheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
        >
            <View
                style={{
                    flex: 1,
                    padding: 24,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 28,
                            fontWeight: "700",
                            color: "#3B5CCC",
                        }}
                    >
                        EchoOwl
                    </Text>

                    <TouchableOpacity>
                        <X />
                    </TouchableOpacity>
                </View>

                <Text
                    style={{
                        marginTop: 24,
                        color: "#94A3B8",
                    }}
                >
                    Overview
                </Text>

                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        marginTop: 16,
                        gap: 12,
                    }}
                    onPress={() =>
                        router.push(
                            "/(app)/(tabs)/dashboard"
                        )
                    }
                >
                    <Home size={20} />
                    <Text>Dashboard</Text>
                </TouchableOpacity>

                <Text
                    style={{
                        marginTop: 32,
                        color: "#94A3B8",
                    }}
                >
                    Account
                </Text>

                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        marginTop: 16,
                        gap: 12,
                    }}
                    onPress={() =>
                        router.push(
                            "/(app)/(tabs)/upgrade"
                        )
                    }
                >
                    <Diamond size={20} />
                    <Text>Upgrade</Text>
                </TouchableOpacity>

                <Text
                    style={{
                        marginTop: 32,
                        color: "#94A3B8",
                    }}
                >
                    Settings
                </Text>

                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        marginTop: 16,
                        gap: 12,
                    }}
                    onPress={() =>
                        router.push(
                            "/(app)/(tabs)/api-keys"
                        )
                    }
                >
                    <KeyRound size={20} />
                    <Text>API Key</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        marginTop: 16,
                        gap: 12,
                    }}
                    onPress={() =>
                        router.push(
                            "/(app)/(tabs)/settings"
                        )
                    }
                >
                    <Settings size={20} />
                    <Text>
                        Account Settings
                    </Text>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
}