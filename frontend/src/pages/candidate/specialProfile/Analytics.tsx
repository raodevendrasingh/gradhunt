import { BsGraphUp } from "react-icons/bs";
import { IoAnalytics } from "react-icons/io5";

export const Analytics = () => {
	return (
		<div className="flex flex-col gap-3 w-full h-[80vh]">
			<div className="flex-grow pb-3 bg-gray-50 border rounded-lg">
				<div className="flex flex-col justify-center items-center gap-5 h-full">
					<div className="flex flex-col justify-center items-center gap-5 h-full">
						<IoAnalytics className="size-12 text-gray-400" />
						<p className="text-base font-medium text-gray-700">
							Not Enough Data
						</p>
                        <p className="text-sm text-gray-700">Your profile views will appear here</p>
					</div>
				</div>
			</div>
		</div>
	);
};
