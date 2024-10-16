import React from "react";
import { GoBookmark } from "react-icons/go";

export default function SavedJobsPage() {
	return (
		<div className="flex h-full">
			{/* main */}
			<div className="w-full lg2:w-[70%] overflow-y-auto scrollbar-hide p-4">
				<div className="relative h-full">
					<div className="flex flex-col items-center justify-center gap-2 h-full select-none">
						<GoBookmark className="w-16 h-16 text-gray-500" />
						<h2 className="text-2xl font-semibold text-gray-600 mb-2">
							No saved jobs yet
						</h2>
						<p className="text-gray-500">Start saving jobs to see them here!</p>
					</div>
				</div>
			</div>
			{/* sidebar */}
			<div className="hidden lg2:flex flex-col gap-2 w-64 xl:w-[25%] h-full border-l scrollbar-hide overflow-y-auto p-4">
				
			</div>
		</div>
	);
}
