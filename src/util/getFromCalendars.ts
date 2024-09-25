import ical from "node-ical";

// TODO: understand why microsoft calendars are not working
const getCalendars = async () => {
	const gCal = await ical.async.fromURL(process.env.GOOGLE_CALENDAR_LINK || '');
	const outlookCal = await ical.async.fromURL(process.env.OUTLOOK_CALENDAR_LINK || '');

	return [{ calendar: gCal, name: "GCal" }, { calendar: outlookCal, name: "UC Cal" }];
};

const parseEvents = (calendar: ical.CalendarResponse, name: string) => {
	const events = [];

	for (const [_key, value] of Object.entries(calendar)) {
		if (value.type === 'VEVENT') {
			const event = {
				name: value.summary,
				deadline: value.start,
				fromCalendar: name
			};
			events.push(event);
		}
	}

	return events;
};

export const syncToDb = async () => {
	const calendars = await getCalendars();

	let events: { deadline: Date, name: string }[] = [];

	for (const calendar of calendars) {
		const parsedEvents = parseEvents(calendar.calendar as ical.CalendarResponse, calendar.name);
		events = events.concat(parsedEvents);
	}
}

export const getFromCalendars = async () => {
	const calendars = await getCalendars();

	let events: { deadline: Date | null, name: string }[] = [];

	for (const calendar of calendars) {
		const parsedEvents = parseEvents(calendar.calendar as ical.CalendarResponse, calendar.name);
		events = events.concat(parsedEvents);
	}

	return events;
}


