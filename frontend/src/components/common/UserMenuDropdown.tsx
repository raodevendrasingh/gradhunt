import React, { useState, useRef, useEffect } from "react";
import { HiOutlineLogout, HiUserCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useUser, SignOutButton } from "@clerk/clerk-react";

export const UserMenuDropdown = () => {
	const [isVisible, setIsVisible] = useState(false);
	const dropdownRef = useRef(null);
	const { isSignedIn, user } = useUser();

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

	if (isSignedIn) {
		return (
			<div className="relative" ref={dropdownRef}>
				<div className="inline-flex items-center overflow-hidden  ">
					<button onClick={toggleDropdown}>
						<span className="pt-5 rounded-full">
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
						className="absolute top-12 right-0 z-30 rounded-xl border border-gray-200 bg-white shadow"
						role="menu"
					>
						<div className="">
							<span className="flex items-center gap-5 px-4 py-3 border-b rounded-t-xl text-sm  text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
								<div className="rounded-full w-10 overflow-hidden">
									<img
										src={user.imageUrl}
										alt="User profile"
										className="h-full w-full object-cover rounded-full bg-gray-400"
									/>
								</div>
								<div className="flex flex-col overflow-x-hidden text-sm">
									<span>{user?.firstName}</span>
									<span>{user?.primaryEmailAddress?.toString()}</span>
								</div>
							</span>
							<Link
								to="/profile"
								className="flex items-center gap-6 px-4 py-3 border-b leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
							>
								<span>
									<HiUserCircle className="size-5 text-gray-600" />
								</span>
								<span className="text-sm">Profile</span>
							</Link>
							<div className="flex items-center gap-6 px-4 py-3 leading-5 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
								<span>
									<HiOutlineLogout className="size-5 text-rose-400" />
								</span>
								<SignOutButton>Logout</SignOutButton>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
};
