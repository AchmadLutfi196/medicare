// A simple script to test user creation with Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCreateUser() {
  try {
    console.log('Testing user creation with password field...');
    
    const testUser = await prisma.user.create({
      data: {
        email: 'test-user@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890',
        password: 'testpass123',
        role: 'PATIENT',
        isActive: true,
        gender: 'MALE',
        dateOfBirth: '1990-01-01',
        address: '123 Test Street'
      }
    });
    
    console.log('User created successfully:', testUser);
    return true;
  } catch (error) {
    console.error('Error creating user:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

testCreateUser()
  .then(success => {
    console.log('Test completed, success:', success);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  });
