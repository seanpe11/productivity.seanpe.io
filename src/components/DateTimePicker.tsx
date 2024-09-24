import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";

interface DateTimePickerProps {
	selectedDate: Date;
	onDateChange: (date: Date) => void;
}

export default function DateTimePicker({ selectedDate, onDateChange }: DateTimePickerProps) {
	const [time, setTime] = React.useState<string>("12:00");

	const handleDateChange = (selectedDate: Date | undefined) => {
		if (selectedDate) onDateChange(selectedDate);
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTime(e.target.value);
		onDateChange(new Date(
			`${format(selectedDate, "yyyy-MM-dd")} ${e.target.value}`
		))
	};

	return (
		<div>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className="w-[280px] justify-start text-left font-normal"
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{selectedDate ? `${format(selectedDate, "PPpp")}` : "Pick a date and time"}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar
						mode="single"
						selected={selectedDate}
						onSelect={handleDateChange}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
			<div className="mt-2 flex items-center gap-2">
				<input
					type="time"
					value={time}
					onChange={handleTimeChange}
					className="border p-2 rounded-md"
				/>
			</div>
		</div>
	);
}

