import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export const GetStarted = () => {
	return (
		<>
			<Navbar />
			<div className="bg-gray-100 flex flex-col items-center justify-center h-screen mx-auto p-10 relative">
				<p className="text-3xl absolute top-40 left-40">
					What describes you best?
				</p>
				<div className="flex flex-col items-center text-xl gap-4 w-full md:w-1/2 lg:w-1/4">
					<Link
						to="/get-started/cad"
						className="hover:bg-gray-700 hover:text-white rounded-lg flex justify-between border-2 border-gray-700 px-10 py-5 w-full min-w-full md:min-w-0 transition duration-300"
					>
						<span className="flex flex-col items-start">
							Candidate
							<small>I&apos;m looking for a job.</small>
						</span>

						<FaLongArrowAltRight className="w-10 h-10" />
					</Link>
					<Link
						to="/get-started/hrm"
						className="hover:bg-gray-700 hover:text-white rounded-lg flex justify-between border-2 border-gray-700 px-10 py-5 w-full min-w-full md:min-w-0 transition duration-300"
					>
						<span className="flex flex-col items-start">
							Hiring Manager
							<small>I&apos;m Recruiting for a job.</small>
						</span>

						<FaLongArrowAltRight className="w-10 h-10" />
					</Link>
				</div>
			</div>
			<Footer />
		</>
	);
};
