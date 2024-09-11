import { Footer } from "@/components/common/Footer";
import { Link } from "react-router-dom";

export const NotFound = () => {
	return (
		<>
			<div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8 text-center">
					<div className="relative">
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="h-48 w-48 bg-sky-100 rounded-full"></div>
						</div>
						<svg
							className="relative z-10 w-48 h-48 mx-auto"
							viewBox="0 0 100 100"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M20 50C20 33.4315 33.4315 20 50 20C66.5685 20 80 33.4315 80 50C80 66.5685 66.5685 80 50 80C33.4315 80 20 66.5685 20 50Z"
								stroke="#0284c7"
								strokeWidth="4"
							/>
							<path
								d="M35 35L65 65M65 35L35 65"
								stroke="#0284c7"
								strokeWidth="4"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
					<h2 className="mt-6 text-6xl font-extrabold text-slate-800">404</h2>
					<p className="mt-2 text-3xl font-bold text-slate-800">
						Page not found
					</p>
					<p className="mt-2 text-xl text-gray-500">
						Sorry, we couldn't find the page you're looking for.
					</p>
					<div className="mt-8">
						<Link
							to="/"
							className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-slate-800 hover:bg-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 ease-in-out transform hover:scale-105"
						>
							Go back home
						</Link>
					</div>
				</div>
				<div className="mt-16 text-center">
					<p className="text-sm text-gray-500">
						If you think this is a mistake, please{" "}
						<a
							href="#"
							className="font-medium text-slate-800 hover:text-sky-500 transition-colors duration-200"
						>
							contact support
						</a>
						.
					</p>
				</div>
			</div>
			<Footer />
		</>
	);
}
