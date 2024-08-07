// hooks
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// assets
import logo from "@/assets/brand/brandLogoFull.png";

export const AdminLogin = () => {
	const [email, setEmail] = useState("");

	const navigate = useNavigate();



	const handleEmailPasswordLogin = (event: { preventDefault: () => void; }) => {
		event.preventDefault();
	};

	return (
		<section className=" pt-32 w-full h-screen bg-slate-100">
			<div className="flex justify-center items-center max-w-md min-h-[424px] mx-auto border border-green-50 rounded-xl shadow-lg bg-slate-800/90">
				<div className=" flex flex-col justify-center flex-1 px-4 pb-12 pt-8 sm:px-6 lg:flex-none lg:px-20 xl:px-24 ">
					<div className="w-full max-w-xl mx-auto lg:w-96">
						<div>
							<span className="flex justify-center">
								<Link to="/">
									<img src={logo} alt="logo" className="w-36 aspect-auto" />
								</Link>
							</span>
							<h2 className="mt-6 text-center text-3xl font-extrabold text-slate-50">
								ADMIN
							</h2>
						</div>

						<div className="mt-8">
							<div className="mt-6">
								<form
									onSubmit={handleEmailPasswordLogin}
									method="POST"
									className="space-y-6"
								>
									<div>
										<label
											htmlFor="email"
											className="block text-sm font-medium text-slate-50"
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
												className="block w-full px-5 py-2 text-base placeholder-gray-300 transition duration-500 ease-in-out transform rounded-lg text-neutral-600 bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-green-700 focus:ring-offset-2 focus:ring-offset-gray-100"
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
												className="w-4 h-4 text-blue-600 rounded focus:ring-green-500"
											/>
											<label
												htmlFor="remember-me"
												className="block ml-2 text-sm text-slate-50"
											>
												Remember me
											</label>
										</div>

										<div className="text-sm">
											<a
												href=""
												className="font-medium text-green-500 hover:text-green-400"
											>
												Forgot password?
											</a>
										</div>
									</div>

									<div>
										<button
											type="submit"
											className="flex items-center justify-center w-full px-10 py-2.5 text-lg font-medium text-center text-white transition duration-500 ease-in-out transform bg-green-700 rounded-xl hover:bg-green-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
										>
											Log In
										</button>
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
