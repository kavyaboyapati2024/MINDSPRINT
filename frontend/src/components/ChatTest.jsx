import React, { useState, useRef } from 'react';
import streamChat from '../services/ollamaService';

export default function ChatTest() {
  const [messages, setMessages] = useState([]); // { role: 'user'|'assistant'|'assistant-stream', content }
  const [input, setInput] = useState('');
  const sendingRef = useRef(false);

  function appendChunk(text) {
    setMessages(prev => {
      if (prev.length === 0 || prev[prev.length - 1].role !== 'assistant-stream') {
        return [...prev, { role: 'assistant-stream', content: text }];
      }
      const copy = [...prev];
      copy[copy.length - 1] = { ...copy[copy.length - 1], content: copy[copy.length - 1].content + text };
      return copy;
    });
  }

  function finalizeAssistant() {
    setMessages(prev => {
      const copy = [...prev];
      if (copy.length && copy[copy.length - 1].role === 'assistant-stream') {
        copy[copy.length - 1].role = 'assistant';
      }
      return copy;
    });
    sendingRef.current = false;
  }

  async function send() {
    const prompt = input.trim();
    if (!prompt || sendingRef.current) return;
    sendingRef.current = true;
    setInput('');

    // add user message and prepare assistant stream slot
    setMessages(prev => [...prev, { role: 'user', content: prompt }, { role: 'assistant-stream', content: '' }]);

    try {
      await streamChat(prompt, {
        onChunk: (delta) => appendChunk(delta),
        onDone: () => finalizeAssistant(),
        onError: (err) => {
          finalizeAssistant();
          setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + String(err) }]);
        }
      });
    } catch (err) {
      finalizeAssistant();
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + String(err) }]);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2>LLM Stream Test</h2>
      <div style={{ border: '1px solid #ddd', padding: 12, height: 400, overflowY: 'auto', marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '8px 0' }}>
            <strong style={{ textTransform: 'capitalize' }}>{m.role.replace('-', ' ')}:</strong>
            <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a prompt..."
          style={{ flex: 1, padding: 8 }}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
        />
        <button onClick={send} style={{ padding: '8px 16px' }}>Send</button>
      </div>
    </div>
  );
}
