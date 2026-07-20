export type DegreeLevel = 'Bachelors' | 'Masters' | 'PhD' | 'Any';
export type FinancialNeed = 'High' | 'Medium' | 'Low';

export interface StudentProfile {
  degreeLevel: string;
  fieldOfStudy: string;
  gpa: string;
  homeCountry: string;
  destinationCountry: string;
  financialNeed: FinancialNeed;
  extraActivities: string;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  degreeLevels: DegreeLevel[];
  fieldsOfStudy: string[]; // ['All'] or specific fields
  fundingType: 'Fully Funded' | 'Partial Tuition' | 'Stipend Only' | 'Tuition + Stipend';
  amount: string;
  eligibleCountries: string[]; // ['Global'] or specific list
  destinationCountries: string[]; // ['Global'] or specific list
  deadline: string;
  academicRequirements: string;
  financialRequirements?: string;
  description: string;
  website: string;
  tags: string[];
}

export interface AIRecommendation {
  scholarshipId: string;
  matchScore: number; // 0-100
  whySuitable: string; // Detail reasoning grounded in user profile
  applicationGuidance: string; // Actionable preparation steps
}

export interface AIAdvisorResponse {
  analysisSummary: string; // Overall executive summary
  recommendations: AIRecommendation[];
  actionPlan: string[]; // Staggered steps/timeline for application success
}
