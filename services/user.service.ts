// User service for authentication and profile management
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { where, QueryConstraint } from 'firebase/firestore';
import { auth } from '../lib/firebase';
import { dbService } from './database.service';
import { User, ApiResponse } from '../types/database';

export class UserService {
  private static instance: UserService;
  private collectionName = 'users';
  private currentUser: User | null = null;
  private isDevMode = process.env.NODE_ENV === 'development';

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  constructor() {
    // Listen to auth state changes
    if (this.isDevMode) {
      // In development mode, simulate auth with localStorage
      this.loadUserFromLocalStorage();
    } else {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userResult = await this.getUserByEmail(firebaseUser.email!);
          if (userResult.success && userResult.data) {
            this.currentUser = userResult.data;
          }
        } else {
          this.currentUser = null;
        }
      });
    }
  }

  private loadUserFromLocalStorage() {
    if (typeof window !== 'undefined') {
      // Initialize demo users in development
      this.initializeDemoUsers();
      
      const userData = localStorage.getItem('medicare_user');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
    }
  }

  private initializeDemoUsers() {
    if (typeof window !== 'undefined') {
      const existingUsers = JSON.parse(localStorage.getItem('medicare_users') || '[]');
      
      // Add demo users if not present
      const demoUsers = [
        {
          id: 'demo-admin-1',
          email: 'admin@medicare.com',
          firstName: 'Administrator',
          lastName: 'System',
          phone: '+62 812-3456-7890',
          role: 'admin',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'demo-patient-1', 
          email: 'patient@gmail.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+62 812-1234-5678',
          role: 'patient',
          dateOfBirth: '1990-01-15',
          gender: 'male',
          address: 'Jl. Contoh No. 123, Jakarta',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'demo-doctor-1',
          email: 'doctor@medicare.com',
          firstName: 'Dr. Sarah',
          lastName: 'Johnson',
          phone: '+62 812-9876-5432',
          role: 'doctor',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      demoUsers.forEach(demoUser => {
        const userExists = existingUsers.find((u: any) => u.email === demoUser.email);
        if (!userExists) {
          existingUsers.push(demoUser);
        }
      });
      
      localStorage.setItem('medicare_users', JSON.stringify(existingUsers));
    }
  }

  private saveUserToLocalStorage(user: User) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medicare_user', JSON.stringify(user));
    }
  }

  private removeUserFromLocalStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('medicare_user');
    }
  }

  // Development mode authentication methods
  private async registerDevMode(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    phone: string,
    role: User['role'] = 'patient',
    dateOfBirth?: string,
    gender?: 'male' | 'female' | 'other',
    address?: string
  ): Promise<ApiResponse<User & { id: string }>> {
    try {
      // Check if user already exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('medicare_users') || '[]');
      const userExists = existingUsers.find((u: any) => u.email === email);
      
      if (userExists) {
        return {
          success: false,
          error: 'Email sudah terdaftar'
        };
      }

      // Create new user
      const newUser: User & { id: string } = {
        id: Date.now().toString(),
        email,
        firstName,
        lastName,
        phone,
        role,
        isActive: true,
        dateOfBirth,
        gender,
        address,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to localStorage
      existingUsers.push(newUser);
      localStorage.setItem('medicare_users', JSON.stringify(existingUsers));
      
      this.currentUser = newUser;
      this.saveUserToLocalStorage(newUser);

      return {
        success: true,
        data: newUser
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed'
      };
    }
  }

  private async loginDevMode(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      // Check user in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('medicare_users') || '[]');
      const user = existingUsers.find((u: any) => u.email === email);
      
      if (!user) {
        return {
          success: false,
          error: 'Email atau password salah'
        };
      }

      // In dev mode, we don't check password for simplicity
      // You can add password checking here if needed

      this.currentUser = user;
      this.saveUserToLocalStorage(user);

      return {
        success: true,
        data: user
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  }

  // Authentication methods
  async register(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    phone: string,
    role: User['role'] = 'patient',
    dateOfBirth?: string,
    gender?: 'male' | 'female' | 'other',
    address?: string
  ): Promise<ApiResponse<User & { id: string }>> {
    if (this.isDevMode) {
      return this.registerDevMode(email, password, firstName, lastName, phone, role, dateOfBirth, gender, address);
    }

    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update Firebase profile
      await updateProfile(firebaseUser, {
        displayName: `${firstName} ${lastName}`
      });

      // Create user document in Firestore
      const userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
        email,
        firstName,
        lastName,
        phone,
        role,
        isActive: true,
        dateOfBirth,
        gender,
        address
      };

      const result = await dbService.create<User>(this.collectionName, userData);
      
      if (result.success) {
        this.currentUser = result.data!;
        return result;
      } else {
        // If Firestore creation fails, delete the Firebase user
        await firebaseUser.delete();
        throw new Error(result.error);
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed'
      };
    }
  }

  async login(email: string, password: string): Promise<ApiResponse<User>> {
    if (this.isDevMode) {
      return this.loginDevMode(email, password);
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userResult = await this.getUserByEmail(firebaseUser.email!);
      
      if (userResult.success && userResult.data) {
        this.currentUser = userResult.data;
        return userResult;
      } else {
        throw new Error('User data not found');
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      if (this.isDevMode) {
        this.currentUser = null;
        this.removeUserFromLocalStorage();
      } else {
        await signOut(auth);
        this.currentUser = null;
      }
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Logout failed'
      };
    }
  }

  // User data methods
  async getUserById(id: string): Promise<ApiResponse<User>> {
    return await dbService.getById<User>(this.collectionName, id);
  }

  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    const constraints: QueryConstraint[] = [where('email', '==', email)];
    const result = await dbService.getAll<User>(this.collectionName, constraints);
    
    if (result.success && result.data && result.data.length > 0) {
      return {
        success: true,
        data: result.data[0]
      };
    }
    
    return {
      success: false,
      error: 'User not found'
    };
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<void>> {
    const result = await dbService.update<User>(this.collectionName, id, userData);
    
    // Update current user if it's the same user
    if (result.success && this.currentUser && this.currentUser.id === id) {
      const updatedUser = await this.getUserById(id);
      if (updatedUser.success) {
        this.currentUser = updatedUser.data!;
      }
    }
    
    return result;
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return await dbService.delete(this.collectionName, id);
  }

  async getAllUsers(role?: User['role']): Promise<ApiResponse<User[]>> {
    const constraints: QueryConstraint[] = [];
    
    if (role) {
      constraints.push(where('role', '==', role));
    }
    
    return await dbService.getAll<User>(this.collectionName, constraints);
  }

  async getPatients(): Promise<ApiResponse<User[]>> {
    return await this.getAllUsers('patient');
  }

  async getDoctorUsers(): Promise<ApiResponse<User[]>> {
    return await this.getAllUsers('doctor');
  }

  async getAdminUsers(): Promise<ApiResponse<User[]>> {
    return await this.getAllUsers('admin');
  }

  async getStaffUsers(): Promise<ApiResponse<User[]>> {
    return await this.getAllUsers('staff');
  }

  // Profile methods
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<void>> {
    if (!this.currentUser) {
      return {
        success: false,
        error: 'User not logged in'
      };
    }
    
    return await this.updateUser(this.currentUser.id, userData);
  }

  async updateProfileImage(imageUrl: string): Promise<ApiResponse<void>> {
    if (!this.currentUser) {
      return {
        success: false,
        error: 'User not logged in'
      };
    }
    
    return await this.updateUser(this.currentUser.id, { profileImage: imageUrl });
  }

  // Status management
  async activateUser(id: string): Promise<ApiResponse<void>> {
    return await this.updateUser(id, { isActive: true });
  }

  async deactivateUser(id: string): Promise<ApiResponse<void>> {
    return await this.updateUser(id, { isActive: false });
  }

  // Current user getters
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getCurrentUserId(): string | null {
    return this.currentUser?.id || null;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  hasRole(role: User['role']): boolean {
    return this.currentUser?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isDoctor(): boolean {
    return this.hasRole('doctor');
  }

  isPatient(): boolean {
    return this.hasRole('patient');
  }

  isStaff(): boolean {
    return this.hasRole('staff');
  }

  // Search users
  async searchUsers(searchTerm: string, role?: User['role']): Promise<ApiResponse<User[]>> {
    const allUsers = await this.getAllUsers(role);
    
    if (allUsers.success && allUsers.data) {
      const filtered = allUsers.data.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const search = searchTerm.toLowerCase();
        return fullName.includes(search) || 
               user.email.toLowerCase().includes(search) ||
               user.phone.includes(search);
      });
      
      return {
        success: true,
        data: filtered
      };
    }
    
    return allUsers;
  }

  // User statistics
  async getUserStats(): Promise<ApiResponse<{
    total: number;
    patients: number;
    doctors: number;
    admins: number;
    staff: number;
    active: number;
    inactive: number;
  }>> {
    try {
      const allUsers = await this.getAllUsers();
      if (!allUsers.success || !allUsers.data) {
        throw new Error(allUsers.error || 'Failed to get users');
      }

      const users = allUsers.data;
      
      const stats = {
        total: users.length,
        patients: users.filter(u => u.role === 'patient').length,
        doctors: users.filter(u => u.role === 'doctor').length,
        admins: users.filter(u => u.role === 'admin').length,
        staff: users.filter(u => u.role === 'staff').length,
        active: users.filter(u => u.isActive).length,
        inactive: users.filter(u => !u.isActive).length
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Pagination for admin
  async getUsersPaginated(page: number = 1, limit: number = 10, role?: User['role']) {
    const constraints: QueryConstraint[] = [];
    
    if (role) {
      constraints.push(where('role', '==', role));
    }
    
    return await dbService.getPaginated<User>(
      this.collectionName,
      limit,
      undefined,
      constraints
    );
  }
}

export const userService = UserService.getInstance();
