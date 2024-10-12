import React from "react";
import { useController, Control } from "react-hook-form";

interface ToggleSwitchProps {
	label: string;
	helptext?: string;
	control: Control<any>;
	name: string;
	icon: React.ReactNode;
	defaultValue?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
	label,
	helptext,
	name,
	control,
	icon,
	defaultValue = false,
}) => {
	const {
		field: { onChange, value },
	} = useController({
		name,
		control,
		defaultValue,
	});

	return (
		<div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
			<div className="flex items-center space-x-3">
				<span className="text-gray-500">{icon}</span>
				<div className="flex flex-col">
					<span className="text-sm font-medium text-gray-800">{label}</span>
					<span className="text-xs font-normal text-gray-800">{helptext}</span>
				</div>
			</div>
			<label className="relative inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					className="sr-only peer"
					checked={value}
					onChange={(e) => {
						const newValue = e.target.checked;
						onChange(newValue);
					}}
				/>
				<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-700"></div>
			</label>
		</div>
	);
};
