export const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 1) {
        const diffInMins = Math.floor(diffInMs / (1000 * 60));
        return diffInMins <= 1 ? 'Just now' : `${diffInMins}m ago`;
    }

    if (diffInHours < 24) {
        const hours = Math.floor(diffInHours);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} old`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} old`;
};
