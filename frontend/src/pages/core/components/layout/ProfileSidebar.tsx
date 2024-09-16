import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { GoLightBulb } from "react-icons/go";
import { GoHome } from "react-icons/go";
import { GoBriefcase } from "react-icons/go";
import { GoBook } from "react-icons/go";
import { GoBell } from "react-icons/go";
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

	const tabs = [
        { icon: <GoHome size={20} />, label: "Feed", route: "/posts" },
        { icon: <GoBriefcase size={20} />, label: "Jobs", route: "/job-search" },
        { icon: <GoBook size={20} />, label: "News", route: "/news-feed" },
        { icon: <GoLightBulb size={20} />, label: "Showcase", route: "/showcase" },
    ];

    if (isSignedIn) {
        tabs.push({
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
    }

	return (
		<div className="w-64 max-h-[80%] bg-white border-slate-200 p-4">
			<nav>
				{tabs.map((tab) => (
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
