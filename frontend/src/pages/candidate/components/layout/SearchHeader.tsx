export const SearchHeader = () => {
	return (
		<div className="flex justify-center items-center  py-10">
			<div className=" flex flex-col justify-center items-center gap-3">
				<span className=" text-center text-5xl text-zinc-700 font-bold">
					Explore{" "}
					<span className="relative inline-flex sm:inline">
						<span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
						<em className="relative font-medium"> limitless </em>
					</span>{" "}
					opportunities
				</span>
				<p className="text-lg">Your dream job awaits you</p>
			</div>
		</div>
	);
};
