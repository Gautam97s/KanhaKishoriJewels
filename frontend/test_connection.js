const axios = require('axios');

async function testConnection() {
    try {
        console.log("Testing connection to backend...");
        const response = await axios.get('http://localhost:8000/api/v1/products/');
        console.log("Connection successful!");
        console.log("Products received:", response.data.length);
        if (response.data.length === 0) {
            console.log("Note: Database is empty, but connection works.");
        }
    } catch (error) {
        console.error("Connection failed:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
    }
}

testConnection();
