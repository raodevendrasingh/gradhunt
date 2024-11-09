import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
	FiCreditCard,
	FiBell,
	FiTrash2,
	FiDollarSign,
	FiGlobe,
} from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi2";
import {
	MdOutlineDangerous,
	MdAccountBalance,
	MdAlternateEmail,
} from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/Button";
import { useUser } from "@clerk/clerk-react";
import { HandleProfilePictureUpdate } from "@/components/layouts/ProfilePictureUpdate";
import { UsernameUpdateDialog } from "@/modal-forms/UsernameUpdateDialog";
import { EmailUpdateDialog } from "@/modal-forms/EmailUpdateDialog";
import { PasswordUpdateDialog } from "@/modal-forms/PasswordUpdateDialog";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { useFetchUserData } from "@/hooks/useFetchUserData";
import { ProfileVisibilityToggle } from "../components/layout/ProfileVisibilityToggle";
import { NotificationToggle } from "../components/layout/NotificationToggle";

export default function SettingsPage() {
	const [activeSection, setActiveSection] = useState("profile");
	const [showUsernameDialog, setShowUsernameDialog] = useState<boolean>(false);
	const [showEmailDialog, setShowEmailDialog] = useState<boolean>(false);
	const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);
	const { user } = useUser();

	const { register, control } = useForm<FormData>();

	const { data: userData } = useFetchUserData();

	if (!userData) return null;

	const scrollToSection = (sectionId: string) => {
		setActiveSection(sectionId);
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	const sections = [
		{
			id: "profile",
			icon: <HiOutlineUserCircle className="h-5 w-5" />,
			label: "Profile",
		},
		{ id: "account", icon: <MdAccountBalance />, label: "Account" },
		{ id: "subscription", icon: <FiCreditCard />, label: "Subscription" },
		{ id: "notifications", icon: <FiBell />, label: "Notifications" },
		{
			id: "danger",
			icon: <MdOutlineDangerous />,
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
							<HiOutlineUserCircle className="mr-2 h-6 w-6" /> Profile
						</h2>
						<HandleProfilePictureUpdate />
						<div className="space-y-4">
							<div className="flex items-center justify-between py-4 border-b border-gray-200">
								<div>
									<h3 className="text-sm font-medium text-gray-800">
										Username
									</h3>
									<p className="text-sm text-gray-500">{user?.username}</p>
								</div>

								<Button
									variant="secondary"
									className="rounded-lg w-24 py-2"
									onClick={() => setShowUsernameDialog(true)}
								>
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

								<Button
									disabled
									variant="secondary"
									className="rounded-lg w-24 py-2"
									onClick={() => setShowEmailDialog(true)}
								>
									Update
								</Button>
							</div>
							<div className="flex items-center justify-between py-4 border-gray-200">
								<div>
									<h3 className="text-sm font-medium text-gray-800">
										Password
									</h3>
									<p className="text-sm text-gray-500">
										{user?.passwordEnabled ? "Enabled" : "No password set"}
									</p>
								</div>
								{user?.passwordEnabled ? (
									<Button
										variant="secondary"
										className="rounded-lg w-24 py-2"
										onClick={() => setShowPasswordDialog(true)}
									>
										Update
									</Button>
								) : (
									<Button
										disabled
										variant="secondary"
										className="rounded-lg w-24 py-2"
									>
										Create
									</Button>
								)}
							</div>
						</div>
					</section>

					<section id="career" className="bg-white shadow-sm rounded-lg p-6">
						<h2 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
							<MdAccountBalance className="mr-2" /> Account
						</h2>
						<div className="space-y-4">
							<ProfileVisibilityToggle
								defaultValue={userData.isProfilePrivate}
							/>
							{user?.passwordEnabled ? (
								<ToggleSwitch
									disabled={true}
									defaultValue={false}
									control={control}
									register={register}
									icon={<FcGoogle className="h-5 w-5" />}
									label="Connect Google Account"
									name="connectGoogleAccount"
								/>
							) : (
								<ToggleSwitch
									disabled={true}
									defaultValue={true}
									control={control}
									register={register}
									icon={<FcGoogle className="h-5 w-5" />}
									label="Connect Google Account"
									name="connectGoogleAccount"
								/>
							)}

							<div className="flex flex-col items-start gap-5 justify-start sm:items-center sm:flex-row sm:justify-between py-4">
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
										Current Plan
									</h3>
									<p className="text-sm text-gray-500">
										Limited access to features and capabilities
									</p>
								</div>
								<Button
									className="rounded-lg bg-sky-100 hover:bg-blue-100 w-32 py-2"
									variant="secondary"
								>
									{userData.plan}
								</Button>
							</div>
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

							<div className="flex flex-col items-start gap-5 justify-start sm:items-center sm:flex-row sm:justify-between py-4">
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
							<NotificationToggle
								label="Web Notifications"
								icon={<FiGlobe />}
								defaultValue={userData.isWebNotificationEnabled}
								notificationType="web"
							/>
							<NotificationToggle
								label="Email Notifications"
								icon={<MdAlternateEmail />}
								defaultValue={userData.isEmailNotificationEnabled}
								notificationType="email"
							/>
						</div>
					</section>

					<section id="danger" className="bg-white shadow-sm rounded-lg p-6">
						<h2 className="text-lg font-semibold mb-6 text-red-500 flex items-center">
							<MdOutlineDangerous className="mr-2 h-6 w-6" /> Danger Zone
						</h2>
						<div className="flex flex-col items-start gap-5 justify-start sm:items-center sm:flex-row sm:justify-between py-4">
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
			{showUsernameDialog && (
				<UsernameUpdateDialog
					setShowUsernameDialog={setShowUsernameDialog}
					currentUsername={userData.username}
				/>
			)}
			{showEmailDialog && (
				<EmailUpdateDialog
					setShowEmailDialog={setShowEmailDialog}
					currentEmail={userData.email}
				/>
			)}
			{showPasswordDialog && (
				<PasswordUpdateDialog setShowPasswordDialog={setShowPasswordDialog} />
			)}
		</div>
	);
}
