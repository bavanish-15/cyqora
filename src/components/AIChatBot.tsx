import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatKnapsackCurrency } from '../utils/formatters';
import { BASELINE_THREATS_DATA, ENTERPRISE_ASSETS_DATA } from '../data/demoData';
import Markdown from 'react-markdown';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Maximize2,
  Minimize2,
  Bot,
  User,
  ShieldCheck,
  ChevronDown,
  Copy,
  Check,
  Zap,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

const PRESET_QUERIES = [
  'Why is MFA prioritized over Email Security?',
  'How does the 0/1 Knapsack DP optimizer work?',
  'What is our DPDP Act 2023 financial exposure?',
  'Explain Baseline EAL vs Residual EAL.',
  'What happens if we increase budget to ₹1.5 Cr?'
];

export const AIChatBot: React.FC = () => {
  const {
    budget,
    optimizationResult,
    riskProfile
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const initialTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Hello! I am your **Cyqora executive AI risk advisor**.

I have live telemetry on your enterprise cyber posture:
- **Current Budget**: ${formatKnapsackCurrency(budget)}
- **Baseline EAL**: ₹1.37 Cr → **Residual**: ${formatKnapsackCurrency(optimizationResult.residual_risk)}
- **Active Controls**: ${optimizationResult.selected_controls.length} selected via 0/1 Knapsack optimization

How can I assist your risk quantification or board-level justification today?`,
      timestamp: initialTime
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: 'model',
        content: `Conversation reset. I am ready to evaluate new scenarios against your **${formatKnapsackCurrency(budget)}** security budget and threat profiles.`,
        timestamp: time
      }
    ]);
  };

  // Local expert synthesis engine as fallback if server API is momentarily restarting
  const generateOfflineRiskAdvisorReply = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('mfa') || q.includes('email security') || q.includes('priorit')) {
      return `### 🛡️ Why Phishing-Resistant MFA is Prioritized

1. **Knapsack ROI Superiority**:
   - **MFA Upgrade (Phishing-Resistant)** yields a **1.56× ROI** (Cost: ₹18 L, Risk Reduction: ₹28 L).
   - **Advanced Email Security** yields only **0.83× ROI** (Cost: ₹12 L, Risk Reduction: ₹10 L).

2. **Dual Threat Vector Mitigation**:
   - MFA directly neutralizes **Account Compromise** and significantly mitigates initial access in **Ransomware** kill-chains.
   - Email Security mitigates inbound lures, but modern attackers bypass gateways using session hijacking, token theft, and SMS phishing where FIDO2 hardware tokens provide absolute cryptographic protection.

3. **Knapsack Combinatorial Packing**:
   - Under the current **${formatKnapsackCurrency(budget)}** budget constraint, allocating capital to MFA alongside Cryptographic Backup (ROI: 1.25×) delivers the maximum aggregate risk reduction of **${formatKnapsackCurrency(optimizationResult.total_risk_reduction)}**.`;
    }

    if (q.includes('knapsack') || q.includes('optimizer') || q.includes('algorithm') || q.includes('dp')) {
      return `### 🧮 How the 0/1 Knapsack Optimizer Works

Cyqora treats cyber risk mitigation as a **Deterministic 0/1 Knapsack Problem**:
$$\\max \\sum_{i=1}^n (R_i \\cdot X_i) \\quad \\text{subject to} \\quad \\sum_{i=1}^n (C_i \\cdot X_i) \\le B$$

- **DP Unit Resolution**: Dynamic programming table discretized into **₹1 Lakh integer units**.
- **Combinatorial Advantage**: Unlike a naive greedy sorting by ROI (which often leaves awkward budget gaps), 0/1 Knapsack finds the mathematically optimal combination of discrete controls that exhausts the budget with zero waste.
- **8% Irreducible Floor**: The model imposes a mathematical floor at 8% of baseline EAL (₹11 L), reflecting systemic and zero-day risks that cannot be eliminated by technical controls alone.
- **Current Allocation**: Out of your **${formatKnapsackCurrency(budget)}** budget, **${formatKnapsackCurrency(optimizationResult.total_cost)}** is deployed (${optimizationResult.selected_controls.length} controls), leaving **${formatKnapsackCurrency(optimizationResult.remaining_budget)}** in reserve.`;
    }

    if (q.includes('dpdp') || q.includes('compliance') || q.includes('penalty') || q.includes('legal') || q.includes('fine')) {
      return `### ⚖️ Digital Personal Data Protection (DPDP) Act 2023 Exposure

- **Maximum Statutory Penalties**: Up to **₹250 Crores** per breach occurrence for failure to take reasonable security safeguards to prevent personal data breach (Section 33).
- **High-Risk Assets**:
  - **Customer PII Data Lake** (Asset Value: ₹25.0 Cr)
  - **Core Banking Payment Switch** (Asset Value: ₹45.0 Cr)
- **CERT-In 6-Hour Reporting**: Mandatory disclosure of cybersecurity incidents within 6 hours of discovery.
- **Mitigation Strategy**: The Knapsack model prioritizes **Data Breach** mitigations (Zero Trust Micro-Segmentation and Vulnerability Management) to drastically compress the Probability of Compromise (PoC), slashing modeled legal liability by over **68%**.`;
    }

    if (q.includes('baseline') || q.includes('residual') || q.includes('eal') || q.includes('loss')) {
      return `### 📉 Baseline vs. Residual Expected Annual Loss (EAL)

- **Baseline EAL**: **₹1.37 Cr / year**
  - Expected financial loss from probabilistic threat modeling across all unmitigated threat vectors without upgraded controls.
- **Current Residual EAL**: **${formatKnapsackCurrency(optimizationResult.residual_risk)} / year**
- **Risk Avoidance**: **${formatKnapsackCurrency(optimizationResult.total_risk_reduction)}** in annual losses prevented.
- **Portfolio Efficiency**: **${optimizationResult.roi.toFixed(2)}×** return on capital deployed.
- **Confidence Interval (95% VaR)**: Modeled between ₹34.7 L (5th percentile) and ₹69.8 L (95th percentile) under Monte Carlo simulations.`;
    }

    if (q.includes('1.5') || q.includes('increase') || q.includes('more budget')) {
      return `### 📈 Impact of Increasing Budget to ₹1.5 Cr (+₹50 Lakhs)

If you expand the security budget from ₹1.00 Cr to ₹1.50 Cr:
1. **Additional Controls Unlocked**:
   - **Advanced Email Security** (Cost: ₹12 L)
   - **Privileged Access Management (PAM)** (Cost: ₹14 L)
   - **Cloud Security Posture Management (CSPM)** (Cost: ₹10 L)
2. **Projected Risk Reduction**:
   - Total risk reduction expands from **₹96 L** to **~₹1.18 Cr**.
   - Residual EAL contracts further toward the **8% irreducible floor** (~₹11 L).
3. **Executive Takeaway**: Beyond ₹1.5 Cr, diminishing marginal returns set in as lower ROI controls (<0.60×) are ingested. ₹1.3 Cr to ₹1.5 Cr represents the optimal efficiency plateau for your enterprise profile.`;
    }

    // Default intelligent summary
    return `### 📊 Cyqora executive analysis

Based on your current telemetry:
- **Budget**: ${formatKnapsackCurrency(budget)} (${optimizationResult.total_cost > 0 ? Math.round((optimizationResult.total_cost / budget) * 100) : 0}% deployed)
- **Annual Risk Reduction**: **${formatKnapsackCurrency(optimizationResult.total_risk_reduction)}** avoided per year
- **Residual Loss Exposure**: **${formatKnapsackCurrency(optimizationResult.residual_risk)}** (vs. ₹1.37 Cr baseline)
- **Top Selected Controls**: ${optimizationResult.selected_controls.slice(0, 3).map(c => c.name).join(', ')}

Would you like me to analyze specific threat vectors (such as Ransomware or Supply Chain exploitation) or compare alternative budget thresholds?`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: userTimestamp
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    // Prepare context payload
    const contextPayload = {
      budget,
      total_cost: optimizationResult.total_cost,
      remaining_budget: optimizationResult.remaining_budget,
      total_risk_reduction: optimizationResult.total_risk_reduction,
      portfolio_roi: optimizationResult.roi,
      residual_risk: optimizationResult.residual_risk,
      selected_controls: optimizationResult.selected_controls.map(c => ({
        name: c.name,
        cost: c.cost,
        risk_reduction: c.risk_reduction,
        roi: c.roi,
        category: c.category
      })),
      unselected_controls: optimizationResult.unselected_controls.map(c => ({
        name: c.name,
        cost: c.cost,
        roi: c.roi,
        decision: c.decision
      })),
      baseline_eal: 13670000,
      assets_count: ENTERPRISE_ASSETS_DATA.length,
      threats_count: BASELINE_THREATS_DATA.length
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-5).map(m => ({
            role: m.role,
            content: m.content
          })),
          context: contextPayload
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const replyContent = data.reply || generateOfflineRiskAdvisorReply(query);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Backend /api/chat error, utilizing deterministic CYQORA risk engine fallback:', err);
      const fallbackContent = generateOfflineRiskAdvisorReply(query);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: fallbackContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none select-none">
      
      {/* Expanded / Floating Chat Window */}
      {isOpen && (
        <div
          id="cyqora-ai-chat-window"
          className={`pointer-events-auto mb-3 flex flex-col rounded-xl bg-[#FFFFFF] border border-[rgba(41,41,39,0.1)] shadow-xl transition-all duration-200 ease-out overflow-hidden ${
            isExpanded
              ? 'w-[94vw] sm:w-[540px] h-[78vh] sm:h-[680px]'
              : 'w-[92vw] sm:w-[410px] h-[540px] max-h-[82vh]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#FFFFFF] border-b border-[rgba(41,41,39,0.08)]">
            <div className="flex items-center space-x-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#6F6275] text-[#FFFFFF]">
                <Bot className="w-4 h-4" strokeWidth={1.75} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#718C78]" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[13px] font-semibold tracking-[-0.01em] text-[#292927]">
                    Cyqora Assistant
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[rgba(113,140,120,0.12)] text-[9px] font-medium text-[#718C78]">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-[#6F6D68]">
                  Risk & investment advisor
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handleClearHistory}
                title="Reset conversation"
                className="p-1.5 rounded-lg text-[#6F6D68] hover:text-[#292927] hover:bg-[rgba(41,41,39,0.04)] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Minimize size' : 'Expand window'}
                className="p-1.5 rounded-lg text-[#6F6D68] hover:text-[#292927] hover:bg-[rgba(41,41,39,0.04)] transition-colors hidden sm:block cursor-pointer"
              >
                {isExpanded ? (
                  <Minimize2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg text-[#6F6D68] hover:text-[#292927] hover:bg-[rgba(41,41,39,0.04)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Live Context Strip */}
          <div className="px-3 py-1.5 bg-[#F7F6F2] border-b border-[rgba(41,41,39,0.08)] flex items-center justify-between text-[10px] text-[#6F6D68]">
            <div className="flex items-center space-x-2 truncate">
              <span className="flex items-center text-[#6F6275] font-medium">
                <Zap className="w-3 h-3 mr-1" strokeWidth={1.75} />
                Synced
              </span>
              <span>Budget: <strong className="text-[#292927] font-mono">{formatKnapsackCurrency(budget)}</strong></span>
              <span className="text-[rgba(41,41,39,0.25)]">·</span>
              <span>Residual: <strong className="text-[#718C78] font-mono">{formatKnapsackCurrency(optimizationResult.residual_risk)}</strong></span>
            </div>
            <span className="text-[9px] text-[#6F6D68] tracking-wide">
              {optimizationResult.selected_controls.length} active
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs select-text bg-[#FFFFFF]">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isUser
                        ? 'bg-[rgba(111,98,117,0.12)] text-[#6F6275]'
                        : 'bg-[#F7F6F2] text-[#6F6275]'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" strokeWidth={1.75} /> : <Bot className="w-3.5 h-3.5" strokeWidth={1.75} />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`relative max-w-[85%] rounded-xl p-3 leading-relaxed group ${
                      isUser
                        ? 'bg-[#6F6275] text-[#FFFFFF] rounded-tr-none font-medium'
                        : 'bg-[#F7F6F2] border border-[rgba(41,41,39,0.06)] text-[#292927] rounded-tl-none'
                    }`}
                  >
                    <div className={`flex items-center justify-between text-[10px] mb-1 ${isUser ? 'text-[#FFFFFF]/70' : 'text-[#6F6D68]'}`}>
                      <span>{isUser ? 'You' : 'Cyqora'}</span>
                      <span className="font-mono">{msg.timestamp}</span>
                    </div>

                    <div className={`prose prose-xs max-w-none font-sans leading-relaxed space-y-1.5 break-words ${isUser ? 'text-[#FFFFFF]' : 'text-[#292927]'}`}>
                      <Markdown>{msg.content}</Markdown>
                    </div>

                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-[#FFFFFF] text-[#6F6D68] hover:text-[#292927] text-[10px] flex items-center space-x-1 cursor-pointer border border-[rgba(41,41,39,0.08)]"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#718C78]" />
                            <span className="text-[#718C78] text-[9px]">Copied</span>
                          </>
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start space-x-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#F7F6F2] text-[#6F6275] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" strokeWidth={1.75} />
                </div>
                <div className="bg-[#F7F6F2] border border-[rgba(41,41,39,0.06)] rounded-xl rounded-tl-none p-3 max-w-[80%] flex items-center space-x-2 text-[#6F6D68]">
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6F6275] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6F6275] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6F6275] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[11px] text-[#6F6D68]">
                    Thinking…
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Preset Suggested Questions */}
          <div className="px-3 py-2 bg-[#F7F6F2] border-t border-[rgba(41,41,39,0.08)] overflow-x-auto no-scrollbar flex items-center space-x-1.5">
            <span className="text-[10px] text-[#6F6D68] flex-shrink-0 mr-1 flex items-center tracking-wide">
              <Sparkles className="w-3 h-3 text-[#6F6275] mr-1" strokeWidth={1.75} />
              Ask
            </span>
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(preset)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#F1F0EC] border border-[rgba(41,41,39,0.08)] text-[11px] text-[#6F6D68] hover:text-[#292927] transition-colors flex-shrink-0 cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#FFFFFF] border-t border-[rgba(41,41,39,0.08)]">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about budget, ROI, or exposure…"
                className="w-full bg-[#F7F6F2] border border-[rgba(41,41,39,0.08)] focus:border-[#6F6275] text-[#292927] placeholder-[#6F6D68] text-xs rounded-lg pl-3.5 pr-10 py-2.5 outline-none transition-colors"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#6F6275] hover:bg-[#5A5160] text-[#FFFFFF] disabled:opacity-40 transition-colors cursor-pointer"
                title="Send message"
              >
                <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-[#6F6D68]">
              <span>Decision support</span>
              <span>Enter to send</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <div className="pointer-events-auto flex items-center space-x-2">
        {!isOpen && (
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[rgba(41,41,39,0.1)] text-[#6F6D68] text-xs shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#718C78]" />
            <span>Ask Cyqora</span>
          </div>
        )}

        <button
          id="cyqora-ai-chat-toggle"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close AI Chatbot' : 'Open AI Chatbot'}
          className={`relative group flex items-center justify-center w-12 h-12 rounded-xl cursor-pointer transition-colors border shadow-md ${
            isOpen
              ? 'bg-[#F7F6F2] border-[rgba(41,41,39,0.1)] text-[#292927]'
              : 'bg-[#6F6275] border-[#6F6275] hover:bg-[#5A5160] text-[#FFFFFF]'
          }`}
        >
          {isOpen ? (
            <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-0.5" strokeWidth={1.75} />
          ) : (
            <>
              <Bot className="w-5 h-5" strokeWidth={1.75} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#718C78]" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};
