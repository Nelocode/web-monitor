const axios = require('axios');

async function listModels() {
    const apiKey = "AIzaSyB1mKkyd91iTC4218PPvOs-rH-N0-V1cIM";
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log("Models:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Error listing models:", error.response ? error.response.data : error.message);
    }
}

listModels();
