import { useUser } from "@clerk/clerk-react";
import NotFound from "./NotFound";

export default function SalariesPage() {
	const { isSignedIn } = useUser();

	if (!isSignedIn) return <NotFound />;

	return (
		<div className="flex h-full">
			{/* main */}
			<div className="w-full lg2:w-[70%] overflow-y-auto scrollbar-hide border-r p-4">
				Salaries
			</div>
		</div>
	);
}
