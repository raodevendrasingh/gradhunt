import { useUser } from "@clerk/clerk-react";
import { FaPlus } from "react-icons/fa6";
export const RecruiterDashboard = () => {
	const { user } = useUser();

	return (
		<>
			<div className="pt-24 h-80 bg-gray-800 ">
				<div className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl mx-auto flex justify-between items-center">
					<div className="text-gray-200 text-2xl py-3">
						Welcome back, {user?.firstName}
					</div>
					<div className="px-2 py-1 flex gap-2 font-medium items-center text-gray-200 border-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-all duration-150 cursor-pointer">
						<span>
							<FaPlus />
						</span>
						Post Job
					</div>
				</div>
			</div>
		</>
	);
};
