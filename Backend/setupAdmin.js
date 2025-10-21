// setupAdmin.js
const axios = require('axios');

async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin account...');
    
    // Add a small delay to ensure server is fully ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // First test basic connection
    console.log('Testing server connection...');
    const testResponse = await axios.get('http://localhost:5000/api/test', {
      timeout: 5000 // 5 second timeout
    });
    console.log('✅ Server connection test:', testResponse.data.message);
    
    // Setup admin account
    console.log('Setting up admin account...');
    const response = await axios.post('http://localhost:5000/api/admin/setup', {
      contactNumber: '0000000000',
      password: '000000'
    }, {
      timeout: 10000 // 10 second timeout for setup
    });
    
    console.log('✅ Admin setup response:', response.data);
    
    // Small delay to ensure database is updated
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verify admin was created
    console.log('Verifying admin account...');
    const checkResponse = await axios.get('http://localhost:5000/api/admin/check', {
      timeout: 5000
    });
    console.log('✅ Admin verification:', checkResponse.data);
    
    console.log('🎉 Admin setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Admin setup failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
      console.error('Make sure the backend server is started on port 5000');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Please start the server first:');
      console.error('  node server.js');
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1); // Exit with error code
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  setupAdmin();
}

module.exports = setupAdmin; // Allow importing in other files