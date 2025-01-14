import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useFetchCompanyProfile } from "@/hooks/company/useFetchCompanyProfile";

export const SuccessJobPage: React.FC = () => {
	const { data } = useFetchCompanyProfile();
	return (
		<div className="flex h-full">
			<div className="flex items-center justify-center w-full lg2:w-[70%] overflow-y-auto scrollbar-hide border-r p-4">
				<div className="flex flex-col items-center">
					<div className="w-52 h-52 mb-4">
						<Player
							autoplay
							loop
							src="https://lottie.host/dc928af9-e277-4cf5-aab8-f3cf6c4f59f6/41Wgp78Fzd.json"
							style={{ width: "100%", height: "100%" }}
						/>
					</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
						Job successfully published
					</h2>
					<div className="flex flex-col xs:flex-row gap-4 mt-6 w-full">
						<Link
							to={`/company/${data?.companySlug}`}
							className="w-full xs:w-1/2"
						>
							<Button className="w-full rounded-lg">
								Go to Profile
							</Button>
						</Link>
						<Link
							to={`/company/${data?.companySlug}/manage-jobs/post`}
							className="w-full xs:w-1/2"
						>
							<Button
								variant="secondary"
								className="w-full rounded-lg"
							>
								Post Another Job
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
