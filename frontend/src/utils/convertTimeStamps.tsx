export const getMonthYear = (date: string): string => {
    const past = new Date(date);

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
    };
    const formattedDate = past.toLocaleDateString("en-US", options);

    return formattedDate;
};