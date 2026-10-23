from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class DetectedSignal(BaseModel):
    category: str = Field(..., description="Signal classification category")
    severity: str = Field(..., description="low, medium, high, or critical")
    title: str = Field(..., description="Short plain-language description")
    description: str = Field(..., description="Detailed explanation of why this is suspicious")
    evidence: List[str] = Field(default_factory=list, description="Specific matching words or phrases")

class MessageAnalysisRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=4000, description="The message text to analyze")
    source_type: Optional[str] = Field("auto", description="sms, whatsapp, email, job, social, or auto")
    use_ai: Optional[bool] = Field(True, description="Whether to invoke LLM if API key is configured")

class MessageAnalysisResponse(BaseModel):
    scan_id: str
    analyzed_at: str
    risk_score: int = Field(..., ge=0, le=100, description="Composite risk score from 0 to 100")
    risk_level: str = Field(..., description="Low Risk (0-29), Suspicious (30-59), High Risk (60-100)")
    summary: str
    detected_signals: List[DetectedSignal]
    evidence: List[str]
    recommended_actions: List[str]
    limitations: str
    engine_used: str = Field(..., description="heuristic, ai, or hybrid")
    source_type_detected: str

class UrlSecurityCheck(BaseModel):
    is_valid_url: bool
    has_https: bool
    is_ip_address: bool
    suspicious_tld: bool
    excessive_subdomains: bool
    has_typosquatting: bool
    target_brand: Optional[str] = None
    suspicious_path_keywords: List[str] = Field(default_factory=list)
    punycode_detected: bool
    url_length: int
    safe_browsing_checked: bool
    safe_browsing_flagged: Optional[bool] = None

class UrlAnalysisRequest(BaseModel):
    url: str = Field(..., min_length=3, max_length=2048, description="URL to inspect")

class UrlAnalysisResponse(BaseModel):
    scan_id: str
    analyzed_at: str
    url: str
    domain: str
    hostname: str
    risk_score: int = Field(..., ge=0, le=100)
    risk_level: str
    summary: str
    checks: UrlSecurityCheck
    detected_signals: List[DetectedSignal]
    evidence: List[str]
    recommended_actions: List[str]
    limitations: str
    engine_used: str

class SystemHealthResponse(BaseModel):
    status: str
    version: str
    ai_provider_configured: bool
    ai_provider_name: Optional[str]
    safe_browsing_configured: bool
    uptime_seconds: float
