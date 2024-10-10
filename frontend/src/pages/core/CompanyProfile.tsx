import { useFetchCompanyProfile } from "@/hooks/useFetchCompanyProfile";

export default function CompanyProfile() {
	const { data } = useFetchCompanyProfile();
	// console.log("profile data: ", data);
	return <div className="p-10 text-xl">company Profile</div>;
}
