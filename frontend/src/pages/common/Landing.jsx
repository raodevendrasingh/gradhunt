// external libraries
import { Link } from "react-router-dom";

// components
import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import FAQAccordion from "@/components/layouts/FAQAccordion";
import { UsernameInput } from "@/components/ui/UserrnameInput";

// helper functions
import faqItems from "@/utils/faqItems";

export const LandingPage = () => {
	return (
		<>
			<Header />
			<section className="relative isolate z-0 bg-white px-6 pt-10 lg:px-8 min-h-screen ">
				<div className="relative w-full h-screen overflow-hidden">
					{/* Grid pattern with elliptical mask */}
					<div
						className="absolute inset-0 
                      [background-image:linear-gradient(to_right,#8ecf90_1px,transparent_1px),linear-gradient(to_bottom,#8ecf90_1px,transparent_1px)] 
                      [background-size:3rem_3rem] 
                      [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_70%)] 
                      [webkit-mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_70%)]"
					></div>
					{/* badge */}
					<div className="flex justify-center mt-20">
						<span className=" relative inline-flex justify-center items-center rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
							In Development
						</span>
					</div>
					{/* Content container */}
					<div className="relative mx-auto max-w-2xl pt-16">
						<div className="absolute inset-x-0 -top-[4rem] -z-10 transform-gpu overflow-hidden blur-3xl md:-top-[10rem]">
							<svg
								className="relative left-[calc(50%-11rem)] -z-10 h-96 max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
								viewBox="0 0 1155 678"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
									fillOpacity=".3"
									d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
								/>
								<defs>
									<linearGradient
										id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
										x1="1155.49"
										x2="-78.208"
										y1=".177"
										y2="474.645"
										gradientUnits="userSpaceOnUse"
									>
										<stop stopColor="#95fc9d" />
										<stop offset={1} stopColor="#f0f0f0" />
									</linearGradient>
								</defs>
							</svg>
						</div>

						<div className=" flex flex-col justify-center">
							<div>
								<h1 className="select-none font-extrabold tracking-tight text-zinc-800 sm:text-6xl text-center">
									Gradhunt is More Than Just An Online Resume
								</h1>
								<h5 className="mt-9 text-xl font-medium leading-8 text-gray-700 select-none text-center">
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

			<section className="py-10 bg-white sm:py-16 lg:py-24">
				<div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="max-w-2xl mx-auto text-center">
						<h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
							How does it work?
						</h2>
						<p className="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">
							Amet minim mollit non deserunt ullamco est sit aliqua dolor do
							amet sint. Velit officia consequat duis.
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
									<span className="text-xl font-semibold text-gray-700">
										{" "}
										1{" "}
									</span>
								</div>
								<h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
									Create a free account
								</h3>
								<p className="mt-4 text-base text-gray-600">
									Amet minim mollit non deserunt ullamco est sit aliqua dolor do
									amet sint. Velit officia consequat duis enim velit mollit.
								</p>
							</div>

							<div>
								<div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
									<span className="text-xl font-semibold text-gray-700">
										{" "}
										2{" "}
									</span>
								</div>
								<h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
									Build your Profile
								</h3>
								<p className="mt-4 text-base text-gray-600">
									Amet minim mollit non deserunt ullamco est sit aliqua dolor do
									amet sint. Velit officia consequat duis enim velit mollit.
								</p>
							</div>

							<div>
								<div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
									<span className="text-xl font-semibold text-gray-700">
										{" "}
										3{" "}
									</span>
								</div>
								<h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
									Make it Public
								</h3>
								<p className="mt-4 text-base text-gray-600">
									Amet minim mollit non deserunt ullamco est sit aliqua dolor do
									amet sint. Velit officia consequat duis enim velit mollit.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="min-h-[80vh] pt-20 md:pt-24 border-t-[1px]">
				<FAQAccordion faqItems={faqItems} />
			</section>

			<Footer />
		</>
	);
};
