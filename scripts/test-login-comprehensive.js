// Comprehensive test script for login and registration
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const { v4: uuidv4 } = require('uuid');

async function runComprehensiveLoginTest() {
  let db;
  try {
    console.log('Opening database connection...');
    db = await open({
      filename: './prisma/dev.db', 
      driver: sqlite3.Database
    });
    
    // 1. Create a test user with mixed-case email
    const testId = uuidv4();
    const testEmail = `Test.User${Date.now()}@Example.com`;
    const normalizedEmail = testEmail.toLowerCase();
    const testPassword = 'test123';
    
    console.log(`\n1. Creating test user with email: "${testEmail}"`);
    console.log(`   Normalized email would be: "${normalizedEmail}"`);
    
    // Insert the user with the original mixed-case email
    await db.run(
      `INSERT INTO User (
        id, email, firstName, lastName, phone, 
        role, isActive, password, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        testId,
        testEmail, // Use the mixed-case email
        'Test',
        'User',
        '1234567890',
        'PATIENT',
        1,
        testPassword,
        new Date().toISOString(),
        new Date().toISOString()
      ]
    );
    
    // 2. Verify the user was created with the correct email case
    console.log('\n2. Verifying user was created correctly');
    const createdUser = await db.get('SELECT id, email, password FROM User WHERE id = ?', [testId]);
    if (createdUser) {
      console.log(`   ✅ User created with email: "${createdUser.email}"`);
      console.log(`   Password stored: "${createdUser.password}"`);
    } else {
      console.log('   ❌ Failed to create test user');
    }
    
    // 3. Test login with exact email case match
    console.log('\n3. Testing login with exact email case match');
    const exactCaseUser = await db.get(
      'SELECT id, email FROM User WHERE email = ? AND password = ?', 
      [testEmail, testPassword]
    );
    
    if (exactCaseUser) {
      console.log(`   ✅ Login successful with exact case: "${testEmail}"`);
    } else {
      console.log(`   ❌ Login failed with exact case: "${testEmail}"`);
    }
    
    // 4. Test login with lowercase email (case-insensitive)
    console.log('\n4. Testing login with lowercase email (case-insensitive)');
    const lowerCaseUser = await db.get(
      'SELECT id, email FROM User WHERE LOWER(email) = LOWER(?) AND password = ?', 
      [testEmail.toLowerCase(), testPassword]
    );
    
    if (lowerCaseUser) {
      console.log(`   ✅ Login successful with lowercase: "${testEmail.toLowerCase()}"`);
    } else {
      console.log(`   ❌ Login failed with lowercase: "${testEmail.toLowerCase()}"`);
    }
    
    // 5. Test with our custom login function (similar to auth-utils.ts)
    console.log('\n5. Testing with custom login function (like auth-utils.ts)');
    const customLoginUser = await db.get(
      'SELECT * FROM User WHERE LOWER(email) = ? AND password = ?', 
      [testEmail.toLowerCase(), testPassword]
    );
    
    if (customLoginUser) {
      console.log(`   ✅ Custom login successful with lowercase: "${testEmail.toLowerCase()}"`);
    } else {
      console.log(`   ❌ Custom login failed with lowercase: "${testEmail.toLowerCase()}"`);
      
      // Debug why the login failed
      const userByEmail = await db.get('SELECT email, password FROM User WHERE LOWER(email) = ?', [testEmail.toLowerCase()]);
      if (userByEmail) {
        console.log(`   Found user by email: "${userByEmail.email}"`);
        console.log(`   Stored password: "${userByEmail.password}", Test password: "${testPassword}"`);
        console.log(`   Passwords match: ${userByEmail.password === testPassword}`);
      } else {
        console.log(`   No user found with email (case-insensitive): "${testEmail.toLowerCase()}"`);
      }
    }
    
    // 6. Normalize this user's email to lowercase
    console.log('\n6. Normalizing user email to lowercase');
    await db.run(
      'UPDATE User SET email = ? WHERE id = ?',
      [testEmail.toLowerCase(), testId]
    );
    
    const normalizedUser = await db.get('SELECT id, email FROM User WHERE id = ?', [testId]);
    console.log(`   User email updated to: "${normalizedUser.email}"`);
    
    // 7. Test login after normalization
    console.log('\n7. Testing login after normalization');
    const afterNormalizeUser = await db.get(
      'SELECT id, email FROM User WHERE email = ? AND password = ?', 
      [testEmail.toLowerCase(), testPassword]
    );
    
    if (afterNormalizeUser) {
      console.log(`   ✅ Login successful with normalized email: "${testEmail.toLowerCase()}"`);
    } else {
      console.log(`   ❌ Login failed with normalized email: "${testEmail.toLowerCase()}"`);
    }
    
    // Clean up by removing the test user
    console.log('\n8. Cleaning up - removing test user');
    await db.run('DELETE FROM User WHERE id = ?', [testId]);
    console.log('   Test user removed');
    
  } catch (error) {
    console.error('Error during comprehensive login test:', error);
  } finally {
    if (db) {
      await db.close();
      console.log('\nDatabase connection closed');
    }
  }
}

runComprehensiveLoginTest().then(() => console.log('Test completed'));
