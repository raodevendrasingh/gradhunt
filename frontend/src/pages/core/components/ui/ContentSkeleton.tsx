export const ContentSkeleton = () => {
	return (
		<div className="flex flex-col justify-start gap-1 mt-3 w-full">
			<div className="h-6 w-1/2 skeleton" />
			<div className="flex items-center gap-2">
				<div className="h-4 w-40 skeleton" />
				<div className="h-4 w-40 skeleton" />
			</div>
			<div className="flex items-center gap-2">
				<div className="h-4 w-24 skeleton" />
				<div className="h-4 w-24 skeleton" />
			</div>
			<div className="h-4 w-32 skeleton" />
			<div className="h-4 w-full skeleton mt-1" />
		</div>
	);
};
