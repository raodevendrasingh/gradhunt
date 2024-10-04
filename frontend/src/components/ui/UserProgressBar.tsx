import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import clsx from "clsx";
import { useFetchProfileCompletion } from "@/hooks/useFetchCompletionPercentage";
interface Task {
	id: string;
	label: string;
	value: number;
	completed: boolean;
}

export const UserProfileCompletion = () => {
	const { data: progress } = useFetchProfileCompletion();

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
			value: 15,
			completed: false,
		},
		{
			id: "6",
			label: "Add at least one Experience",
			value: 15,
			completed: false,
		},
		{
			id: "7",
			label: "Add at least one Projects",
			value: 10,
			completed: false,
		},
		{
			id: "8",
			label: "Add at least one Social link",
			value: 10,
			completed: false,
		},
		{
			id: "9",
			label: "Add About Section",
			value: 20,
			completed: false,
		},
	]);
	const [isToggleOpen, setIsToggleOpen] = useState<boolean>(false);

	const getStrength = (
		progressPerc: number
	): { label: string; color: string } => {
		if (progressPerc < 33) return { label: "Weak", color: "text-red-500" };
		if (progressPerc < 66) return { label: "Medium", color: "text-orange-500" };
		return { label: "Strong", color: "text-green-500" };
	};
	const strength = getStrength(progress?.completion_percentage as number);

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
					{progress && progress?.completion_percentage ? (
						<span className="text-3xl font-bold text-gray-800">
							{progress?.completion_percentage.toFixed(0)}%
						</span>
					) : (
						<div className="size-10 skeleton" />
					)}
					<div className="flex items-center gap-3">
						{progress ? (
							<span className={clsx("text-sm font-medium", strength.color)}>
								{strength.label}
							</span>
						) : (
							<div className="h-6 w-20 skeleton" />
						)}
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
					{progress ? (
						<div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
							<motion.div
								initial={{ width: 0 }}
								animate={{
									width: `${progress?.completion_percentage as number}%`,
								}}
								transition={{ duration: 0.5, ease: "easeInOut" }}
								className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-slate-800"
							></motion.div>
						</div>
					) : (
						<div className="h-2 w-full rounded-full skeleton" />
					)}
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
					{tasks.map((task, index) => (
						<div key={task.id} className="flex items-center space-x-3 px-1">
							<input
								type="checkbox"
								id={task.id}
								checked={
									progress?.tasks &&
									progress.tasks[index] &&
									progress.tasks[index].completed === true
								}
								onChange={() => handleTaskToggle(task.id)}
								disabled
								className="form-checkbox size-4 text-slate-800 rounded-full border-gray-300 focus:ring-blue-500 transition duration-150 ease-in-out"
							/>
							<label
								htmlFor={task.id}
								className={clsx(
									"text-xs transition-all duration-150 ease-in-out",
									progress?.tasks &&
										progress.tasks[index] &&
										progress.tasks[index].completed === true
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
