import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import {
	FiUser,
	FiLock,
	FiMail,
	FiCreditCard,
	FiBell,
	FiAlertTriangle,
	FiUpload,
	FiBriefcase,
	FiGlobe,
	FiTrash2,
	FiPower,
	FiDollarSign,
} from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { useFetchUserDetails } from "@/hooks/useFetchUserDetails";
import { useUser } from "@clerk/clerk-react";

type FormData = {
	username: string;
	email: string;
	password: string;
	makeProfilePrivate: boolean;
	makeSpecialProfilePrivate: boolean;
	connectGoogleAccount: boolean;
	pushNotifications: boolean;
	webNotifications: boolean;
	emailNotifications: boolean;
};

export default function SettingsPage() {
	const [activeSection, setActiveSection] = useState("profile");

	const { user } = useUser();

	const {
		register,
		control,
		formState: { errors },
	} = useForm<FormData>();

	const scrollToSection = (sectionId: string) => {
		setActiveSection(sectionId);
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	const ToggleSwitch: React.FC<{
		label: string;
		name: keyof FormData;
		icon: React.ReactNode;
	}> = ({ label, name, icon }) => (
		<div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
			<div className="flex items-center space-x-3">
				<span className="text-gray-500">{icon}</span>
				<span className="text-sm font-medium text-gray-800">{label}</span>
			</div>
			<Controller
				name={name}
				control={control}
				render={({ field: { value, ...field } }) => (
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							className="sr-only peer"
							checked={(value as boolean) || false}
							{...field}
						/>
						<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-700"></div>
					</label>
				)}
			/>
		</div>
	);

	const sections = [
		{ id: "profile", icon: <FiUser />, label: "Profile" },
		{ id: "career", icon: <FiBriefcase />, label: "Career" },
		{ id: "subscription", icon: <FiCreditCard />, label: "Subscription" },
		{ id: "notifications", icon: <FiBell />, label: "Notifications" },
		{
			id: "danger",
			icon: <FiAlertTriangle />,
			label: "Danger Zone",
			danger: true,
		},
	];

	return (
		<div className="flex h-full bg-gray-50">
			{/* main section */}
			<div className="w-full lg2:w-[70%] overflow-y-auto scrollbar-hide p-4">
				<h1 className="text-2xl font-bold mb-4 text-gray-800">
					Account Settings
				</h1>
				<div className="w-full space-y-6">
					<section id="profile" className="bg-white shadow-sm rounded-lg p-6">
						<h2 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
							<FiUser className="mr-2" /> Profile
						</h2>
						<div className="flex flex-col items-start gap-5 justify-start sm:items-center sm:flex-row sm:justify-between mb-6">
							<div className="flex flex-col xs:flex-row items-start xs:items-center gap-3">
								{/* <img
									src="/api/"
									alt="Profile"
									className="w-24 h-24 rounded-lg object-cover"
								/> */}
								<div className="h-24 w-24 rounded-lg border boder-gray-800" />
								<div className="">
									<h3 className="font-medium text-gray-800">
										Change Profile Picture
									</h3>
									<p className="text-sm text-gray-500 mt-1">
										JPG, GIF or PNG. Max size of 800K
									</p>
								</div>
							</div>
							<Button
								icon={<FiUpload />}
								variant="secondary"
								className="rounded-lg w-28 py-2"
							>
								Upload
							</Button>
						</div>
						<div className="space-y-4">
							<div className="flex items-center justify-between py-4 border-b border-gray-200">
								<div>
									<h3 className="text-sm font-medium text-gray-800">
										Username
									</h3>
									<p className="text-sm text-gray-500">{user?.username}</p>
								</div>

								<Button variant="secondary" className="rounded-lg w-24 py-2">
									Update
								</Button>
							</div>
							<div className="flex items-center justify-between py-4 border-b border-gray-200">
								<div>
									<h3 className="text-sm font-medium text-gray-800">Email</h3>
									<p className="text-sm text-gray-500">
										{user?.emailAddresses[0].emailAddress}
									</p>
								</div>

								<Button variant="secondary" className="rounded-lg w-24 py-2">
									Update
								</Button>
							</div>
							<div className="flex items-center justify-between py-4 border-b border-gray-200">
								<div>
									<h3 className="text-sm font-medium text-gray-800">
										Password
									</h3>
									<p className="text-sm text-gray-500">
										{user?.passwordEnabled ? "Enabled" : "Disabled"}
									</p>
								</div>
								{user?.passwordEnabled ? (
									<Button variant="secondary" className="rounded-lg w-24 py-2">
										Update
									</Button>
								) : (
									<Button variant="secondary" className="rounded-lg w-24 py-2">
										Create
									</Button>
								)}
							</div>
						</div>
					</section>

					<section id="career" className="bg-white shadow-sm rounded-lg p-6">
						<h2 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
							<FiBriefcase className="mr-2" /> Career and Privacy
						</h2>
						<div className="space-y-4">
							<ToggleSwitch
								icon={<FiGlobe />}
								label="Make Profile Private"
								name="makeProfilePrivate"
							/>
							<ToggleSwitch
								icon={<FiGlobe />}
								label="Connect Google Account"
								name="connectGoogleAccount"
							/>

							<div
								className="flex flex-col items-start gap-5 justify-start sm:items-center sm:flex-row sm:justify-between mb-6
                                            py-4 border-b border-gray-200"
							>
								<div>
									<h3 className="text-sm font-medium text-gray-800">
										Company Profile
									</h3>
									<p className="text-sm text-gray-500">
										Create a profile for your company to attract talent
									</p>
								</div>
								<Link to="/create-company-profile">
									<Button className="rounded-lg w-32 py-2">
										Create Profile
									</Button>
								</Link>
							</div>
						</div>
					</section>

					<section
						id="subscription"
						className="bg-white shadow-sm rounded-lg p-6"
					>
						<h2 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
							<FiCreditCard className="mr-2" /> Subscription
						</h2>
						<div className="space-y-4">
							<div
								className="flex flex-col items-start gap-5 justify-start sm:items-center sm:flex-row sm:justify-between mb-6
                                            py-4 border-b border-gray-200"
							>
								<div>
									<h3 className="text-sm font-medium text-gray-800">
										Upgrade Plan
									</h3>
									<p className="text-sm text-gray-500">
										Get access to premium features and enhanced capabilities
									</p>
								</div>
								<Button
									icon={<FiDollarSign />}
									className="rounded-lg w-32 py-2"
								>
									Upgrade
								</Button>
							</div>

							<div
								className="flex flex-col items-start gap-5 justify-start sm:items-center sm:flex-row sm:justify-between mb-6
                                            py-4 border-b border-gray-200"
							>
								<div>
									<h3 className="text-sm font-medium text-gray-800">
										Payment Method
									</h3>
									<p className="text-sm text-gray-500">
										Update your billing information and payment details
									</p>
								</div>
								<Button
									icon={<FiCreditCard />}
									variant="secondary"
									className="rounded-lg w-32 py-2"
								>
									Update
								</Button>
							</div>
						</div>
					</section>

					<section
						id="notifications"
						className="bg-white shadow-sm rounded-lg p-6"
					>
						<h2 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
							<FiBell className="mr-2" /> Notifications
						</h2>
						<div className="space-y-2">
							<ToggleSwitch
								icon={<FiBell />}
								label="Push Notifications"
								name="pushNotifications"
							/>
							<ToggleSwitch
								icon={<FiBell />}
								label="Web Notifications"
								name="webNotifications"
							/>
							<ToggleSwitch
								icon={<FiBell />}
								label="Email Notifications"
								name="emailNotifications"
							/>
						</div>
					</section>

					<section id="danger" className="bg-white shadow-sm rounded-lg p-6">
						<h2 className="text-lg font-semibold mb-6 text-red-500 flex items-center">
							<FiAlertTriangle className="mr-2" /> Danger Zone
						</h2>
						<div className="space-y-4">
							<div
								className="flex flex-col items-start gap-5 justify-start sm:items-center sm:flex-row sm:justify-between mb-6
                                            py-4 border-b border-gray-200"
							>
								<div>
									<h3 className="text-sm font-medium text-gray-800">
										Deactivate Account
									</h3>
									<p className="text-sm text-gray-500">
										Temporarily disable your account and hide your profile
									</p>
								</div>
								<Button
									icon={<FiPower />}
									variant="danger"
									className="rounded-lg w-32 py-2"
								>
									Deactivate
								</Button>
							</div>

							<div
								className="flex flex-col items-start gap-5 justify-start sm:items-center sm:flex-row sm:justify-between mb-6
                                            py-4 border-b border-gray-200"
							>
								<div>
									<h3 className="text-sm font-medium text-gray-800">
										Delete Account
									</h3>
									<p className="text-sm text-gray-500">
										Permanently remove your account and all associated data
									</p>
								</div>
								<Button
									icon={<FiTrash2 />}
									variant="danger"
									className="rounded-lg w-32 py-2"
								>
									Delete
								</Button>
							</div>
						</div>
					</section>
				</div>
			</div>

			{/* sidebar */}
			<div className="hidden lg2:flex flex-col gap-2 w-64 xl:w-[25%] h-full p-4">
				<div className="bg-white shadow-sm rounded-lg p-6 sticky top-6">
					<h2 className="text-lg font-semibold mb-6 text-gray-800">
						Quick Navigation
					</h2>
					<nav className="space-y-4">
						{sections.map((section) => (
							<button
								key={section.id}
								onClick={() => scrollToSection(section.id)}
								className={`flex w-full items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
									activeSection === section.id
										? "bg-gray-100 text-gray-800"
										: section.danger
											? "text-red-500 hover:bg-red-50"
											: "text-gray-700 hover:bg-gray-100"
								}`}
							>
								<span className="text-lg">{section.icon}</span>
								<span className="font-medium">{section.label}</span>
							</button>
						))}
					</nav>
				</div>
			</div>
		</div>
	);
}
