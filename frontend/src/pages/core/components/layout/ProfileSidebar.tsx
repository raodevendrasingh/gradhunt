import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoBookmark, GoGear } from "react-icons/go";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { BsPersonGear, BsBriefcase } from "react-icons/bs";
import clsx from "clsx";

interface TabProps {
	icon: ReactNode;
	label: string;
	isActive: boolean;
	route: string;
	disabled?: boolean;
}

interface ProfileSidebarProps {
	isOpen?: boolean;
	onClose?: () => void;
	isMobile?: boolean;
}

const Tab: React.FC<TabProps> = ({ icon, label, isActive, disabled }) => {
	return (
		<motion.div
			className={clsx(
				"flex items-center p-3 mx-2 my-1 rounded-lg transition-colors select-none",
				{
					"bg-slate-100 text-slate-900": isActive,
					"text-slate-600 hover:bg-slate-50": !isActive && !disabled,
					"opacity-70 cursor-not-allowed text-slate-600": disabled,
					"cursor-pointer": !disabled,
				}
			)}
			whileHover={{ scale: disabled ? 1 : 1.02 }}
			transition={{ type: "spring", stiffness: 400, damping: 10 }}
		>
			<motion.div
				className="mr-3"
				whileHover={{ scale: 1 }}
				transition={{ type: "spring", stiffness: 400, damping: 10 }}
			>
				{icon}
			</motion.div>
			<span className="text-sm font-medium">{label}</span>
		</motion.div>
	);
};

export const ProfileSidebar = ({
	isOpen,
	onClose,
	isMobile = false,
}: ProfileSidebarProps) => {
	const [activeTab, setActiveTab] = useState("Profile");
	const { user, isSignedIn } = useUser();

	const baseTabs = [
		{
			icon: <HiOutlineUserCircle size={20} />,
			label: "Profile",
			route: `/p/${user?.username}`,
			disabled: false,
		},
		{
			icon: <BsPersonGear size={20} />,
			label: "Preferences",
			route: "/career-preferences",
			disabled: true,
		},
		{
			icon: <IoPaperPlaneOutline size={20} />,
			label: "Applications",
			route: "/job-applications",
			disabled: false,
		},
		{
			icon: <GoBookmark size={20} />,
			label: "Saved Jobs",
			route: "/jobs-saved",
			disabled: false,
		},
		{
			icon: <GoGear size={20} />,
			label: "Settings",
			route: "/settings",
			disabled: false,
		},
	];

	const exploreTab = {
		icon: <BsBriefcase size={20} />,
		label: "Explore Jobs",
		route: "/",
		disabled: false,
	};

	const tabs = isMobile
		? [baseTabs[0], exploreTab, ...baseTabs.slice(1)]
		: baseTabs;

	if (!isSignedIn) return null;

	if (!isMobile) {
		return (
			<div className="flex justify-end w-full pt-2">
				<nav className="flex flex-col w-48">
					{tabs.map((tab) =>
						tab.disabled ? (
							<div key={tab.label}>
								<Tab
									icon={tab.icon}
									label={tab.label}
									route={tab.route}
									isActive={activeTab === tab.label}
									disabled={tab.disabled}
								/>
							</div>
						) : (
							<Link
								key={tab.label}
								to={tab.route}
								onClick={() => {
									setActiveTab(tab.label);
									if (isMobile) {
										onClose?.();
									}
								}}
							>
								<Tab
									icon={tab.icon}
									label={tab.label}
									route={tab.route}
									isActive={activeTab === tab.label}
									disabled={tab.disabled}
								/>
							</Link>
						)
					)}
				</nav>
			</div>
		);
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<div
						className="fixed inset-0 bg-black bg-opacity-50 z-30"
						onClick={onClose}
					/>

					{/* Sidebar */}
					<motion.div
						initial={{ x: -300, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: -300, opacity: 0 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg pt-16"
					>
						<nav className="flex flex-col mt-4">
							{tabs.map((tab) => (
								<Link
									key={tab.label}
									to={tab.route}
									onClick={() => {
										setActiveTab(tab.label);
										onClose?.();
									}}
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
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};
