// Script to test login functionality
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function checkLogin(email, password) {
  let db;
  try {
    // Open the database connection
    db = await open({
      filename: './prisma/dev.db',
      driver: sqlite3.Database
    });
    
    console.log('--- Checking login for:', email, '---');
    
    // Examine database structure
    console.log('\nDatabase structure check:');
    const tableInfo = await db.all("PRAGMA table_info(User)");
    console.log('User table columns:', tableInfo.map(col => `${col.name} (${col.type})`));
    
    // Check if user exists
    console.log('\nUser search:');
    const user = await db.get('SELECT * FROM User WHERE email = ?', [email]);
    
    if (!user) {
      console.log('❌ User not found with exact email match.');
      
      // Try case insensitive search
      const userInsensitive = await db.get('SELECT * FROM User WHERE LOWER(email) = LOWER(?)', [email]);
      if (userInsensitive) {
        console.log('✅ User found with case-insensitive match!');
        console.log('Database email:', userInsensitive.email);
        console.log('Searched email:', email);
      } else {
        // Look for similar emails to help debugging
        const similarUsers = await db.all("SELECT id, email FROM User WHERE email LIKE ?", [`%${email.split('@')[1]}`]);
        console.log('Similar emails in database:', similarUsers.map(u => u.email));
      }
      
      // List all users in the database
      console.log('\nAll users in database:');
      const allUsers = await db.all('SELECT id, email FROM User');
      allUsers.forEach(user => {
        console.log(`- ${user.id}: ${user.email}`);
      });
      
      return { success: false, error: 'User not found' };
    }
    
    // Check password
    console.log('\nPassword check:');
    console.log('User found:', { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName, 
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0,
      enteredPasswordLength: password.length,
      passwordsMatch: user.password === password,
      isActive: user.isActive
    });
    
    if (!user.password) {
      console.log('❌ User has no password set!');
      return { success: false, error: 'No password set for this user' };
    }
    
    if (user.password !== password) {
      console.log('❌ Password mismatch!');
      console.log(`Entered: "${password}"`);
      console.log(`Stored:  "${user.password}"`);
      return { success: false, error: 'Password incorrect' };
    }
    
    console.log('✅ Password matches!');
    return { success: true, data: { id: user.id, email: user.email } };
    
  } catch (error) {
    console.error('Error checking login:', error);
    return { success: false, error: error.message };
  } finally {
    if (db) await db.close();
  }
}

// Run the test with demo accounts
async function runTests() {
  console.log('=== RUNNING LOGIN TESTS ===\n');
  
  // Test admin login
  const adminResult = await checkLogin('admin@medicare.com', 'admin123');
  console.log('\nAdmin login test result:', adminResult.success ? '✅ SUCCESS' : '❌ FAILED', '\n');
  
  // Test patient login
  const patientResult = await checkLogin('patient@example.com', 'patient123');
  console.log('\nPatient login test result:', patientResult.success ? '✅ SUCCESS' : '❌ FAILED', '\n');
  
  // Test case sensitivity
  const caseResult = await checkLogin('Admin@Medicare.com', 'admin123');
  console.log('\nCase sensitivity test result:', caseResult.success ? '✅ SUCCESS' : '❌ FAILED', '\n');
}

runTests().catch(console.error);
