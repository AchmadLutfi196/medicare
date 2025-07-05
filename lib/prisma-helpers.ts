/**
 * Helper functions for working with Prisma and SQLite JSON data
 * 
 * Since SQLite doesn't natively support arrays, we store them as JSON strings
 * These helpers make it easy to convert between string JSON and actual arrays
 */

/**
 * Safely parse a JSON string into an array
 * @param jsonString The JSON string to parse
 * @param defaultValue Default value if parsing fails
 * @returns Parsed array or default value
 */
export function parseJsonArray<T = string>(jsonString: string | null | undefined, defaultValue: T[] = []): T[] {
  if (!jsonString) return defaultValue;
  
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : defaultValue;
  } catch (error) {
    console.error("Error parsing JSON string:", error);
    return defaultValue;
  }
}

/**
 * Safely stringify an array to JSON string
 * @param array The array to stringify
 * @returns JSON string representation of the array
 */
export function stringifyArray<T>(array: T[] | null | undefined): string {
  if (!array) return JSON.stringify([]);
  return JSON.stringify(array);
}

/**
 * Transform a Prisma doctor model to add parsed arrays
 * @param doctor The doctor model from Prisma
 * @returns Doctor with parsed arrays
 */
export function transformDoctorModel(doctor: any) {
  if (!doctor) return null;
  
  return {
    ...doctor,
    education: parseJsonArray(doctor.education),
    certifications: parseJsonArray(doctor.certifications),
    languages: parseJsonArray(doctor.languages),
    specialties: parseJsonArray(doctor.specialties),
  };
}

/**
 * Transform an array of Prisma doctor models
 * @param doctors Array of doctor models
 * @returns Array of doctors with parsed arrays
 */
export function transformDoctorModels(doctors: any[]) {
  return doctors.map(transformDoctorModel);
}
