const { execSync } = require("child_process");

async function main() {
  console.log("API KEY EXISTS:", !!process.env.OPENAI_API_KEY);

  const diff = execSync("git diff HEAD~1").toString();

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
          { role: "system", content: "You are a code reviewer" },
          { role: "user", content: diff }
        ]
      })
    });

    const data = await response.json();

    console.log("=== RAW RESPONSE ===");
    console.log(JSON.stringify(data, null, 2));

    if (!data.choices) {
      console.log("❌ API ERROR:", data);
      return;
    }

    console.log("=== AI REVIEW ===");
    console.log(data.choices[0].message.content);

  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
}

main();