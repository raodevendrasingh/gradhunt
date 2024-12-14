import React, { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoArchive, GoBriefcase, GoGear } from "react-icons/go";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useFetchCompanyProfile } from "@/hooks/useFetchCompanyProfile";
import { useFetchUserDetails } from "@/hooks/useFetchUserDetails";
import { HiOutlineUserGroup, HiOutlineUsers } from "react-icons/hi2";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { LuChartLine } from "react-icons/lu";

interface TabProps {
	icon: ReactNode;
	label: string;
	title?: string;
	isActive: boolean;
	route: string;
}

interface RecruiterSidebarProps {
	isOpen?: boolean;
	onClose?: () => void;
	isMobile?: boolean;
}

const Tab: React.FC<TabProps> = ({ icon, label, title, isActive }) => {
	return (
		<motion.div
			className={`flex items-center p-3 mx-2 my-1 rounded-lg cursor-pointer transition-colors select-none ${
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
			<div className="flex flex-col justify-start w-full">
				<span className="text-sm font-medium">{label}</span>
				{title && (
					<span className="text-xs font-normal text-gray-600">{title}</span>
				)}
			</div>
		</motion.div>
	);
};

export const RecruiterSidebar: React.FC<RecruiterSidebarProps> = ({
	isOpen,
	onClose,
	isMobile = false,
}) => {
	const [activeTab, setActiveTab] = useState("Manage Jobs");
	const { isSignedIn } = useUser();
	const { data: userData, isLoading: isUserDataLoading } =
		useFetchUserDetails();
        
	const isCompanyAdmin = userData?.user_details?.isCompanyAdmin;

	const { data: companyProfileData, error: companyProfileError } =
		useFetchCompanyProfile(isUserDataLoading ? false : !!isCompanyAdmin);

	useEffect(() => {
		const errorStatus = companyProfileError?.response?.status;
		if (companyProfileError && errorStatus !== 404 && errorStatus !== 400) {
			console.log("Error fetching company details");
		}
	}, [companyProfileError]);

	const recruiterTabs = [];

    const companyProfileUrl = `/company/${companyProfileData?.companySlug}`;

	if (isSignedIn) {
		if (companyProfileData && companyProfileData.isDraft === false) {
			recruiterTabs.push({
				icon: (
					<img
						src={companyProfileData.companyLogo}
						alt="Company Profile"
						className="h-10 w-14 rounded-lg aspect-square object-cover border"
					/>
				),
				label: companyProfileData.companyName,
				title: "Company Profile",
				route: `${companyProfileUrl}`,
			});
		}

		recruiterTabs.push(
			{
				icon: <GoBriefcase size={20} />,
				label: "Manage Postings",
				route: `${companyProfileUrl}/manage-jobs`,
			},
			{
				icon: <HiOutlineUsers size={20} />,
				label: "Manage Applicants",
				route: `${companyProfileUrl}/applicants`,
			},
			{
				icon: <GoArchive size={20} />,
				label: "Archived Postings",
				route: `${companyProfileUrl}/archived`,
			},
			{
				icon: <LuChartLine size={20} />,
				label: "Analytics",
				route: `${companyProfileUrl}/analytics`,
			},
			{
				icon: <HiOutlineUserGroup size={20} />,
				label: "Team",
				route: `${companyProfileUrl}/team`,
			},
			{
				icon: <IoExtensionPuzzleOutline size={20} />,
				label: "Integrations",
				route: `${companyProfileUrl}/integrations`,
			},
			{
				icon: <GoGear size={20} />,
				label: "Settings",
				route: `${companyProfileUrl}/settings`,
			}
		);
	}

	if (!isSignedIn) return null;

	const sidebarContent = (
		<nav className="flex flex-col w-full ">
			{recruiterTabs.map((tab) => (
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
						title={tab.title}
						route={tab.route}
						isActive={activeTab === tab.label}
					/>
				</Link>
			))}
		</nav>
	);

	if (!isMobile) {
		return <div className="hidden md:flex w-64 pt-2">{sidebarContent}</div>;
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<div
						className="fixed inset-0 bg-black bg-opacity-50 z-30"
						onClick={onClose}
					/>
					<motion.div
						initial={{ x: -300, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: -300, opacity: 0 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg pt-16"
					>
						{sidebarContent}
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};
