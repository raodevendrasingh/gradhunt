/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

const FAQAccordion = ({ faqItems }) => {
	const [openItemId, setOpenItemId] = useState(null);

	const toggleItem = (itemId) => {
		setOpenItemId(openItemId === itemId ? null : itemId);
	};

	return (
		<div className="max-w-[350px] sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl mx-auto">
			<h1 className="text-center text-4xl pb-16">Frequently Asked Questions</h1>
			<div className="flex flex-col gap-1">
				{faqItems.map((item, index) => (
					<div
						key={item.id}
						className=" bg-gray-50 rounded-lg gap-1"
					>
						<h2 className="mb-0" id={`heading${item.id}`}>
							<button
								className={`${
									openItemId === item.id
										? `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
										: ""
								} group relative flex w-full items-center border-0 px-5 py-4 text-left text-lg text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800`}
								type="button"
								onClick={() => toggleItem(item.id)}
								aria-expanded={openItemId === item.id ? "true" : "false"}
								aria-controls={`collapse${item.id}`}
							>
								{item.question}
								<span className="ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300">
									{openItemId === item.id ? (
										<FaChevronUp className="h-5 w-5 fill-current text-[#212529]" />
									) : (
										<FaChevronDown className="h-5 w-5 fill-current text-[#212529]" />
									)}
								</span>
							</button>
						</h2>
						{openItemId === item.id && (
							<div className="px-5 py-4  border-t-2 border-slate-100">{item.answer}</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default FAQAccordion;
