import ComboboxCurriculars from "@/components/layouts/ComboboxCurriculars";
import { Projects } from "@/pages/core/user-pages/profile-sections/Projects";
import { Ceritficates } from "@/pages/core/user-pages/profile-sections/Certificates";
import { useUser } from "@clerk/clerk-react";

export const ExtraCurriculars = () => {
	const { isSignedIn } = useUser();

	return (
		<div className="flex flex-col">
			{isSignedIn && (
				<div className="flex justify-between items-center">
					<ComboboxCurriculars />
				</div>
			)}

			<Projects />
			<Ceritficates />
		</div>
	);
};
