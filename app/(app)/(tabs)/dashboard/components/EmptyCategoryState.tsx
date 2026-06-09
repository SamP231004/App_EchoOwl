import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from "react-native";

interface Props {
    categoryName: string;
}

export function EmptyCategoryState({
    categoryName,
}: Props) {
    const codeSnippet = `await fetch('https://api.echoowl.dev/api/events', {
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

    return (
        <ScrollView
            contentContainerStyle={styles.container}
        >
            <Text style={styles.title}>
                Create your first {categoryName} event
            </Text>

            <Text style={styles.description}>
                Get started by sending a request
                to the EchoOwl tracking API.
            </Text>

            <View style={styles.codeContainer}>
                <Text style={styles.fileName}>
                    your-first-event.js
                </Text>

                <Text style={styles.code}>
                    {codeSnippet}
                </Text>
            </View>

            <View style={styles.listening}>
                <View style={styles.dot} />

                <Text style={styles.listeningText}>
                    Listening for incoming events...
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },

    title: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 10,
        color: "#0F172A",
    },

    description: {
        textAlign: "center",
        color: "#64748B",
        marginBottom: 24,
    },

    codeContainer: {
        backgroundColor: "#111827",
        borderRadius: 16,
        overflow: "hidden",
    },

    fileName: {
        color: "#94A3B8",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#374151",
    },

    code: {
        color: "#E2E8F0",
        padding: 16,
        fontFamily: "monospace",
        lineHeight: 22,
    },

    listening: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },

    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#22C55E",
        marginRight: 8,
    },

    listeningText: {
        color: "#64748B",
    },
});