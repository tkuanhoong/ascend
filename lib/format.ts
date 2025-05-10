export function formatMinutes(minutes: number): string {
    if (minutes < 0) {
        throw new Error("Time cannot be negative");
    }

    if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours < 24) {
        const parts = [`${hours} hr${hours !== 1 ? 's' : ''}`];
        if (remainingMinutes > 0) {
            parts.push(`${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}`);
        }
        return parts.join(' ');
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    const parts = [`${days} day${days !== 1 ? 's' : ''}`];
    if (remainingHours > 0) {
        parts.push(`${remainingHours} hr${remainingHours !== 1 ? 's' : ''}`);
    }
    if (remainingMinutes > 0) {
        parts.push(`${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}`);
    }

    return parts.join(' ');
}