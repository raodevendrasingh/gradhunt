import { useState } from "react";
import { FaGithub, FaXTwitter, FaLinkedin, FaInstagram } from "react-icons/fa6";
import { motion } from "framer-motion";
import gradhunt from "@/assets/brand/brandLogoFull.png";

const socialLinks = [
	{ icon: FaGithub, label: "GitHub", href: "#" },
	{ icon: FaXTwitter, label: "Twitter", href: "#" },
	{ icon: FaLinkedin, label: "LinkedIn", href: "#" },
	{ icon: FaInstagram, label: "Instagram", href: "#" },
];

const footerSections = [
	{
		title: "Company",
		items: ["Features", "Pricing", "Affiliate Program", "Press Kit"],
	},
	{
		title: "Support",
		items: ["Account", "Help", "Contact Us", "Customer Support"],
	},
	{
		title: "Legals",
		items: ["Terms & Conditions", "Privacy Policy", "Licensing"],
	},
];

const AnimatedLink = ({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) => (
	<motion.a
		href={href}
		className="text-base font-medium text-gray-700 hover:text-slate-800 transition-colors duration-300"
		whileHover={{ scale: 1.05 }}
		whileTap={{ scale: 0.95 }}
	>
		{children}
	</motion.a>
);

const NewsletterForm = () => {
	const [email, setEmail] = useState("");

	const handleSubmit = (e: { preventDefault: () => void }) => {
		e.preventDefault();
		// Handle newsletter subscription logic here
		console.log("Subscribed:", email);
		setEmail("");
	};

	return (
		<form onSubmit={handleSubmit} className="mt-4">
			<div className="flex flex-col sm:flex-row gap-2">
				<input
					type="email"
					value={email}
					onChange={(e: { target: { value: string } }) =>
						setEmail(e.target.value)
					}
					placeholder="Enter your email"
					className="flex-grow px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
					required
				/>
				<motion.button
					type="submit"
					className="px-4 py-2 text-white bg-slate-900 rounded-md hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					Subscribe
				</motion.button>
			</div>
		</form>
	);
};

export function Footer() {
	return (
		<footer className="bg-gray-50 text-gray-700 border-t border-gray-200">
			<div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
					<div className="col-span-1 lg:col-span-2">
						<img
							src={gradhunt}
							alt="GradHunt Logo"
							className="h-12 w-auto mb-4"
						/>
						<p className="text-base text-gray-500 mb-4">
							Where Graduates Meet Employers. Start Your Professional Journey
							Today
						</p>
						<div className="flex space-x-4 mb-4">
							{socialLinks.map(({ icon: Icon, label, href }) => (
								<motion.a
									key={label}
									href={href}
									aria-label={label}
									className="text-gray-400 hover:text-slate-800 transition-colors duration-300"
									whileHover={{ scale: 1.2, rotate: 5 }}
									whileTap={{ scale: 0.8 }}
								>
									<Icon className="h-6 w-6" />
								</motion.a>
							))}
						</div>
						<NewsletterForm />
					</div>
					{footerSections.map(({ title, items }) => (
						<div key={title}>
							<h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
								{title}
							</h3>
							<ul className="space-y-2">
								{items.map((item) => (
									<li key={item}>
										<AnimatedLink href="#">{item}</AnimatedLink>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<div className="mt-12 border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center">
					<p className="text-base text-gray-400">
						&copy; 2024 GradHunt Inc. All rights reserved
					</p>
					<div className="mt-4 sm:mt-0">
						<AnimatedLink href="#">Privacy Policy</AnimatedLink>
						<span className="mx-2 text-gray-300">|</span>
						<AnimatedLink href="#">Terms of Service</AnimatedLink>
					</div>
				</div>
			</div>
		</footer>
	);
}
