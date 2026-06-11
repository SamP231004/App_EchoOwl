import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";

export default function SSOCallback() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/(app)/(tabs)/dashboard");
    }, [router]);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ActivityIndicator size="large" />
        </View>
    );
}
