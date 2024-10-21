import { Analytics } from "@/pages/core/company-pages/companyProfile/Analytics";
import { Opportunities } from "@/pages/core/company-pages/companyProfile/Opportunities";
import { Overview } from "@/pages/core/company-pages/companyProfile/Overview";
import { People } from "@/pages/core/company-pages/companyProfile/People";

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
