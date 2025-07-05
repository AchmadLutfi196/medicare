// Test registration directly

async function testRegistration() {
  try {
    console.log('Testing registration API...');
    
    const userData = {
      email: 'test-registration@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'Registration',
      phone: '9876543210',
      dateOfBirth: '1995-01-01',
      gender: 'MALE',
      address: '123 Test Street'
    };
    
    console.log('Sending registration data:', {
      ...userData,
      password: '********'
    });
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const contentType = response.headers.get('content-type');
    console.log('Response status:', response.status);
    console.log('Content type:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      console.log('Registration result:', JSON.stringify(result, null, 2));
    } else {
      const text = await response.text();
      console.log('Response (text):', text.substring(0, 500));
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}

testRegistration();
