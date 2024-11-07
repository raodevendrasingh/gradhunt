import { SignIn, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function SignInPage() {
	const { isLoaded } = useUser();
	return (
		<>
			{isLoaded && (
				<div className="flex justify-center items-center h-[90vh]">
					<div className="flex flex-col items-center border rounded-2xl py-5 px-5 shadow-xl">
						<div className="flex flex-col justify-center items-center gap-2 text-sm max-w-md py-5 w-[401px]">
							<span className="text-slate-800 text-4xl font-bold">Log In</span>
						</div>
						<SignIn
							path="/login"
							appearance={{
								elements: {
									rootBox: "rounded-lg ",
									cardBox: "rounded shadow-none",
									card: "rounded p-3",
									header: "hidden",
									headerTitle: " text-2xl",
									headerSubtitle: "text-base",
									socialButtons: "",
									socialButtonsProviderIcon: "",
									socialButtonsBlockButton: "py-2 rounded-lg",
									socialButtonsBlockButtonText: "text-base",
									dividerRow: "",
									dividerText: "text-lg",
									formFieldLabel: " text-base",
									formFieldInput:
										"rounded-lg bg-gray-50 border border-gray-300 py-4",
									formButtonPrimary: " text-base py-2 rounded-lg",
									footer: "hidden",
								},
							}}
							signUpUrl="/signup"
							forceRedirectUrl="/"
						/>
						<div className="flex justify-center items-center gap-2 text-sm max-w-md py-5 border-t-0 rounded-t-none w-[401px]">
							<span className="text-gray-500">Don&apos;t have an account?</span>
							<Link to="/signup">Sign up</Link>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
