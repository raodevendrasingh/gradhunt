import { Controller } from "react-hook-form";

export const ToggleSwitch: React.FC<{
	label: string;
	control: any;
	name: string;
	icon: React.ReactNode;
}> = ({ label, name, control, icon }) => (
	<div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
		<div className="flex items-center space-x-3">
			<span className="text-gray-500">{icon}</span>
			<span className="text-sm font-medium text-gray-800">{label}</span>
		</div>
		<Controller
			name={name}
			control={control}
			render={({ field: { value, ...field } }) => (
				<label className="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						className="sr-only peer"
						checked={value || false}
						{...field}
					/>
					<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-700"></div>
				</label>
			)}
		/>
	</div>
);
