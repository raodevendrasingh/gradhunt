export function formatDate(dateString: Date): string {
	const date = new Date(dateString);

	const dayOfMonth = date.getDate();
	const daySuffix = getDaySuffix(dayOfMonth);

	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	const month = monthNames[date.getMonth()];

	const year = date.getFullYear();

	return `${dayOfMonth}${daySuffix} ${month} ${year}`;
}

function getDaySuffix(day: number): string {
	if (day === 1 || day === 21 || day === 31) {
		return "st";
	} else if (day === 2 || day === 22) {
		return "nd";
	} else if (day === 3 || day === 23) {
		return "rd";
	} else {
		return "th";
	}
}
