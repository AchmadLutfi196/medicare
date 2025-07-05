import prisma from '../lib/prisma';

async function createTestUser() {
  try {
    console.log('Attempting to create test user...');
    
    const userData = {
      email: 'test-user@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '1234567890',
      password: 'password123',
      gender: 'MALE' as const,
      role: 'PATIENT' as const,
      isActive: true
    };
    
    const user = await prisma.user.create({
      data: userData
    });
    
    console.log('User created successfully:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
