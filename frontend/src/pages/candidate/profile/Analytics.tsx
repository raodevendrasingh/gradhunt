import { BsGraphUp } from "react-icons/bs";

export const Analytics = () => {
	return (
		<div className="flex flex-col gap-3 w-full">
			<div className="pb-3 border-gray-400 bg-zinc-100 rounded-lg">
				<div className="flex flex-col justify-center items-center gap-5 h-72">
					<BsGraphUp className="size-12 text-gray-300" />
					<p className="text-base font-medium text-gray-700">Not Enough Data</p>
				</div>
			</div>
		</div>
	);
};
