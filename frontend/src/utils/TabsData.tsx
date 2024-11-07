import { Overview } from "@/pages/core/user-pages/Overview";
import { ExtraCurriculars } from "@/pages/core/user-pages/ExtraCurriculars";
import { ProfessionalBackground } from "@/pages/core/user-pages/ProfessionalBackground";

export const standardTabsData = [
	{
		title: "Overview",
		content: <Overview/>
	},
	{
		title: "Extra Curriculars",
		content: <ExtraCurriculars/>,
	},
	{
		title: "Professional Background",
		content: <ProfessionalBackground />,
	},
];

