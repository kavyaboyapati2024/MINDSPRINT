// Simple streaming client for the backend LLM stream endpoint.
// Exports a function `streamChat(prompt, { onChunk, onDone, onError })` that
// POSTs to the backend and calls callbacks as data arrives.

export default async function streamChat(prompt, { model = 'gemma3', onChunk = () => {}, onDone = () => {}, onError = () => {} } = {}) {
  const url = (import.meta.env.VITE_API_BASE || 'http://localhost:9000') + '/api/llm/stream';

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model }),
  });

  if (!res.ok) {
    const txt = await res.text();
    onError(txt);
    throw new Error(txt || 'Stream request failed');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      const parts = buf.split('\n\n');
      buf = parts.pop(); // remainder

      for (const part of parts) {
        // part could be multiple lines; we only care about lines starting with `data:`
        const lines = part.split('\n');
        for (const line of lines) {
          if (!line) continue;
          if (line.startsWith('data:')) {
            const payload = line.replace(/^data:\s?/, '').trim();
            // The backend sends JSON payloads for partial chunks
            try {
              const obj = JSON.parse(payload);
              if (obj?.delta) onChunk(obj.delta);
              else onChunk(String(obj));
            } catch (e) {
              // Not JSON, maybe a raw string like [DONE]
              if (payload === '[DONE]') {
                // ignore here; finalization handled below
              } else {
                onChunk(payload);
              }
            }
          }
        }
      }
    }

    // process any remaining buffer
    if (buf) {
      for (const line of buf.split('\n')) {
        if (line.startsWith('data:')) {
          const payload = line.replace(/^data:\s?/, '').trim();
          try {
            const obj = JSON.parse(payload);
            if (obj?.delta) onChunk(obj.delta);
            else onChunk(String(obj));
          } catch (e) {
            if (payload !== '[DONE]') onChunk(payload);
          }
        }
      }
    }

    onDone();
  } catch (err) {
    onError(err);
    throw err;
  }
}
