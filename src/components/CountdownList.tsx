"use client";
import { useState, useEffect, useRef } from 'react';
import * as deadlineFormatters from '~/util/deadlineFormatters';
import { SelectDeadlines } from "~/server/db/schema";
import { Progress } from "~/components/ui/progress";

interface CountdownListProps {
	deadlines: SelectDeadlines[] | undefined; // Directly pass the deadlines data from useQuery
	onDelete: (name: string, deadline: Date) => void;
}

// frontend type that holds calculated distance from deadline
type Countdown = {
	remainingTime: Date;
	name: string;
	startTime: Date;
	deadline: Date;
};

const CountdownList: React.FC<CountdownListProps> = ({ deadlines, onDelete }) => {
	const [countdowns, setCountdowns] = useState<Countdown[]>([]);
	const modes = ["default", "pomodoro", "week", "month"];
	const [modeIndex, setModeIndex] = useState(0);
	const animationFrameRef = useRef<number | null>(null);

	useEffect(() => {
		if (!deadlines) return;

		const updateCountdowns = () => {
			const now = new Date().getTime();
			const updatedCountdowns = deadlines.map(({ deadline, name, startTime, createdAt }) => {
				const distance = new Date(deadline).getTime() - now;
				if (startTime !== null) return { remainingTime: new Date(distance), name, startTime, deadline };
				return { remainingTime: new Date(distance), name, startTime: createdAt, deadline };
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

	const getProgress = (countdown: Countdown) => {
		const now = new Date().getTime();
		const totalDistance = countdown.deadline.getTime() - countdown.startTime.getTime();
		const currentDistance = countdown.deadline.getTime() - now;
		return Math.floor((currentDistance / totalDistance) * 100);
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
									{formatCountdown(countdown.remainingTime.getTime())}
								</div>
							</div>
							<button onClick={() => onDelete(countdown.name, countdown.deadline)}>Delete</button>
						</div>
						<Progress value={getProgress(countdown)} />
					</div>
				))}
		</div>
	);
};

export default CountdownList;
