"use client";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useState, useEffect, useRef } from "react";
import CountdownCircle from "./ui/CountdownCircle";

interface PomodoroTimerProps {
	pomodoroState: 'pomodoro' | 'break' | 'longBreak';
	onPomodoroStateChange: (state: 'pomodoro' | 'break' | 'longBreak') => void;
}

export default function PomodoroTimer({ pomodoroState, onPomodoroStateChange }: PomodoroTimerProps) {
	const [remainingTime, setRemainingTime] = useState<Date>(new Date(25 * 60 * 1000));
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const [isTimerRunning, setIsTimerRunning] = useState(false);

	// Start the timer
	const startTimer = () => {
		// If the timer is already running, pause it
		if (isTimerRunning) {
			pauseTimer();
			return;
		}

		// If the timer is not running, start it
		setIsTimerRunning(true);

		// Clear any previous interval before starting a new one
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		// Start a new interval
		intervalRef.current = setInterval(() => {
			setRemainingTime((prevTime) => new Date(prevTime.getTime() - 1000));
		}, 1000);
	};

	// Pause the timer
	const pauseTimer = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
		setIsTimerRunning(false); // Set timer to paused
	};

	// Effect to clear the timer and update remaining time when pomodoroState changes
	useEffect(() => {
		switch (pomodoroState) {
			case 'pomodoro':
				setRemainingTime(new Date(25 * 60 * 1000));
				break;
			case 'break':
				setRemainingTime(new Date(5 * 60 * 1000));
				break;
			case 'longBreak':
				setRemainingTime(new Date(15 * 60 * 1000));
				break;
			default:
				break;
		}

		// Clean up the interval when pomodoroState changes
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			setIsTimerRunning(false); // Reset the running state on change
		};

	}, [pomodoroState]); // Runs when `pomodoroState` changes

	return (
		<div className="flex flex-col gap-4 justify-center items-center bg-white/25 p-4 rounded-xl">
			<h1>Pomodoro Timer</h1>
			<Tabs defaultValue="pomodoro">
				<TabsList>
					<TabsTrigger value="pomodoro" onClick={() => onPomodoroStateChange('pomodoro')}>Pomodoro</TabsTrigger>
					<TabsTrigger value="break" onClick={() => onPomodoroStateChange('break')}>Break</TabsTrigger>
					<TabsTrigger value="longBreak" onClick={() => onPomodoroStateChange('longBreak')}>Long Break</TabsTrigger>
				</TabsList>
			</Tabs>
			<div className="font-bold text-[5rem]">
				{remainingTime.getMinutes().toString().padStart(2, '0')}:{remainingTime.getSeconds().toString().padStart(2, '0')}
			</div>
			<CountdownCircle />
			<button className="bg-white px-4 py-2 rounded-xl text-black" onClick={startTimer}>
				{isTimerRunning ? "Pause" : "Start"}
			</button>
		</div>
	);
}
