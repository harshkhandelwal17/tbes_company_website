// Company founded: November 1, 2018
const COMPANY_START = new Date(2018, 10, 1); // Month is 0-indexed, so 10 = November
const BASE_PROJECTS = 100; // Projects completed by end of first year (Nov 2019)
const ANNUAL_GROWTH_RATE = 0.10; // 10% growth per year

/**
 * Returns years of experience (floored), e.g. 7 for Feb 2026
 */
export function getYearsOfExperience(): number {
    const now = new Date();
    const diffMs = now.getTime() - COMPANY_START.getTime();
    const years = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
    return years;
}

/**
 * Returns total project count with 10% annual compound growth.
 * Base: 100 projects by Nov 2019 (year 1), grows 10% each year after.
 * Result is rounded to the nearest 10 for display purposes.
 */
export function getProjectCount(): number {
    const now = new Date();
    const yearsElapsed = (now.getTime() - COMPANY_START.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    const rawCount = BASE_PROJECTS * Math.pow(1 + ANNUAL_GROWTH_RATE, yearsElapsed);
    // Round down to nearest 10 for a clean "200+" style number
    return Math.floor(rawCount / 10) * 10;
}
