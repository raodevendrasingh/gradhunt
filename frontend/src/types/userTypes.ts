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
	resumeLink: string;
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

export type ExperienceData = {
	id: number;
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

export type ExperienceForm = {
	id: number;
	companyName: string;
	jobTitle: { value: string; label: string };
	jobType: { value: string; label: string };
	startMonth: { value: string; label: string };
	startYear: { value: string; label: string };
	endMonth: { value: string; label: string } | null;
	endYear: { value: string; label: string } | null;
	jobLocation: string;
	locationType: { value: string; label: string };
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
	branches: { city: string; state: string; country: string }[];
	about: string;
	values: string;
};

export type EducationData = {
	id: number;
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

export type EducationForm = {
	id: number;
	instituteName: string;
	degreeTitle: { value: string; label: string };
	studyField: { value: string; label: string };
	startMonth: { value: string; label: string };
	startYear: { value: string; label: string };
	endMonth: { value: string; label: string } | null;
	endYear: { value: string; label: string } | null;
    instituteLocation: string;
	grade: string;
	description: string;
    [key: string]: any;
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

export type SocialLinks = {
    github: string;
    linkedin: string;
    leetcode: string;
    twitter: string;
};

export type Linguistics = { 
    id: number;
    language: string; 
    proficiency: string; 
};

export type UserBasicDetails = {
    user_details: UserDetails;
    social_links: SocialLinks[];
    linguistics: Linguistics[];
};

export type UserBasicFormData = {
	firstname: string;
	lastname: string;
	bio: string;
	location: string;
	socialLinks: {
		github: string;
		linkedin: string;
		leetcode: string;
		twitter: string;
	};
	languages: {
		id: number;
		language: string;
		proficiency: string;
	}[];
};

export type ProjectData = {
	id?: number;
	user?: UserDetails;
	projectName: string;
	description: string;
	liveLink: string;
	skills: string[];
	sourceCodeLink: string | null;
	isCurrentlyWorking: boolean;
	startMonth: string;
	startYear: string;
	endMonth?: string;
	endYear?: string;
};

export type ProjectForm = {
	id?: number;
	user?: UserDetails;
	projectName: string;
	description: string;
	liveLink: string;
	skills: SelectOption[];
	sourceCodeLink: string | null;
	isCurrentlyWorking: boolean;
	startMonth: { value: string; label: string };
	startYear: { value: string; label: string };
	endMonth: { value: string; label: string } | null;
	endYear: { value: string; label: string } | null;
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

export type AboutSection = {
	description: string;
};

export type ProgressField = {
	label: string;
	value: number;
	completed: boolean;
};

export type Progress = {
	tasks: ProgressField[];
	completion_percentage: number;
};

export type Skill = {
	id?: number;
	label: string;
	value: string;
	image: string;
	category: string;
};
