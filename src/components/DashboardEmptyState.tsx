import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";

interface Props {
    onQuickstart: () => void;
    onCreateCategory: () => void;
    loading?: boolean;
}

export function DashboardEmptyState({
    onQuickstart,
    onCreateCategory,
    loading,
}: Props) {
    return (
        <View style={styles.container}>
            <Image
                source={require("assets/images/brand-asset-wave.png")}
                style={styles.image}
            />

            <Text style={styles.title}>
                No Event Categories Yet
            </Text>

            <Text style={styles.description}>
                Start tracking events by creating your first
                category.
            </Text>

            <TouchableOpacity
                style={styles.outlineButton}
                onPress={onQuickstart}
                disabled={loading}
            >
                <Text style={styles.outlineText}>
                    🚀 {loading ? "Creating..." : "Quickstart"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.primaryButton}
                onPress={onCreateCategory}
            >
                <Text style={styles.primaryText}>
                    Add Category
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },

    image: {
        width: 180,
        height: 180,
        resizeMode: "contain",
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#0F172A",
        marginTop: 10,
    },

    description: {
        textAlign: "center",
        color: "#64748B",
        marginTop: 12,
        marginBottom: 28,
        lineHeight: 22,
    },

    outlineButton: {
        width: "100%",
        height: 56,
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },

    outlineText: {
        fontWeight: "600",
        color: "#0F172A",
    },

    primaryButton: {
        width: "100%",
        height: 56,
        backgroundColor: "#3B5CCC",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },

    primaryText: {
        color: "#FFF",
        fontWeight: "700",
    },
});