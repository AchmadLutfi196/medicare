// Utility functions for direct database access when Prisma has issues
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a user directly in the SQLite database
 * This is a fallback method when Prisma client has issues
 */
export async function createUser(userData: {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
}) {
  let db;
  try {
    // Open a database connection
    db = await open({
      filename: './prisma/dev.db',
      driver: sqlite3.Database
    });
    
    const userId = uuidv4();
    const now = new Date().toISOString();
    
    // CRITICAL: Normalize email to ensure consistency (lowercase and trimmed)
    // This was causing registration/login issues
    const normalizedEmail = userData.email.trim().toLowerCase();
    
    console.log('Creating user with direct SQL:', {
      id: userId,
      email: normalizedEmail, // Log the actual normalized email we'll use
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      hasPassword: !!userData.password,
      dateOfBirth: userData.dateOfBirth || 'not provided',
      gender: userData.gender || 'not provided',
      hasAddress: !!userData.address,
    });
    
    console.log('Normalized email for DB storage:', normalizedEmail);
    
    // Double check that email is normalized
    if (normalizedEmail !== userData.email.trim().toLowerCase()) {
      console.error('Critical error: Email normalization failed');
    }
    
    // Check if this user email exists first to give a cleaner error (case-insensitive)
    const existingUser = await db.get('SELECT id FROM User WHERE LOWER(email) = ?', [normalizedEmail]);
    if (existingUser) {
      console.log('User with this email already exists:', userData.email);
      throw new Error('Email already in use');
    }
    
    // FIXED: Insert the user with SQL using explicitly normalized email
    const insertResult = await db.run(
      `INSERT INTO User (
        id, email, firstName, lastName, phone, 
        dateOfBirth, gender, address, 
        role, isActive, password, 
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        normalizedEmail, // IMPORTANT: Always use normalized email (lowercase)
        userData.firstName,
        userData.lastName,
        userData.phone,
        userData.dateOfBirth || null,
        userData.gender || null,
        userData.address || null,
        'PATIENT',
        1, // TRUE for isActive
        userData.password,
        now,
        now
      ]
    );
    
    console.log('SQL insert successful:', {
      changes: insertResult.changes,
      lastID: insertResult.lastID
    });
    
    // Get the created user (without password) and verify email is lowercase
    const user = await db.get(
      'SELECT id, email, firstName, lastName, phone, dateOfBirth, gender, address, role, isActive, createdAt, updatedAt FROM User WHERE id = ?', 
      [userId]
    );
    
    // Verify that email was stored correctly in lowercase
    if (user && user.email !== normalizedEmail) {
      console.error('CRITICAL ERROR: Email was not stored as normalized lowercase!');
      console.error(`- Expected: "${normalizedEmail}"`);
      console.error(`- Actual:   "${user.email}"`);
      // Try to understand why by checking another direct query
      const checkUser = await db.get('SELECT email FROM User WHERE id = ?', [userId]);
      console.error('Verification query returned:', checkUser?.email);
    } else if (user) {
      console.log('Email verification successful - stored as lowercase:', user.email);
    }
    
    if (!user) {
      throw new Error('User was created but could not be retrieved');
    }
    
    console.log('User successfully created and retrieved with ID:', userId);
    return { success: true, data: user };
  } catch (sqlError) {
    console.error('SQL Error during user creation:', sqlError);
    
    // Create more specific error messages
    let errorMessage = 'Database error during user creation';
    if (sqlError instanceof Error) {
      if (sqlError.message.includes('UNIQUE constraint failed')) {
        errorMessage = 'Email already in use';
      } else {
        errorMessage = sqlError.message;
      }
    }
    
    throw new Error(errorMessage);
  } finally {
    // Make sure we always close the DB connection
    if (db) {
      try {
        await db.close();
        console.log('Database connection closed');
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
  }
}

/**
 * Checks if a user with the given email exists
 */
export async function checkUserExists(email: string): Promise<boolean> {
  let db;
  try {
    db = await open({
      filename: './prisma/dev.db',
      driver: sqlite3.Database
    });
    
    // Normalize email for consistent case-insensitive check
    const normalizedEmail = email.trim().toLowerCase();
    console.log('Checking if user exists with normalized email:', normalizedEmail);
    
    // Use case-insensitive check
    const user = await db.get('SELECT id FROM User WHERE LOWER(email) = ?', [normalizedEmail]);
    
    console.log('User exists check result:', !!user);
    return !!user;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    // Return false on error to avoid blocking registration flow
    // This is safe because the unique constraint will still be enforced by the database
    return false;
  } finally {
    // Make sure we always close the DB connection
    if (db) {
      try {
        await db.close();
        console.log('Database connection closed after user check');
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
  }
}
