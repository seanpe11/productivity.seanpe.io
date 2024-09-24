"use client";
import { useState, useEffect, useRef } from 'react';
import * as deadlineFormatters from '~/util/deadlineFormatters';

type Countdown = {
	date: Date;
	name: string;
};

interface CountdownListProps {
	deadlines: Countdown[] | undefined; // Directly pass the deadlines data from useQuery
}

const CountdownList: React.FC<CountdownListProps> = ({ deadlines }) => {
	const [countdowns, setCountdowns] = useState<Countdown[]>([]);
	const modes = ["default", "pomodoro", "week", "month"];
	const [modeIndex, setModeIndex] = useState(0);
	const animationFrameRef = useRef<number | null>(null);

	useEffect(() => {
		if (!deadlines) return;

		const updateCountdowns = () => {
			const now = new Date().getTime();
			const updatedCountdowns = deadlines.map(({ date, name }) => {
				const distance = new Date(date).getTime() - now;
				return { date: new Date(distance), name };
			});

			setCountdowns(updatedCountdowns);

			animationFrameRef.current = requestAnimationFrame(updateCountdowns);
		};

		animationFrameRef.current = requestAnimationFrame(updateCountdowns);

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [deadlines]);

	const formatCountdown = (milliseconds: number) => {
		switch (modes[modeIndex]) {
			case "pomodoro":
				return deadlineFormatters.pomodoroFormatter(milliseconds);
			case "week":
				return deadlineFormatters.weekFormatter(milliseconds);
			case "month":
				return deadlineFormatters.monthFormatter(milliseconds);
			default:
				return deadlineFormatters.formatDeadline(milliseconds);
		}
	};

	return (
		<div className="flex flex-col w-max rounded-xl bg-blue/10">
			{countdowns.length > 0 &&
				countdowns.map((countdown, index) => (
					<div
						className={`flex flex-col gap-4 p-4 hover:bg-white/20 ${(index < countdowns.length - 1) ? "border-b" : ""}`}
						key={index + countdown.name}
						onClick={() => setModeIndex((modeIndex + 1) % modes.length)}
					>
						<h3 className="text-2xl font-bold">{countdown.name}</h3>
						<div className="text-lg">
							{formatCountdown(countdown.date.getTime())}
						</div>
					</div>
				))}
		</div>
	);
};

export default CountdownList;
