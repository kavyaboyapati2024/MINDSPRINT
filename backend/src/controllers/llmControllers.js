import ollama from 'ollama';

/*
	POST /api/llm/stream
	Body: { prompt?: string, messages?: [{ role, content }], model?: string }

	Streams assistant content from the Ollama JS SDK to the client using
	Server-Sent Events (SSE)-style `data:` frames. The client should consume
	the response stream and parse SSE frames (split on "\n\n" and lines
	starting with "data:").

	Notes:
	- Requires `ollama` package installed and configured to talk to a local
		Ollama daemon (the SDK reads environment / defaults). If using an older
		Node runtime, ensure ESM imports work or adjust to `require`.
*/
export async function streamChat(req, res) {
	try {
		const { prompt, messages, model = 'gemma3' } = req.body || {};

		if (!prompt && !(Array.isArray(messages) && messages.length > 0)) {
			return res.status(400).json({ error: 'Provide `prompt` or non-empty `messages` in request body' });
		}

		// Build messages array: prefer explicit `messages`, otherwise wrap `prompt`
		const chatMessages = Array.isArray(messages) && messages.length > 0
			? messages
			: [{ role: 'user', content: prompt }];

		// Start streaming chat from Ollama SDK
		const stream = await ollama.chat({ model, messages: chatMessages, stream: true });

		// SSE headers
		res.setHeader('Content-Type', 'text/event-stream');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Connection', 'keep-alive');

		// Flush headers (some proxies require an initial write)
		res.flush?.();

		// Forward chunks: send each `chunk.message.content` as a data frame.
		for await (const chunk of stream) {
			try {
				const text = chunk?.message?.content ?? '';
				if (text) {
					// Wrap in JSON so the client can distinguish partial updates
					const payload = JSON.stringify({ delta: text });
					res.write(`data: ${payload}\n\n`);
				}
			} catch (inner) {
				// Non-fatal for a single chunk
				console.error('Error processing chunk from ollama:', inner);
			}
		}

		// Signal end
		res.write('event: done\ndata: [DONE]\n\n');
		res.end();
	} catch (err) {
		console.error('streamChat error:', err);
		if (!res.headersSent) return res.status(500).json({ error: 'Internal server error' });
		try { res.write('event: error\ndata: Internal server error\n\n'); } catch (e) {}
		res.end();
	}
}

export default { streamChat };

