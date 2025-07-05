// Test script to debug registration and login flow
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const { v4: uuidv4 } = require('uuid');

async function createAndLoginTestUser() {
  let db;
  try {
    console.log('Opening database connection...');
    db = await open({
      filename: './prisma/dev.db',
      driver: sqlite3.Database
    });
    
    // Create test user data
    const testUser = {
      id: uuidv4(),
      email: `test_${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      phone: '1234567890',
      password: 'test123',
      role: 'PATIENT',
      isActive: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Creating test user with data:', {
      id: testUser.id,
      email: testUser.email,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      password: testUser.password
    });
    
    // Insert test user
    await db.run(
      `INSERT INTO User (
        id, email, firstName, lastName, phone, 
        role, isActive, password, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        testUser.id,
        testUser.email,
        testUser.firstName,
        testUser.lastName,
        testUser.phone,
        testUser.role,
        testUser.isActive,
        testUser.password,
        testUser.createdAt,
        testUser.updatedAt
      ]
    );
    
    console.log('Test user created successfully');
    
    // Verify the user was created
    const createdUser = await db.get(
      'SELECT id, email, firstName, lastName, password, role FROM User WHERE id = ?',
      [testUser.id]
    );
    
    if (createdUser) {
      console.log('User found in database:', createdUser);
    } else {
      console.log('ERROR: User not found after creation!');
    }
    
    // Test login with the test user
    console.log('\nTesting login with created user...');
    const loginTest = await db.get(
      'SELECT * FROM User WHERE LOWER(email) = ? AND password = ?',
      [testUser.email.toLowerCase(), testUser.password]
    );
    
    if (loginTest) {
      console.log('Login test successful - user found with correct password');
      console.log('Retrieved data:', {
        id: loginTest.id,
        email: loginTest.email,
        firstName: loginTest.firstName,
        lastName: loginTest.lastName,
        role: loginTest.role
      });
    } else {
      console.log('ERROR: Login test failed - user not found or password mismatch');
      
      // Try to find the user without password check
      const userCheck = await db.get(
        'SELECT email, password FROM User WHERE LOWER(email) = ?',
        [testUser.email.toLowerCase()]
      );
      
      if (userCheck) {
        console.log('User found by email but password mismatch:');
        console.log(`Stored password: "${userCheck.password}"`);
        console.log(`Test password: "${testUser.password}"`);
      } else {
        console.log('User not found by email at all');
      }
    }
    
    // Test login with incorrect case email
    console.log('\nTesting login with uppercase email...');
    const uppercaseEmail = testUser.email.toUpperCase();
    const caseInsensitiveTest = await db.get(
      'SELECT * FROM User WHERE LOWER(email) = LOWER(?)',
      [uppercaseEmail]
    );
    
    if (caseInsensitiveTest) {
      console.log('Case-insensitive login test successful');
      console.log('User found with email:', uppercaseEmail);
    } else {
      console.log('ERROR: Case-insensitive login failed');
    }
    
    // List all users in database for debugging
    console.log('\nAll users in database:');
    const allUsers = await db.all('SELECT email, password FROM User');
    console.table(allUsers);
    
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    if (db) {
      await db.close();
      console.log('Database connection closed');
    }
  }
}

createAndLoginTestUser().then(() => console.log('Test completed'));
