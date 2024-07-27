// hooks
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// external libs
import { toast } from "sonner";
import { GoArrowRight } from "react-icons/go";

export const Tabs = () => {
	const [openTab, setOpenTab] = useState(1);
	const [firstName, setFname] = useState("");
	const [lastName, setLname] = useState("");
	const [email, setEmail] = useState("");
	const { register, login, isAuthenticated } = useKindeAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	const handleEmailPasswordLogin = async (e) => {
		e.preventDefault();
		let userData = null;
		try {
			userData = await login({
				authUrlParams: {
					connection_id: import.meta.env
						.VITE_KINDE_EMAIL_PASSWORD_CONNECTION_ID,
					login_hint: email,
				},
			});
		} catch (error) {
			console.error(error);
			toast.error("Error Logging In!");
		}
	};

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
	return (
		<>
			<div className="flex flex-wrap p-6">
				<div className="w-[430px]">
                    {/* tabs */}
					<ul
						className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
						role="tablist"
					>
						<li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
							<a
								className={
									"text-sm uppercase px-5 py-3 shadow rounded-md border border-gray-200 block leading-normal " +
									(openTab === 1
										? `text-white bg-sky-600`
										: `text-sky-600 bg-white`)
								}
								onClick={(e) => {
									e.preventDefault();
									setOpenTab(1);
								}}
								data-toggle="tab"
								href="#link1"
								role="tablist"
							>
								Login
							</a>
						</li>
						<li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
							<a
								className={
									"text-sm px-5 py-3 shadow rounded-md border border-gray-200 block leading-normal " +
									(openTab === 2
										? `text-white bg-sky-600`
										: `text-sky-600 bg-white`)
								}
								onClick={(e) => {
									e.preventDefault();
									setOpenTab(2);
								}}
								data-toggle="tab"
								href="#link2"
								role="tablist"
							>
								Sign Up
							</a>
						</li>
					</ul>
                    {/* tabs end */}


						<div className="relative h-[400px] flex flex-col bg-white w-full mb-6">
							<div className="flex-auto ">
								<div className={openTab === 1 ? "block shadow rounded-md border border-gray-200" : "hidden"} id="link1">
									<div className="flex justify-center items-center max-w-lg lg:max-w-sm mx-auto">
										<div className="flex flex-col justify-start flex-1 px-4 py-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
											<div className="w-full max-w-xl mx-auto lg:w-96">
												<form
													onSubmit={handleEmailPasswordLogin}
													method="POST"
													className="space-y-6"
												>
													<div>
														<label
															htmlFor="email"
															className="block text-left text-sm font-medium text-neutral-600"
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
																className="block font-normal  w-full px-5 py-2 text-base placeholder-gray-300 transition duration-500 ease-in-out transform border-2 border-gray-100 rounded-lg text-neutral-600 bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
															/>
														</div>
													</div>

													<div>
														<button
															type="submit"
															className="flex gap-2 items-center justify-center w-full px-10 py-2.5 text-lg font-medium text-center text-white transition duration-500 ease-in-out transform bg-sky-700 rounded-xl hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
														>
															<span>Login</span>
															<span>
																<GoArrowRight />
															</span>
														</button>
													</div>
												</form>
											</div>
										</div>
									</div>
								</div>
								<div className={openTab === 2 ? "block  shadow rounded-md border border-gray-200" : "hidden"} id="link2">
									<div className="flex justify-center items-center max-w-lg lg:max-w-sm mx-auto">
										<div className="flex flex-col justify-start flex-1 px-4 py-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
											<div className="w-full max-w-xl mx-auto lg:w-96">
												<form
													onSubmit={handleEmailPasswordRegister}
													method="POST"
													className="space-y-6"
												>
													<div>
														<label
															htmlFor="firstName"
															className="block text-left text-sm font-medium text-neutral-600"
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
																className="block w-full px-5 py-2 text-base placeholder-gray-300 transition duration-500 ease-in-out transform border-2 border-gray-100 rounded-md text-neutral-600 bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
															/>
														</div>
													</div>
													<div>
														<label
															htmlFor="lastName"
															className="block text-left text-sm font-medium text-neutral-600"
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
															className="block text-left text-sm font-medium text-neutral-600"
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
																className="block w-full px-5 py-2 text-base placeholder-gray-300 transition duration-500 ease-in-out transform border-2 border-gray-100 rounded-md text-neutral-600 bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
															/>
														</div>
													</div>

													<div>
														<button
															type="submit"
															className="flex items-center justify-center w-full px-10 py-2.5 text-lg font-medium text-center text-white transition duration-500 ease-in-out transform bg-sky-700 rounded-md hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
														>
															Create Account
														</button>
													</div>
												</form>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					
				</div>
			</div>
		</>
	);
};
