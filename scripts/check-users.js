const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function checkUsers() {
  try {
    // Open the database
    const db = await open({
      filename: './prisma/dev.db',
      driver: sqlite3.Database
    });

    console.log('Checking User table...');
    const tableInfo = await db.all("PRAGMA table_info(User)");
    console.log('User table columns:', tableInfo.map(col => `${col.name} (${col.type})`));
    
    console.log('\nListing all users:');
    const users = await db.all('SELECT id, email, firstName, lastName, password, role FROM User');
    
    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      users.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Name: ${user.firstName} ${user.lastName}`);
        console.log(`Role: ${user.role}`);
        console.log(`Has Password: ${user.password ? 'Yes' : 'No'}`);
        console.log(`Password Length: ${user.password ? user.password.length : 0}`);
        console.log('------------------------------');
      });
    }

    await db.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error checking users:', error);
  }
}

checkUsers();
