// hooks
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// external libs
import { toast } from "sonner";
import axios from "axios";

// assets
import logo from "@/assets/brand/brandLogoFull.png";

export const SignUpPage = () => {
	const [firstName, setFname] = useState("");
	const [lastName, setLname] = useState("");
	const [email, setEmail] = useState("");
	const { register, login, isAuthenticated, getToken } = useKindeAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	const handleEmailPasswordRegister = async (e) => {
		e.preventDefault();
		let userData = null;
		try {
			userData = await register({
				authUrlParams: {
					connection_id: import.meta.env
						.VITE_KINDE_EMAIL_PASSWORD_CONNECTION_ID,
					login_hint: email,
				},
			});
		} catch (error) {
			console.error(error);
			toast.error("Error creating account!");
		}
	};

	const handleGoogleRegister = () => {
		register({
			authUrlParams: {
				connection_id: import.meta.env.VITE_KINDE_GOOGLE_CONNECTION_ID,
				login_hint: email,
			},
		});
	};

	return (
		<section>
			<div className="flex justify-center items-center h-screen max-w-sm mx-auto">
				<div className="flex flex-col justify-center flex-1 px-4 py-8 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
					<div className="w-full max-w-xl mx-auto lg:w-96">
						<div>
							<span className="flex justify-center">
								<Link to="/">
									<img src={logo} alt="logo" className="w-32 aspect-auto" />
								</Link>
							</span>
							<h2 className="mt-5 text-3xl font-extrabold text-neutral-600">
								Sign Up.
							</h2>
						</div>

						<div className="mt-8">
							<div className="mt-6">
								<div>
									<button
										type="submit"
										className="w-full items-center block px-10 py-3 text-base font-medium text-center text-slate-800 transition duration-500 ease-in-out transform border border-gray-200 shadow rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
										onClick={handleGoogleRegister}
									>
										<div className="flex items-center justify-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												xmlnsXlink="http://www.w3.org/1999/xlink"
												className="w-6 h-6"
												viewBox="0 0 48 48"
											>
												<defs>
													<path
														id="a"
														d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
													></path>
												</defs>
												<clipPath id="b">
													<use xlinkHref="#a" overflow="visible"></use>
												</clipPath>
												<path
													clipPath="url(#b)"
													fill="#FBBC05"
													d="M0 37V11l17 13z"
												></path>
												<path
													clipPath="url(#b)"
													fill="#EA4335"
													d="M0 11l17 13 7-6.1L48 14V0H0z"
												></path>
												<path
													clipPath="url(#b)"
													fill="#34A853"
													d="M0 37l30-23 7.9 1L48 0v48H0z"
												></path>
												<path
													clipPath="url(#b)"
													fill="#4285F4"
													d="M48 48L17 24l-4-3 35-10z"
												></path>
											</svg>
											<span className="ml-4"> Continue with Google</span>
										</div>
									</button>
								</div>
								<div className="relative my-4">
									<div className="absolute inset-0 flex items-center">
										<div className="w-full border-t border-gray-300"></div>
									</div>
									<div className="relative flex justify-center text-sm">
										<span className="px-2 bg-white text-neutral-600">
											Or continue with
										</span>
									</div>
								</div>
								<form
									onSubmit={handleEmailPasswordRegister}
									method="POST"
									className="space-y-6"
								>
									<div>
										<label
											htmlFor="firstName"
											className="block text-sm font-medium text-neutral-600"
										>
											First Name
										</label>
										<div className="mt-1">
											<input
												id="firstName"
												name="firstName"
												type="text"
												autoComplete="firstName"
												placeholder="First Name"
												value={firstName}
												onChange={(e) => setFname(e.target.value)}
												required
												className="block w-full px-5 py-2 text-base placeholder-gray-300 transition duration-500 ease-in-out transform border-2 border-gray-100 rounded-lg text-neutral-600 bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
											/>
										</div>
									</div>
									<div>
										<label
											htmlFor="lastName"
											className="block text-sm font-medium text-neutral-600"
										>
											Last Name
										</label>
										<div className="mt-1">
											<input
												id="lastName"
												name="lastName"
												type="text"
												autoComplete="lastName"
												placeholder="Last Name"
												value={lastName}
												onChange={(e) => setLname(e.target.value)}
												required
												className="block w-full px-5 py-2 text-base placeholder-gray-300 transition duration-500 ease-in-out transform border-2 border-gray-100 rounded-lg text-neutral-600 bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
											/>
										</div>
									</div>
									<div>
										<label
											htmlFor="email"
											className="block text-sm font-medium text-neutral-600"
										>
											Email address
										</label>
										<div className="mt-1">
											<input
												id="email"
												name="email"
												type="email"
												autoComplete="email"
												placeholder="Your Email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												required
												className="block w-full px-5 py-2 text-base placeholder-gray-300 transition duration-500 ease-in-out transform border-2 border-gray-100 rounded-lg text-neutral-600 bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
											/>
										</div>
									</div>

									<div>
										<button
											type="submit"
											className="flex items-center justify-center w-full px-10 py-2.5 text-lg font-medium text-center text-white transition duration-500 ease-in-out transform bg-green-700 rounded-xl hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
										>
											Create Account
										</button>
									</div>

									<div className="flex items-center justify-start text-sm font-medium text-slate-600">
										Already have an account?
										<Link
											to="/login"
											className="ml-1 font-medium text-green-600 hover:text-green-500"
										>
											Login
										</Link>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
