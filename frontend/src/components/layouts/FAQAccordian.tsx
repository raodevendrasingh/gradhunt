import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa6";
import faqItems from "@/utils/faqItems";

interface FAQItem {
	id: string;
	question: string;
	answer: string;
}

const FAQAccordion: React.FC<{ item: FAQItem }> = ({ item }) => {
	const [isOpen, setIsOpen] = useState(false);

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
				<div className="relative ml-4 cursor-pointer select-none items-center py-4 pr-2 flex gap-4">
					<motion.div
						initial={{ opacity: 0, rotate: -90 }}
						animate={{ opacity: 1, rotate: isOpen ? 0 : 90 }}
						transition={{ duration: 0.2 }}
						className="before:absolute before:block before:text-xl before:text-blue-400"
					>
						{isOpen ? (
							<FaMinus className="size-4" />
						) : (
							<FaPlus className="size-4" />
						)}
					</motion.div>
					<h3 className="text-sm lg:text-base">{item.question}</h3>
				</div>
				<motion.div
					initial={{ height: 0 }}
					animate={{ height: isOpen ? "auto" : 0 }}
					className="overflow-hidden pr-2"
				>
					<div className="pb-5">
						<p
							className="text-sm"
							dangerouslySetInnerHTML={{ __html: item.answer }}
						/>
					</div>
				</motion.div>
			</label>
		</li>
	);
};

export const FAQSection: React.FC = () => {
	return (
		<div className="relative mx-auto w-full px-5 py-20 text-gray-800 sm:px-20 md:max-w-screen-lg">
			<h2 className="mb-5 text-4xl text-center font-bold sm:text-5xl pb-14">
				Frequently Asked Questions
			</h2>

			<ul className="divide-y divide-gray-200">
				{faqItems.map((item, index) => (
					<React.Fragment key={item.id}>
						{index > 0 && <hr className="border-gray-100" />}
						<FAQAccordion item={item} />
					</React.Fragment>
				))}
			</ul>
		</div>
	);
};
