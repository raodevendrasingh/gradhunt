export const JobCardSkeleton = () => {
	return (
		<div className="bg-white mx-5 border rounded-xl overflow-hidden">
			<div className="p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="w-16 h-16 bg-slate-300 rounded-xl flex-shrink-0 overflow-hidden"></div>
						<div className="flex flex-col gap-1 ">
							<div className="h-6 w-52 skeleton" />
							<div className="h-5 w-56 skeleton"></div>
						</div>
					</div>
					<div className="size-8 skeleton" />
				</div>
				<div className=" flex flex-col gap-1 mt-4">
					<div className="h-3 w-2/3 skeleton" />
					<div className="h-3 w-1/2 skeleton" />
				</div>
				<div className="mt-4 flex justify-between text-sm text-gray-500">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<div className="size-4 skeleton rounded-md" />
							<div className="h-4 w-40 skeleton" />
						</div>
						<div className="flex items-center space-x-2">
							<div className="size-4 skeleton rounded-md" />
							<div className="h-4 w-20 skeleton" />{" "}
						</div>
						<div className="flex items-center space-x-2">
							<div className="size-4 skeleton rounded-md" />
							<div className="h-4 w-24 skeleton" />
						</div>
					</div>
					<div className="flex flex-col items-end justify-between">
						<div className="flex items-center space-x-2">
							<div className="size-4 skeleton rounded-md" />
							<div className="h-4 w-44 skeleton" />
						</div>
						<div className="space-x-2 flex items-center">
							<div className="h-10 w-32 skeleton" />
							<div className="h-10 w-32 skeleton" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
