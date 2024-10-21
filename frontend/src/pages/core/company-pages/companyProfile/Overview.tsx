import { BiBriefcase } from 'react-icons/bi';
import { FiGlobe, FiPhone } from 'react-icons/fi';
import { HiOutlineBuildingOffice2, HiOutlineUsers } from 'react-icons/hi2';
import { LuCircleDollarSign, LuLineChart, LuWallet } from 'react-icons/lu';
import { MdEmail } from 'react-icons/md';
import { TbSeeding } from 'react-icons/tb';
import { useFetchCompanyProfileByName } from '@/hooks/useFetchCompanyProfileByName';

export const Overview = () => {
	const { data: companyProfile, isLoading } = useFetchCompanyProfileByName();

	const gridItems = [
		{
			label: "Company Email",
			icon: MdEmail,
			value: companyProfile?.companyEmail,
		},
		{
			label: "Company Phone",
			icon: FiPhone,
			value: companyProfile?.companyPhone,
		},
		{
			label: "Company Website",
			icon: FiGlobe,
			value: companyProfile?.companyWebsite,
		},
		{
			label: "Employee Size",
			icon: HiOutlineUsers,
			value: companyProfile?.employeeSize,
		},
		{
			label: "Company Type",
			icon: TbSeeding,
			value: companyProfile?.companyType,
		},
		{ label: "Industry", icon: BiBriefcase, value: companyProfile?.industry },
		{
			label: "Market Cap",
			icon: LuLineChart,
			value: companyProfile?.marketCap,
		},
		{
			label: "Funding Raised",
			icon: LuCircleDollarSign,
			value: companyProfile?.fundingRaised,
		},
		{
			label: "Yearly Revenue",
			icon: LuWallet,
			value: companyProfile?.yearlyRevenue,
		},
	];

	return (
		<div className="space-y-6 bg-slate-50 p-5">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{gridItems.map((item, index) => (
					<div key={index} className="bg-white rounded-lg p-3">
						{isLoading ? (
							<div className="h-20 skeleton" />
						) : (
							<div className="space-y-2">
								<div className="flex items-center text-sm text-gray-500">
									<item.icon className="w-4 h-4 mr-2" />
									{item.label}
								</div>
								<div className="font-medium">
									{item.value === ""
										? "DID NOT DISCLOSE"
										: item.value !== undefined && item.value !== null
											? typeof item.value === "string"
												? item.value
												: item.value.value
											: "DID NOT DISCLOSE"}
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			<div className="bg-white rounded-lg p-4">
				<div className="space-y-2">
					<div className="text-sm text-gray-500 flex items-center">
						<HiOutlineBuildingOffice2 className="w-4 h-4 mr-2" />
						About Company
					</div>
					{isLoading ? (
						<div className="h-40 skeleton" />
					) : (
						<div
							className="prose max-w-none"
							dangerouslySetInnerHTML={{
								__html:
									companyProfile?.description || "No description available.",
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
