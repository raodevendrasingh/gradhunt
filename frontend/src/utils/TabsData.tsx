import { ResumePage } from "@/pages/core/standardProfile/ResumePage";
import { Featured } from "@/pages/core/standardProfile/Featured";
import { Overview } from "@/pages/core/standardProfile/Overview";
import { Projects } from "@/pages/core/standardProfile/Projects";

export const standardTabsData = [
	{
		title: "Overview",
		content: <Overview/>
	},
	{
		title: "Projects",
		content: <Projects/>,
	},
	{
		title: "Resume",
		content: <ResumePage/>,
	},
	{
		title: "Featured",
		content: <Featured/>,
	},
];
