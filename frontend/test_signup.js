const axios = require('axios');

async function testSignup() {
    try {
        console.log("Testing POST /auth/signup...");
        const response = await axios.post('http://localhost:8000/api/v1/auth/signup', {
            email: "testuser" + Date.now() + "@example.com",
            password: "TestPassword123!",
            full_name: "Test User"
        });
        console.log("Signup successful!");
        console.log("Status:", response.status);
        console.log("Data:", response.data);
    } catch (error) {
        console.error("Signup failed:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error("No response received. Server might be down or not reachable.");
        }
    }
}

testSignup();
