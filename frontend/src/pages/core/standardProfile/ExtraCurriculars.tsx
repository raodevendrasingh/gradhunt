import ComboboxCurriculars from "@/components/layouts/ComboboxCurriculars";
import { Projects } from "./profileSections/Projects";
import { Ceritficates } from "./profileSections/Ceritficates";
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
