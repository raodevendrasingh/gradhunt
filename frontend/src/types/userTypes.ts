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
	isProfilePrivate: boolean;
	isVerified: boolean;
	isCompanyAdmin: boolean;
	createdAt: string;
	isWebNotificationEnabled: boolean;
	isEmailNotificationEnabled: boolean;
	plan: "Free" | "Pro";
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
	companyWebsite: string;
	isVerified: boolean;
	verificationCode: string;
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
	companyWebsite: string;
	isVerified: boolean;
	verificationCode: string;
	isCurrentlyWorking: boolean;
};

export type CompanyAdmin = {
	username: string;
	firstname: string;
	lastname: string;
	email: string;
};

export type CompanyForm = {
	companyAdmin: CompanyAdmin;
	companyBanner: string;
	companyLogo: string;
	companySlug: string;
	companyName: string;
	companyTagline: string;
	companyWebsite: string;
	tagline: string;
	companyEmail: string;
	companyPhone: string;
	employeeSize: string | { value: string; label: string };
	establishedYear: string;
	marketCap: string;
	fundingRaised: string;
	companyType: string | { value: string; label: string };
	yearlyRevenue: string;
	industry: string | { value: string; label: string };
	headquarters: string;
	branches: [] | { city: string; state: string; country: string }[];
	description: string;
	isDraft: boolean;
};

export type CompanyProfileType = {
	companyBanner: string;
	companyLogo: string;
	companySlug: string;
	companyName: string;
	companyTagline: string;
	companyWebsite: string;
	tagline: string;
	companyEmail: string;
	companyPhone: string;
	employeeSize: { value: string; label: string };
	establishedYear: string;
	marketCap: string;
	fundingRaised: string;
	companyType: { value: string; label: string };
	yearlyRevenue: string;
	industry: { value: string; label: string };
	headquarters: string;
	branches: { city: string; state: string; country: string }[];
	description: string;
	isDraft: boolean;
};

export type CompanyData = {
	companyBanner: string;
	companyLogo: string;
	companyName: string;
	companySlug: string;
	companyWebsite: string;
	tagline: string;
	companyEmail: string;
	companyPhone: string;
	employeeSize: string;
	establishedYear: string;
	marketCap: string;
	fundingRaised: string;
	companyType: string;
	yearlyRevenue: string;
	industry: string;
	headquarters: string;
	branches: [];
	description: string;
	isDraft: boolean;
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
	instituteWebsite: string;
	isVerified: boolean;
	verificationCode: string;
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
	instituteWebsite: string;
	isVerified: boolean;
	verificationCode: string;
	[key: string]: any;
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

export type CertificateData = {
	id?: number;
	user?: UserDetails;
	certificateName: string;
	issuerOrg: string;
	credentialUrl: string;
	credentialId: string;
	isValid: boolean;
	startMonth: string;
	startYear: string;
	endMonth?: string;
	endYear?: string;
};

export type CertificateForm = {
	id?: number;
	user?: UserDetails;
	certificateName: string;
	issuerOrg: string;
	credentialUrl: string;
	credentialId: string;
	isValid: boolean;
	startMonth: { value: string; label: string };
	startYear: { value: string; label: string };
	endMonth: { value: string; label: string } | null;
	endYear: { value: string; label: string } | null;
};

export type JobPosting = {
	id: number;
	jobTitle: string;
	jobType: { value: string; label: string };
	jobCategory: { value: string; label: string };
	jobDescription: string;
	workType: { value: string; label: string };
	requiredSkills: SkillObject[];
	experience: { value: string; label: string };
	isActive: Boolean;
	applyLink: string;
	applyWithUs: boolean;
	lowestSalary: string;
	highestSalary: string;
	currency: { value: string; label: string };
	openings: number;
	applicants: number;
	jobLocation: string;
	applicationDeadline: Date;
};

export type JobPosts = {
	id: number;
	jobId: string;
	jobTitle: string;
	jobType: string;
	jobCategory: string;
	jobDescription: string;
	workType: string;
	requiredSkills: SkillObject[];
	experience: string;
	isActive: Boolean;
	isArchived: Boolean;
	applyLink: string;
	applyWithUs: boolean;
	jobLocation: string;
	postedDate: Date;
	companyData: CompanyData;
	applicationDeadline: Date;
	lowestSalary: string;
	highestSalary: string;
	currency: string;
	openings: number;
	applicants: number;
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

export type SkillObject = {
	id?: number;
	label: string;
	value: string;
	image?: string;
	category: string;
};

export type Skill = {
	user: number;
	skills_list: SkillObject[];
};

export type SearchParams = {
	position: string;
	experience: string | null;
	location: string | null;
};

export type SearchQuery = {
	exact_matches: JobPosts[];
	related_matches: JobPosts[];
};

export type SavedJobsType = {
	some(arg0: (savedJob: SavedJobsType) => boolean): unknown;
	candidates: number;
	jobPosting: number;
};

export type AppliedJobsType = {
	id: number;
	some(arg0: (savedJob: AppliedJobsType) => boolean): unknown;
	status: string;
	candidates: number;
	jobPosting: number;
	appliedDate: Date;
};

export type Applicant = {
	jobId: string;
	isActive: boolean;
	jobTitle: string;
	jobType: string;
	workType: string;
	jobLocation: string;
	postedDate: Date;
	applicationDeadline: Date;
	openings: number;
	applicants: {
		id: number;
		status: string;
		appliedDate: Date;
		candidate: {
			username: string;
			firstname: string;
			lastname: string;
			email: string;
			location: string;
			resumeLink: string;
		};
	}[];
};
