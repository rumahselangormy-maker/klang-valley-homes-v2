export interface Project {
  ID: string;
  AREA: string;
  PROJECT_NAME: string;
  PRICE_FROM: string;
  PROPERTY_TYPE: string;
  BUILT_UP: string;
  LAND_SIZE: string;
  BEDROOMS: string;
  BATHROOMS: string;
  TENURE: string;
  STATUS: string;
  MAIN_IMAGE: string;
  GALLERY_URLS: string;
  GOOGLE_MAPS_URL: string;
  DESCRIPTION: string;
  KEY_FEATURES: string;
  FACILITIES: string;
  SALES_PACKAGE: string;
  COMPLETION: string;
  SORT_ORDER: string;
  LAST_UPDATED?: string;
}

export interface FilterState {
  searchQuery: string;
  area: string;
  propertyType: string;
  priceRange: string;
  bedrooms: string;
  tenure: string;
  status: string;
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'name';
}

export interface LeadFormData {
  leadType: string;
  name: string;
  phone: string;
  email: string;
  preferredArea: string;
  interestedProject: string;
  grossIncome: string;
  netIncome: string;
  employmentStatus: string;
  loanCommitments: string;
  firstHomeBuyer: string;
  propertyType: string;
  estimatedBudget: string;
  remarks: string;
  consent: boolean;
  source?: string;
}

export type ActiveTab = 'home' | 'properties' | 'projects' | 'eligibility' | 'about' | 'contact' | 'calculator';
