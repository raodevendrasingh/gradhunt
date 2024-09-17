import { Experience } from "@/pages/core/standardProfile/Experience";
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
		title: "Experience",
		content: <Experience/>,
	},
	{
		title: "Featured",
		content: <Featured/>,
	},
];
// {
//     title: "Posts",
//     content: "Posts",
// },