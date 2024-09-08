import { useState } from "react";

export const useFilterOptions = () => {
	const [checkedExpertExp, setCheckedExpertExp] = useState(false);
	const [checkedMidExp, setCheckedMidExp] = useState(false);
	const [checkedEntryExp, setCheckedEntryExp] = useState(false);

	const [checkedOnsite, setCheckedOnsite] = useState(false);
	const [checkedRemote, setCheckedRemote] = useState(false);
	const [checkedHybrid, setCheckedHybrid] = useState(false);

	const [checkedBengaluru, setCheckedBengaluru] = useState(false);
	const [checkedMumbai, setCheckedMumbai] = useState(false);
	const [checkedNewDelhi, setCheckedNewDelhi] = useState(false);
	const [checkedHyderabad, setCheckedHyderabad] = useState(false);
	const [checkedChennai, setCheckedChennai] = useState(false);
	const [checkedPune, setCheckedPune] = useState(false);

	const [checkedBelow3LPA, setCheckedBelow3LPA] = useState(false);
	const [checked36LPA, setChecked36LPA] = useState(false);
	const [checked610LPA, setChecked610LPA] = useState(false);

	const experienceLevels = [
		{
			id: "expert",
			label: "Expert",
			checked: checkedExpertExp,
			setChecked: setCheckedExpertExp,
		},
		{
			id: "entry",
			label: "Entry Level",
			checked: checkedEntryExp,
			setChecked: setCheckedEntryExp,
		},
		{
			id: "intermediate",
			label: "Intermediate",
			checked: checkedMidExp,
			setChecked: setCheckedMidExp,
		},
	];

	const workTypes = [
		{
			id: "onsite",
			label: "Onsite",
			checked: checkedOnsite,
			setChecked: setCheckedOnsite,
		},
		{
			id: "remote",
			label: "Remote",
			checked: checkedRemote,
			setChecked: setCheckedRemote,
		},
		{
			id: "hybrid",
			label: "Hybrid",
			checked: checkedHybrid,
			setChecked: setCheckedHybrid,
		},
	];

	const salaryTypes = [
		{
			id: "below3LPA",
			label: "Below 3 LPA",
			checked: checkedBelow3LPA,
			setChecked: setCheckedBelow3LPA,
		},
		{
			id: "3-6LPA",
			label: "3-6 LPA",
			checked: checked36LPA,
			setChecked: setChecked36LPA,
		},
		{
			id: "6-10LPA",
			label: "6-10 LPA",
			checked: checked610LPA,
			setChecked: setChecked610LPA,
		},
	];

	const IndiaLocation = [
		{
			id: "Bengaluru",
			label: "Bengaluru",
			checked: checkedBengaluru,
			setChecked: setCheckedBengaluru,
		},
		{
			id: "Pune",
			label: "Pune",
			checked: checkedPune,
			setChecked: setCheckedPune,
		},
		{
			id: "Mumbai",
			label: "Mumbai",
			checked: checkedMumbai,
			setChecked: setCheckedMumbai,
		},
		{
			id: "Chennai",
			label: "Chennai",
			checked: checkedChennai,
			setChecked: setCheckedChennai,
		},
		{
			id: "New Delhi",
			label: "New Delhi",
			checked: checkedNewDelhi,
			setChecked: setCheckedNewDelhi,
		},
		{
			id: "Hyderabad",
			label: "Hyderabad",
			checked: checkedHyderabad,
			setChecked: setCheckedHyderabad,
		},
	];

	return { experienceLevels, workTypes, salaryTypes, IndiaLocation };
}
