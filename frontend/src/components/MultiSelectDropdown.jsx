/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

export const MultiSelectDropdown = ({
	id,
	options,
	label,
	buttonTitle,
	helpText,
	maxSelect,
	dropdownName,
	selectedValues,
	onChange,
}) => {
	const [selectedOptions, setSelectedOptions] = useState(selectedValues || []);
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	const toggleOption = (option) => {
		setSelectedOptions((prev) =>
			prev.includes(option)
				? prev.filter((o) => o !== option)
				: prev.length < maxSelect
				? [...prev, option]
				: prev
		);
	};

	useEffect(() => {
		onChange(selectedOptions); // notify the parent component when the selected options change
	}, [selectedOptions, onChange]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div className="relative inline-block text-left w-full" ref={dropdownRef}>
			<div className="relative">
				<label htmlFor={id} className="text-sm">
					{label}
					<span className="text-xs text-gray-500 pl-2">{helpText}</span>
				</label>
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="focus:outline-none focus:ring-0 flex items-baseline justify-between w-full rounded-md border border-gray-200 shadow-sm px-4 py-2 bg-white text-sm  text-gray-500 hover:bg-gray-50 "
					id={id}
					aria-haspopup="true"
					aria-expanded="true"
				>
					{buttonTitle}
					<FaChevronDown className="h-3.5 w-3.5 text-gray-500" />
				</button>
				{isOpen && (
					<div className="origin-top-right absolute right-0 border border-gray-300 w-full rounded-md shadow-2xl bg-white overflow-auto max-h-48 z-10">
						<div className="py-1" role="menu" aria-orientation="vertical">
							{options.map((option) => (
								<label
									key={option.value}
									className="px-4 py-2 flex items-center hover:bg-slate-100 "
								>
									<input
										type="checkbox"
										name={dropdownName}
										value={option.value}
										className="form-checkbox outline-none ring-0 rounded h-5 w-5 text-indigo-500 ring-offset-0 "
										checked={selectedOptions.includes(option.value)}
										onChange={() => toggleOption(option.value)}
									/>
									<span className="ml-3 block text-sm">{option.label}</span>
								</label>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
