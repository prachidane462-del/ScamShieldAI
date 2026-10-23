export type RiskLevel = 'Low Risk' | 'Suspicious' | 'High Risk';

export interface DetectedSignal {
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  evidence: string[];
}

export interface MessageAnalysisResponse {
  scan_id: string;
  analyzed_at: string;
  risk_score: number;
  risk_level: RiskLevel;
  summary: string;
  detected_signals: DetectedSignal[];
  evidence: string[];
  recommended_actions: string[];
  limitations: string;
  engine_used: string;
  source_type_detected: string;
}

export interface UrlSecurityCheck {
  is_valid_url: boolean;
  has_https: boolean;
  is_ip_address: boolean;
  suspicious_tld: boolean;
  excessive_subdomains: boolean;
  has_typosquatting: boolean;
  target_brand: string | null;
  suspicious_path_keywords: string[];
  punycode_detected: boolean;
  url_length: number;
  safe_browsing_checked: boolean;
  safe_browsing_flagged: boolean | null;
}

export interface UrlAnalysisResponse {
  scan_id: string;
  analyzed_at: string;
  url: string;
  domain: string;
  hostname: string;
  risk_score: number;
  risk_level: RiskLevel;
  summary: string;
  checks: UrlSecurityCheck;
  detected_signals: DetectedSignal[];
  evidence: string[];
  recommended_actions: string[];
  limitations: string;
  engine_used: string;
}

export interface SystemHealth {
  status: string;
  version: string;
  ai_provider_configured: boolean;
  ai_provider_name: string | null;
  safe_browsing_configured: boolean;
  uptime_seconds: number;
}

export interface ScanHistoryItem {
  id: string;
  type: 'message' | 'url';
  title: string;
  preview: string;
  risk_score: number;
  risk_level: RiskLevel;
  timestamp: string;
  full_report: MessageAnalysisResponse | UrlAnalysisResponse;
}
