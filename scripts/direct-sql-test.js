// Create user directly with SQL
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./prisma/dev.db');

async function createUserDirectly() {
  try {
    console.log('Creating user directly with SQL...');
    
    // Generate a UUID for the user ID
    const userId = require('crypto').randomUUID();
    const now = new Date().toISOString();
    
    // Insert user with all required fields
    db.run(`
      INSERT INTO User (
        id, email, firstName, lastName, phone, 
        dateOfBirth, gender, address, 
        role, isActive, password, 
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      'sql-test@example.com',
      'SQL',
      'Test',
      '1234567890',
      '1990-01-01',
      'MALE',
      '123 SQL Street',
      'PATIENT',
      1, // TRUE for isActive
      'password123',
      now,
      now
    ], function(err) {
      if (err) {
        console.error('Error inserting user:', err);
      } else {
        console.log('User inserted successfully! ID:', userId);
      }
      
      db.close();
    });
  } catch (error) {
    console.error('Error:', error);
    db.close();
  }
}

createUserDirectly();
