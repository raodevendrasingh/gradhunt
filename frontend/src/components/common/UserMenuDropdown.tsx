import { useState, useRef, useEffect } from "react";
import { HiOutlineLogout, HiUserCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useUser, SignOutButton } from "@clerk/clerk-react";

export const UserMenuDropdown = () => {
	const [isVisible, setIsVisible] = useState(false);
	const dropdownRef = useRef(null);
	const { isSignedIn, user } = useUser();
	const navigate = useNavigate();

	const profilePath = isSignedIn ? user?.username : "user";

	const toggleDropdown = () => setIsVisible(!isVisible);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!(dropdownRef.current as HTMLElement).contains(event.target as Node)
			) {
				setIsVisible(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleProfileClick = () => {
		navigate(`${profilePath}`); // Navigate to the profile page
		setIsVisible(false); // Close the dropdown menu
	};

	if (isSignedIn) {
		return (
			<div className="relative z-50" ref={dropdownRef}>
				<div className="flex items-center overflow-hidden  ">
					<button onClick={toggleDropdown}>
						<span className="rounded-full">
							<img
								src={user.imageUrl}
								alt="User profile"
								className="size-10 object-cover rounded-full bg-gray-400"
							/>
						</span>
					</button>
				</div>

				{isVisible && (
					<div
                    className="absolute top-12 right-0 w-48 rounded-lg border border-gray-200 bg-white bg-opacity-[.97] shadow cursor-pointer z-50 backdrop-blur-md"
                    role="menu"
					>
						<div className="">
							<span className="flex items-center gap-5 px-4 py-3 border-b rounded-t-xl text-sm  text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
								{user?.username ? (
									<>
										<div className="flex flex-col overflow-x-hidden text-sm">
											<span className="text-sm font-semibold ">
												{user?.firstName}
											</span>
											<span className="font-light">@{user?.username}</span>
										</div>
									</>
								) : (
									<>
										<div className="flex flex-col overflow-x-hidden text-sm">
											<span>{user?.primaryEmailAddress?.toString()}</span>
										</div>
									</>
								)}
							</span>
							<div
								// to={`${profilePath}`}
								onClick={handleProfileClick}
								className="flex items-center gap-6 px-4 py-3 border-b leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
							>
								<span>
									<HiUserCircle className="size-5 text-gray-600" />
								</span>
								<span className="text-sm">Profile</span>
							</div>
							<SignOutButton>
								<div className="flex items-center gap-6 px-4 py-3 leading-5 rounded-b-lg text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
									<span>
										<HiOutlineLogout className="size-5 text-red-500" />
									</span>
									Logout
								</div>
							</SignOutButton>
						</div>
					</div>
				)}
			</div>
		);
	}
};
