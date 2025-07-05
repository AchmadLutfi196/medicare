const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function setPasswords() {
  try {
    // Open the database
    const db = await open({
      filename: './prisma/dev.db',
      driver: sqlite3.Database
    });

    console.log('Setting passwords for default users...');
    
    // Set password for admin@medicare.com
    await db.run(
      'UPDATE User SET password = ? WHERE email = ?',
      ['admin123', 'admin@medicare.com']
    );
    console.log('Set password for admin@medicare.com');
    
    // Set password for doctor1@medicare.com
    await db.run(
      'UPDATE User SET password = ? WHERE email = ?',
      ['doctor123', 'doctor1@medicare.com']
    );
    console.log('Set password for doctor1@medicare.com');
    
    // Set password for doctor2@medicare.com
    await db.run(
      'UPDATE User SET password = ? WHERE email = ?',
      ['doctor123', 'doctor2@medicare.com']
    );
    console.log('Set password for doctor2@medicare.com');
    
    // Set password for patient@example.com
    await db.run(
      'UPDATE User SET password = ? WHERE email = ?',
      ['patient123', 'patient@example.com']
    );
    console.log('Set password for patient@example.com');
    
    console.log('\nVerifying passwords:');
    const users = await db.all('SELECT email, password FROM User');
    users.forEach(user => {
      console.log(`Email: ${user.email}, Password: ${user.password ? '********' : 'none'}, Length: ${user.password ? user.password.length : 0}`);
    });

    await db.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error setting passwords:', error);
  }
}

setPasswords();
