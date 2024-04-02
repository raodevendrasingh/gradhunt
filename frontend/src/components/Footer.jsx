import React from "react";
import mascot from "../assets/mascot.png";
import gradhunt from "../assets/gradhunt.png";
import { FaGithub, FaInstagram, FaXTwitter, FaLinkedin } from "react-icons/fa6";

export const Footer = () => {
	return (
		<footer className="bg-gray-50  border-t">
			<div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
				<div className="flex justify-center text-teal-600">
                <img src={gradhunt} alt="logo"  className="aspect-auto w-40" />
				</div>

				<p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500">
                Where Graduates Meet Employers. Start Your Professional Journey Today
				</p>

				<ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
					<li>
						<a
							className="text-gray-700 transition hover:text-gray-700/75"
							href="#"
						>
							{" "}
							About{" "}
						</a>
					</li>

					<li>
						<a
							className="text-gray-700 transition hover:text-gray-700/75"
							href="#"
						>
							{" "}
							Careers{" "}
						</a>
					</li>

					<li>
						<a
							className="text-gray-700 transition hover:text-gray-700/75"
							href="#"
						>
							{" "}
							History{" "}
						</a>
					</li>

					<li>
						<a
							className="text-gray-700 transition hover:text-gray-700/75"
							href="#"
						>
							{" "}
							Services{" "}
						</a>
					</li>

					<li>
						<a
							className="text-gray-700 transition hover:text-gray-700/75"
							href="#"
						>
							{" "}
							Projects{" "}
						</a>
					</li>

					<li>
						<a
							className="text-gray-700 transition hover:text-gray-700/75"
							href="#"
						>
							{" "}
							Blog{" "}
						</a>
					</li>
				</ul>

				<ul className="mt-12 flex justify-center gap-6 md:gap-8">
					<li>
						<a
							href="#"
							rel="noreferrer"
							target="_blank"
							className="text-gray-700 transition hover:text-gray-700/75"
						>
							<span className="sr-only">GitHub</span>
							<FaGithub className="h-6 w-6" aria-hidden="true" />
						</a>
					</li>

					<li>
						<a
							href="#"
							rel="noreferrer"
							target="_blank"
							className="text-gray-700 transition hover:text-gray-700/75"
						>
							<span className="sr-only">X</span>
							<FaXTwitter className="h-6 w-6" aria-hidden="true" />
						</a>
					</li>

					<li>
						<a
							href="#"
							rel="noreferrer"
							target="_blank"
							className="text-gray-700 transition hover:text-gray-700/75"
						>
							<span className="sr-only">LinkedIn</span>
							<FaLinkedin className="h-6 w-6" aria-hidden="true" />
						</a>
					</li>

					<li>
						<a
							href="#"
							rel="noreferrer"
							target="_blank"
							className="text-gray-700 transition hover:text-gray-700/75"
						>
							<span className="sr-only">Instagram</span>
							<FaInstagram className="h-6 w-6" aria-hidden="true" />
						</a>
					</li>
				</ul>
			</div>
			<p className="bg-green-600 w-full py-3 mt-10 text-white text-center bottom-0 left-0 right-0">
				© Copyright 2024 GradHunt Inc. All rights reserved
			</p>
		</footer>
	);
};
