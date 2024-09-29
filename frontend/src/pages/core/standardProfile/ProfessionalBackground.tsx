import ComboboxWork from "@/components/layouts/ComboboxWork";
import { Education } from "./ResumeComponents/Education";
import { Experience } from "./ResumeComponents/Experience";
import { useUser } from "@clerk/clerk-react";

export const ProfessionalBackground = () => {
    const { isSignedIn } = useUser();
	return (
		<div className="flex flex-col">
			{isSignedIn && (
				<div className="flex justify-between items-center">
					<ComboboxWork />
				</div>
			)}

			<Experience />
			<Education />
		</div>
	);
};
