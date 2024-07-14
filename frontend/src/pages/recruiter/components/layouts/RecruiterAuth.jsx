// hooks
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// external libs
import { toast } from "sonner";
import axios from "axios";

// assets
import logo from "@/assets/brand/brandLogoFull.png";

export const RecruiterAuth = () => {
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
