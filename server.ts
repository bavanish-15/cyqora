import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8080;

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

      // Build system prompt with domain grounding
      const systemInstruction = `You are the CYQORA AI Cyber Risk & Knapsack Investment Advisor (Chief Risk Intelligence Copilot).
CYQORA is an advanced Cyber Risk Quantification (CRQ) and 0/1 Knapsack Investment Optimization web application designed for enterprises.

Key Platform Architecture & Quantitative Principles:
1. Cyber Risk Quantification (CRQ):
   - Combines the Factor Analysis of Information Risk (FAIR) taxonomy with Monte Carlo Value-at-Risk (VaR at 95% confidence).
   - Core metrics: Expected Annual Loss (EAL), Single Loss Expectancy (SLE), Loss Event Frequency (LEF), and Incident Probability.
   - Currency: Indian Rupees (₹ Crores, ₹ Lakhs). For instance, baseline EAL is ₹1.37 Cr, and post-portfolio residual risk drops to ~₹40.7 L.
2. Investment Optimization:
   - Formulated as a Deterministic 0/1 Knapsack Problem solved via Dynamic Programming in ₹1 Lakh integer units.
   - Objective: Maximize sum(Risk_Reduction_i * X_i) subject to sum(Cost_i * X_i) <= Budget.
   - Includes an 8% irreducible residual risk floor that cannot be eliminated solely through technical controls.
   - Solved using exact global knapsack DP, which outperforms greedy ROI sorting because it finds the optimal combinatorial packing for the discrete budget constraint.
3. Indian Regulatory & Compliance Grounding:
   - Digital Personal Data Protection (DPDP) Act 2023: Non-compliance or failure to protect personal data incurs penalties up to ₹250 Crores per incident.
   - CERT-In 6-hour cybersecurity incident reporting mandate.
   - RBI & SEBI cybersecurity framework benchmarks.
4. Security Controls Catalog:
   - MFA Upgrade (Phishing-Resistant FIDO2): Cost ₹18 L, Risk Reduction ₹28 L, ROI 1.56x. Defends Account Compromise, Ransomware.
   - Cryptographic Backup & Recovery (WORM snapshots): Cost ₹16 L, Risk Reduction ₹20 L, ROI 1.25x. Defends Ransomware.
   - Security Awareness Program: Cost ₹8 L, Risk Reduction ₹8 L, ROI 1.00x. Defends Phishing, Data Breach.
   - Advanced Email Security: Cost ₹12 L, Risk Reduction ₹10 L, ROI 0.83x. Defends BEC, Phishing.
   - Continuous Vulnerability Management: Cost ₹16 L, Risk Reduction ₹12 L, ROI 0.75x. Defends Supply Chain, Vulnerabilities.
   - EDR Upgrade (MDR 24/7): Cost ₹24 L, Risk Reduction ₹16 L, ROI 0.67x. Defends Ransomware, Lateral movement.
   - Zero Trust Micro-Segmentation: Cost ₹18 L, Risk Reduction ₹12 L, ROI 0.67x. Defends Data Breach, Lateral movement.
   - Privileged Access Management (PAM): Cost ₹14 L, Risk Reduction ₹9 L, ROI 0.64x.
   - Cloud Security Posture (CSPM): Cost ₹10 L, Risk Reduction ₹6 L, ROI 0.60x.
   - DDoS Protection: Cost ₹8 L, Risk Reduction ₹4 L, ROI 0.50x.

Active Live Session Telemetry from User's Dashboard:
${context ? JSON.stringify(context, null, 2) : 'No live state passed.'}

Communication Style Guidelines:
- Speak as a seasoned Chief Information Security Officer (CISO) and quantitative financial risk advisor.
- Be clear, mathematically rigorous, objective, and executive-ready.
- Use concise markdown with bullet points and bold financial metrics where appropriate.
- Refer to actual Rupee figures (₹ Cr, ₹ Lakhs) and specific controls when explaining decisions.`;

      // Construct messages payload
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

      // Primary attempt: gemini-3.8-flash
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
        console.warn('Primary model error, attempting fallback model:', genErr?.message);
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

      // Fallback domain intelligence if external API is temporarily saturated
      const q = message.toLowerCase();
      let fallbackText = '';

      if (q.includes('mfa') || q.includes('email') || q.includes('priorit')) {
        fallbackText = `### 🛡️ Prioritization Rationale: MFA vs. Email Security

1. **Quantified Knapsack ROI**:
   - **Phishing-Resistant MFA**: Cost ₹18 L, Risk Reduction ₹28 L (**1.56× ROI**).
   - **Advanced Email Security**: Cost ₹12 L, Risk Reduction ₹10 L (**0.83× ROI**).

2. **Attack Surface Coverage**:
   - FIDO2 hardware MFA neutralizes the **Account Compromise** root vector and blocks credential replay across all enterprise portals.
   - While Email Security addresses inbound spam/BEC, adversaries increasingly bypass gateways using stolen session cookies, SMS spoofing, and OAuth token theft.

3. **0/1 Knapsack Decision**:
   - The deterministic dynamic programming solver packs controls to maximize total risk reduction under your **${context?.budget ? '₹' + (context.budget / 10000000).toFixed(2) + ' Cr' : 'current'}** budget. MFA provides the steepest marginal drop in annual loss.`;
      } else if (q.includes('knapsack') || q.includes('optimizer') || q.includes('dp')) {
        fallbackText = `### 🧮 0/1 Knapsack Dynamic Programming Engine

CYQORA formulates cyber security allocation as a discrete mathematical optimization:
$$\\max \\sum_{i=1}^n (R_i \\cdot X_i) \\quad \\text{subject to} \\quad \\sum_{i=1}^n (C_i \\cdot X_i) \\le B$$

- **Discrete Resolution**: Evaluated in discrete **₹1 Lakh integer units** (1 DP step).
- **Exact Global Optimum**: Unlike greedy heuristics (sorting by ROI alone), 0/1 Knapsack examines all feasible subsets to eliminate budget waste.
- **8% Irreducible Floor**: Retains a baseline floor (~₹11 L) representing systemic zero-day and unpreventable catastrophic risk.`;
      } else if (q.includes('dpdp') || q.includes('fine') || q.includes('penalty') || q.includes('india')) {
        fallbackText = `### ⚖️ DPDP Act 2023 Statutory Liability

- **Statutory Financial Fines**: Up to **₹250 Crores** per breach occurrence under Section 33 for failing to implement reasonable security safeguards.
- **Critical Data Assets**: Customer PII Data Lake (₹25 Cr asset valuation) and Payment Switch (₹45 Cr asset valuation).
- **CERT-In Mandate**: Mandatory 6-hour disclosure window for cybersecurity incidents.
- **Recommendation**: Deploying Zero Trust Micro-Segmentation and Continuous Vulnerability Management reduces the Probability of Compromise (PoC) by >65%, shielding against maximum enforcement brackets.`;
      } else {
        fallbackText = `### 📊 CYQORA Executive Risk Assessment

- **Current Allocation**: ${context?.total_cost ? '₹' + (context.total_cost / 10000000).toFixed(2) + ' Cr' : '₹1.00 Cr'} deployed across active security controls.
- **Annual Loss Avoidance**: ${context?.total_risk_reduction ? '₹' + (context.total_risk_reduction / 100000).toFixed(0) + ' Lakhs' : '₹96 Lakhs'} EAL eliminated annually.
- **Residual Loss**: ${context?.residual_risk ? '₹' + (context.residual_risk / 100000).toFixed(1) + ' Lakhs' : '₹40.7 Lakhs'} modeled residual exposure.
- **Recommendation**: Maintain Phishing-Resistant MFA, Cryptographic Backups, and Micro-Segmentation as the bedrock foundation for enterprise cyber resilience.`;
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

  // Vite middleware for development vs static in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CYQORA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
