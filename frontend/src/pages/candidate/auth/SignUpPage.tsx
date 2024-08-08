import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

// assets
import logo from "@/assets/brand/brandLogoFull.png";

export const SignUpPage = () => {
	return (
		<>
			<div className="cursor-pointer">
				<Link to="/">
					<img src={logo} alt="logo" className="aspect-auto w-52 p-4" />
				</Link>
			</div>
			<div className="flex justify-center items-center pt-10">
				<div className="flex flex-col items-center border rounded-xl py-3 px-5 shadow-xl">
					<div className="flex flex-col justify-center items-center gap-2 text-sm max-w-md py-5 w-[401px]">
						<span className="text-slate-800 text-4xl font-bold">Sign In</span>
						<span className="text-gray-700 text-sm pt-2">
							We're holding on to "username" for you
						</span>
					</div>
					<SignUp
						path="/signup"
						appearance={{
							elements: {
								rootBox: "rounded-lg ",
								cardBox: "rounded shadow-none",
								card: "rounded p-3",
								header: "hidden",
								socialButtonsBlockButton: "py-2 rounded-lg",
								socialButtonsBlockButtonText: "text-base",
								dividerText: "text-lg",
								formFieldLabel: " text-base",
								formFieldInput:
									"rounded-lg bg-gray-50 border border-gray-300 py-4",
								formButtonPrimary: " text-base py-2 rounded-lg",
								footer: "hidden",
                                otpCodeFieldInput: "rounded-lg bg-gray-50 border border-gray-300 py-4"
							},
						}}
						initialValues={{
							username: undefined, //pass as props from the landing page
						}}
						signInUrl="/login"
						forceRedirectUrl="/search"
					/>

					<div className="flex justify-center items-center gap-2 text-sm max-w-md py-5 border-t-0 rounded-t-none w-[401px]">
						<span className="text-gray-500">Already have an account?</span>
						<Link to="/login">Login</Link>
					</div>
				</div>
			</div>
		</>
	);
};
