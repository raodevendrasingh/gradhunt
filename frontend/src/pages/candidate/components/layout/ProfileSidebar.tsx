import React from "react";
import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";
import { GoLightBulb } from "react-icons/go";
import { GoHome } from "react-icons/go";
import { GoBriefcase } from "react-icons/go";
import { GoBook } from "react-icons/go";
import { GoBell } from "react-icons/go";
import { useUser } from "@clerk/clerk-react";

interface TabProps {
	icon: React.ReactNode;
	label: string;
	isActive: boolean;
}

const Tab: React.FC<TabProps> = ({ icon, label, isActive }) => {
	return (
		<motion.div
			className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
				isActive
					? "bg-slate-100 text-slate-900"
					: "text-slate-600 hover:bg-slate-50"
			}`}
			whileHover={{ scale: 1.02 }}
			transition={{ type: "spring", stiffness: 400, damping: 10 }}
		>
			<motion.div
				className="mr-3"
				whileHover={{ scale: 1.1 }}
				transition={{ type: "spring", stiffness: 400, damping: 10 }}
			>
				{icon}
			</motion.div>
			<span className="text-sm font-medium">{label}</span>
		</motion.div>
	);
};

export const ProfileSidebar = () => {
    const { user } = useUser();
	const [activeTab, setActiveTab] = React.useState("Feed");

	const tabs = [
		{ icon: <GoHome size={20} />, label: "Feed" },
		{ icon: <GoBriefcase size={20} />, label: "Jobs" },
		{ icon: <GoBook size={20} />, label: "News" },
		{ icon: <GoLightBulb size={20} />, label: "Showcase" },
		{
            icon: (
                <img
                    src={user?.imageUrl}
                    alt="Profile"
                	className="w-5 h-5 rounded-full object-cover"
                />
            ),
            label: user?.fullName,
        },
	];

	return (
		<div className="w-64 max-h-[80%] bg-white border-slate-200 p-4">
			<nav>
				{tabs.map((tab) => (
					<div key={tab.label} onClick={() => setActiveTab(tab.label)}>
						<Tab
							icon={tab.icon}
							label={tab.label}
							isActive={activeTab === tab.label}
						/>
					</div>
				))}
			</nav>
		</div>
	);
};
