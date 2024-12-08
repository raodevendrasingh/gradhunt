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
			className="pl-2 cursor-pointer break-words select-none text-slate-600 text-sm peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
			htmlFor={id}
		>
			{label}
		</label>
		<svg
			className="absolute left-0 w-4 h-4 transition-all duration-300 opacity-0 rotate-0 pointer-events-none top-1 fill-none stroke-current stroke-[2px] peer-checked:opacity-100 peer-checked:rotate-0 peer-disabled:cursor-not-allowed"
			viewBox="0 0 16 16"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			aria-labelledby="title-1 description-1"
			role="graphics-symbol"
		>
			<path
				d="M4 8.5L7 11.5L12 4.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	</div>
);
