export const splitDate = (resDate: string) => {
	const dateParts = resDate.split(' ');
	const date = dateParts[0];
	const time = dateParts[1];
	const [year, month, day] = date.split('-');
	const [hour, minute, second] = time.split(':');
	return { year, month, day, hour, minute, second };
};

export const makeDay = (dateStr: string) => {
	const date = new Date(dateStr);
	return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export const dateAndTime = () => {
	const now = new Date();
	const formatDate = new Intl.DateTimeFormat('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: '2-digit',
	}).format(now);
	const formatTime = new Intl.DateTimeFormat('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	}).format(now);

	return { formatDate, formatTime };
};
