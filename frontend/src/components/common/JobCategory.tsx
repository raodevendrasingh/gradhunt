import { Link } from "react-router-dom";
import { HiOutlineHomeModern, HiChevronRight } from "react-icons/hi2";
import { CiBank } from "react-icons/ci";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { GoRocket } from "react-icons/go";
import { FaCode } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import { MdOutlinePalette } from "react-icons/md";
import { PiGraduationCap } from "react-icons/pi";
import { FiTool } from "react-icons/fi";
import { TfiWorld } from "react-icons/tfi";
import { IconWrapper } from "@/components/layouts/IconWrapper";

interface Category {
	name: string;
	Icon: React.ComponentType;
	bgColor: string;
	textColor: string;
	href: string;
}

const categories: Category[] = [
	{
		name: "Remote",
		Icon: HiOutlineHomeModern,
		bgColor: "bg-blue-100",
		textColor: "text-blue-500",
		href: "#",
	},
	{
		name: "Finance",
		Icon: CiBank,
		bgColor: "bg-yellow-100",
		textColor: "text-yellow-600",
		href: "#",
	},
	{
		name: "MNCs",
		Icon: TbBuildingSkyscraper,
		bgColor: "bg-teal-100",
		textColor: "text-teal-500",
		href: "#",
	},
	{
		name: "Startups",
		Icon: GoRocket,
		bgColor: "bg-rose-100",
		textColor: "text-rose-500",
		href: "#",
	},
	{
		name: "Software",
		Icon: FaCode,
		bgColor: "bg-green-100",
		textColor: "text-green-500",
		href: "#",
	},
	{
		name: "HR",
		Icon: BsPeople,
		bgColor: "bg-fuchsia-100",
		textColor: "text-fuchsia-500",
		href: "#",
	},
	{
		name: "Designing",
		Icon: MdOutlinePalette,
		bgColor: "bg-indigo-100",
		textColor: "text-indigo-500",
		href: "#",
	},
	{
		name: "Fresher",
		Icon: PiGraduationCap,
		bgColor: "bg-orange-100",
		textColor: "text-orange-500",
		href: "3",
	},
	{
		name: "Engineering",
		Icon: FiTool,
		bgColor: "bg-gray-100",
		textColor: "text-gray-500",
		href: "#",
	},
	{
		name: "InfoTech",
		Icon: TfiWorld,
		bgColor: "bg-purple-100",
		textColor: "text-purple-500",
		href: "#",
	},
];

export const JobCategories = () => (
	<div className="flex flex-col w-full mx-auto py-10 max-w-7xl">
		<h2 className="text-2xl font-semibold text-zinc-800 text-center pb-10">
			Search by Categories
		</h2>
		<div className="flex flex-wrap w-full mx-auto items-center justify-center p-4 gap-5">
			{categories.map((category) => (
				<Link
					to={category.href} key={category.name}
					className="flex justify-between items-center gap-3 rounded-2xl px-3 h-20 w-[200px] border hover:shadow-lg transition duration-150 cursor-pointer bg-gray-50"
				>
					<span className="w-[20%]">
						<IconWrapper
							Icon={category.Icon}
							className={`size-9 ${category.bgColor} ${category.textColor} p-2 rounded-full`}
						/>
					</span>
					<span className="w-[65%] text-lg font-medium overflow-hidden text-zinc-800">
						{category.name}
					</span>
					<span className="w-[15%]">
						<HiChevronRight className="size-5 text-gray-600" />
					</span>
				</Link>
			))}
		</div>
	</div>
);
