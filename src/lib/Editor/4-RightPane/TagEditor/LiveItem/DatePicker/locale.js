export function getLocaleDefaults() {
    return {
        weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        months: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ],
        weekStartsOn: 1,
    };
}
export function getInnerLocale(locale = {}) {
    const innerLocale = getLocaleDefaults();
    if (typeof locale.weekStartsOn === 'number') {
        innerLocale.weekStartsOn = locale.weekStartsOn;
    }
    if (locale.months)
        innerLocale.months = locale.months;
    if (locale.weekdays)
        innerLocale.weekdays = locale.weekdays;
    return innerLocale;
}
/** Create a Locale from a date-fns locale */
export function localeFromDateFnsLocale(dateFnsLocale) {
    var _a;
    const locale = getLocaleDefaults();
    if (typeof ((_a = dateFnsLocale === null || dateFnsLocale === void 0 ? void 0 : dateFnsLocale.options) === null || _a === void 0 ? void 0 : _a.weekStartsOn) === 'number') {
        locale.weekStartsOn = dateFnsLocale.options.weekStartsOn;
    }
    if (dateFnsLocale.localize) {
        for (let i = 0; i < 7; i++) {
            // widths: narrow, short, abbreviated, wide, any
            locale.weekdays[i] = dateFnsLocale.localize.day(i, { width: 'short' });
        }
        for (let i = 0; i < 12; i++) {
            locale.months[i] = dateFnsLocale.localize.month(i, { width: 'wide' });
        }
    }
    return locale;
}
