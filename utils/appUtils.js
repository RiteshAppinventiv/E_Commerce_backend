
export function timeConversion(value) {
	const seconds = Number((value / 1000).toFixed(0));
	const minutes = Number((value / (1000 * 60)).toFixed(0));
	const hours = Number((value / (1000 * 60 * 60)).toFixed(0));
	const days = Number((value / (1000 * 60 * 60 * 24)).toFixed(0));

	if (seconds < 60) {
		return seconds + " Sec";
	} else if (minutes < 60) {
		return minutes + " Minutes";
	} else if (hours < 24) {
		return hours + " Hrs";
	} else {
		return days + " Days";
	}
};
