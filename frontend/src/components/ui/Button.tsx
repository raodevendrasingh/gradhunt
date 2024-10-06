export const Button: React.FC<{
	children: React.ReactNode;
	icon?: React.ReactNode;
	variant?: "primary" | "danger" | "secondary";
    type?: "button" | "submit" | "reset";
	fullWidth?: boolean;
	className?: string;
}> = ({ children, icon, variant = "primary", fullWidth, className = "" }) => {
	const baseStyles =
		"flex items-center justify-center px-4 py-2.5 rounded-lg font-medium transition-colors text-sm";
	const variantStyles = {
		primary: "bg-gray-800 hover:bg-gray-900 text-white",
		secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
		danger: "bg-red-500 hover:bg-red-600 text-white",
	};

	return (
		<button
			className={`${baseStyles} ${variantStyles[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
		>
			{icon && <span className="mr-2">{icon}</span>}
			{children}
		</button>
	);
};
