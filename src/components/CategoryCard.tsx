import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import {
    Clock3,
    Database,
    BarChart3,
    Trash2,
    ArrowRight,
} from "lucide-react-native";
import {
    formatDistanceToNow,
} from "date-fns";
import {
  formatShortDate,
} from "@src/lib/date";

export interface Category {
    id: string;
    name: string;
    emoji?: string | null;
    color: number;
    uniqueFieldCount: number;
    eventsCount: number;
    lastPing?: string | number | null;
    createdAt?: string | number | Date;
}

interface Props {
    category: Category;
    onPress: () => void;
    onDelete: () => void;
}

export function CategoryCard({
    category,
    onPress,
    onDelete,
}: Props) {
    const color = `#${category.color
        .toString(16)
        .padStart(6, "0")}`;

    const getLastPingText = () => {
        if (!category.lastPing) {
            return "Never";
        }

        try {
            let date: Date;

            if (typeof category.lastPing === "number") {
                date = new Date(category.lastPing * 1000);
            } else {
                date = new Date(category.lastPing);
            }

            return (
                formatDistanceToNow(date) +
                " ago"
            );
        } catch {
            return "Never";
        }
    };

    return (
        <View style={styles.card}>
            {/* Header */}

            <View style={styles.topRow}>
                <View style={styles.leftSection}>
                    <View
                        style={[
                            styles.colorCircle,
                            {
                                backgroundColor: color,
                            },
                        ]}
                    />

                    <View>
                        <Text style={styles.name}>
                            {category.emoji || "📂"}{" "}
                            {category.name}
                        </Text>

                        {category.createdAt && (
                            <Text style={styles.date}>
                                <Text style={styles.date}>
                                    {formatShortDate(
                                        category.createdAt
                                    )}
                                </Text>
                            </Text>
                        )}
                    </View>
                </View>

                <TouchableOpacity
                    onPress={onDelete}
                    hitSlop={10}
                >
                    <Trash2
                        size={18}
                        color="#94A3B8"
                    />
                </TouchableOpacity>
            </View>

            {/* Stats */}

            <View style={styles.infoRow}>
                <Clock3
                    size={16}
                    color="#3B82F6"
                />

                <Text style={styles.infoText}>
                    <Text
                        style={styles.boldText}
                    >
                        Last ping:
                    </Text>{" "}
                    {getLastPingText()}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Database
                    size={16}
                    color="#3B82F6"
                />

                <Text style={styles.infoText}>
                    <Text
                        style={styles.boldText}
                    >
                        Unique fields:
                    </Text>{" "}
                    {category.uniqueFieldCount}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <BarChart3
                    size={16}
                    color="#3B82F6"
                />

                <Text style={styles.infoText}>
                    <Text
                        style={styles.boldText}
                    >
                        Events this month:
                    </Text>{" "}
                    {category.eventsCount}
                </Text>
            </View>

            {/* Footer */}

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.viewButton}
                    onPress={onPress}
                >
                    <Text
                        style={styles.viewText}
                    >
                        View all
                    </Text>

                    <ArrowRight
                        size={14}
                        color="#0F172A"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 20,
        marginBottom: 16,

        borderWidth: 1,
        borderColor: "#E5E7EB",

        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },

        elevation: 1,
    },

    topRow: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
    },

    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 14,
    },

    name: {
        fontSize: 24,
        fontWeight: "600",
        color: "#111827",
    },

    date: {
        marginTop: 4,
        fontSize: 14,
        color: "#64748B",
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },

    infoText: {
        marginLeft: 10,
        color: "#475569",
        fontSize: 15,
    },

    boldText: {
        fontWeight: "600",
        color: "#334155",
    },

    footer: {
        marginTop: 12,
        flexDirection: "row",
        justifyContent:
            "space-between",
        alignItems: "center",
    },

    viewButton: {
        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 14,
        paddingVertical: 10,

        borderWidth: 1,
        borderColor: "#E5E7EB",

        borderRadius: 10,
    },

    viewText: {
        marginRight: 6,
        fontWeight: "500",
        color: "#0F172A",
    },
});
