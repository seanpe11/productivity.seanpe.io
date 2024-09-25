import ical from "node-ical";

const getCalendars = async () => {
	const gCal = await ical.async.fromURL(process.env.GOOGLE_CALENDAR_LINK || '');
	const outlookCal = await ical.async.fromURL(process.env.OUTLOOK_CALENDAR_LINK || '');

	return [gCal, outlookCal];
};

const parseEvents = (calendar: ical.CalendarResponse) => {
	const events = [];

	for (const eventKey in calendar) {
		if (Object.prototype.hasOwnProperty.call(calendar, eventKey)) {
			const event = calendar[eventKey];

			if (event?.type === 'VEVENT') {
				const event = calendar[eventKey] as ical.VEvent;
				const deadline = event.start ? new Date(event.start.toISOString()) : null;
				if (!deadline) continue;
				if (deadline.getTime() < Date.now()) continue;
				const name = event.summary || '';

				events.push({ deadline, name });
			}
		}
	}

	return events;
};

export const getFromCalendars = async () => {
	const calendars = await getCalendars();

	let events: { deadline: Date | null, name: string }[] = [];

	for (const calendar of calendars) {
		const parsedEvents = parseEvents(calendar);
		events = events.concat(parsedEvents);
	}

	return events;
}


