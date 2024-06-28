// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// const llm = new ChatGoogleGenerativeAI({
//   model: "gemini-pro", 
//   apiKey: import.meta.env.VITE_GOOGLE_GENAI_API_KEY, 
// });

// export async function getAnswer(question) {
//   let answer = "";
//   try {
//     const response = await llm.predict({
//       prompt: question, 
//       max_tokens: 150,  // Adjust as needed
//       temperature: 0.7, // Adjust as needed
//     });
//     answer = response.choices[0]?.text.trim() || "No response received";
//   } catch (e) {
//     console.error("Error fetching answer:", e);
//     answer = "An error occurred. Please try again.";
//   }
//   return answer;
// }
