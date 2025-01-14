import {
	Dispatch,
	SetStateAction,
	useState,
	DragEvent as ReactDragEvent,
	TouchEvent,
	Fragment,
	useEffect,
} from "react";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import { LuUser, LuMail, LuMapPin, LuDot } from "react-icons/lu";
import { useFetchJobApplicants } from "@/hooks/jobs/useFetchJobApplicants";
import { timesAgo } from "@/utils/DaysAgo";
import { Applicant } from "@/types/userTypes";
import { GoArrowUpRight } from "react-icons/go";
import { FaUserLargeSlash } from "react-icons/fa6";
import { daysRemaining } from "@/utils/DaysRemaining";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { apiUrl } from "@/modal-forms/profile/OnboardingModal";

type ColumnType =
	| "applied"
	| "shortlisted"
	| "interviewScheduled"
	| "matched"
	| "rejected";

type CardType = {
	id: string;
	column: ColumnType;
	applicantData: Applicant["applicants"][0];
};

export const formatLocation = (location: string) => {
	const parts = location?.split(",");
	if (!parts) return "";
	return `${parts[0]} (${parts[2]?.split(" ")[1]})`;
};

export default function JobApplicantsPage() {
	const { data: applicationData, isLoading } = useFetchJobApplicants();

	return (
		<div className="flex h-full">
			<div className="flex flex-col w-full overflow-y-auto scrollbar-hide p-4">
				<div className="flex flex-col gap-4 p-2 mb-2 bg-slate-50 rounded-lg">
					<div className="flex items-center justify-between">
						<div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
							<div>
								{applicationData ? (
									<h1 className="text-2xl font-semibold text-gray-800 whitespace-nowrap">
										{applicationData.jobTitle}
									</h1>
								) : (
									<div className="h-8 w-44 skeleton" />
								)}
							</div>
							<div className="flex justify-start sm:items-center w-full">
								<span className="text-sm text-neutral-500 mr-2">
									JobId:
								</span>
								{applicationData ? (
									<span className="text-sm font-mono text-neutral-600">
										{applicationData.jobId}
									</span>
								) : (
									<span className="h-4 w-20 skeleton" />
								)}
							</div>
						</div>
						<div className="">
							{applicationData ? (
								<span
									className={`text-sm px-3 py-0.5 rounded-full ${
										applicationData.isActive
											? "bg-emerald-50 text-green-700 border border-green-300"
											: "bg-red-50 text-red-700 border border-red-300"
									}`}
								>
									{applicationData.isActive
										? "Active"
										: "Inactive"}
								</span>
							) : (
								<div className="h-6 w-20 skeleton rounded-full" />
							)}
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							{applicationData ? (
								<div className="flex justify-start w-full flex-col sm:flex-row sm:items-center ">
									<div className="flex items-center">
										<span className="text-sm text-neutral-600">
											{applicationData.jobType}
										</span>
										<LuDot className="flex  sm:size-8 text-slate-600" />
										<span className="text-sm text-neutral-600">
											{applicationData.workType}
										</span>
									</div>
									<LuDot className=" hidden sm:flex size-8 text-slate-600" />

									<span className="text-sm text-neutral-600">
										{formatLocation(
											applicationData.jobLocation
										)}
									</span>
								</div>
							) : (
								<div className="flex justify-start gap-2 w-full flex-col sm:flex-row sm:items-center ">
									<span className="h-4 w-20 skeleton" />
									<span className="h-4 w-20 skeleton" />
									<span className="h-4 w-20 skeleton" />
								</div>
							)}
						</div>
						<div className="flex h-full flex-col sm:flex-row sm:gap-0 sm:items-center">
							<div className="flex items-center text-sm text-neutral-600">
								<span className="text-neutral-500 mr-1">
									Posted
								</span>
								{applicationData ? (
									<span>
										{timesAgo(applicationData.postedDate)}
									</span>
								) : (
									<div className="h-4 w-20 skeleton" />
								)}
							</div>
							<LuDot className=" hidden sm:flex size-8 text-slate-600" />
							<div className="flex items-center text-sm text-neutral-600">
								<span className="text-neutral-500 mr-1">
									Deadline
								</span>
								{applicationData ? (
									<span>
										{daysRemaining(
											applicationData.applicationDeadline
										)}
									</span>
								) : (
									<div className="h-4 w-20 skeleton" />
								)}
							</div>
						</div>
					</div>
				</div>
				<Board
					applicationData={applicationData}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
}

const Board = ({
	applicationData,
	isLoading,
}: {
	applicationData: Applicant | undefined;
	isLoading: boolean;
}) => {
	const [cards, setCards] = useState<CardType[]>([]);

	useEffect(() => {
		if (applicationData?.applicants) {
			const initialCards: CardType[] = applicationData.applicants.map(
				(applicant) => ({
					id: applicant.id.toString(),
					column: applicant.status as ColumnType,
					applicantData: applicant,
				})
			);
			setCards(initialCards);
		}
	}, [applicationData]);

	return (
		<div className="flex h-full w-full gap-3 overflow-scroll">
			<Column
				title="Applied"
				column="applied"
				headingColor="text-neutral-500"
				tabColor="bg-neutral-100"
				cards={cards}
				setCards={setCards}
			/>
			<Column
				title="Shortlisted"
				column="shortlisted"
				headingColor="text-orange-600"
				tabColor="bg-orange-100"
				cards={cards}
				setCards={setCards}
			/>
			<Column
				title="Schedule Interview"
				column="interviewScheduled"
				headingColor="text-blue-600"
				tabColor="bg-blue-100"
				cards={cards}
				setCards={setCards}
			/>
			<Column
				title="Matched"
				column="matched"
				headingColor="text-emerald-600"
				tabColor="bg-emerald-100"
				cards={cards}
				setCards={setCards}
			/>
			<RejectContainer setCards={setCards} />
		</div>
	);
};

const handleApplicationStatusChange = async (
	applicantId: number,
	newStatus: ColumnType,
	token: string | null
) => {
	try {
		if (!token) {
			return "User Unauthorized!";
		}
		const url = `${apiUrl}/api/application/${applicantId}`;
		await axios.patch(
			url,
			{ newStatus },
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
	} catch (error) {
		console.log(error);
		toast.error("Failed to update application status");
	}
};

type ColumnProps = {
	title: string;
	headingColor: string;
	tabColor: string;
	cards: CardType[];
	column: ColumnType;
	setCards: Dispatch<SetStateAction<CardType[]>>;
};

const Column = ({
	title,
	headingColor,
	tabColor,
	cards,
	column,
	setCards,
}: ColumnProps) => {
	const [active, setActive] = useState(false);
	const { getToken } = useAuth();

	const handleDragStart = (e: ReactDragEvent, card: CardType) => {
		e.dataTransfer.setData("cardId", card.id);
	};

	const handleDragEnd = async (e: ReactDragEvent) => {
		const cardId = e.dataTransfer.getData("cardId");
		const token = await getToken();

		setActive(false);
		clearHighlights();

		const indicators = getIndicators();
		const { element } = getNearestIndicator(e as any, indicators);

		const before = element.dataset.before || "-1";

		if (before !== cardId) {
			let copy = [...cards];

			let cardToTransfer = copy.find((c) => c.id === cardId);
			if (!cardToTransfer) return;
			cardToTransfer = { ...cardToTransfer, column };

			copy = copy.filter((c) => c.id !== cardId);

			const moveToBack = before === "-1";

			if (moveToBack) {
				copy.push(cardToTransfer);
			} else {
				const insertAtIndex = copy.findIndex((el) => el.id === before);
				if (insertAtIndex === undefined) return;

				copy.splice(insertAtIndex, 0, cardToTransfer);
			}

			handleApplicationStatusChange(
				cardToTransfer.applicantData.id,
				column,
				token
			);

			setCards(copy);
		}
	};

	const handleDragOver = (e: ReactDragEvent) => {
		e.preventDefault();
		highlightIndicator(e as any);
		setActive(true);
	};

	const clearHighlights = (els?: HTMLElement[]) => {
		const indicators = els || getIndicators();
		indicators.forEach((i) => {
			i.style.opacity = "0";
		});
	};

	const highlightIndicator = (e: DragEvent) => {
		const indicators = getIndicators();
		clearHighlights(indicators);
		const el = getNearestIndicator(e, indicators);
		el.element.style.opacity = "1";
	};

	const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
		const DISTANCE_OFFSET = 50;
		const el = indicators.reduce(
			(closest, child) => {
				const box = child.getBoundingClientRect();
				const offset = e.clientY - (box.top + DISTANCE_OFFSET);
				if (offset < 0 && offset > closest.offset) {
					return { offset: offset, element: child };
				} else {
					return closest;
				}
			},
			{
				offset: Number.NEGATIVE_INFINITY,
				element: indicators[indicators.length - 1],
			}
		);
		return el;
	};

	const getIndicators = () => {
		return Array.from(
			document.querySelectorAll(
				`[data-column="${column}"]`
			) as unknown as HTMLElement[]
		);
	};

	const handleDragLeave = () => {
		clearHighlights();
		setActive(false);
	};

	const filteredCards = cards.filter((c) => c.column === column);

	return (
		<div className="w-64 shrink-0">
			<div
				className={`mb-3 flex items-center justify-between px-2 rounded-lg py-1 ${tabColor}`}
			>
				<h3 className={`font-medium ${headingColor}`}>{title}</h3>
				<span className={`rounded text-sm ${headingColor}`}>
					{filteredCards.length}
				</span>
			</div>
			<div
				onDrop={handleDragEnd}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				className={`h-full w-full transition-colors p-1 rounded-lg bg-slate-50 ${
					active ? "bg-black/5" : "bg-slate-100"
				}`}
			>
				<div className="flex flex-col gap-2">
					{filteredCards.map((card) => (
						<Fragment key={card.id}>
							<DropIndicator beforeId={card.id} column={column} />
							<CandidateCard
								{...card}
								handleDragStart={handleDragStart}
							/>
						</Fragment>
					))}
					<DropIndicator beforeId={null} column={column} />
				</div>
			</div>
		</div>
	);
};

type CardProps = CardType & {
	handleDragStart: (
		e: ReactDragEvent<HTMLDivElement>,
		card: CardType
	) => void;
};

const CandidateCard = ({
	id,
	column,
	applicantData,
	handleDragStart,
}: CardProps) => {
	const [isDragging, setIsDragging] = useState(false);
	const [touchTimeout, setTouchTimeout] = useState<NodeJS.Timeout | null>(
		null
	);
	const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });

	const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
		const touch = e.touches[0];
		setTouchStartPos({ x: touch.clientX, y: touch.clientY });

		const timeout = setTimeout(() => {
			setIsDragging(true);
			e.currentTarget.style.opacity = "1";
			e.currentTarget.style.transform = "scale(1.02)";
		}, 500);

		setTouchTimeout(timeout);
	};

	const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
		if (!isDragging) {
			// Cancel drag if moved before timeout
			if (touchTimeout) {
				clearTimeout(touchTimeout);
				setTouchTimeout(null);
			}
			return;
		}

		const touch = e.touches[0];
		const deltaX = touch.clientX - touchStartPos.x;
		const deltaY = touch.clientY - touchStartPos.y;

		e.currentTarget.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
	};

	const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
		if (touchTimeout) {
			clearTimeout(touchTimeout);
			setTouchTimeout(null);
		}

		if (isDragging) {
			setIsDragging(false);
			e.currentTarget.style.opacity = "1";
			e.currentTarget.style.transform = "none";

			// Get the element under the touch point
			const touch = e.changedTouches[0];
			const elemBelow = document.elementFromPoint(
				touch.clientX,
				touch.clientY
			);

			// Find the nearest column
			const column = elemBelow?.closest("[data-column]");
			if (column) {
				const columnType = column.getAttribute(
					"data-column"
				) as ColumnType;
				// Create a synthetic drag event
				const syntheticEvent = new DragEvent("drop", {
					bubbles: true,
					cancelable: true,
					dataTransfer: new DataTransfer(),
				});
				if (syntheticEvent.dataTransfer) {
					syntheticEvent.dataTransfer.setData("cardId", id);
					column.dispatchEvent(syntheticEvent);
				}
			}
		}
	};

	const handleViewProfile = () => {
		if (!isDragging) {
			window.open(`/p/${applicantData.candidate.username}`, "_blank");
		}
	};

	const handleViewResume = () => {
		if (!isDragging && applicantData.candidate.resumeLink) {
			window.open(applicantData.candidate.resumeLink, "_blank");
		}
	};

	return (
		<motion.div
			layout
			layoutId={id}
			draggable="true"
			onDragStart={(e) =>
				handleDragStart(e as any, { id, column, applicantData })
			}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			style={{ opacity: 1 }}
			className={`cursor-grab rounded-lg border border-gray-200 bg-white p-4 active:cursor-grabbing touch-none
          ${isDragging ? "shadow-lg z-50" : ""}`}
		>
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-2">
					<LuUser className="text-gray-600" />
					<h3 className="font-medium text-gray-800">
						{applicantData.candidate.firstname}{" "}
						{applicantData.candidate.lastname}
					</h3>
				</div>

				<div className="flex items-center gap-2 text-sm text-gray-600">
					<LuMail className="shrink-0" />
					<span className="truncate">
						{applicantData.candidate.email}
					</span>
				</div>

				<div className="flex items-center gap-2 text-sm text-gray-600">
					<LuMapPin className="shrink-0" />
					<span className="truncate">
						{applicantData.candidate.location}
					</span>
				</div>

				<div className="flex gap-2 mt-2 w-full">
					<button
						onClick={handleViewProfile}
						className="flex items-center justify-center w-1/2 gap-1 rounded-lg bg-slate-100 px-2 py-1 text-sm font-medium text-gray-700 hover:bg-slate-200 transition-colors"
					>
						Profile
						<GoArrowUpRight className="h-4 w-4" />
					</button>

					{applicantData.candidate.resumeLink && (
						<button
							onClick={handleViewResume}
							className="flex items-center justify-center gap-1 w-1/2 rounded-lg bg-slate-100 px-2 py-1 text-sm font-medium text-gray-700 hover:bg-slate-200 transition-colors"
						>
							Resume
							<GoArrowUpRight className="h-4 w-4" />
						</button>
					)}
				</div>
			</div>
		</motion.div>
	);
};

