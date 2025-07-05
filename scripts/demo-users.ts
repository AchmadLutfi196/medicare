// Demo users for testing login/register functionality
// This script can be run in browser console to add demo users

const demoUsers = [
  {
    id: 'demo-admin-1',
    email: 'admin@medicare.com',
    firstName: 'Administrator',
    lastName: 'System',
    phone: '+62 812-3456-7890',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo-patient-1', 
    email: 'patient@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+62 812-1234-5678',
    role: 'patient',
    dateOfBirth: '1990-01-15',
    gender: 'male',
    address: 'Jl. Contoh No. 123, Jakarta',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo-doctor-1',
    email: 'doctor@medicare.com',
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    phone: '+62 812-9876-5432',
    role: 'doctor',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Function to add demo users to localStorage
function addDemoUsers() {
  if (typeof window !== 'undefined') {
    const existingUsers = JSON.parse(localStorage.getItem('medicare_users') || '[]');
    
    // Only add if not already present
    demoUsers.forEach(demoUser => {
      const userExists = existingUsers.find((u: any) => u.email === demoUser.email);
      if (!userExists) {
        existingUsers.push(demoUser);
      }
    });
    
    localStorage.setItem('medicare_users', JSON.stringify(existingUsers));
    console.log('Demo users added to localStorage:', existingUsers);
  }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  addDemoUsers();
}

export { demoUsers, addDemoUsers };
