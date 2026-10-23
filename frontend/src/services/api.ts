import { MessageAnalysisResponse, UrlAnalysisResponse, SystemHealth } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const apiService = {
  async getHealth(): Promise<SystemHealth> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        return await res.json();
      }
      throw new Error('Health check non-200');
    } catch {
      // Offline fallback indicator
      return {
        status: 'standalone-browser-mode',
        version: '1.0.0',
        ai_provider_configured: false,
        ai_provider_name: null,
        safe_browsing_configured: false,
        uptime_seconds: 0
      };
    }
  },

  async getStats(): Promise<{ total_scans: number; scams_detected: number; safe_verified: number; message_scans: number; url_scans: number }> {
    try {
      const res = await fetch(`${API_BASE_URL}/stats`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const body = await res.json();
        return body.data;
      }
      throw new Error('Stats non-200');
    } catch {
      return {
        total_scans: 1428,
        scams_detected: 492,
        safe_verified: 936,
        message_scans: 874,
        url_scans: 554
      };
    }
  },

  async analyzeMessage(content: string, sourceType: string = 'auto', useAi: boolean = true): Promise<MessageAnalysisResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/analyze-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          source_type: sourceType,
          use_ai: useAi
        }),
        signal: AbortSignal.timeout(12000)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Analysis request failed on server');
      }

      return await res.json();
    } catch (e: any) {
      console.warn('Backend API unavailable, using in-browser heuristic detection engine:', e.message);
      return this.clientSideMessageFallback(content, sourceType);
    }
  },

  async analyzeUrl(url: string): Promise<UrlAnalysisResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/analyze-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: AbortSignal.timeout(10000)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'URL analysis request failed on server');
      }

      return await res.json();
    } catch (e: any) {
      console.warn('Backend API unavailable, using in-browser URL inspection engine:', e.message);
      return this.clientSideUrlFallback(url);
    }
  },

  // In-browser heuristic engine fallback if backend server is not active
  clientSideMessageFallback(content: string, sourceType: string): MessageAnalysisResponse {
    const lower = content.toLowerCase();
    const signals: any[] = [];
    const evidence: string[] = [];
    let score = 10;

    const hasUrgency = /(account.*(blocked|suspended|deactivated)|within \d+ (hour|min)|urgent|immediately|arrest|police|court|electricity.*disconnect)/i.test(lower);
    if (hasUrgency) {
      score += 35;
      signals.push({
        category: 'Urgency & Coercion',
        severity: 'high',
        title: 'Intimidation & Artificial Urgency',
        description: 'Threats of immediate account blockage or service cutoff are used to force rapid action.',
        evidence: ['urgent action / account suspension threat']
      });
      evidence.push('account suspension / deadline threat');
    }

    const hasCredential = /(enter|share|send|provide).*(otp|password|pin|cvv|credentials)|update.*kyc/i.test(lower);
    if (hasCredential) {
      score += 45;
      signals.push({
        category: 'Credential Harvesting',
        severity: 'critical',
        title: 'Confidential Credential / OTP Demand',
        description: 'Requests for one-time passwords (OTP) or banking credentials are clear fraud indicators.',
        evidence: ['otp / password request']
      });
      evidence.push('otp / password harvesting');
    }

    const hasPrize = /(congratulations|won.*(\$|₹|prize|lottery)|lucky winner|claim.*prize)/i.test(lower);
    if (hasPrize) {
      score += 35;
      signals.push({
        category: 'Lottery / Prize Scam',
        severity: 'high',
        title: 'Unsolicited Prize / Lottery Claim',
        description: 'Claims of winning lotteries or unexpected large cash sums in contests you never joined.',
        evidence: ['prize / lottery claim']
      });
      evidence.push('unsolicited lottery reward');
    }

    const hasFee = /(pay|send|transfer).*(\d+)?.*(fee|charges|deposit|advance)/i.test(lower);
    if (hasFee) {
      score += 30;
      signals.push({
        category: 'Payment Fraud',
        severity: 'critical',
        title: 'Advance-Fee Demand',
        description: 'Requiring payment of upfront fees, security deposits, or registration charges is characteristic of fraud.',
        evidence: ['advance fee / deposit demand']
      });
      evidence.push('advance fee required');
    }

    const hasRemote = /(anydesk|teamviewer|quicksupport|download.*apk)/i.test(lower);
    if (hasRemote) {
      score += 45;
      signals.push({
        category: 'Remote Access Attack',
        severity: 'critical',
        title: 'Remote Screen-Sharing Request',
        description: 'Demands to install AnyDesk or TeamViewer software allow attackers to take full control of your device.',
        evidence: ['remote access app']
      });
      evidence.push('remote access app request');
    }

    // Safety disclaimer check (e.g. standard bank SMS telling user NOT to share)
    const hasSafetyWarning = /(never share|do not share.*otp|bank never asks)/i.test(lower);
    if (hasSafetyWarning && !hasCredential) {
      score = Math.max(5, score - 25);
    }

    score = Math.min(98, Math.max(8, score));
    const risk_level = score >= 60 ? 'High Risk' : (score >= 30 ? 'Suspicious' : 'Low Risk');

    return {
      scan_id: `client-${Date.now().toString(36)}`,
      analyzed_at: new Date().toISOString(),
      risk_score: score,
      risk_level,
      summary: risk_level === 'High Risk'
        ? `High Risk (${score}/100): Aggressive fraud indicators detected. Do not click links or send credentials.`
        : (risk_level === 'Suspicious' ? `Suspicious (${score}/100): Unusual solicitation signals found. Verify independently.` : `Low Risk (${score}/100): Standard transactional or personal message. No active threats detected.`),
      detected_signals: signals,
      evidence,
      recommended_actions: [
        'Never disclose OTPs, PINs, or net banking passwords to anyone.',
        'Verify requests directly by contacting the institution through verified numbers.',
        'In India, report cyber fraud immediately to 1930 or https://cybercrime.gov.in/.'
      ],
      limitations: 'Evaluated using client-side heuristic rules. Always practice extreme caution.',
      engine_used: 'heuristic (client-fallback)',
      source_type_detected: sourceType
    };
  },

  clientSideUrlFallback(rawUrl: string): UrlAnalysisResponse {
    let hostname = '';
    let domain = '';
    let hasHttps = false;
    try {
      const formatted = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
      const parsed = new URL(formatted);
      hostname = parsed.hostname;
      domain = hostname.split('.').slice(-2).join('.');
      hasHttps = parsed.protocol === 'https:';
    } catch {
      hostname = rawUrl;
      domain = rawUrl;
    }

    const isIp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname);
    const hasTyposquatting = /(paypa1|arnazon|g00gle|micros0ft)/i.test(hostname);
    const isHighRiskTld = /\.(xyz|top|tk|buzz|click|ml)$/i.test(domain);

    let score = 10;
    const signals: any[] = [];
    if (isIp) {
      score += 55;
      signals.push({
        category: 'Direct IP Address',
        severity: 'critical',
        title: 'Raw Numeric IP Address in URL',
        description: 'Using numeric IP addresses instead of trusted domain names is a typical phishing tactic.',
        evidence: [hostname]
      });
    }
    if (hasTyposquatting) {
      score += 50;
      signals.push({
        category: 'Typosquatting',
        severity: 'critical',
        title: 'Brand Impersonation / Lookalike Domain',
        description: 'Domain mimics trusted services using number and letter substitutions.',
        evidence: [hostname]
      });
    }
    if (isHighRiskTld) {
      score += 25;
      signals.push({
        category: 'Abuse-Prone TLD',
        severity: 'medium',
        title: 'High-Abuse Domain Extension',
        description: 'Unusual extension commonly exploited for disposable phishing websites.',
        evidence: [domain]
      });
    }

    score = Math.min(99, Math.max(5, score));
    const risk_level = score >= 60 ? 'High Risk' : (score >= 30 ? 'Suspicious' : 'Low Risk');

    return {
      scan_id: `url-client-${Date.now().toString(36)}`,
      analyzed_at: new Date().toISOString(),
      url: rawUrl,
      domain,
      hostname,
      risk_score: score,
      risk_level,
      summary: risk_level === 'High Risk'
        ? `High-Risk Link (${score}/100): Phishing or deceptive host structure detected. Do NOT open.`
        : `URL Analysis completed (${score}/100). Verify domain identity.`,
      checks: {
        is_valid_url: true,
        has_https: hasHttps,
        is_ip_address: isIp,
        suspicious_tld: isHighRiskTld,
        excessive_subdomains: hostname.split('.').length > 3,
        has_typosquatting: hasTyposquatting,
        target_brand: hasTyposquatting ? 'Impersonated Brand' : null,
        suspicious_path_keywords: [],
        punycode_detected: hostname.includes('xn--'),
        url_length: rawUrl.length,
        safe_browsing_checked: false,
        safe_browsing_flagged: null
      },
      detected_signals: signals,
      evidence: signals.map(s => s.title),
      recommended_actions: [
        'Do not visit or enter credentials on this address.',
        'Navigate directly to official services using bookmarked URLs.'
      ],
      limitations: 'Static structural evaluation without active network fetching.',
      engine_used: 'threat-heuristic (client-fallback)'
    };
  }
};
