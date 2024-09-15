import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import clsx from "clsx";

interface Task {
	id: string;
	label: string;
	value: number;
	completed: boolean;
}

export const ProfileCompletion = () => {
	const [tasks, setTasks] = useState<Task[]>([
		{ id: "1", label: "Add a Profile Picture", value: 10, completed: false },
		{ id: "2", label: "Add a Bio", value: 10, completed: false },
		{ id: "3", label: "Add your Location", value: 5, completed: false },
		{
			id: "4",
			label: "Add at least one Languages",
			value: 5,
			completed: false,
		},
		{
			id: "5",
			label: "Add at least one Education",
			value: 10,
			completed: false,
		},
		{
			id: "6",
			label: "Add at least one Experience",
			value: 10,
			completed: false,
		},
		{ id: "7", label: "Add at least one Projects", value: 5, completed: false },
		{
			id: "8",
			label: "Connect at least one featured social",
			value: 5,
			completed: false,
		},
		{
			id: "9",
			label: "Add at least five people in your network",
			value: 20,
			completed: false,
		},
		{ id: "10", label: "Write your first post", value: 20, completed: false },
	]);
	const [isToggleOpen, setIsToggleOpen] = useState<boolean>(false);

	const totalValue = tasks.reduce((sum, task) => sum + task.value, 0);
	const completedValue = tasks
		.filter((task) => task.completed)
		.reduce((sum, task) => sum + task.value, 0);
	const progress = (completedValue / totalValue) * 100;

	const getStrength = (progress: number): string => {
		if (progress < 33) return "Weak";
		if (progress < 66) return "Medium";
		return "Strong";
	};

	const handleTaskToggle = (id: string) => {
		setTasks(
			tasks.map((task) =>
				task.id === id ? { ...task, completed: !task.completed } : task
			)
		);
	};

	return (
		<div
			className={clsx(
				"w-full mx-auto space-y-6 border border-gray-200 shadow-sm rounded-lg p-3 transition-all duration-300 ease-in-out",
				isToggleOpen ? "max-h-[460px]" : "max-h-32"
			)}
		>
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<span className="text-3xl font-bold text-gray-800">
						{progress.toFixed(0)}%
					</span>
					<div className="flex items-center gap-3">
						<span className="text-sm font-medium text-gray-600">
							{getStrength(progress)}
						</span>
						<button
							onClick={() => setIsToggleOpen(!isToggleOpen)}
							className="text-gray-500 hover:text-gray-700 transition-colors"
						>
							{isToggleOpen ? (
								<FaChevronUp size={16} />
							) : (
								<FaChevronDown size={16} />
							)}
						</button>
					</div>
				</div>
				<div className="relative pt-1">
					<div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${progress}%` }}
							transition={{ duration: 0.5, ease: "easeInOut" }}
							className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-slate-800"
						></motion.div>
					</div>
				</div>
				<p className="text-sm font-medium text-gray-600">Profile Strength</p>
			</div>
			<motion.div
				initial={{ opacity: 0, height: 0 }}
				animate={{
					opacity: isToggleOpen ? 1 : 0,
					height: isToggleOpen ? "auto" : 0,
				}}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="overflow-hidden"
			>
				<div className="space-y-3 pb-1">
					{tasks.map((task) => (
						<div key={task.id} className="flex items-center space-x-3 px-1">
							<input
								type="checkbox"
								id={task.id}
								checked={task.completed}
								onChange={() => handleTaskToggle(task.id)}
								disabled={task.completed}
								className="form-checkbox size-4 text-slate-800 rounded border-gray-300 focus:ring-blue-500 transition duration-150 ease-in-out"
							/>
							<label
								htmlFor={task.id}
								className={clsx(
									"text-xs transition-all duration-150 ease-in-out",
									task.completed
										? "line-through text-gray-400"
										: "text-gray-700 hover:text-gray-900"
								)}
							>
								{task.label}
							</label>
						</div>
					))}
				</div>
			</motion.div>
		</div>
	);
};
