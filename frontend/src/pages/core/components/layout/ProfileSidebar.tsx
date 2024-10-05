import { ReactNode, useState } from "react";
import { motion } from "framer-motion";

import {
	GoBriefcase,
	GoBookmark,
	GoPaperAirplane,
	GoGear,
	GoLaw,
} from "react-icons/go";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

interface TabProps {
	icon: ReactNode;
	label: string;
	isActive: boolean;
	route: string;
}

const Tab: React.FC<TabProps> = ({ icon, label, isActive }) => {
	return (
		<motion.div
			className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-colors select-none ${
				isActive
					? "bg-slate-100 text-slate-900"
					: "text-slate-600 hover:bg-slate-50"
			}`}
			whileHover={{ scale: 1.02 }}
			transition={{ type: "spring", stiffness: 400, damping: 10 }}
		>
			<motion.div
				className="md2:mr-3 "
				whileHover={{ scale: 1.1 }}
				transition={{ type: "spring", stiffness: 400, damping: 10 }}
			>
				{icon}
			</motion.div>

			<span className="hidden md2:flex text-sm font-medium">{label}</span>
		</motion.div>
	);
};

export const ProfileSidebar = () => {
	const { user, isSignedIn } = useUser();
	const [activeTab, setActiveTab] = useState("Feed");

	const commonTabs = [
		{
			icon: <GoBriefcase size={20} />,
			label: "Explore Jobs",
			route: "/job-search",
		},
		{
			icon: <GoPaperAirplane size={20} />,
			label: "Applications",
			route: "/job-applications",
		},
		{
			icon: <GoBookmark size={20} />,
			label: "Saved Jobs",
			route: "/jobs-saved",
		},
		{ icon: <GoLaw size={20} />, label: "Salaries", route: "/salaries" },
	];
	const personalTabs = [];

	if (isSignedIn) {
		personalTabs.push({
			icon: (
				<img
					src={user?.imageUrl}
					alt="Profile"
					className="size-5 rounded-full object-cover"
				/>
			),
			label: user?.firstName as string,
			route: `/p/${user?.username}`,
		});

		personalTabs.push({
			icon: <GoGear size={20} />,
			label: "Settings",
			route: `/settings`,
		});
	}

	return (
		<div className="w-64 max-h-[80%] bg-white border-slate-200 p-4">
			<nav>
				{commonTabs.map((tab) => (
					<Link
						key={tab.label}
						to={tab.route}
						onClick={() => setActiveTab(tab.label)}
					>
						<Tab
							icon={tab.icon}
							label={tab.label}
							route={tab.route}
							isActive={activeTab === tab.label}
						/>
					</Link>
				))}
				<hr className="pb-2" />
				{personalTabs.map((tab) => (
					<Link
						key={tab.label}
						to={tab.route}
						onClick={() => setActiveTab(tab.label)}
					>
						<Tab
							icon={tab.icon}
							label={tab.label}
							route={tab.route}
							isActive={activeTab === tab.label}
						/>
					</Link>
				))}
			</nav>
		</div>
	);
};
