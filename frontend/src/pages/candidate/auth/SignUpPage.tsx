import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

// assets
import logo from "@/assets/brand/brandLogoFull.png";
import { useReadLocalStorage } from "usehooks-ts";

const SignUpPage = () => {
    const username = useReadLocalStorage<string>('potentialUser')

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
                        <span className="text-slate-800 text-4xl font-bold">Sign Up</span>
                        {username && (
                            <span className="text-gray-600 text-sm pt-2 text-center">
                                We've saved{" "}
                                <span className="text-gray-800 font-medium">
                                    {" "}
                                    gradhunt.tech/{username}{" "}
                                </span>
                                for you
                            </span>
                        )}
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
                                formFieldRow__name: "hidden",
                                formFieldRow__username: "hidden",
                                formFieldLabel: "text-base",
                                formFieldInput:
                                    "rounded-lg bg-gray-50 border border-gray-300 py-4",
                                formButtonPrimary: "text-base py-2 rounded-lg",
                                footer: "hidden",
                                otpCodeFieldInput:
                                    "rounded-lg bg-gray-50 border border-gray-300 py-4",
                            },
                        }}
                        initialValues={{
                            username: username || '',
                        }}
                        signInUrl="/login"
                        forceRedirectUrl="/onboarding"
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

export default SignUpPage;