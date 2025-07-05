// Script untuk menguji proses registrasi dan login
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const { v4: uuidv4 } = require('uuid');

async function main() {
  const db = await open({
    filename: './prisma/dev.db',
    driver: sqlite3.Database
  });

  try {
    // 1. Buat pengguna pengujian baru dengan email mengandung huruf besar
    const testEmail = `TEST_${Date.now()}@ExAmPlE.cOm`;
    const testPassword = "test123";
    const testFirstName = "Test";
    const testLastName = "User";
    const userId = uuidv4();
    const now = new Date().toISOString();

    console.log(`\n1. Creating test user with email: ${testEmail}`);

    // Cek apakah email unik (case insensitive)
    const existingUser = await db.get('SELECT id FROM User WHERE LOWER(email) = ?', [testEmail.toLowerCase()]);
    if (existingUser) {
      console.log('Email already exists in database (case insensitive match)');
      return;
    }

    // Insert pengguna dengan email asli (dengan huruf besar)
    await db.run(
      `INSERT INTO User (
        id, email, firstName, lastName, phone, 
        dateOfBirth, gender, address, 
        role, isActive, password, 
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        testEmail, // Email asli dengan case mixed
        testFirstName,
        testLastName,
        "1234567890",
        null,
        null,
        null,
        'PATIENT',
        1,
        testPassword,
        now,
        now
      ]
    );

    console.log('User created successfully');

    // 2. Coba login dengan email yang sama persis
    console.log(`\n2. Trying login with exact same email: ${testEmail}`);
    const exactUser = await db.get(
      'SELECT id, email, firstName, lastName FROM User WHERE email = ? AND password = ?',
      [testEmail, testPassword]
    );
    
    console.log('Login with exact email:', exactUser ? 'SUCCESS' : 'FAILED');
    if (exactUser) {
      console.log('User found:', exactUser);
    }

    // 3. Coba login dengan email lowercase
    console.log(`\n3. Trying login with lowercase email: ${testEmail.toLowerCase()}`);
    const lowerUser = await db.get(
      'SELECT id, email, firstName, lastName FROM User WHERE LOWER(email) = LOWER(?) AND password = ?',
      [testEmail.toLowerCase(), testPassword]
    );
    
    console.log('Login with lowercase email:', lowerUser ? 'SUCCESS' : 'FAILED');
    if (lowerUser) {
      console.log('User found:', lowerUser);
    }

    // 4. Cek implementasi yang sesuai dengan auth-utils.ts
    console.log(`\n4. Simulating direct login from auth-utils.ts`);
    const lowercaseEmail = testEmail.toLowerCase().trim();
    const authUser = await db.get(
      'SELECT * FROM User WHERE LOWER(email) = ?',
      [lowercaseEmail]
    );
    
    console.log('Login with auth-utils approach:', authUser ? 'SUCCESS' : 'FAILED');
    if (authUser) {
      console.log('User found with ID:', authUser.id);
      console.log('Password check:', authUser.password === testPassword ? 'PASS' : 'FAIL');
    }

    // 5. Tampilkan bagaimana email pengguna disimpan di database
    console.log(`\n5. Checking how email was stored in database`);
    const storedUser = await db.get(
      'SELECT id, email, password FROM User WHERE id = ?',
      [userId]
    );
    
    if (storedUser) {
      console.log('Stored user data:');
      console.log('- ID:', storedUser.id);
      console.log('- Email (as stored):', storedUser.email);
      console.log('- Email (lowercase):', storedUser.email.toLowerCase());
      console.log('- Password (as stored):', storedUser.password);
      
      // Verifikasi apakah disimpan sesuai case asli atau sudah dinormalisasi
      if (storedUser.email === testEmail) {
        console.log('ISSUE FOUND: Email stored with original case - NOT normalized!');
      } else if (storedUser.email === testEmail.toLowerCase()) {
        console.log('Email stored correctly as lowercase');
      } else {
        console.log('Email modified in unexpected way');
      }
    }

    // 6. Hapus data pengujian
    await db.run('DELETE FROM User WHERE id = ?', [userId]);
    console.log('\nTest user deleted from database');

  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await db.close();
  }
}

main().catch(console.error);
