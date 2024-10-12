import { useUser } from "@clerk/clerk-react";
import { HiPlus } from "react-icons/hi2";
import { BsSortUp } from "react-icons/bs";
import { Link } from "react-router-dom";
import { BiBriefcase, BiSort } from "react-icons/bi";

export const Opportunities = () => {
	const { isSignedIn, user } = useUser();

	return (
		<div className="flex flex-col p-5">
			{isSignedIn && (
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						<button className="inline-flex justify-center items-center gap-2 w-40 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0">
							<BiBriefcase className="size-5" />
							Jobs Posted: 0
						</button>
					</div>
					<div className="flex items-center gap-2">
						<Link to="#">
							<button className="inline-flex justify-center items-center gap-2 w-24 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0">
								<BiSort className="size-5" />
								Sort
							</button>
						</Link>
						<Link to="post-job">
							<button className="inline-flex justify-center items-center gap-2 w-28 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0">
								Post Job
								<HiPlus className="size-5" />
							</button>
						</Link>
					</div>
				</div>
			)}
			<div className="flex flex-col items-center border rounded-lg mt-2 w-full px-3 py-1"></div>
		</div>
	);
};
