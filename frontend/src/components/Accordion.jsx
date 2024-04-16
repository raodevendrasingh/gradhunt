import { useState } from "react";
import { TECollapse } from "tw-elements-react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

export const Accordion = () => {
	const [activeElement, setActiveElement] = useState("");

	const handleClick = (value) => {
		if (value === activeElement) {
			setActiveElement("");
		} else {
			setActiveElement(value);
		}
	};
	return (
		<>
			<div className=" max-w-[350px] sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl mx-auto ">
				<h1 className="text-center text-4xl pb-16 ">
					Frequently Asked Questions
				</h1>
				<div className="rounded-t-lg border border-neutral-200  bg-gray-50 dark:border-neutral-600 dark:bg-neutral-800">
					<h2 className="mb-0" id="headingOne">
						<button
							className={`${
								activeElement === "element1" &&
								`text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
							} group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 `}
							type="button"
							onClick={() => handleClick("element1")}
							aria-expanded="true"
							aria-controls="collapseOne"
						>
							How do I create an account?
							<span
								className={`ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
							>
								{activeElement === "element1" ? (
									<FaChevronUp className="h-5 w-5 fill-current text-[#212529] " />
								) : (
									<FaChevronDown className="h-5 w-5 fill-current text-[#212529] " />
								)}
							</span>
						</button>
					</h2>
					<TECollapse
						show={activeElement === "element1"}
						className="!mt-0 !rounded-b-none !shadow-none"
					>
						<div className="px-5 py-4">
							Click on the &apos;Get Started&apos; button on the homepage and
							provide the necessary information. You&apos;ll need to confirm
							your email address to activate your account.
						</div>
					</TECollapse>
				</div>

				<div className="border border-t-0 border-neutral-200  bg-gray-50 dark:border-neutral-600 dark:bg-neutral-800">
					<h2 className="mb-0" id="headingTwo">
						<button
							className={`${
								activeElement === "element2"
									? `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
									: `transition-none rounded-b-[15px]`
							} group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 `}
							type="button"
							onClick={() => handleClick("element2")}
							aria-expanded="true"
							aria-controls="collapseOne"
						>
							How do I apply for a job?
							<span
								className={`ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
							>
								{activeElement === "element2" ? (
									<FaChevronUp className="h-5 w-5 fill-current text-[#212529] " />
								) : (
									<FaChevronDown className="h-5 w-5 fill-current text-[#212529] " />
								)}
							</span>
						</button>
					</h2>
					<TECollapse
						show={activeElement === "element2"}
						className="!mt-0 !rounded-b-none !shadow-none"
					>
						<div className="px-5 py-4">
							Click on the job post you&apos;re interested in and click the
							&apos;Apply&apos; button. You may need to provide additional
							information or upload a resume.
						</div>
					</TECollapse>
				</div>
				<div className="border border-t-0 border-neutral-200  bg-gray-50 dark:border-neutral-600 dark:bg-neutral-800">
					<h2 className="mb-0" id="headingTwo">
						<button
							className={`${
								activeElement === "element3"
									? `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
									: `transition-none rounded-b-[15px]`
							} group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 `}
							type="button"
							onClick={() => handleClick("element3")}
							aria-expanded="true"
							aria-controls="collapseOne"
						>
							How do I search for jobs?
							<span
								className={`ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
							>
								{activeElement === "element3" ? (
									<FaChevronUp className="h-5 w-5 fill-current text-[#212529] " />
								) : (
									<FaChevronDown className="h-5 w-5 fill-current text-[#212529] " />
								)}
							</span>
						</button>
					</h2>
					<TECollapse
						show={activeElement === "element3"}
						className="!mt-0 !rounded-b-none !shadow-none"
					>
						<div className="px-5 py-4">
							Use the search bar at the top of the page to search for jobs. You
							can filter jobs by keywords, location, and job type.
						</div>
					</TECollapse>
				</div>
				<div className="rounded-b-lg border border-t-0 border-neutral-200  bg-gray-50 dark:border-neutral-600 dark:bg-neutral-800">
					<h2 className="accordion-header mb-0" id="headingThree">
						<button
							className={`${
								activeElement === "element4"
									? `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
									: `transition-none rounded-b-[15px]`
							} group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 `}
							type="button"
							onClick={() => handleClick("element4")}
							aria-expanded="true"
							aria-controls="collapseOne"
						>
							Can I save jobs to apply for later?
							<span
								className={`ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
							>
								{activeElement === "element4" ? (
									<FaChevronUp className="h-5 w-5 fill-current text-[#212529] " />
								) : (
									<FaChevronDown className="h-5 w-5 fill-current text-[#212529] " />
								)}
							</span>
						</button>
					</h2>
					<TECollapse
						show={activeElement === "element4"}
						className="!mt-0 !shadow-none"
					>
						<div className="px-5 py-4">
							Yes, you can save jobs by clicking on the &apos;Save Job&apos;
							button on the job post. You can view your saved jobs in your
							account dashboard.
						</div>
					</TECollapse>
				</div>
			</div>
		</>
	);
};
