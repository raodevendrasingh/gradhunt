import { LuRefreshCcw } from "react-icons/lu";
import noUpdates from "@/assets/illustration/no_updates.png";

export const Updates = () => {
	return (
		<div className="w-full pt-20 mx-auto">
			<div className="max-w-7xl mx-auto lg:ml-64">
				<div className="max-w-5xl mx-auto flex flex-col mb-3 gap-3 px-3">
					<section className="bg-white px-2 p-2 border rounded-xl shadow">
						<div className="flex justify-between items-center mb-1">
							<span className="font-semibold text-lg pl-1 text-gray-800">
								Updates
							</span>
							<div>
								<LuRefreshCcw className="size-9 hover:bg-gray-100 rounded-full p-2" />
							</div>
						</div>
						<div className="rounded-xl border ">
							{/* only show if there's no update */}
							<div className="flex justify-center items-center h-[81vh]">
								<img
									src={noUpdates}
									alt="no_updates"
									className="aspect-auto w-[40%] rounded-xl "
								/>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};
