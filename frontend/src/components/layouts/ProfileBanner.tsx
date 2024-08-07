import looking from "@/assets/illustration/looking.jpg";
import { FaChevronRight } from "react-icons/fa6";
import { Link } from "react-router-dom";

export const ProfileBanner = () => {
	return (
		<div className="p-5">
			<div className="flex flex-col lg:flex-row justify-between items-center bg-white gap-10 mx-auto max-w-xs xs:max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-5xl md:mx-auto border rounded-2xl p-5 mt-10">
				<div className="flex flex-col gap-3 sm:flex-row">
					<div className=" flex justify-center items-center sm:w-1/4">
						<img
							src={looking}
							alt="person-looking-for-way"
							className="size-28"
						/>
					</div>
					<div className="flex flex-col justify-between gap-5 sm:w-3/4">
						<div className="flex flex-col gap-1">
							<div className="text-center sm:text-start text-xl text-zinc-800 font-semibold">
								Get ahead of the competition by creating your freshfolio now
							</div>
							<div className="text-center sm:text-start  text-sm text-gray-600">
								Showcase your content, projects, and experiences to stand out
								and attract top employers.
							</div>
						</div>
						<div className="flex items-center justify-center sm:justify-start">
							<Link to="#">
								<span className=" flex items-center gap-2 px-4 py-1 rounded-full border">
									<p className="text-xs">Explore Premium Plans </p>
									<span>
										<FaChevronRight className="size-2" />
									</span>
								</span>
							</Link>
						</div>
					</div>
				</div>
				<div>
					<Link to="#">
						<button className="px-4 py-2 rounded-full border">
							<span className="text-base"> Get Started</span>
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
