// external libraries
import { Link, useNavigate } from "react-router-dom";

// components

import { Footer } from "@/components/common/Footer";
import { UsernameInput } from "@/components/ui/UsernameInput";

// icons
import { GoDotFill } from "react-icons/go";

// helper functions
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { FAQSection } from "@/components/layouts/FAQAccordian";
import Navbar from "@/components/common/Navbar";

export const LandingPage = () => {
	const { isSignedIn, user } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (isSignedIn) {
			navigate("/job-search");
		}
	}, [user]);

	return (
        
		<div className="max-w-screen-2xl mx-auto overflow-hidden">
            {/* <Navbar /> */}
			{/* Added overflow-hidden */}
			<section className="relative isolate z-0 px-6 pt-8 lg:px-8 min-h-screen max-w-full">
				<div className="relative w-full h-screen overflow-hidden">
					<div
						className="absolute inset-0 

                      [background-image:linear-gradient(to_right,#a4eddb_1px,transparent_1px),linear-gradient(to_bottom,#fad2d2_1px,transparent_1px)] 
                      [background-size:3rem_3rem] 

                      [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_70%)] 
                      [webkit-mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_70%)]"
					></div>

					{/* badge */}
					<div className="flex justify-center mt-20 select-none">
						<span className=" relative inline-flex justify-center items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700">
							<GoDotFill className="size-3 text-rose-600" />
							<span>In Development</span>
						</span>
					</div>

					{/* Content container */}
					<div className="relative mx-auto max-w-2xl pt-5 lg:pt-10 select-none">
						<div className="flex flex-col justify-center">
							<div className="relative">
								<h1 className="mt-5 text-5xl font-bold text-center leading-tight text-gray-900 sm:leading-tight sm:text-6xl lg:leading-tight">
									Gradhunt is More Than Just An Online Resume
								</h1>
								<h5 className="mt-9 text-lg font-medium leading-8 text-gray-500 select-none text-center">
									We provide a seamless experience for job seekers and hiring
									managers, making the recruitment process efficient and
									effective.
								</h5>
							</div>
							<UsernameInput />
						</div>
					</div>
				</div>
			</section>
			{/* profile showcase section */}
			<section className="bg-white select-none">
				<div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="max-w-2xl mx-auto text-center">
						<h1 className="px-6 text-lg text-gray-600 font-inter">
							Smart Job Portal, developed for the New Age
						</h1>
						<p className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:leading-tight">
							Unveil your skills with a dynamic bento grid profile
						</p>
					</div>
				</div>
				<div className="pb-12 bg-white">
					<div className="relative">
						<div className="absolute inset-0 h-2/3 bg-white"></div>

						<div className="relative mx-auto">
							<div className="lg:max-w-6xl lg:mx-auto">
								<img
									className="transform scale-110"
									src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/2/illustration.png"
									alt=""
								/>
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* how it works section */}
			<section className="py-10 bg-white sm:py-16 lg:py-24 select-none">
				<div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="max-w-2xl mx-auto text-center">
						<h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
							How does it work?
						</h2>

						<p className="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">
							In Three Steps, Smart To Sucess
						</p>
					</div>

					<div className="relative mt-12 lg:mt-20">
						<div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
							<img
								className="w-full"
								src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg"
								alt=""
							/>
						</div>

						<div className="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12">
							<div>
								<div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
									<span className="text-xl font-semibold text-gray-700">1</span>
								</div>
								<h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
									Create a free account
								</h3>
								<p className="mt-4 text-base text-gray-600">
									Dive into a world of opportunities by signing up for your free
									account today. No hidden fees, just endless possibilities.
								</p>
							</div>

							<div>
								<div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
									<span className="text-xl font-semibold text-gray-700">2</span>
								</div>

								<h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
									Build your Profile
								</h3>

								<p className="mt-4 text-base text-gray-600">
									Showcase your unique skills and experiences by crafting a
									profile that stands out in the crowd. Let your talents shine.
								</p>
							</div>

							<div>
								<div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
									<span className="text-xl font-semibold text-gray-700">3</span>
								</div>
								<h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
									Make it Public
								</h3>

								<p className="mt-4 text-base text-gray-600">
									Amplify your reach by making your profile public. Connect with
									opportunities and let the world discover your potential.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* explore jobs sections */}
			<section>
				<div className="relative bg-white">
					<section className="relative py-12 sm:py-16 lg:pt-20 lg:pb-36">
						<div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
							<div className="grid grid-cols-1 gap-y-8 lg:items-center lg:grid-cols-2 sm:gap-y-20 xl:grid-cols-5">
								<div className="text-center xl:col-span-2 lg:text-left md:px-16 lg:px-0">
									<div className="max-w-sm mx-auto sm:max-w-md md:max-w-full">
										<h1 className="text-4xl select-none font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:leading-tight ">
											Craft your Path, Discover Jobs that{" "}
											<span className="relative inline-flex sm:inline">
												<span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>

												<span className="relative"> Match </span>
											</span>{" "}
											your Skills
										</h1>
									</div>

                                    <div className="mt-8 sm:flex sm:items-center sm:justify-center lg:justify-start sm:space-x-5 lg:mt-12">
										<Link
											to="/job-search"
											onClick={() => {
												window.scrollTo({
													top: 0,
													behavior: "smooth",
												});
											}}
											className="inline-flex items-center px-6 py-3 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 font-pj justif-center hover:bg-gray-600"
											role="button"
										>
											Explore Jobs
										</Link>
									</div>
								</div>

								<div className="xl:col-span-3">
									<img
										className="w-full mx-auto scale-110"
										src="https://d33wubrfki0l68.cloudfront.net/29c501c64b21014b3f2e225abe02fe31fd8f3a5c/f866d/images/hero/3/illustration.png"
										alt=""
									/>
								</div>
							</div>
						</div>
					</section>
				</div>
			</section>
			{/* faq section */}
			<section className="min-h-[60vh] flex items-center justify-center pt-20 md:pt-12 border-t">
				<FAQSection />
			</section>
			<Footer />
		</div>
	);
};
