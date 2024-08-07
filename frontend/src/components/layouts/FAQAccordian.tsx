import React, { useState } from "react";
import faqItems from "@/utils/faqItems";

interface FAQItem {
	id: string;
	question: string;
	answer: string;
}

const FAQAccordion: React.FC<{ item: FAQItem }> = ({ item }) => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<li className="text-left">
			<label htmlFor={`accordion-${item.id}`} className="flex flex-col">
				<input
					className="peer hidden"
					type="checkbox"
					id={`accordion-${item.id}`}
					checked={isOpen}
					onChange={() => setIsOpen(!isOpen)}
				/>
				<div className="before:absolute before:-left-6 before:block before:text-xl before:text-blue-400 before:content-['–'] peer-checked:before:content-['+'] relative ml-4 cursor-pointer select-none items-center py-4 pr-2">
					<h3 className="text-sm lg:text-base">{item.question}</h3>
				</div>
				<div className={isOpen ? "hidden" : "pr-2"}>
					<div className="pb-5">
						<p
							className="text-sm"
							dangerouslySetInnerHTML={{ __html: item.answer }}
						/>
					</div>
				</div>
			</label>
		</li>
	);
};

export const FAQSection: React.FC = () => {
	return (
		<div className="relative mx-auto w-full px-5 py-16 text-gray-800 sm:px-20 md:max-w-screen-lg lg:py-24">
			<h2 className="mb-5 text-4xl text-center  sm:text-5xl">
				Have Questions? Checkout these FAQs
			</h2>
			<p className="mb-12 text-center text-lg text-gray-600">
				We have written down answers to some of the frequently asked questions.
				But, if you still have any queries, feel free to ping us our social media.
			</p>
			<ul className="divide-y divide-gray-200">
				{faqItems.map((item, index) => (
					<React.Fragment key={item.id}>
						{index > 0 && <hr className="border-gray-100" />}
						<FAQAccordion item={item} />
					</React.Fragment>
				))}
			</ul>
			<div className="mt-20 flex justify-center">
				<a
					className="inline-flex cursor-pointer rounded-full bg-zinc-800 px-5 py-4 text-white"
					href="#"
				>
					Still have a question? Ping us on our social media
				</a>
			</div>
		</div>
	);
};

