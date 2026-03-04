// Company founded: November 1, 2018
const COMPANY_START = new Date(2018, 10, 1); // Month is 0-indexed, so 10 = November
const ANNUAL_GROWTH_RATE = 0.10; // 10% growth per year

// Base values as of first year (Nov 2019)
const BASE_PROJECTS = 100;
const BASE_SQM = 5; // 5M Sq. M.
const BASE_CLIENTS = 25;
const BASE_COUNTRIES = 13;

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
 * Helper to calculate compound growth
 */
function calculateGrowth(baseValue: number): number {
    const now = new Date();
    const yearsElapsed = (now.getTime() - COMPANY_START.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    return baseValue * Math.pow(1 + ANNUAL_GROWTH_RATE, yearsElapsed);
}

/**
 * Returns total project count with 10% annual compound growth.
 */
export function getProjectCount(): number {
    const rawCount = calculateGrowth(BASE_PROJECTS);
    // Round down to nearest 10 for a clean "200+" style number
    return Math.floor(rawCount / 10) * 10;
}

/**
 * Returns total Sq. M. modeled with 10% annual growth.
 */
export function getSqMModeled(): number {
    const rawValue = calculateGrowth(BASE_SQM);
    // Return rounded to nearest integer (for "10M+" style)
    return Math.floor(rawValue);
}

/**
 * Returns happy clients count with 10% annual growth.
 */
export function getHappyClients(): number {
    const rawValue = calculateGrowth(BASE_CLIENTS);
    // Round down to nearest 5
    return Math.floor(rawValue / 5) * 5;
}

/**
 * Returns countries served count with 10% annual growth.
 */
export function getCountriesServed(): number {
    const rawValue = calculateGrowth(BASE_COUNTRIES);
    // Return floor
    return Math.floor(rawValue);
}
