import { SelectOption } from "@/utils/selectObjects";

export type Recruiter = {
	userDetails: UserDetails;
	recruiterDetails: RecruiterDetails;
	hiringPreference: HiringPreference;
	jobPostings: JobPosting[];
};

export type UserDetails = {
	profilePicture: string;
	username: string;
	usertype: string;
	firstname: string;
	lastname: string;
	email: string;
	bio: string;
	location: string;
	followers: number;
	following: number;
	createdAt: string;
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

export type socialLinks = {
	github: string;
	linkedin: string;
	twitter: string;
};

export type linguistics = { language: string[]; proficiency: string[] };

export type UserBasicDetails = {
	user_details: UserDetails;
	socials: socialLinks[];
    linguistics: linguistics[];
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

export type JobPosting = {
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

export type ProfileData = {
	user: UserDetails;
	experience: Experience[];
	education: Education[];
	certificate: Certificate[];
	project: Project[];
};
