import React from "react";
import { Link } from "react-router-dom";

export default function NotFound(): React.JSX.Element {
	return (
		<div className="w-full lg2:w-[70%] border-r h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
			<div className="space-y-8 text-center">
				<div className="relative">
					<h1 className="text-9xl font-extrabold text-slate-800 tracking-widest">
						404
					</h1>
					<div className="absolute top-0 left-2 w-full h-full flex items-center justify-center">
						<div className="bg-slate-300 bg-opacity-20 h-full w-full transform rotate-12 rounded-3xl" />
					</div>
				</div>
				<h2 className="mt-8 text-3xl font-bold text-gray-500">
					Whoops! Page not found.
				</h2>
				<p className="mt-2 text-lg text-gray-500">
					The page you're looking for doesn't exist or has been moved.
				</p>
				<div className="mt-6" />
				<div className="mt-8">
					<Link
						to="/"
						className="inline-flex items-center px-6 py-3 border text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-0 transition-colors duration-300"
					>
						Go back home
					</Link>
				</div>
			</div>
		</div>
	);
}
