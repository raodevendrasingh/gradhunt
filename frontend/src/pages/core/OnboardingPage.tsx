import { useEffect, useState } from "react";
import { UserOnboardingModal } from "@/modalForms/OnboardingModal";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export default function OnboardingPage() {
	const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

	const { isSignedIn, isLoaded, user } = useUser();
	const navigate = useNavigate();

	const username = user?.username;

	useEffect(() => {
		if (isLoaded) {
			if (isSignedIn && user) {
				if (!user.username || !user.firstName || !user.lastName) {
					setIsOnboardingModalOpen(true);
				} else {
					setIsOnboardingModalOpen(false);

					navigate(`/p/${username}`);
				}
			} else {
				navigate("/login");
			}
		}
	}, [isSignedIn, user, navigate, username]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
			<div>
				<UserOnboardingModal
					isOnboardingModalOpen={isOnboardingModalOpen}
					setIsOnboardingModalOpen={setIsOnboardingModalOpen}
				/>
			</div>

			<div className="relative w-full max-w-4xl p-8">
				<div className="absolute inset-0 bg-gray-200 transform -skew-y-6 z-0" />
				<div className="relative flex flex-col items-center justify-center z-10">
					{isOnboardingModalOpen ? (
						<h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-gray-800">
							Welcome aboard!
						</h1>
					) : (
						<>
							<h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-gray-800">
								User Onboarded Successfully
							</h1>
							<p className="text-2xl sm:text-3xl md:text-4xl text-gray-600 mb-8">
								Redirecting user to the profile
							</p>
						</>
					)}
					<svg
						className="w-16 h-16 mx-auto animate-spin text-gray-400"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				</div>
			</div>
		</div>
	);
}
