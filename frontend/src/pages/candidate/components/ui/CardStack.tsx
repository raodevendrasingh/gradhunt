import React, { useState } from "react";
import { motion, AnimatePresence, MotionStyle } from "framer-motion";
import move from "lodash-move";
import { BsArrowRight } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi2";

const CARD_DETAILS = [
	{
		color: "#F4F5FA",
		title: "Complete Profile Setup",
		content: "Add all the section of the profile",
	},
	{
		color: "#F8F8FF",
		title: "Add your Background",
		content: "Include your academic and professional details.",
	},
	{
		color: "#F0FFFF",
		title: "Apply for Positions",
		content: "Search for jobs that suit your skills and apply.",
	},
];
const CARD_OFFSET = 15;
const SCALE_FACTOR = 0.009;

export const CardStack = () => {
	const [cards, setCards] = useState(CARD_DETAILS);

	const moveToEnd = () => {
		setCards((prevCards) => move(prevCards, 0, prevCards.length - 1));
	};

	return (
		<div className="relative flex flex-col gap-3">
			<div className="flex font-lg font-medium  justify-center items-center gap-2">
				Recommendations
				<span>
					<HiSparkles />
				</span>
			</div>
			<ul className=" mt-5">
				<AnimatePresence>
					{cards.map((card, index) => (
						<motion.li
							key={card.color}
							className="absolute border border-gray-300 hover:border-gray-600 w-[100%] h-[130px] rounded-lg list-none"
							style={{
								backgroundColor: card.color,
							}}
							initial={{
								scale: 1 - index * SCALE_FACTOR,
								y: index * -CARD_OFFSET,
							}}
							animate={{
								scale: 1 - index * SCALE_FACTOR,
								y: index * -CARD_OFFSET,
								zIndex: cards.length - index,
							}}
							exit={{
								scale: 1 - (cards.length - 1) * SCALE_FACTOR,
								y: (cards.length - 1) * -CARD_OFFSET,
								zIndex: 1,
							}}
							transition={{ duration: 0.3 }}
						>
							{index === 0 && (
								<>
									<div className="p-3 select-none">
										<span className="text-lg font-semibold pb-3">
											{card.title}
										</span>
										<p className="text-xs font-normal ">{card.content}</p>
									</div>
									<button
										onClick={moveToEnd}
										className="absolute bottom-4 right-4"
									>
										<BsArrowRight className="size-7 text-black" />
									</button>
								</>
							)}
						</motion.li>
					))}
				</AnimatePresence>
			</ul>
		</div>
	);
};
