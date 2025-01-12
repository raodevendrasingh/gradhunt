import { FilterSideBar } from "./components/layout/FilterSideBar";
import { SetStateAction, useEffect, useState } from "react";
import { TextInput } from "@/components/ui/TextInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { JobPosts, SearchParams, SearchQuery } from "@/types/userTypes";
import { SelectInput, selectStyles } from "@/components/ui/SelectInput";
import { experienceLevels } from "@/utils/selectObjects";
import { GoBriefcase, GoSearch } from "react-icons/go";
import { citySelectStyles, LocationSelect } from "@/helpers/LocationSelect2";
import { Button } from "@/components/ui/Button";
import { CSSObjectWithLabel } from "react-select";
import axios from "axios";
import { encodeSearchParams } from "@/utils/encodeSearchParams";
import { JobSearchCard } from "./components/layout/JobSearchCard";
import { useNavigate } from "react-router-dom";
import { JobCardSkeleton } from "./components/ui/JobCardSkeleton2";
import JobFeedNavbar from "./components/layout/JobFeedNavbar";
import { FaBuilding, FaStar } from "react-icons/fa6";
import { featuredCompanies, topIndustries } from "@/utils/dummyData";
import { apiUrl } from "@/modal-forms/OnboardingModal";

export default function JobsFeedPage() {
	const [result, setResult] = useState<SearchQuery>();
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isSearchDisabled, setIsSearchDisabled] = useState(true);

	const { register, control, handleSubmit, watch } = useForm<SearchParams>({
		defaultValues: {
			position:
				new URLSearchParams(location.search)
					.get("position")
					?.replace("+", " ") || "",
			experience:
				new URLSearchParams(location.search).get("experience") || "",
			location:
				new URLSearchParams(location.search).get("location") || "",
		},
	});

	const position = watch("position");

	useEffect(() => {
		setIsSearchDisabled(!position || position.length < 2);
	}, [position]);

	useEffect(() => {
		if (isSidebarOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isSidebarOpen]);

	const fetchJobs = async (params: string | Record<string, any>) => {
		setIsLoading(true);
		try {
			const searchParams =
				typeof params === "string"
					? params
					: new URLSearchParams(params).toString();

			const url = `${apiUrl}/api/jobs/query?${searchParams}`;
			const response = await axios.get(url);
			setResult(response.data);
		} catch (error) {
			console.error("Error Completing Search:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		if (searchParams.toString()) {
			fetchJobs(searchParams.toString());
		}
	}, [location.search]);

	const onSubmit: SubmitHandler<SearchParams> = async (data) => {
		const searchParams = encodeSearchParams(data);
		navigate(`?${searchParams}`);
	};

	return (
		<div className="relative h-screen overflow-hidden">
			<JobFeedNavbar
				isSidebarOpen={isSidebarOpen}
				setIsSidebarOpen={setIsSidebarOpen}
			/>

			<div
				className={`fixed inset-0 bg-black transition-opacity duration-300 md:hidden ${
					isSidebarOpen ? "opacity-50 z-30" : "opacity-0 -z-10"
				}`}
				onClick={() => setIsSidebarOpen(false)}
			/>

			<div className="flex h-[calc(100vh-64px)]">
				{/* Sidebar */}
				<div
					className={`fixed md:relative w-72 xl:w-[20%] h-[calc(100vh-64px)] bg-white z-40 md:z-auto transition-transform duration-300 ease-in-out
                                md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} border-r overflow-y-auto scrollbar-hide
                            `}
				>
					<div className="flex justify-end p-5">
						<FilterSideBar
							onFilterResults={(
								filteredResults: SetStateAction<
									SearchQuery | undefined
								>
							) => {
								setResult(filteredResults);
								setIsLoading(false);
							}}
						/>
					</div>
				</div>

				{/* Main content */}
				<div className="flex-1 w-full md:w-[70%] overflow-y-auto scrollbar-hide">
					{/* Search bar */}
					<div className="flex items-center justify-center w-full p-5">
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="flex flex-col w-full"
						>
							<div className="flex flex-col lg:flex-row items-center gap-2 w-full rounded-xl py-2">
								<div className="flex w-full lg:w-1/3">
									<TextInput
										name="position"
										placeholder="Positions / skills / companies"
										register={register}
										icon={<GoSearch className="h-5 w-5" />}
										className="py-3 bg-white focus:ring-0"
										onChange={(e) => {
											register("position").onChange(e);
										}}
									/>
								</div>

								<div className="flex flex-col md:flex-row gap-2 w-full lg:w-2/3">
									<div className="flex w-full items-center md:w-1/2 gap-2">
										<SelectInput
											placeholder="Experience"
											name="experience"
											options={experienceLevels}
											control={control}
											icon={
												<GoBriefcase className="h-5 w-5" />
											}
											styles={{
												...selectStyles,
												control: (
													base: CSSObjectWithLabel,
													state: any
												) => ({
													...selectStyles.control?.(
														base,
														state
													),
													paddingTop: "0.2rem",
													paddingBottom: "0.2rem",
													backgroundColor: "white",
												}),
											}}
										/>
									</div>

									<div className="flex w-full md:w-1/2 gap-2">
										<LocationSelect
											control={control}
											name="location"
											placeholder="Location"
											styles={{
												...selectStyles,
												control: (
													base: CSSObjectWithLabel,
													state: any
												) => ({
													...citySelectStyles.control?.(
														base,
														state
													),
													paddingTop: "0.2rem",
													paddingBottom: "0.2rem",
													backgroundColor: "white",
												}),
											}}
										/>
									</div>
								</div>
							</div>
							<div className="w-full flex justify-end">
								<Button
									type="submit"
									className="w-fit rounded-lg"
									disabled={isSearchDisabled}
								>
									Search
								</Button>
							</div>
						</form>
					</div>
					{/* Search bar ends*/}
					<hr />

					{isLoading ? (
						<div className="py-5 w-full space-y-5">
							<JobCardSkeleton />
							<JobCardSkeleton />
						</div>
					) : (
						<>
							<div className="flex flex-col w-full items-start gap-3 pt-10 px-5 pb-3">
								<div className="text-sm text-gray-500">
									Search Results (
									{result?.exact_matches?.length || 0})
								</div>
								<div className="space-y-4 w-full">
									{result?.exact_matches ? (
										result.exact_matches.length > 0 ? (
											result.exact_matches.map(
												(jobPost: JobPosts) => (
													<JobSearchCard
														key={jobPost.id}
														jobPost={jobPost}
													/>
												)
											)
										) : (
											<div className="min-h-16 border rounded-lg flex items-center justify-center">
												<span className="text-sm text-gray-600">
													No Jobs Found
												</span>
											</div>
										)
									) : null}
								</div>
							</div>
							{result?.related_matches &&
								result.related_matches.length > 0 && (
									<div className="flex flex-col w-full items-start gap-3 pt-10 px-5 pb-3">
										<div className="text-sm text-gray-500">
											Related Jobs (
											{result.related_matches.length})
										</div>
										<div className="space-y-4 w-full">
											{result.related_matches.map(
												(jobPost: JobPosts) => (
													<JobSearchCard
														key={jobPost.id}
														jobPost={jobPost}
													/>
												)
											)}
										</div>
									</div>
								)}
						</>
					)}
				</div>
				<div className="hidden xl:block border-l w-80 space-y-4 p-5">
					<div className="border bg-white rounded-xl p-4">
						<h3 className="text-lg font-semibold mb-3 flex items-center">
							<FaStar className="text-yellow-400 mr-2" />
							Featured Companies
						</h3>
						<ul className="space-y-2">
							{featuredCompanies.map((company) => (
								<li
									key={company.id}
									className="flex justify-between items-center border border-gray-200 rounded-md px-2 py-1"
								>
									<span>{company.name}</span>
									<span className="text-sm text-gray-500">
										{company.openings} jobs
									</span>
								</li>
							))}
						</ul>
						<button className="mt-4 w-full bg-zinc-100 text-zinc-800 py-2 px-4 rounded-md hover:bg-zinc-200 transition-colors duration-300">
							View All Companies
						</button>
					</div>

					<div className="border bg-white rounded-xl p-4">
						<h3 className="text-lg font-semibold mb-3 flex items-center">
							<FaBuilding className="text-blue-500 mr-2" />
							Top Industries
						</h3>
						<ul className="space-y-2">
							{topIndustries.map((industry) => (
								<li
									key={industry.id}
									className="flex justify-between items-center border border-gray-200 rounded-md px-2 py-1"
								>
									<span>{industry.name}</span>
									<span className="text-sm text-gray-500">
										{industry.companies} companies
									</span>
								</li>
							))}
						</ul>
						<button className="mt-4 w-full bg-zinc-100 text-zinc-800 py-2 px-4 rounded-md hover:bg-zinc-200 transition-colors duration-300">
							Explore Industries
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
