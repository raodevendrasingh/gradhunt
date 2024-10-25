export const JobApplicationCardSkeleton = () => {
	return (
		<div className="bg-white border rounded-xl overflow-hidden">
			<div className="p-5">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4 w-full">
						<div className="w-12 h-12 bg-slate-300 rounded-xl flex-shrink-0 overflow-hidden"></div>
						<div className="flex flex-col gap-1 w-full">
							<div className="h-5 w-2/3 skeleton" />
							<div className="h-4 w-2/3 skeleton"></div>
						</div>
					</div>
					<div className="hidden sm:flex items-center gap-2">
						<div className="h-3 w-20 skeleton" />
						<div className="h-3 w-20 skeleton" />
					</div>
				</div>
				<div className="mt-4 flex justify-between text-sm text-gray-500">
					<div className="space-y-2">
						<div className="flex flex-col xs:flex-row gap-2">
							<div className="flex items-center space-x-2">
								<div className="h-4 w-20 skeleton" />
								<div className="h-4 w-20 skeleton" />
							</div>
							<div className="h-4 w-20 skeleton" />
						</div>
						<div className="flex items-center space-x-2"></div>
						<div className="flex items-center gap-2">
							<div className="h-4 w-40 skeleton" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
