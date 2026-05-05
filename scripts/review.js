import fs from "fs";
import { execSync } from "child_process";

const diff = execSync("git diff HEAD~1").toString();

console.log("=== CODE DIFF ===");
console.log(diff);

const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "You are a senior code reviewer"
      },
      {
        role: "user",
        content: `Review this code:\n${diff}`
      }
    ]
  })
});

const data = await response.json();

console.log("=== AI REVIEW ===");
console.log(data.choices[0].message.content);
console.log(process.env.OPENAI_API_KEY ? "OK" : "NO KEY");