import { useState, useRef, useEffect } from "react";
import {
	HiArrowRightOnRectangle,
	HiUserCircle,
	HiCog6Tooth,
	HiMiniBuildingOffice2,
	HiMiniBuildingOffice,
} from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useFetchUserDetails } from "@/hooks/useFetchUserDetails";
import { useFetchCompanyProfile } from "@/hooks/useFetchCompanyProfile";

interface CompanyProfile {
	isDraft: boolean;
	companyName: string;
	companyLogo: string;
}

interface UserMenuProps {
	className?: string;
}

interface MenuLinkProps {
	to: string;
	icon: React.ReactNode;
	onClick?: () => void;
	children: React.ReactNode;
}

interface CompanyLinkProps {
	company: CompanyProfile;
	onClick: () => void;
}

export const UserMenuDropdown: React.FC<UserMenuProps> = ({ className }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { isSignedIn, user } = useUser();
	const navigate = useNavigate();

	const { data: userData, isLoading: isUserDataLoading } =
		useFetchUserDetails();
	const isCompanyAdmin = userData?.user_details?.isCompanyAdmin;

	const { data: companyProfile, error: companyProfileError } =
		useFetchCompanyProfile(isUserDataLoading ? false : !!isCompanyAdmin);

	useEffect(() => {
		if (!companyProfileError) return;

		const errorStatus = companyProfileError.response?.status;
		if (errorStatus !== 404 && errorStatus !== 400) {
			console.error("Failed to fetch company details:", companyProfileError);
		}
	}, [companyProfileError]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleNavigate = (path: string) => {
		navigate(path);
		setIsOpen(false);
	};

	if (!isSignedIn || !user) return null;

	return (
		<div className={`relative z-50 ${className}`} ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center overflow-hidden rounded-full ring-2 ring-transparent hover:ring-gray-200 transition-all duration-200"
				aria-label="Open user menu"
			>
				<img
					src={user.imageUrl}
					alt="User profile"
					className="h-10 w-10 object-cover rounded-full bg-gray-100"
				/>
			</button>

			{isOpen && (
				<div className="absolute top-12 right-0 w-64 rounded-2xl border border-gray-200 bg-white shadow-lg cursor-pointer z-50 overflow-hidden">
					<div className="flex flex-col gap-1 p-4 bg-gray-50/50">
						<div className="flex items-center gap-3">
							<img
								src={user.imageUrl}
								alt="User profile"
								className="h-12 w-12 object-cover rounded-full border-2 border-white shadow-sm bg-gray-100"
							/>
							<div className="flex flex-col overflow-hidden">
								{user.username ? (
									<>
										<span className="font-semibold text-gray-900 truncate">
											{user.firstName}
										</span>
										<span className="text-sm text-gray-500 truncate">
											@{user.username}
										</span>
									</>
								) : (
									<span className="text-sm text-gray-700 truncate">
										{user.primaryEmailAddress?.toString()}
									</span>
								)}
							</div>
						</div>
					</div>
					<Divider />

					<div className="py-1.5">
						<MenuLink
							to={`/p/${user.username}`}
							icon={<HiUserCircle className="size-5 text-gray-600" />}
							onClick={() => handleNavigate(`/p/${user.username}`)}
						>
							Profile
						</MenuLink>

						{companyProfile && !companyProfile.isDraft && (
							<CompanyLink
								company={companyProfile}
								onClick={() =>
									handleNavigate(
										`/company/${companyProfile.companyName.toLowerCase()}`
									)
								}
							/>
						)}

						<MenuLink
							to="/settings"
							icon={<HiCog6Tooth className="size-5 text-gray-600" />}
							onClick={() => handleNavigate("/settings")}
						>
							Settings
						</MenuLink>
					</div>

					<Divider />

					<div className="py-1.5">
						<SignOutButton>
							<MenuLink
								to="#"
								icon={
									<HiArrowRightOnRectangle className="size-5 text-red-600" />
								}
							>
								Logout
							</MenuLink>
						</SignOutButton>
					</div>
				</div>
			)}
		</div>
	);
};

const MenuLink: React.FC<MenuLinkProps> = ({ to, icon, onClick, children }) => (
	<Link
		to={to}
		onClick={onClick}
		className="flex items-center gap-3 mx-1.5 px-3 py-2.5 rounded-lg text-gray-700  hover:bg-gray-100 active:bg-gray-100 transition-colors duration-150"
	>
		<span className="flex items-center justify-center pr-2">{icon}</span>
		<span className="text-sm font-medium">{children}</span>
	</Link>
);

const CompanyLink: React.FC<CompanyLinkProps> = ({ company, onClick }) => (
	<Link
		to={`/company/${company.companyName.toLowerCase()}`}
		onClick={onClick}
		className="flex items-center gap-3 mx-1.5 px-3 py-2 rounded-lg text-gray-700  hover:bg-gray-100 active:bg-gray-100 transition-colors duration-150"
	>
		<span className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-1">
			<img
				src={company.companyLogo}
				alt={`${company.companyName} logo`}
				className="h-4 w-4 object-cover"
			/>
		</span>
		<span className="text-sm font-medium truncate">{company.companyName}</span>
	</Link>
);

const Divider = () => <hr className="mx-2 border-gray-200" />;
