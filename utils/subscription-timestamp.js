function getSubscriptionExpiryTimestamp(subscription) {
    switch (subscription) {
        case '2 weeks subscription':
            return Date.now() + 14 * 24 * 60 * 60 * 1000; // 14 days
        case '1 month subscription':
            return Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
        case '6 months subscription':
            return Date.now() + 182 * 24 * 60 * 60 * 1000; // 182 days
        case '1 year subscription':
            return Date.now() + 365 * 24 * 60 * 60 * 1000; // 365 days
        default:
            throw new Error('Invalid subscription duration');
    }
}

export default getSubscriptionExpiryTimestamp;