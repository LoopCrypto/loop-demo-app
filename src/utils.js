export function currentSeconds() {
    return Math.floor(Date.now() / 1000);
}

export function frequencyUnitToSeconds(frequencyUnit) {
    switch (frequencyUnit.toLowerCase()) {
        case "hour":
            return 60 * 60;
        case "day":
            return 24 * 60 * 60;
        case "week":
            return 7 * 24 * 60 * 60;
        case "month":
            return 30 * 24 * 60 * 60;
        case "year":
            return 365 * 24 * 60 * 60;
        default:
            return 0;
    }
}
