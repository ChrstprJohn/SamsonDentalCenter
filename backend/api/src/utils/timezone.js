/**
 * Timezone utility functions for Philippine Time (UTC+8) handling.
 *
 * The clinic is located in the Philippines and operates on Philippine Time (UTC+8).
 * This utility ensures all date calculations use the correct timezone instead of UTC.
 */

/**
 * Get today's date in Philippine Time (UTC+8) format: 'YYYY-MM-DD'
 *
 * Example:
 * - UTC: 2026-03-26T16:00:00Z
 * - PH Time: 2026-03-27 (UTC+8, next day!)
 * - Returns: '2026-03-27'
 *
 * @returns {string} Today's date in YYYY-MM-DD format (Philippine Time)
 */
export const getTodayPH = () => {
    const now = new Date();
    // Convert to Philippine Time by adding 8 hours
    const phTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    return phTime.toISOString().split('T')[0];
};

/**
 * Get a specific date in Philippine Time format: 'YYYY-MM-DD'
 *
 * Use this when you need to convert a Date object to PH timezone string.
 *
 * @param {Date} date - The date to convert
 * @returns {string} Date in YYYY-MM-DD format (Philippine Time)
 */
export const formatDatePH = (date) => {
    const phTime = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    return phTime.toISOString().split('T')[0];
};

/**
 * Get the current time in Philippine Time format: 'HH:MM'
 *
 * @returns {string} Current time in HH:MM format (Philippine Time)
 */
export const getCurrentTimePH = () => {
    const now = new Date();
    // Convert to Philippine Time by adding 8 hours
    const phTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const hours = String(phTime.getUTCHours()).padStart(2, '0');
    const minutes = String(phTime.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

/**
 * Check if a date string is today in Philippine Time.
 *
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {boolean} True if the date is today (PH time)
 */
export const isTodayPH = (dateStr) => {
    return dateStr === getTodayPH();
};

/**
 * Check if a date string is in the future (from today, Philippine Time).
 *
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {boolean} True if the date is after today (PH time)
 */
export const isFuturePH = (dateStr) => {
    return dateStr > getTodayPH();
};

/**
 * Check if a date string is in the past (from today, Philippine Time).
 *
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {boolean} True if the date is before today (PH time)
 */
export const isPastPH = (dateStr) => {
    return dateStr < getTodayPH();
};

/**
 * Check if a datetime is in the past (Philippine Time).
 *
 * Combines date and time to determine if an appointment has passed.
 * Useful for checking if an appointment end time has passed.
 *
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @param {string} timeStr - Time string in HH:MM format
 * @returns {boolean} True if the datetime has passed (PH time)
 */
export const isDateTimePastPH = (dateStr, timeStr) => {
    const now = new Date();
    const phTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);

    const todayPH = phTime.toISOString().split('T')[0];
    const currentTimePH = `${String(phTime.getUTCHours()).padStart(2, '0')}:${String(phTime.getUTCMinutes()).padStart(2, '0')}`;

    // If appointment date is in the past, it's definitely past
    if (dateStr < todayPH) {
        return true;
    }

    // If appointment date is in the future, it hasn't passed
    if (dateStr > todayPH) {
        return false;
    }

    // Same day: compare times
    return timeStr < currentTimePH;
};

/**
 * Calculate hours until an appointment (Philippine Time aware).
 *
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @param {string} timeStr - Time string in HH:MM format
 * @returns {number} Hours until the appointment (can be negative if passed)
 */
export const getHoursUntilPH = (dateStr, timeStr) => {
    const now = new Date();
    const phTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);

    // Parse appointment datetime
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);

    // Create appointment time in UTC (since we adjusted current time)
    const apptTime = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));

    // Calculate difference in hours
    return (apptTime.getTime() - phTime.getTime()) / (1000 * 60 * 60);
};

/**
 * Get hours remaining until appointment end time, considering grace period.
 *
 * Used to detect no-shows: if end_time + grace period has passed, mark as no-show.
 *
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @param {string} endTimeStr - End time string in HH:MM format
 * @param {number} graceMinutes - Grace period in minutes (default: 15)
 * @returns {number} Hours from now until (end_time + grace period)
 */
export const getHoursUntilNoShowDeadlinePH = (dateStr, endTimeStr, graceMinutes = 15) => {
    const hoursUntilEnd = getHoursUntilPH(dateStr, endTimeStr);
    const graceHours = graceMinutes / 60;
    return hoursUntilEnd + graceHours;
};

/**
 * Get Philippine Time information for logging/debugging.
 *
 * Returns current UTC and Philippine Time for debugging purposes.
 *
 * @returns {object} { utc, ph, todayPH, currentTimePH }
 */
export const getTimezoneInfo = () => {
    const now = new Date();
    const phTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);

    return {
        utc: now.toISOString(),
        ph: phTime.toISOString(),
        todayPH: phTime.toISOString().split('T')[0],
        currentTimePH: `${String(phTime.getUTCHours()).padStart(2, '0')}:${String(phTime.getUTCMinutes()).padStart(2, '0')}`,
    };
};
