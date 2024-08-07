interface IconWrapperProps {
	Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	className?: string;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({
	Icon,
	className,
}) => {
	return <Icon className={className} />;
};
