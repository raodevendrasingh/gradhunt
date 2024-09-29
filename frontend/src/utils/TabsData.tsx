import { Overview } from "@/pages/core/standardProfile/Overview";
import { ExtraCurriculars } from "@/pages/core/standardProfile/ExtraCurriculars";
import { ProfessionalBackground } from "@/pages/core/standardProfile/ProfessionalBackground";

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

