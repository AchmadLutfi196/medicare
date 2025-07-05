// Script untuk menguji login dengan akun tertentu
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const fetch = require('node-fetch');

async function testSpecificLogin() {
  console.log('=== TEST LOGIN FOR SPECIFIC USER ===');
  
  const testEmail = 'dosen@gmail.com';
  const testPassword = '123456'; // Password dari database
  
  try {
    // 1. Verifikasi user di database
    const db = await open({
      filename: './prisma/dev.db',
      driver: sqlite3.Database
    });
    
    console.log(`1. Checking database for user: ${testEmail}`);
    const user = await db.get('SELECT * FROM User WHERE LOWER(email) = ?', [testEmail.toLowerCase()]);
    
    if (!user) {
      console.error('User not found in database!');
      return;
    }
    
    console.log('User found in database:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0,
      isActive: !!user.isActive,
      role: user.role
    });
    
    // 2. Test login using the direct API
    console.log(`\n2. Testing login via direct API endpoint`);
    try {
      const loginResponse = await fetch('http://localhost:3001/api/auth/direct-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        })
      });
      
      if (!loginResponse.ok) {
        console.error(`API responded with status: ${loginResponse.status}`);
        try {
          const errorText = await loginResponse.text();
          console.error('Error response:', errorText);
        } catch (e) {
          console.error('Could not read error response');
        }
        return;
      }
      
      const loginResult = await loginResponse.json();
      console.log('Login API result:', {
        success: loginResult.success,
        error: loginResult.error || 'none',
        hasData: !!loginResult.data
      });
      
      if (loginResult.success && loginResult.data) {
        console.log('Login successful! User data:', {
          id: loginResult.data.id,
          email: loginResult.data.email,
          firstName: loginResult.data.firstName,
          lastName: loginResult.data.lastName,
          role: loginResult.data.role
        });
      } else {
        console.error('Login failed:', loginResult.error);
      }
    } catch (apiError) {
      console.error('API call error:', apiError);
    }
    
    // 3. Test manual password comparison for debugging
    console.log('\n3. Manual password verification:');
    console.log(`Stored password: "${user.password}"`);
    console.log(`Test password:   "${testPassword}"`);
    console.log(`Passwords match: ${user.password === testPassword}`);
    
    if (user.password !== testPassword) {
      console.log('Password mismatch details:');
      console.log(`- Stored password length: ${user.password.length}`);
      console.log(`- Test password length: ${testPassword.length}`);
      console.log(`- Character by character comparison:`);
      
      const maxLength = Math.max(user.password.length, testPassword.length);
      for (let i = 0; i < maxLength; i++) {
        const storedChar = user.password[i] || 'undefined';
        const testChar = testPassword[i] || 'undefined';
        const match = storedChar === testChar ? 'match' : 'MISMATCH';
        console.log(`  Position ${i}: ${storedChar} vs ${testChar} - ${match}`);
      }
    }
    
    // 4. Check for whitespace issues
    console.log('\n4. Checking for whitespace issues:');
    const trimmedPassword = testPassword.trim();
    console.log(`- Original password: "${testPassword}"`);
    console.log(`- Trimmed password: "${trimmedPassword}"`);
    console.log(`- Difference in length: ${testPassword.length - trimmedPassword.length}`);
    console.log(`- Trimmed password matches stored: ${user.password === trimmedPassword}`);
    
    await db.close();
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testSpecificLogin();
