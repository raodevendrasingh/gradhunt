import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/gh_full_shade2.png";

export const LoginPage = () => {
	const [email, setEmail] = useState("");
	const { login, isAuthenticated } = useKindeAuth();

	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	const handleEmailPasswordLogin = (event) => {
		event.preventDefault();
		login({
			authUrlParams: {
				connection_id: import.meta.env.VITE_KINDE_EMAIL_PASSWORD_CONNECTION_ID,
				login_hint: email,
			},
		});
	};

	const handleGoogleLogin = () => {
		login({
			authUrlParams: {
				connection_id: import.meta.env.VITE_KINDE_GOOGLE_CONNECTION_ID,
			},
		});
	};

	return (
		<section>
			<div className="flex justify-center items-center h-screen max-w-sm mx-auto">
				<div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
					<div className="w-full max-w-xl mx-auto lg:w-96">
						<div>
							<span className="flex justify-center">
								<Link to="/">
									<img src={logo} alt="logo" className="w-32 aspect-auto" />
								</Link>
							</span>
							<h2 className="mt-6 text-3xl font-extrabold text-neutral-600">
								Log In.
							</h2>
						</div>

						<div className="mt-8">
							<div className="mt-6">
								<div>
									<button
										type="submit"
										className="w-full items-center block px-10 py-3 text-base font-medium text-center text-slate-800 transition duration-500 ease-in-out transform border border-gray-200 shadow rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
										onClick={handleGoogleLogin}
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
									onSubmit={handleEmailPasswordLogin}
									method="POST"
									className="space-y-6"
								>
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
												required
												placeholder="Your Email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												className="block w-full px-5 py-2 text-base placeholder-gray-300 transition duration-500 ease-in-out transform border-2 border-gray-100 rounded-lg text-neutral-600 bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
											/>
										</div>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<input
												id="remember-me"
												name="remember-me"
												type="checkbox"
												placeholder="Your password"
												className="w-4 h-4 text-blue-600 border-gray-200 rounded focus:ring-blue-500"
											/>
											<label
												htmlFor="remember-me"
												className="block ml-2 text-sm text-neutral-600"
											>
												Remember me
											</label>
										</div>

										<div className="text-sm">
											<a
												href=""
												className="font-medium text-blue-600 hover:text-blue-500"
											>
												Forgot password?
											</a>
										</div>
									</div>

									<div>
										<button
											type="submit"
											className="flex items-center justify-center w-full px-10 py-2.5 text-lg font-medium text-center text-white transition duration-500 ease-in-out transform bg-green-700 rounded-xl hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
										>
											Log In
										</button>
									</div>

									<div className="flex items-center justify-start text-sm font-medium text-slate-600">
										Don&apos;t have an account?{"  "}
										<Link
											to="/signup"
											className="ml-1 font-medium text-green-600 hover:text-green-500"
										>
											Sign Up
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
