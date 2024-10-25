export const JobApplicationCardSkeleton2 = () => {
	return (
		<div className="flex flex-col gap-3 bg-white border rounded-xl overflow-hidden p-5">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4 w-full">
					<div className="w-12 h-12 bg-slate-300 rounded-xl flex-shrink-0 overflow-hidden"></div>
					<div className="flex flex-col gap-1 w-full">
						<div className="h-5 w-1/2 skeleton" />
						<div className="h-4 w-1/2 skeleton"></div>
					</div>
				</div>

				<div className="h-7 w-24 skeleton rounded-full" />
			</div>
			<div className="flex justify-start gap-5 text-sm text-gray-500">
				<div className="h-7 w-32 skeleton" />
				<div className="h-7 w-32 skeleton" />
			</div>
			<div className="flex justify-between text-sm text-gray-500">
				<div className="h-4 w-28 skeleton" />

				<div className="h-10 w-40 skeleton" />
			</div>
		</div>
	);
};
