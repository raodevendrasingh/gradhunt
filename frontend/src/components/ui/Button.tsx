import React from "react";

export const Button: React.FC<{
	children: React.ReactNode;
	icon?: React.ReactNode;
	variant?: "primary" | "danger" | "secondary" | "outline";
	type?: "button" | "submit" | "reset";
	fullWidth?: boolean;
	className?: string;
    disabled?: boolean;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({
	children,
	icon,
	variant = "primary",
	type = "button",
	className = "",
	onClick,
    disabled = false,
}) => {
	const baseStyles =
		"flex items-center justify-center px-4 py-2 font-medium transition-colors text-sm";
	const variantStyles = {
		primary: "bg-gray-800 hover:bg-gray-900 text-white",
		secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
		danger: "bg-red-500 hover:bg-red-600 text-white",
		outline:
			"bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100 hover:border-gray-400",
	};

	return (
		<button
			type={type}
			className={`${baseStyles} ${variantStyles[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
			onClick={onClick}
            disabled={disabled}
		>
			{icon && <span className="mr-2">{icon}</span>}
			{children}
		</button>
	);
};