export const JobCardSkeleton = () => {
	return (
		<div className="bg-slate-50 border rounded-2xl p-4 mb-4 w-full relative">
			<div className="absolute top-4 right-4">
				<div className="h-8 w-3 skeleton" />
			</div>

			<h2 className="text-xl font-bold text-gray-800 mb-1">
				<div className="h-8 w-80 skeleton" />
			</h2>

			<div className="flex gap-2 mb-4 pt-1">
				<div className="h-5 w-20 skeleton" />
				<div className="h-5 w-20 skeleton" />
			</div>

			<div className="flex flex-col sm:flex-row sm:items-center justify-start gap-4 mb-2 text-sm">
				<div className="flex items-center text-gray-600">
					<div className="h-7 w-36 skeleton" />
				</div>
				<div className="flex items-center text-gray-600">
					<div className="h-7 w-36 skeleton" />
				</div>
			</div>

			<div className="flex  gap-2 justify-between">
				<div className="flex items-center text-gray-600 text-sm">
					<div className="h-6 w-32 skeleton" />
				</div>
				<div className="h-10 w-32 skeleton" />
			</div>
		</div>
	);
};
