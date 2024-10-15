const encodeValue = (value: string) => value.replace(/ /g, "+");
export const encodeSearchParams = (data: {
	position: string;
	experience: any;
	location: any;
}) => {
	return new URLSearchParams({
		position: encodeValue(data.position),
		experience: encodeValue(
			typeof data.experience === "object"
				? data.experience?.value || ""
				: data.experience || ""
		),
		location: encodeValue(
			typeof data.location === "object"
				? data.location?.value || ""
				: data.location || ""
		),
	});
};
