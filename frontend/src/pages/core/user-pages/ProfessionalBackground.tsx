import ComboboxWork from "@/components/layouts/ComboboxWork";
import { Education } from "@/pages/core/user-pages/profile-sections/Education";
import { Experience } from "@/pages/core/user-pages/profile-sections/Experience";
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
