import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

import BusinessMeeting from "@/assets/illustration/businessMeeting.jpg";

import { SignInPage } from "@/pages/recruiter/auth/SignInPage";
import { SignUpPage } from "@/pages/recruiter/auth/SignUpPage";

export const RecruiterView = () => {
    const { isSignedIn, user } = useUser();
	const navigate = useNavigate();
    const [isSignIn, setIsSignIn] = useState(true);

	useEffect(() => {
		if (isSignedIn) {
			navigate("/feed");
		}
	}, [user]);

	const toggleView = () => {
		setIsSignIn(!isSignIn);
	};
	return (
		<div className="text-center font-semibold text-xl pt-32">
			<div className="flex justify-center items-center">
				<div className="hidden w-3/5 lg:flex justify-center items-center">
					<img
						src={BusinessMeeting}
						alt="business_svg"
						className="lg:w-[70%] xl:w-[80%]"
					/>
				</div>
				<div className="max-w-full mx-auto xl:w-2/5 h-[500px]">
					{isSignIn ? (
						<SignInPage toggleView={toggleView} />
					) : (
						<SignUpPage toggleView={toggleView} />
					)}
				</div>
			</div>
		</div>
	);
};
