export type Recruiter = {
	user_details: UserDetails;
	recruiter_details: RecruiterDetails;
	hiring_preference: HiringPreference;
};

export type UserDetails = {
	profilePicture: string;
	username: string;
	usertype: string;
	firstname: string;
	lastname: string;
	email: string;
	bio: string;
	mobileNumber: string;
	location: string;
};

export type RecruiterDetails = {
	user: UserDetails;
	companyName: string;
	jobTitle: string;
	startDate: Date;
	endDate: Date;
	companyLocation: string;
};

export type HiringPreference = {
	recruiter: RecruiterDetails;
	experience: number;
	levels: string[];
	industry: string[];
	function: string[];
	skills: string[];
};

export type Experience = {
	experienceId: string;
	user: UserDetails;
	companyName: string;
	jobTitle: string;
	jobType: string;
	startMonth: string;
	startYear: string;
	endMonth: string;
	endYear: string;
	jobLocation: string;
	locationType: string;
	description: string;
	isCurrentlyWorking: boolean;
};

export type CompanyProfile = {
	recruiter: Recruiter;
	companyName: string;
	website: string;
	companyLogo: string;
	companyCover: string;
	employeeSize: string;
	establishedYear: string;
	industry: string;
	headquarters: string;
	branches: string[];
	about: string;
	values: string;
};

export type Education = {
	educationId: string;
	user: UserDetails;
	instituteName: string;
	degreeTitle: string;
	studyField: string;
	startMonth: string;
	startYear: string;
	endMonth: string;
	endYear: string;
	instituteLocation: string;
	description: string;
};
