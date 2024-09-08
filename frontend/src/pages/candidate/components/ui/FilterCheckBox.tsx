export const FilterCheckbox = ({
	id,
	label,
	checked,
	setChecked,
}: {
	id: string;
	label: string;
	checked: boolean;
	setChecked: (checked: boolean) => void;
}) => (
	<div className="relative flex flex-wrap items-center">
		<input
			className="size-4 transition-colors bg-white border-[1.5px] rounded appearance-none cursor-pointer focus-visible:outline-none peer border-slate-500 checked:border-slate-700 checked:bg-slate-700 checked:hover:border-slate-800 checked:hover:bg-slate-800 focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-slate-800 checked:focus:bg-slate-800 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50"
			type="checkbox"
			id={id}
			checked={checked}
			onChange={() => setChecked(!checked)}
		/>
		<label
			className="pl-2 cursor-pointer select-none text-slate-600 text-sm peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
			htmlFor={id}
		>
			{label}
		</label>
		<svg
			className="absolute left-0 w-4 h-4 transition-all duration-300 -rotate-90 opacity-0 pointer-events-none top-1 fill-white stroke-white peer-checked:rotate-0 peer-checked:opacity-100 peer-disabled:cursor-not-allowed"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			aria-labelledby="title-1 description-1"
			role="graphics-symbol"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M12.8116 5.17568C12.9322 5.2882 13 5.44079 13 5.5999C13 5.759 12.9322 5.91159 12.8116 6.02412L7.66416 10.8243C7.5435 10.9368 7.37987 11 7.20925 11C7.03864 11 6.87501 10.9368 6.75435 10.8243L4.18062 8.42422C4.06341 8.31105 3.99856 8.15948 4.00002 8.00216C4.00149 7.84483 4.06916 7.69434 4.18846 7.58309C4.30775 7.47184 4.46913 7.40874 4.63784 7.40737C4.80655 7.406 4.96908 7.46648 5.09043 7.57578L7.20925 9.55167L11.9018 5.17568C12.0225 5.06319 12.1861 5 12.3567 5C12.5273 5 12.691 5.06319 12.8116 5.17568Z"
			/>
		</svg>
	</div>
);
