import { FiPlus } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";

// assets
import CompanyLogo from "@/assets/avatar/emptyLogo.png";
import { EducationModal } from "./modalForms/EducationModal";

export const Education = () => {
	return (
		<div className="w-full pt-20 mx-auto">
			<div className="max-w-7xl mx-auto lg:ml-64">
				<div className="max-w-5xl mx-auto flex flex-col mb-3 gap-3 px-3">
					<section className="bg-white px-2 p-2 border rounded-xl shadow">
						<div className="flex justify-between items-center">
							<span className="font-semibold text-lg pl-1 text-gray-800">
								Education
							</span>
							<div className="flex gap-2">
								<EducationModal/>
							</div>
						</div>
						{/* fetch education data */}
						{/* <div className="flex">
							<div className="w-full flex items-center gap-3 border border-gray-50 bg-gray-100 p-2 rounded-lg">
								<div className="size-14 rounded-lg">
									<img src={CompanyLogo} alt="company_logo" />
								</div>
								<div className="w-full">
									<div className="flex items-baseline justify-between ">
										<div className="text-xl font-semibold">
											<span className="text-lg text-blue-600 pl-3">
												+ Add Institute Name
											</span>
										</div>
										<div className="text-xs hidden xs:block">
											<span className="text-sm text-blue-600 pl-3">
												+ Add Duration
											</span>
										</div>
									</div>
									<div className="text-sm">
										<span className="text-base text-blue-600 pl-3">
											+ Add Degree Name
										</span>
									</div>
									<div className="text-xs xs:hidden">
										<span className="text-sm text-blue-600 pl-3">
											+ Add Duration
										</span>
									</div>
								</div>
							</div>
						</div> */}
					</section>
				</div>
			</div>
		</div>
	);
};
