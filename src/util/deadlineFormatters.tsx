export const formatDeadline = (milliseconds: number) => {
	const ms = milliseconds % 1000;
	const totalSeconds = Math.floor(milliseconds / 1000);
	const seconds = totalSeconds % 60;
	const totalMinutes = Math.floor(totalSeconds / 60);
	const minutes = totalMinutes % 60;
	const totalHours = Math.floor(totalMinutes / 60);
	const hours = totalHours % 24;
	const days = Math.floor(totalHours / 24);

	let deadlineString = "";

	if (days > 0) {
		deadlineString += `${days}d `;
	}

	if (hours > 0) {
		deadlineString += `${String(hours).padStart(2, '0')}h `;
	}

	return deadlineString + `${minutes}m ${String(seconds).padStart(2, '0')}s ${String(ms).padStart(3, '0')}ms`;
};

export const pomodoroFormatter = (milliseconds: number) => {
	const pomodoros = milliseconds / (60 * 30 * 1000);

	return `${pomodoros.toFixed(4)} pomodoros`; // round to decimal place that will move every second
};


export const weekFormatter = (milliseconds: number) => {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const days = totalSeconds / 86400;
	const weeks = days / 7;

	if (weeks < 1) {
		if (days < 1) {
			return "Today";
		}
		return "This week";
	}
	return weeks.toFixed(2) + " weeks";
};

export const monthFormatter = (milliseconds: number) => {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const days = totalSeconds / 86400;
	const months = days / 30;

	return `${months.toFixed(2)} months`;
}
