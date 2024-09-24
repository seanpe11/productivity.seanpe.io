"use client";
import { useState, useEffect, useRef } from 'react';
import * as deadlineFormatters from '~/util/deadlineFormatters';

type Countdown = {
	date: Date;
	name: string;
	createdAt?: Date;
};

interface CountdownListProps {
	deadlines: Countdown[] | undefined; // Directly pass the deadlines data from useQuery
	onDelete: (name: string, deadline: Date) => void;
}

const CountdownList: React.FC<CountdownListProps> = ({ deadlines, onDelete }) => {
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

	// TODO: fix logic
	const getProgress = (countdown: Countdown) => {
		if (!countdown.createdAt) return 100;
		const now = new Date().getTime();
		const distance = new Date(countdown.createdAt).getTime() - now;
		return Math.floor((distance / countdown.date.getTime()) * 100);
	};

	return (
		<div className="flex flex-col w-96 rounded-xl bg-blue/10">
			{countdowns.length > 0 &&
				countdowns.map((countdown, index) => (
					<div key={index + countdown.name}>
						<div className="flex flex-row gap-4 justify-between">
							<div
								className={`flex flex-col gap-4 p-4 hover:bg-white/20`}
								onClick={() => setModeIndex((modeIndex + 1) % modes.length)}
							>
								<h3 className="text-2xl font-bold">{countdown.name}</h3>
								<div className="text-lg">
									{formatCountdown(countdown.date.getTime())}
								</div>
							</div>
							<button onClick={() => onDelete(countdown.name, countdown.date)}>Delete</button>
						</div>
						<div className={`border-4 rounded-full`} style={{ width: `${getProgress(countdown)}%` }} />
						<div className={`border-b rounded-full`} />
					</div>
				))}
		</div>
	);
};

export default CountdownList;
