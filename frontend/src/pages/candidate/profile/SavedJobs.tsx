import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { CardStack } from "../components/ui/CardStack";

export const SavedJobs = () => {
	return (
		<div className="flex flex-col gap-3 w-full">
			<div className="pb-3 border-gray-400 bg-zinc-100 rounded-lg">
				<div className="flex flex-col justify-center items-center gap-5 h-72">
					<HiOutlineDocumentDuplicate className="size-12 text-gray-300" />
					<p className="text-base font-medium text-gray-700">
						No Saved Jobs Applications
					</p>
                    <span className="px-3 py-2 rounded-lg text-white bg-zinc-800 text-xs cursor-pointer">
						Search Jobs 
					</span>
				</div>
			</div>
            
		</div>
	);
};
