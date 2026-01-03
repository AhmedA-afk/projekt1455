
export const getISTDate = () => {
    const now = new Date();
    const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    return new Date(istString);
};

// Target: Jan 1, 2030
export const getDaysRemaining = () => {
    const now = getISTDate();
    const target = new Date("2030-01-01T00:00:00");

    // Normalize to midnight to avoid partial day offsets
    const nowMidnight = new Date(now);
    nowMidnight.setHours(0, 0, 0, 0);

    const diffTime = target - nowMidnight;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// Week 1 Starts: Jan 7, 2026
// Before that is Week 0
export const getCurrentWeek = () => {
    const now = getISTDate();
    const startOfWeek1 = new Date("2026-01-07T00:00:00");

    // Normalize
    now.setHours(0, 0, 0, 0);
    startOfWeek1.setHours(0, 0, 0, 0); // Ensure comparison is fair

    if (now < startOfWeek1) {
        return 0; // Week 0 covers everything before Jan 7, 2026
    }

    const diffTime = now - startOfWeek1;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeksPassed = Math.floor(diffDays / 7);

    return weeksPassed + 1; // Week 1, 2, 3...
};
