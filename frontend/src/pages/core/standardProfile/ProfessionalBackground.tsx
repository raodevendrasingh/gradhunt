import ComboboxWork from "@/components/layouts/ComboboxWork";
import { Education } from "./ResumeComponents/Education";
import { Experience } from "./ResumeComponents/Experience";

export const ProfessionalBackground = () => {
	return (
		<div className="flex flex-col">
			<div className="flex justify-between items-center">
				<ComboboxWork />
			</div>
            <Experience/>
            <Education/>			
		</div>
	);
};
