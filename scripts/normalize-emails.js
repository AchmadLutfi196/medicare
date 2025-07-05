// Script to normalize all email addresses in the database
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function normalizeEmailsInDatabase() {
  let db;
  try {
    console.log('Opening database connection...');
    db = await open({
      filename: './prisma/dev.db',
      driver: sqlite3.Database
    });
    
    // Get all users
    const users = await db.all('SELECT id, email FROM User');
    console.log(`Found ${users.length} users in the database`);
    
    // Process each user to normalize their email
    for (const user of users) {
      const originalEmail = user.email;
      const normalizedEmail = originalEmail.trim().toLowerCase();
      
      // Only update if there's a difference
      if (originalEmail !== normalizedEmail) {
        console.log(`Updating email: "${originalEmail}" -> "${normalizedEmail}"`);
        await db.run(
          'UPDATE User SET email = ? WHERE id = ?',
          [normalizedEmail, user.id]
        );
      }
    }
    
    // Verify all emails
    const updatedUsers = await db.all('SELECT id, email FROM User');
    console.log('\nAll users after normalization:');
    updatedUsers.forEach(user => {
      console.log(`- ${user.id}: ${user.email}`);
    });
    
    console.log('\nEmail normalization completed successfully');
    
  } catch (error) {
    console.error('Error normalizing emails:', error);
  } finally {
    if (db) {
      await db.close();
      console.log('Database connection closed');
    }
  }
}

normalizeEmailsInDatabase().catch(console.error);
