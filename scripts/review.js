const { execSync } = require("child_process");

async function main() {
  const diff = execSync("git diff HEAD~1").toString();

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

  console.log(data.choices[0].message.content);
}

main();