import { Opportunities } from "@/pages/core/company-pages/profile-sections/Opportunities";
import { Overview } from "@/pages/core/company-pages/profile-sections/Overview";
import { People } from "@/pages/core/company-pages/profile-sections/People";

export const CompanyTabs = [
	{
		title: "Overview",
		content: <Overview />,
	},
	{
		title: "Opportunities",
		content: <Opportunities />,
	},
	{
		title: "People",
		content: <People />,
        disabled: true
	},
];