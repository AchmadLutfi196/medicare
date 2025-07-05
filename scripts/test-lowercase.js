// Script untuk menguji registrasi dengan email lowercase
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const { v4: uuidv4 } = require('uuid');

async function main() {
  const db = await open({
    filename: './prisma/dev.db',
    driver: sqlite3.Database
  });

  try {
    // Buat pengguna pengujian baru dengan email huruf besar dan pastikan lowercase
    const originalEmail = `TEST_${Date.now()}@ExAmPlE.cOm`;
    const normalizedEmail = originalEmail.trim().toLowerCase();
    const testPassword = "test123";
    const testFirstName = "Test";
    const testLastName = "User";
    const userId = uuidv4();
    const now = new Date().toISOString();

    console.log(`Creating test user:`);
    console.log(`- Original email: ${originalEmail}`);
    console.log(`- Normalized email: ${normalizedEmail}`);

    // Insert pengguna dengan MEMASTIKAN menggunakan email lowercase
    console.log('Executing INSERT with explicit lowercase email');
    await db.run(
      `INSERT INTO User (
        id, email, firstName, lastName, phone, 
        role, isActive, password, 
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        normalizedEmail, // EXPLICITLY using normalized lowercase email
        testFirstName,
        testLastName,
        "1234567890",
        'PATIENT',
        1,
        testPassword,
        now,
        now
      ]
    );

    console.log('User insert completed');

    // Cek apakah email benar-benar disimpan sebagai lowercase
    const userCheck = await db.get('SELECT id, email FROM User WHERE id = ?', [userId]);
    console.log('\nChecking stored email:');
    console.log(`- ID: ${userCheck.id}`);
    console.log(`- Stored email: "${userCheck.email}"`);
    console.log(`- Should be: "${normalizedEmail}"`);
    console.log(`- Matches expected lowercase: ${userCheck.email === normalizedEmail}`);
    
    // Periksa apakah bisa login dengan email lowercase
    const loginCheck = await db.get(
      'SELECT id FROM User WHERE email = ? AND password = ?',
      [normalizedEmail, testPassword]
    );
    console.log(`\nCan login with lowercase email: ${loginCheck ? 'YES' : 'NO'}`);

    // Periksa apakah bisa login dengan email original case
    const originalLoginCheck = await db.get(
      'SELECT id FROM User WHERE email = ? AND password = ?',
      [originalEmail, testPassword]
    );
    console.log(`Can login with original case email: ${originalLoginCheck ? 'YES' : 'NO'}`);

    // Periksa dengan query case-insensitive
    const caseInsensitiveCheck = await db.get(
      'SELECT id FROM User WHERE LOWER(email) = LOWER(?) AND password = ?',
      [originalEmail, testPassword]
    );
    console.log(`Can login with case-insensitive query: ${caseInsensitiveCheck ? 'YES' : 'NO'}`);

    // Hapus data pengujian
    await db.run('DELETE FROM User WHERE id = ?', [userId]);
    console.log('\nTest user deleted from database');

  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await db.close();
  }
}

main().catch(console.error);
