// Script untuk menguji proses registrasi dan login secara lengkap
// Jalankan setelah perbaikan untuk memastikan semuanya berfungsi dengan baik

const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const fetch = require('node-fetch');

// Fungsi untuk membuat user baru melalui API registrasi
async function testRegisterAndLogin() {
  console.log('==== COMPREHENSIVE REGISTRATION & LOGIN TEST ====');
  
  // Buat data user unik dengan email campuran huruf besar/kecil
  const testEmail = `TEST_${Date.now()}@ExAmPlE.cOm`;
  const testPassword = 'test123';
  const testFirstName = 'Test';
  const testLastName = 'User';
  const testPhone = '1234567890';
  
  try {
    console.log(`\n1. REGISTERING with email: ${testEmail}`);
    // 1. Daftar user baru
    const regResponse = await fetch('http://localhost:3001/api/auth/direct-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        firstName: testFirstName,
        lastName: testLastName,
        phone: testPhone
      })
    });
    
    const regResult = await regResponse.json();
    console.log('Registration result:', {
      success: regResult.success,
      error: regResult.error || 'none',
      hasUserData: !!regResult.data
    });
    
    if (!regResult.success) {
      console.error('Registration failed. Test aborted.');
      return;
    }
    
    // 2. Periksa user yang terdaftar di database
    console.log('\n2. CHECKING created user in database');
    const db = await open({
      filename: './prisma/dev.db',
      driver: sqlite3.Database
    });
    
    const storedUser = await db.get('SELECT id, email, firstName, lastName, password FROM User WHERE LOWER(email) = ?', [testEmail.toLowerCase()]);
    
    if (!storedUser) {
      console.error('User not found in database!');
      return;
    }
    
    console.log('Database record:', {
      id: storedUser.id,
      email: storedUser.email,
      firstName: storedUser.firstName,
      lastName: storedUser.lastName,
      passwordStored: !!storedUser.password
    });
    
    // Verifikasi email disimpan sebagai lowercase
    console.log(`Email normalized correctly:`, storedUser.email === testEmail.toLowerCase());
    
    // 3. Login dengan email yang sama persis (mixed case)
    console.log('\n3. ATTEMPTING LOGIN with original mixed-case email');
    const loginResponse1 = await fetch('http://localhost:3001/api/auth/direct-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    
    const loginResult1 = await loginResponse1.json();
    console.log('Login result with original case:', {
      success: loginResult1.success,
      error: loginResult1.error || 'none',
      hasUserData: !!loginResult1.data
    });
    
    // 4. Login dengan email lowercase
    console.log('\n4. ATTEMPTING LOGIN with lowercase email');
    const loginResponse2 = await fetch('http://localhost:3001/api/auth/direct-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail.toLowerCase(),
        password: testPassword
      })
    });
    
    const loginResult2 = await loginResponse2.json();
    console.log('Login result with lowercase email:', {
      success: loginResult2.success,
      error: loginResult2.error || 'none',
      hasUserData: !!loginResult2.data
    });
    
    // 5. Login dengan password yang salah
    console.log('\n5. ATTEMPTING LOGIN with wrong password');
    const loginResponse3 = await fetch('http://localhost:3001/api/auth/direct-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'wrong_password'
      })
    });
    
    const loginResult3 = await loginResponse3.json();
    console.log('Login result with wrong password:', {
      success: loginResult3.success,
      error: loginResult3.error || 'none'
    });
    
    // 6. Hapus user yang dibuat untuk test
    console.log('\n6. CLEANING UP test user');
    await db.run('DELETE FROM User WHERE id = ?', [storedUser.id]);
    console.log('Test user deleted successfully');
    
    await db.close();
    
    // 7. Kesimpulan test
    console.log('\n==== TEST SUMMARY ====');
    console.log('Registration:', regResult.success ? 'PASS ✓' : 'FAIL ✗');
    console.log('Email storage normalized:', storedUser.email === testEmail.toLowerCase() ? 'PASS ✓' : 'FAIL ✗');
    console.log('Login with original case:', loginResult1.success ? 'PASS ✓' : 'FAIL ✗');
    console.log('Login with lowercase:', loginResult2.success ? 'PASS ✓' : 'FAIL ✗');
    console.log('Login with wrong password rejected:', !loginResult3.success ? 'PASS ✓' : 'FAIL ✗');
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testRegisterAndLogin();
