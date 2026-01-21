const axios = require('axios');

async function findModel() {
    const apiKey = "AIzaSyB1mKkyd91iTC4218PPvOs-rH-N0-V1cIM";
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const models = response.data.models;
        const validModels = models.filter(m => 
            m.name.includes('gemini') && 
            m.supportedGenerationMethods.includes('generateContent')
        );
        console.log("Valid Gemini Models:", validModels.map(m => m.name));
    } catch (error) {
        console.error(error);
    }
}

findModel();
