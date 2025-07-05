// This file is deprecated - using Prisma authentication instead
// This is a placeholder to avoid import errors while transitioning

// Mock Firebase objects for compatibility
export const auth = {
  currentUser: null,
  config: { emulator: null }
};

export const db = null;

// These functions are deprecated
export const createUserWithEmailAndPassword = async (auth: any, email: string, password: string) => {
  console.warn("Firebase authentication is deprecated - use Prisma authentication instead");
  return {
    user: {
      email,
      delete: async () => {},
      uid: "deprecated"
    }
  };
};

export const signInWithEmailAndPassword = async (auth: any, email: string, password: string) => {
  console.warn("Firebase authentication is deprecated - use Prisma authentication instead");
  return {
    user: {
      email,
      uid: "deprecated"
    }
  };
};

export const signOut = async (auth: any) => {
  console.warn("Firebase authentication is deprecated - use Prisma authentication instead");
  return Promise.resolve();
};

export const updateProfile = async (user: any, profile: any) => {
  console.warn("Firebase authentication is deprecated - use Prisma authentication instead");
  return Promise.resolve();
};

// Fix for the error in AuthContext:
// This is an empty function that returns an unsubscribe function
export const onAuthStateChanged = () => {
  console.warn("Firebase authentication is deprecated - use Prisma authentication instead");
  return () => {}; // unsubscribe function
};

const app = {
  name: 'prisma-auth',
  options: {}
};

// Alert developer that they should use Prisma instead
console.warn("Firebase has been removed. Please use Prisma authentication services instead.");

export default app;
