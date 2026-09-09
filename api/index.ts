import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

// API Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Lazy initialize Gemini client
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      genAI = new GoogleGenAI({ apiKey });
    }
  }
  return genAI;
}

// CYQORA AI Chatbot Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, context } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const client = getGenAI();
    if (!client) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server'
      });
    }

    const systemInstruction = `You are the CYQORA AI Cyber Risk & Knapsack Investment Advisor (Chief Risk Intelligence Copilot).
CYQORA is an advanced Cyber Risk Quantification (CRQ) and 0/1 Knapsack Investment Optimization web application designed for enterprises.

Key Platform Architecture & Quantitative Principles:
1. Cyber Risk Quantification (CRQ):
   - Combines FAIR taxonomy with Monte Carlo Value-at-Risk (VaR at 95% confidence).
   - Core metrics: Expected Annual Loss (EAL), Single Loss Expectancy (SLE), Loss Event Frequency (LEF), and Incident Probability.
   - Currency: Indian Rupees (₹ Crores, ₹ Lakhs). For instance, baseline EAL is ₹1.37 Cr, and post-portfolio residual risk drops to ~₹40.7 L.
2. Investment Optimization:
   - Formulated as a Deterministic 0/1 Knapsack Problem solved via Dynamic Programming in ₹1 Lakh integer units.
   - Objective: Maximize sum(Risk_Reduction_i * X_i) subject to sum(Cost_i * X_i) <= Budget.
   - Includes an 8% irreducible residual risk floor that cannot be eliminated solely through technical controls.
3. Indian Regulatory & Compliance Grounding:
   - DPDP Act 2023 penalties up to ₹250 Crores per incident.
   - CERT-In 6-hour cybersecurity incident reporting mandate.
   - RBI & SEBI cybersecurity framework benchmarks.

Active Live Session Telemetry:
${context ? JSON.stringify(context, null, 2) : 'No live state passed.'}

Communication Style Guidelines:
- Speak as a seasoned CISO and quantitative financial risk advisor.
- Be clear, mathematically rigorous, objective, and executive-ready.
- Use concise markdown with bullet points and bold financial metrics where appropriate.`;

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item && (item.role === 'user' || item.role === 'model') && typeof item.content === 'string') {
          contents.push({
            role: item.role,
            parts: [{ text: item.content }]
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    let reply: string | undefined;

    try {
      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.3,
        }
      });
      reply = response.text;
    } catch (genErr: any) {
      console.warn('Primary model error, attempting fallback:', genErr?.message);
      try {
        const fallbackResp = await client.models.generateContent({
          model: 'gemini-flash-latest',
          contents,
          config: {
            systemInstruction,
            temperature: 0.3,
          }
        });
        reply = fallbackResp.text;
      } catch (secondaryErr: any) {
        console.warn('Secondary model error:', secondaryErr?.message);
      }
    }

    if (reply) {
      return res.json({ reply });
    }

    const q = message.toLowerCase();
    let fallbackText = '';

    if (q.includes('mfa') || q.includes('email') || q.includes('priorit')) {
      fallbackText = `### 🛡️ Prioritization Rationale: MFA vs. Email Security

1. **Quantified Knapsack ROI**:
   - **Phishing-Resistant MFA**: Cost ₹18 L, Risk Reduction ₹28 L (**1.56× ROI**).
   - **Advanced Email Security**: Cost ₹12 L, Risk Reduction ₹10 L (**0.83× ROI**).

2. **0/1 Knapsack Decision**:
   - The deterministic dynamic programming solver packs controls to maximize total risk reduction under your **${context?.budget ? '₹' + (context.budget / 10000000).toFixed(2) + ' Cr' : 'current'}** budget. MFA provides the steepest marginal drop in annual loss.`;
    } else if (q.includes('knapsack') || q.includes('optimizer') || q.includes('dp')) {
      fallbackText = `### 🧮 0/1 Knapsack Dynamic Programming Engine

CYQORA formulates cyber security allocation as a discrete mathematical optimization:
$$\\max \\sum_{i=1}^n (R_i \\cdot X_i) \\quad \\text{subject to} \\quad \\sum_{i=1}^n (C_i \\cdot X_i) \\le B$$

- **Discrete Resolution**: Evaluated in discrete **₹1 Lakh integer units**.
- **8% Irreducible Floor**: Retains a baseline floor (~₹11 L) representing systemic zero-day risk.`;
    } else {
      fallbackText = `### 📊 CYQORA Executive Risk Assessment

- **Current Allocation**: ${context?.total_cost ? '₹' + (context.total_cost / 10000000).toFixed(2) + ' Cr' : '₹1.00 Cr'} deployed across active security controls.
- **Annual Loss Avoidance**: ${context?.total_risk_reduction ? '₹' + (context.total_risk_reduction / 100000).toFixed(0) + ' Lakhs' : '₹96 Lakhs'} EAL eliminated annually.
- **Residual Loss**: ${context?.residual_risk ? '₹' + (context.residual_risk / 100000).toFixed(1) + ' Lakhs' : '₹40.7 Lakhs'} modeled residual exposure.`;
    }

    return res.json({ reply: fallbackText });
  } catch (err: any) {
    console.error('API /api/chat error:', err);
    return res.status(500).json({
      error: 'Failed to process AI chat request',
      details: err?.message || String(err)
    });
  }
});

export default app;
