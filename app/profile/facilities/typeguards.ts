// Type definitions for facility objects
export interface BaseFacility {
  name: string;
  description: string;
  features: string[];
}

export interface MedicalFacility extends BaseFacility {
  capacity: string;
  staff: string;
  certification: string;
}

export interface SupportFacility extends BaseFacility {
  capacity: string;
  staff: string;
  certification: string;
}

export interface GeneralFacility extends BaseFacility {
  capacity: string;
  types: string[];
}

export interface TechnologyFacility extends BaseFacility {
  // Note: TechnologyFacility doesn't have capacity unlike the other facility types
  coverage: string;
  benefits: string[];
}

export type Facility = MedicalFacility | SupportFacility | GeneralFacility | TechnologyFacility;

// Type guards for facility objects

export function isMedicalFacility(facility: Facility): facility is MedicalFacility {
  return 'certification' in facility && 'staff' in facility;
}

export function isSupportFacility(facility: Facility): facility is SupportFacility {
  return 'certification' in facility && 'staff' in facility;
}

export function isGeneralFacility(facility: Facility): facility is GeneralFacility {
  return 'types' in facility;
}

export function isTechnologyFacility(facility: Facility): facility is TechnologyFacility {
  return 'coverage' in facility && 'benefits' in facility;
}
