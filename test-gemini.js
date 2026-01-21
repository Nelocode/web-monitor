const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
  const apiKey = "AIzaSyB1mKkyd91iTC4218PPvOs-rH-N0-V1cIM";
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    console.log("Fetching available models...");
    // Using a different approach to check availability if listModels is complex to access directly via SDK in some versions,
    // but try standard way first.
    // Note: The SDK might not expose listModels on the main client in all versions, but let's try a simple generation first with a known safe model.
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, world!");
    console.log("Success! Response:", result.response.text());
  } catch (error) {
    console.error("Error with gemini-1.5-flash:", error.message);
    
    try {
        console.log("Retrying with gemini-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const resultPro = await modelPro.generateContent("Hello, world!");
        console.log("Success with gemini-pro:", resultPro.response.text());
    } catch (err2) {
        console.error("Error with gemini-pro:", err2.message);
    }
  }
}

testGemini();
