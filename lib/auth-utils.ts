// Authentication utilities for direct database access
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

/**
 * Login a user directly with SQLite
 */
export async function directLogin(email: string, password: string) {
  let db;
  try {
    db = await open({
      filename: './prisma/dev.db',
      driver: sqlite3.Database
    });

    console.log('Attempting direct login for:', email);
    
    // Make sure email is lowercase to ensure consistent case-insensitive matching
    const lowercaseEmail = email.toLowerCase().trim();
    console.log('Normalized email for login:', lowercaseEmail);
    
    // Check if the User table exists and has the expected columns
    try {
      const tableInfo = await db.all("PRAGMA table_info(User)");
      console.log('User table columns:', tableInfo.map(col => `${col.name} (${col.type})`));
      
      if (!tableInfo.some(col => col.name === 'password')) {
        console.error('Password column is missing from User table!');
        return {
          success: false,
          error: 'Database error: password column missing'
        };
      }
    } catch (schemaError) {
      console.error('Error checking schema:', schemaError);
    }
    
    // Find user by email - do a case-insensitive search
    console.log('Finding user with email (case-insensitive):', lowercaseEmail);
    const user = await db.get(
      'SELECT * FROM User WHERE LOWER(email) = ?',
      [lowercaseEmail]
    );
    
    if (!user) {
      console.log('User not found:', email);
      
      // Check for any users with similar emails to help debugging
      const similarUsers = await db.all(
        "SELECT email FROM User WHERE email LIKE ?",
        [`%${email.split('@')[1]}`]
      );
      
      if (similarUsers.length > 0) {
        console.log('Found similar emails:', similarUsers.map(u => u.email));
      } else {
        console.log('No similar emails found in database');
      }
      
      return {
        success: false,
        error: 'Email atau password salah'
      };
    }
    
    console.log('User found, checking password');
    console.log('Database user data:', { 
      id: user.id,
      email: user.email, 
      hasPassword: !!user.password, 
      passwordLength: user.password ? user.password.length : 0,
      enteredPasswordLength: password.length,
      passwordsMatch: user.password === password
    });
    
    // Extra debugging for password comparison
    if (!user.password) {
      console.log('User has no password set!');
      return {
        success: false,
        error: 'Akun ini belum memiliki password. Silahkan hubungi admin.'
      };
    }
    
    // Check password (in production, use proper password hashing)
    if (user.password !== password) {
      console.log('Password incorrect for user:', email);
      console.log(`Entered: "${password}" vs Stored: "${user.password}"`);
      return {
        success: false,
        error: 'Email atau password salah'
      };
    }
    
    // Check if user is active
    if (!user.isActive) {
      console.log('Account not active for user:', email);
      return {
        success: false,
        error: 'Akun Anda tidak aktif'
      };
    }
    
    console.log('Login successful for user:', email);
    
    // Remove password from returned user object
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      success: true,
      data: userWithoutPassword
    };
  } catch (error) {
    console.error('Direct login error:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan saat login'
    };
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (err) {
        console.error('Error closing DB connection:', err);
      }
    }
  }
}
