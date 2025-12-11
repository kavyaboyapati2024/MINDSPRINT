import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, HelpCircle, Shield, Send, EyeOff, Minimize2 } from 'lucide-react';
import streamChat from '../services/ollamaService';

const QuantumAuctionChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showQuestions, setShowQuestions] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const qaDatabase = {
    "What is Quantum Key Distribution?": {
      answer: "Quantum Key Distribution (QKD) is an ultra-secure method of encrypting data using principles of quantum mechanics. In our auction system, we use the BB84 protocol - developed by Bennett and Brassard in 1984. It generates cryptographic keys that are mathematically proven to be secure. When you place a bid, QKD creates a unique quantum encryption key that cannot be copied or intercepted without being detected.",
      followUp: ["How does BB84 protocol work?", "Is it really unbreakable?"]
    },
    "How is it different from normal auction systems?": {
      answer: "Traditional auction systems use standard encryption (like SSL/TLS) which can potentially be broken with enough computing power or time. Our quantum-secured system is fundamentally different:\n\n• Traditional systems: Mathematical complexity protects your bid\n• Our system: Laws of physics protect your bid\n\nQuantum encryption detects any eavesdropping attempt instantly because measuring quantum states changes them. This means if someone tries to intercept your bid, the system immediately knows and can reject the compromised data.",
      followUp: ["What are the main advantages?", "How does detection work?"]
    },
    "Do I need any special device to use this auction?": {
      answer: "No special device needed on your end! You can use any regular computer, smartphone, or tablet with a web browser. All the quantum encryption happens on our secure servers in the backend.\n\nYou'll interact with the auction exactly like any other website - the quantum security works invisibly to protect your bids without requiring any special hardware or software installation from you.",
      followUp: ["What browsers are supported?", "Do I need to install anything?"]
    },
    "How does this quantum system keep my bid safe?": {
      answer: "When you submit a bid, here's what happens:\n\n1. Your bid is encrypted using a quantum-generated key via the BB84 protocol\n2. This key is transmitted using quantum states (photon polarizations)\n3. Any attempt to intercept or read the key disturbs these quantum states\n4. Our system constantly monitors for these disturbances\n5. If tampering is detected, that key is discarded and a new one is generated\n\nThe result: Your bid reaches our servers with 100% certainty that no one has intercepted it. The encryption key itself is information-theoretically secure - meaning even unlimited computing power cannot break it.",
      followUp: ["What is BB84 protocol exactly?", "Can quantum computers break it?"]
    },
    "What happens if someone tries to hack my bid?": {
      answer: "This is where quantum security shines! If someone attempts to intercept or hack your bid:\n\n1. The quantum state changes the moment they try to measure it\n2. Our system detects this disturbance immediately (typically within milliseconds)\n3. The compromised encryption key is automatically discarded\n4. A new secure quantum key is generated instantly\n5. Your bid is re-encrypted and transmitted safely\n6. The hacking attempt is logged for security analysis\n\nYou'll never even notice this happening - the system handles it automatically. The hacker gets nothing but random, useless data, while your real bid reaches us securely.",
      followUp: ["Has anyone ever succeeded in hacking?", "How fast is the detection?"]
    },
    "Will this quantum process make the auction slow?": {
      answer: "Not at all! While quantum encryption is incredibly secure, it's also very fast:\n\n• Key generation: Less than 50 milliseconds\n• Bid encryption: Near-instantaneous\n• Transmission: Same speed as regular internet\n• Total overhead: Typically 100-200ms added\n\nFor comparison, this is faster than the time it takes to load most webpage images. You won't notice any difference in speed compared to a regular auction. The security is maximum, but the user experience remains smooth and responsive.",
      followUp: ["What affects the speed?", "Can it work on slow internet?"]
    },
    "Can anyone see my bid before the auction ends?": {
      answer: "Absolutely not - this is guaranteed by quantum physics itself!\n\nYour bid is:\n• Encrypted with quantum keys that are impossible to crack\n• Stored in our secure servers with multiple encryption layers\n• Only decrypted when the auction officially ends\n• Protected by audit logs and access controls\n\nEven our own system administrators cannot see sealed bids before the auction closes. The quantum encryption ensures that any unauthorized access attempt would be immediately detected and prevented. Your bid privacy is not just protected by technology, but by the fundamental laws of quantum mechanics.",
      followUp: ["Who can see my bid after auction ends?", "How is the winner determined?"]
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const findBestMatch = (query) => {
    const normalizedQuery = query.toLowerCase();
    const keywords = {
      "quantum": ["What is Quantum Key Distribution?"],
      "qkd": ["What is Quantum Key Distribution?"],
      "distribution": ["What is Quantum Key Distribution?"],
      "bb84": ["What is Quantum Key Distribution?", "How does this quantum system keep my bid safe?"],
      "different": ["How is it different from normal auction systems?"],
      "normal": ["How is it different from normal auction systems?"],
      "traditional": ["How is it different from normal auction systems?"],
      "device": ["Do I need any special device to use this auction?"],
      "special": ["Do I need any special device to use this auction?"],
      "hardware": ["Do I need any special device to use this auction?"],
      "safe": ["How does this quantum system keep my bid safe?"],
      "secure": ["How does this quantum system keep my bid safe?"],
      "protect": ["How does this quantum system keep my bid safe?"],
      "hack": ["What happens if someone tries to hack my bid?"],
      "intercept": ["What happens if someone tries to hack my bid?"],
      "attack": ["What happens if someone tries to hack my bid?"],
      "slow": ["Will this quantum process make the auction slow?"],
      "speed": ["Will this quantum process make the auction slow?"],
      "fast": ["Will this quantum process make the auction slow?"],
      "see": ["Can anyone see my bid before the auction ends?"],
      "privacy": ["Can anyone see my bid before the auction ends?"],
      "visible": ["Can anyone see my bid before the auction ends?"]
    };

    let matches = new Set();
    for (const [keyword, questions] of Object.entries(keywords)) {
      if (normalizedQuery.includes(keyword)) {
        questions.forEach(q => matches.add(q));
      }
    }

    if (matches.size > 0) {
      return Array.from(matches)[0];
    }

    return null;
  };

  const handleQuestionClick = (question) => {
    const qa = qaDatabase[question];
    setMessages([
      ...messages,
      { type: 'user', text: question },
      { type: 'bot', text: qa.answer, followUp: qa.followUp }
    ]);
    setShowQuestions(false);
  };
  // Prevent concurrent sends
  const sendingRef = useRef(false);

  function appendChunk(text) {
    setMessages(prev => {
      if (prev.length === 0 || prev[prev.length - 1].type !== 'bot-stream') {
        return [...prev, { type: 'bot-stream', text }];
      }
      const copy = [...prev];
      copy[copy.length - 1] = { ...copy[copy.length - 1], text: copy[copy.length - 1].text + text };
      return copy;
    });
  }

  function finalizeAssistant() {
    setMessages(prev => {
      const copy = [...prev];
      if (copy.length && copy[copy.length - 1].type === 'bot-stream') {
        copy[copy.length - 1] = { ...copy[copy.length - 1], type: 'bot' };
      }
      return copy;
    });
    sendingRef.current = false;
  }

  const handleSendMessage = async () => {
    if (!userInput.trim() || sendingRef.current) return;

    const prompt = userInput.trim();
    const matchedQuestion = findBestMatch(prompt);

    if (matchedQuestion) {
      const qa = qaDatabase[matchedQuestion];
      setMessages([
        ...messages,
        { type: 'user', text: prompt },
        { type: 'bot', text: qa.answer, followUp: qa.followUp }
      ]);
      setUserInput('');
      setShowQuestions(false);
      return;
    }

    // Stream via Ollama for unmatched prompts
    sendingRef.current = true;
    setMessages(prev => [...prev, { type: 'user', text: prompt }, { type: 'bot-stream', text: '' }]);
    setUserInput('');
    setShowQuestions(false);

    try {
      await streamChat(prompt, {
        onChunk: (delta) => appendChunk(delta),
        onDone: () => finalizeAssistant(),
        onError: (err) => {
          finalizeAssistant();
          setMessages(prev => [...prev, { type: 'bot', text: 'Error: ' + String(err) }]);
        }
      });
    } catch (err) {
      finalizeAssistant();
      setMessages(prev => [...prev, { type: 'bot', text: 'Error: ' + String(err) }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBackToQuestions = () => {
    setShowQuestions(true);
  };

  const handleReset = () => {
    setMessages([]);
    setShowQuestions(true);
    setUserInput('');
  };

  const handleMinimize = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setIsHidden(true);
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleHide = () => {
    setIsHidden(true);
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleShow = () => {
    setIsHidden(false);
  };

  return (
    <>
      {/* Small Show Button - Only icon when hidden */}
      {isHidden && (
        <button
          onClick={handleShow}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 p-1 shadow-lg hover:scale-110 transition-all duration-300"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
        </button>
      )}

      {/* Floating Button with Avatar */}
      {!isOpen && !isHidden && (
        <div 
          className="fixed bottom-6 right-6 z-50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative">
            {/* Close Button - Only shows on hover */}
            {isHovered && (
              <button
                onClick={handleHide}
                className="absolute -top-1 -left-1 bg-slate-600 hover:bg-slate-700 text-white p-1 rounded-full shadow-lg border border-white transition-all duration-200 z-10"
                aria-label="Hide Chatbot"
                title="Hide chatbot"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}

            {/* Main Button Container */}
            <button
              onClick={handleOpenChat}
              className={`flex items-center gap-2 transition-all duration-300 ${
                isHovered 
                  ? 'bg-slate-900 px-3 py-2 rounded-full shadow-2xl' 
                  : 'bg-transparent p-0'
              }`}
            >
              {/* Avatar Circle */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                {/* Green Online Indicator */}
                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"></span>
              </div>

              {/* "Open Chat" Text - Only shows on hover */}
              {isHovered && (
                <div className="flex items-center gap-1.5 pr-1.5">
                  <span className="text-white font-semibold text-sm whitespace-nowrap">Open Chat</span>
                  <span className="text-white text-base">::</span>
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[550px] bg-slate-800 rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur border border-white/30">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Quantum Security</h3>
                <p className="text-xs text-blue-100">BB84 Protocol Info</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMinimize}
                className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                title="Minimize"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                  <MessageCircle className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="font-bold text-white mb-2">Welcome to Quantum Bid</h4>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">Click any question below or type your query</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-xl ${
                      msg.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-lg shadow-blue-500/20' 
                        : 'bg-slate-700/80 backdrop-blur text-white rounded-bl-none border border-slate-600/50 shadow-lg'
                    }`}>
                      <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                      {msg.followUp && (
                        <div className="mt-3 pt-3 border-t border-slate-600/50 text-xs text-slate-300">
                          <p className="font-semibold mb-2 text-blue-400">Related topics:</p>
                          {msg.followUp.map((q, i) => (
                            <span key={i} className="inline-block bg-slate-600/40 border border-slate-500/30 px-2 py-1 rounded mr-1 mb-1">{q}</span>
                          ))}
                        </div>
                      )}
                      {msg.showSuggestions && (
                        <button
                          onClick={handleBackToQuestions}
                          className="mt-3 w-full py-2 px-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-xs font-medium text-blue-300 transition-all"
                        >
                          View All Questions
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Questions List */}
            {showQuestions && (
              <div className="space-y-2 mt-4">
                {Object.keys(qaDatabase).map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuestionClick(question)}
                    className="w-full text-left p-3 bg-slate-700/60 backdrop-blur hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20 rounded-xl border border-slate-600/50 transition-all hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/50 group"
                  >
                    <span className="text-sm text-slate-200 group-hover:text-white flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                      {question}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-700 bg-slate-800/95 backdrop-blur">
            <div className="flex gap-2 mb-3">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2.5 bg-slate-700/80 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim()}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {messages.length > 0 && !showQuestions && (
              <button
                onClick={handleBackToQuestions}
                className="w-full py-2 px-4 bg-slate-700/80 border border-slate-600/50 text-slate-200 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-all text-sm font-medium mb-2"
              >
                View All Questions
              </button>
            )}
            
            {messages.length > 0 && (
              <button
                onClick={handleReset}
                className="w-full py-2 px-4 bg-slate-700/80 border border-slate-600/50 text-slate-200 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-all text-sm font-medium"
              >
                Start New Conversation
              </button>
            )}
            
            <p className="text-xs text-center text-slate-400 mt-3 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/60"></span>
              Secured by BB84 Quantum Protocol
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default QuantumAuctionChatbot;