import { SelectOption } from "@/utils/selectObjects";

export type Recruiter = {
	user_details: UserDetails;
	recruiter_details: RecruiterDetails;
	hiring_preference: HiringPreference;
};

export type Candidate = {
	user_details: UserDetails;
	experience: Experience[];
	education: Education[];
	certificate: Certificate[];
	project: Project[];
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
	created_at: string;
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
	experienceId?: string;
	user?: UserDetails;
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
	isCurrentlyWorking?: boolean;
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
    branches: { city: string; state: string; country: string }[];
	about: string;
	values: string;
};

export type Education = {
	educationId?: string;
	user?: UserDetails;
	instituteName: string;
	degreeTitle: string;
	studyField: string;
	startMonth: string;
	startYear: string;
	endMonth: string;
	endYear: string;
	grade: string;
	instituteLocation: string;
	description: string;
};

export type Certificate = {
	certificateId?: string;
	user?: UserDetails;
	certificateName: string;
	issuerOrg: string;
	credentialUrl: string;
	credentialId: string;
	isValid: boolean;
	startMonth: string;
	startYear: number;
	endMonth?: string;
	endYear?: number;
};

export type UserBasicDetails = {
	firstname: string;
	lastname: string;
	bio: string;
	location: string;
	socialLinks: {
		linkedin?: string;
		github?: string;
		leetcode?: string;
		twitter?: string;
	};
	languages: { language: string; proficiency: string }[];
};

export type Project = {
	projectId?: string;
	user?: UserDetails;
	projectName: string;
	description: string;
	liveLink: string;
	skills: SelectOption[];
	sourceCodeLink: string | null;
	isCurrentlyWorking: boolean;
	startMonth: string;
	startYear: number;
	endMonth?: string;
	endYear?: number;
};

export type JobListing = {
	recruiter: RecruiterDetails;
	jobTitle: string;
	jobType: SelectOption;
	jobDescription: string;
    workType: SelectOption;
	companySize: SelectOption;
	skillsRequired: string;
	experience: SelectOption;
	datePosted: Date;
	isActive: Boolean;
    salaryRange: string;
    jobLocation: string;
    applicationDeadline: Date;
};
