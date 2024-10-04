import ComboboxWork from "@/components/layouts/ComboboxWork";
import { Education } from "./profileSections/Education";
import { Experience } from "./profileSections/Experience";
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
