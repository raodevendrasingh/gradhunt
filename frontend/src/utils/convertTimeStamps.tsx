export const getMonthYear = (date: string): string => {
	const now = new Date();
	const past = new Date(date);

	// Get the month and year from the past date
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
	};
	const formattedDate = past.toLocaleDateString("en-US", options);

	// Check if the date is in the current month and year
	if (
		past.getFullYear() === now.getFullYear() &&
		past.getMonth() === now.getMonth()
	) {
		return `current month current year`;
	}

	return formattedDate; // Return "July 2024" format
};
