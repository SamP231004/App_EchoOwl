import { Menu } from "lucide-react-native";
import { TouchableOpacity, View, Text } from "react-native";

export function DashboardHeader({
    onMenuPress,
}: {
    onMenuPress: () => void;
}) {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 16,
            }}
        >
            <Text
                style={{
                    fontSize: 26,
                    fontWeight: "700",
                    color: "#3B5CCC",
                }}
            >
                EchoOwl
            </Text>

            <TouchableOpacity onPress={onMenuPress}>
                <Menu size={28} />
            </TouchableOpacity>
        </View>
    );
}