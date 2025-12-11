import ollama from "ollama";

const stream = await ollama.chat({
  model: "gemma3",
  messages: [{ role: "user", content: "Expplain the meaning of name vijaya" }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.message?.content || "");
}