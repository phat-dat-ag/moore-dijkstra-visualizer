const { execSync } = require("child_process");

async function main() {
  console.log("API KEY EXISTS:", !!process.env.OPENAI_API_KEY);

  let diff = "";
  try {
    diff = execSync("git diff HEAD~1").toString().slice(0, 4000);
  } catch {
    diff = execSync("git diff").toString().slice(0, 4000);
  }

  try {
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
            content: "You are a senior code reviewer. Give concise, actionable feedback."
          },
          {
            role: "user",
            content: `Review this code diff:\n${diff}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.log("API ERROR:");
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    console.log("=== AI REVIEW ===");
    console.log(data.choices[0].message.content);

  } catch (err) {
    console.error("REQUEST FAILED:", err.message);
  }
}

main();