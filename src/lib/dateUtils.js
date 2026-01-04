// Helper to get today's date components in IST, treated as UTC for stable math
const getTodayEpochIST = () => {
    const now = new Date();
    // Get distinct parts for Asia/Kolkata
    // Format: "M/D/YYYY" (en-US standard)
    const istDateString = now.toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" });
    const [month, day, year] = istDateString.split('/').map(Number);

    // Return Unix timestamp for "Midnight this morning" in pure UTC terms
    // This allows pure integer math without timezone offsets interfering
    return Date.UTC(year, month - 1, day);
};

// Target: Jan 1, 2030
export const getDaysRemaining = () => {
    const todayEpoch = getTodayEpochIST();
    const targetEpoch = Date.UTC(2030, 0, 1); // Jan 1, 2030 UTC

    // Difference in milliseconds
    const diffMs = targetEpoch - todayEpoch;

    // Convert to days (Math.round to handle any floating point oddities, though integer math should be clean)
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

// Week 1 Starts: Jan 7, 2026
// Before that is Week 0
export const getCurrentWeek = () => {
    const todayEpoch = getTodayEpochIST();
    const startWeek1Epoch = Date.UTC(2026, 0, 7); // Jan 7, 2026 UTC

    if (todayEpoch < startWeek1Epoch) {
        return 0; // Week 0 covers everything before Jan 7, 2026
    }

    const diffMs = todayEpoch - startWeek1Epoch;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeksPassed = Math.floor(diffDays / 7);

    return weeksPassed + 1; // Week 1, 2, 3...
};
