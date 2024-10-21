import { FilterSideBar } from "./components/layout/FilterSideBar";
import { useEffect, useState } from "react";
import { TextInput } from "@/components/ui/TextInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { JobPosts, SearchParams, SearchQuery } from "@/types/userTypes";
import { SelectInput, selectStyles } from "@/components/ui/SelectInput";
import { experience } from "@/utils/selectObjects";
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

export default function JobsFeedPage() {
	const [result, setResult] = useState<SearchQuery>();
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const { register, control, handleSubmit } = useForm<SearchParams>();

	const fetchJobs = async (params: string) => {
		setIsLoading(true);
		try {
			const url = `/api/jobs/query?${params}`;
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
		<>
			<JobFeedNavbar />
			<div className="flex h-full">
				{/* sidebar */}
				<div className="flex flex-col gap-2 w-64 xl:w-[25%] h-full border-l scrollbar-hide overflow-y-auto p-4">
					<FilterSideBar />
				</div>
				<div className="flex flex-col w-[70%] pb-20 overflow-y-auto scrollbar-hide">
					{/* search bar */}
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
									/>
								</div>

								<div className="flex flex-col md:flex-row gap-2 w-full lg:w-2/3 ">
									<div className="flex w-full items-center md:w-1/2 gap-2 ">
										<SelectInput
											placeholder="Experience"
											name="experience"
											options={experience}
											control={control}
											icon={<GoBriefcase className="h-5 w-5" />}
											styles={{
												...selectStyles,
												control: (base: CSSObjectWithLabel, state: any) => ({
													...selectStyles.control?.(base, state),
													paddingTop: "0.2rem",
													paddingBottom: "0.2rem",
													backgroundColor: "white",
												}),
											}}
										/>
									</div>

									<div className="flex w-full md:w-1/2 gap-2 ">
										<LocationSelect
											control={control}
											name="location"
											placeholder="Location"
											styles={{
												...selectStyles,
												control: (base: CSSObjectWithLabel, state: any) => ({
													...citySelectStyles.control?.(base, state),
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
								<Button type="submit" className="w-fit rounded-lg">
									Search
								</Button>
							</div>
						</form>
					</div>
					<hr />

					{isLoading ? (
						<div className="pt-5 w-full space-y-5">
							<JobCardSkeleton />
							<JobCardSkeleton />
						</div>
					) : (
						<>
							<div className="flex flex-col w-full items-start gap-3 pt-10 px-5 ">
								<div className="text-sm text-gray-500">
									Search Results (
									{result && result.exact_matches
										? result.exact_matches.length
										: 0}
									)
								</div>
								<div className="space-y-4 w-full">
									{result && result.exact_matches ? (
										result.exact_matches.length > 0 ? (
											result.exact_matches.map((jobPost: JobPosts) => (
												<JobSearchCard key={jobPost.id} jobPost={jobPost} />
											))
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
							<div className="flex flex-col w-full items-start gap-3 pt-10 px-5 ">
								<div className="text-sm text-gray-500">
									Related Jobs (
									{result && result.related_matches
										? result.related_matches.length
										: 0}
									)
								</div>
								<div className="space-y-4 w-full">
									{result && result.related_matches ? (
										result.related_matches.length > 0 ? (
											result.related_matches.map((jobPost: JobPosts) => (
												<JobSearchCard key={jobPost.id} jobPost={jobPost} />
											))
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
						</>
					)}
				</div>
			</div>
		</>
	);
}
