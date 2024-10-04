export function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
export function getMonthLength(year, month) {
    const feb = isLeapYear(year) ? 29 : 28;
    const monthLenghts = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return monthLenghts[month];
}
export function toText(date, formatTokens) {
    let text = '';
    if (date) {
        for (const token of formatTokens) {
            if (typeof token === 'string') {
                text += token;
            }
            else {
                text += token.toString(date);
            }
        }
    }
    return text;
}
export function getMonthDays(year, month) {
    const monthLength = getMonthLength(year, month);
    const days = [];
    for (let i = 0; i < monthLength; i++) {
        days.push({
            year: year,
            month: month,
            number: i + 1,
        });
    }
    return days;
}
export function getCalendarDays(value, weekStartsOn) {
    const year = value.getFullYear();
    const month = value.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    let days = [];
    // add last month
    const daysBefore = (firstWeekday - weekStartsOn + 7) % 7;
    if (daysBefore > 0) {
        let lastMonth = month - 1;
        let lastMonthYear = year;
        if (lastMonth === -1) {
            lastMonth = 11;
            lastMonthYear = year - 1;
        }
        days = getMonthDays(lastMonthYear, lastMonth).slice(-daysBefore);
    }
    // add current month
    days = days.concat(getMonthDays(year, month));
    // add next month
    let nextMonth = month + 1;
    let nextMonthYear = year;
    if (nextMonth === 12) {
        nextMonth = 0;
        nextMonthYear = year + 1;
    }
    const daysAfter = 42 - days.length;
    days = days.concat(getMonthDays(nextMonthYear, nextMonth).slice(0, daysAfter));
    return days;
}
