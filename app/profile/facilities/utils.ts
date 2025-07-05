// Utility functions for safe property access that ensures TypeScript compatibility

/**
 * Safely accesses a property that may not exist on all union types.
 * This helps prevent TypeScript errors when accessing properties on union types.
 * 
 * @param obj The object to check for property existence
 * @param prop The name of the property to check
 * @returns boolean indicating whether the property exists and is truthy
 */
export function hasProp<T, K extends string>(obj: T, prop: K): boolean {
  return obj !== null && 
         obj !== undefined && 
         Object.prototype.hasOwnProperty.call(obj, prop) && 
         Boolean((obj as any)[prop]);
}

/**
 * Safely gets a property value that may not exist on all union types.
 * 
 * @param obj The object to get the property from
 * @param prop The name of the property to get
 * @param defaultValue Default value if property doesn't exist
 * @returns The property value or defaultValue if it doesn't exist
 */
export function getProp<T, K extends string, D = undefined>(
  obj: T, 
  prop: K, 
  defaultValue: D = undefined as D
): any {
  if (obj !== null && 
      obj !== undefined && 
      Object.prototype.hasOwnProperty.call(obj, prop)) {
    return (obj as any)[prop];
  }
  return defaultValue;
}
