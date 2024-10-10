import { Analytics } from "@/pages/core/companyProfile/Analytics";
import { Opportunities } from "@/pages/core/companyProfile/Opportunities";
import { Overview } from "@/pages/core/companyProfile/Overview";
import { People } from "@/pages/core/companyProfile/People";

export const CompanyTabs = [
	{
		title: "Overview",
		content: <Overview/>
	},
	{
		title: "Opportunities",
		content: <Opportunities/>,
	},
	{
		title: "People",
		content: <People />,
	},
];

// {
//     title: "Analytics",
//     content: <Analytics />,
// },
