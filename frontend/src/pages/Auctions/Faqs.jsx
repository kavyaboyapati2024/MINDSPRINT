import React, { useState } from 'react';
import { Shield, Lock, Zap, Users, Award, ChevronDown, ChevronUp, Atom, Eye, HelpCircle, CreditCard } from 'lucide-react';

const Faqs = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqCategories = [
    {
      title: "Sealed-Bid Auctions",
      icon: <Eye className="w-6 h-6" />,
      faqs: [
        {
          question: "What is a sealed-bid auction?",
          answer: "It's an auction where bids are private and only revealed after the deadline. This ensures complete fairness as no bidder can see or react to others' bids until the auction closes."
        },
        {
          question: "What happens if two bidders place the same highest bid?",
          answer: "The winner is chosen based on predefined rules such as earliest submission time or through a secure re-bidding process. Our quantum system timestamps every bid with precision accuracy."
        },
        {
          question: "How is fairness ensured in sealed-bid auctions?",
          answer: "Bids stay confidential until closing, and no one - not even administrators - can view or alter them. Our quantum-secured system maintains complete bid integrity throughout the entire auction process."
        },
        {
          question: "Can I modify my bid after submission?",
          answer: "No, bids are final once submitted. This maintains auction integrity and prevents strategic manipulation. However, you can place multiple bids, with only your highest bid being considered."
        }
      ]
    },
    {
      title: "Quantum Security",
      icon: <Atom className="w-6 h-6" />,
      faqs: [
        {
          question: "How is my bid secured?",
          answer: "Your bid is encrypted using Quantum Key Distribution (QKD), making it tamper-proof and unbreakable even by future quantum computers."
        },
        {
          question: "Can anyone hack or see my bid?",
          answer: "No. Quantum cryptography detects and blocks any attempt to intercept bids. Any interference with the quantum state immediately alerts our security systems."
        },
        {
          question: "Why quantum cryptography over traditional encryption?",
          answer: "Quantum cryptography provides future-proof security against hackers and even quantum computers. Unlike traditional encryption, it's based on the laws of physics, not mathematical complexity."
        },
        {
          question: "What makes quantum encryption unbreakable?",
          answer: "Quantum encryption leverages the fundamental properties of quantum mechanics. Any attempt to observe or copy quantum information changes its state, immediately alerting us to potential security breaches."
        }
      ]
    },
    {
      title: "User Experience",
      icon: <Users className="w-6 h-6" />,
      faqs: [
        {
          question: "Do I need to understand quantum tech to use this?",
          answer: "No. The security runs in the background; you just place bids normally. Our intuitive interface makes quantum-secured bidding as simple as any regular auction."
        },
        {
          question: "What happens if I miss the deadline?",
          answer: "Late bids are not accepted. Our quantum-synchronized clocks ensure precise timing, and the system automatically locks submissions at the exact deadline."
        },
        {
          question: "How do I know my bid was successfully submitted?",
          answer: "You'll receive an instant confirmation with a quantum-verified timestamp. Your bid status is always visible in your secure dashboard."
        },
        {
          question: "Can I track auction progress in real-time?",
          answer: "Yes, you can monitor auction status, time remaining, and participant count - but bid amounts remain completely hidden until the reveal phase."
        }
      ]
    },
    {
      title: "Privacy & Data Protection",
      icon: <Shield className="w-6 h-6" />,
      faqs: [
        {
          question: "Are my personal details safe too?",
          answer: "Yes. Both bids and personal data are protected with quantum-safe encryption. We employ zero-knowledge protocols to minimize data exposure."
        },
        {
          question: "What information do you collect about me?",
          answer: "We collect only essential information required for auction participation: identity verification, payment details, and bidding history. All data is quantum-encrypted and stored securely."
        },
        {
          question: "Do you share my data with third parties?",
          answer: "Never. Your data remains strictly confidential and is never shared, sold, or disclosed to third parties. Our quantum security extends to data privacy policies."
        },
        {
          question: "How long do you keep my information?",
          answer: "Personal data is retained only as long as legally required. Quantum-encrypted backups ensure secure data handling throughout the retention period."
        }
      ]
    },
   
    {
      title: "Technical Support",
      icon: <HelpCircle className="w-6 h-6" />,
      faqs: [
        {
          question: "What browsers are supported?",
          answer: "EQ-Auction works on all modern browsers including Chrome, Firefox, Safari, and Edge. Our quantum-secured interface is optimized for both desktop and mobile devices."
        },
        {
          question: "Do you offer 24/7 customer support?",
          answer: "Yes, our quantum-trained support team is available 24/7 via live chat, email, and phone. We provide real-time assistance for all auction-related queries."
        },
        {
          question: "What if I experience technical issues during bidding?",
          answer: "Contact our emergency support line immediately. We have quantum-backed systems to verify your intended bids even if technical issues prevent normal submission."
        },
        {
          question: "How do I report suspicious activity?",
          answer: "Use our secure reporting system in your dashboard or contact support immediately. Our quantum monitoring systems automatically detect and flag unusual activities."
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setOpenFAQ(openFAQ === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl lg:text-3xl font-black text-sky-300 mb-6">
            Quantum-Bid FAQs
          </h1>
          
          <p className="text-xl lg:text-2xl text-sky-100 font-bold mb-6">
            Everything You Need to Know About Quantum-Secured Auctions
          </p>
          
          <div className="w-32 h-1 bg-sky-400 mx-auto rounded-full"></div>
        </div>

        {/* Intro Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-500 rounded-full mb-6">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-black text-sky-300 mb-6">
                Get Instant Answers
              </h2>
              
              <p className="text-slate-300 text-lg leading-relaxed font-medium">
                Find comprehensive answers to all your questions about our quantum-secured sealed bid auction platform. 
                Our FAQ covers everything from basic auction concepts to advanced quantum security features.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} 
                className="bg-slate-900 rounded-3xl border border-slate-800">
                
                {/* Category Header */}
                <div className="p-6 border-b border-slate-800">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center">
                      <div className="text-white">{category.icon}</div>
                    </div>
                    <h2 className="text-2xl font-black text-sky-300">
                      {category.title}
                    </h2>
                  </div>
                </div>
                
                {/* FAQ Items */}
                <div className="divide-y divide-slate-800">
                  {category.faqs.map((faq, faqIndex) => {
                    const isOpen = openFAQ === `${categoryIndex}-${faqIndex}`;
                    return (
                      <div key={faqIndex} className="group">
                        <button
                          onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-800 transition-colors duration-300"
                        >
                          <h3 className="text-lg font-bold text-slate-200 group-hover:text-white pr-4 leading-relaxed">
                            {faq.question}
                          </h3>
                          <div className="flex-shrink-0 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                            {isOpen ? 
                              <ChevronUp className="w-4 h-4 text-white" /> : 
                              <ChevronDown className="w-4 h-4 text-white" />
                            }
                          </div>
                        </button>
                        
                        {isOpen && (
                          <div className="px-6 pb-6">
                            <div className="bg-slate-800 rounded-2xl p-6 border-l-4 border-sky-400">
                              <p className="text-slate-300 leading-relaxed text-base font-medium">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faqs;