export function daysRemaining(targetDate: Date): string {
	const currentDate = new Date();
	const endDate = new Date(targetDate);

	const diffInMs = endDate.getTime() - currentDate.getTime();

	if (diffInMs < 0) {
		return "passed";
	}

	const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

	return `in ${diffInDays} days`;
}
