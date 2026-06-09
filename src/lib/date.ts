import { format, formatDistanceToNow } from "date-fns";

export const toDate = (
    value: string | number | Date | null | undefined
): Date | null => {
    if (!value) return null;

    if (value instanceof Date) {
        return value;
    }

    if (typeof value === "number") {
        return new Date(
            value > 1000000000000
                ? value
                : value * 1000
        );
    }

    return new Date(value);
};

export const formatShortDate = (
    value: string | number | Date | null | undefined
) => {
    const date = toDate(value);

    if (!date) return "Unknown";

    return format(
        date,
        "MMM d, yyyy"
    );
};

export const formatDateTime = (
    value: string | number | Date | null | undefined
) => {
    const date = toDate(value);

    if (!date) return "Unknown";

    return format(
        date,
        "MMM d, yyyy h:mm a"
    );
};

export const formatRelativeTime = (
    value: string | number | Date | null | undefined
) => {
    const date = toDate(value);

    if (!date) return "Never";

    return (
        formatDistanceToNow(date) +
        " ago"
    );
};