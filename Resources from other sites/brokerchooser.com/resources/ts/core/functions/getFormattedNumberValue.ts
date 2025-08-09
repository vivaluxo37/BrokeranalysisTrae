export const getFormattedNumberValue = (popularity: number): string => {
    const formatter = Intl.NumberFormat('en', { notation: 'compact' });
    return formatter.format(popularity);
};
