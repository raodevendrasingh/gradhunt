/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { Link } from "react-router-dom";

// let employerOptions = [
// 	{ title: "Recruiter Login", path: "#" },
// 	{ title: "Pricing Suite", path: "#" },
// ];

export const Dropdown = ({ title, options, width }) => {
	const [isVisible, setIsVisible] = useState(false);

	const showDropdown = () => setIsVisible(true);

	const hideDropdown = () => setIsVisible(false);

	return (
		<div className="relative">
			<div className="inline-flex items-center overflow-hidden rounded-md border border-green-200 bg-green-50">
				<button
					onMouseEnter={showDropdown}
					className="flex items-center justify-center gap-2 h-full p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
				>
					<span className="text-sm">{title}</span>
					<FaAngleDown className="size-3"/>
				</button>
			</div>

			{isVisible && (
				<div
					className={`absolute end-0 z-10 mt-2 w-${width} rounded-lg border border-gray-100 bg-white shadow-lg`}
					role="menu"
					onMouseLeave={hideDropdown}
				>
					<div className="p-2">
						{options.map((option, index) => (
							<Link
								key={index}
								to={option.path}
								className="block px-4 py-2 rounded-lg text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
							>
								{option.title}
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