type DropIndicatorProps = {
	beforeId: string | null;
	column: string;
};

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
	return (
		<div
			data-before={beforeId || "-1"}
			data-column={column}
			className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
		/>
	);
};

const RejectContainer = ({
	setCards,
}: {
	setCards: Dispatch<SetStateAction<CardType[]>>;
}) => {
	const [active, setActive] = useState(false);
	const { getToken } = useAuth();

	const handleDragOver = (e: ReactDragEvent) => {
		e.preventDefault();
		setActive(true);
	};

	const handleDragLeave = () => {
		setActive(false);
	};

	const handleDragEnd = async (e: ReactDragEvent) => {
		const cardId = e.dataTransfer.getData("cardId");
		const token = await getToken();
		setCards((pv) => pv.filter((c) => c.id !== cardId));
		handleApplicationStatusChange(parseInt(cardId), "rejected", token);
		toast.success("Candidate Rejected");
		setActive(false);
	};

	return (
		<div className="flex flex-col">
			<div
				className={`mb-3 flex items-center justify-center px-2 rounded-lg py-1 bg-rose-100`}
			>
				<h3 className="font-medium text-red-500">Reject</h3>
			</div>
			<div
				onDrop={handleDragEnd}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				className={`grid h-full w-40 shrink-0 place-content-center rounded-lg border text-3xl ${
					active
						? "border-red-500 bg-red-300 text-red-500"
						: "border-rose-300 bg-rose-100 text-neutral-500"
				}`}
			>
				{active ? (
					<FaFire className="animate-bounce" />
				) : (
					<FaUserLargeSlash />
				)}
			</div>
		</div>
	);
};
