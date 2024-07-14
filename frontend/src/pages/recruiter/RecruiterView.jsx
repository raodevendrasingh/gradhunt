import BusinessMeeting from "@/assets/illustration/businessMeeting.jpg";
import { Tabs } from "./components/ui/Tabs";

export const RecruiterView = () => {
	return (
		<div className="text-center font-semibold text-xl pt-24">
			<div className="flex justify-center items-center">
				<div className="hidden w-3/5 lg:flex justify-center items-center">
					<img src={BusinessMeeting} alt="business_svg" className=" w-[70%]" />
				</div>
				<div className="max-w-full mx-auto xl:w-2/5">
					<Tabs color="red" />
				</div>
			</div>
		</div>
	);
};
