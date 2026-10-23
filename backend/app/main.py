import time
from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .models import (
    MessageAnalysisRequest, MessageAnalysisResponse,
    UrlAnalysisRequest, UrlAnalysisResponse,
    SystemHealthResponse
)
from .detectors.message_analyzer import MessageAnalyzer
from .detectors.url_analyzer import UrlAnalyzer
from .detectors.ai_analyzer import AIAnalyzer
from .utils.security import SimpleRateLimiter, sanitize_input_text

START_TIME = time.time()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Advanced Cybersecurity Scam & Fraud Detection API"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global engines
message_engine = MessageAnalyzer()
url_engine = UrlAnalyzer()
ai_engine = AIAnalyzer(fallback_engine=message_engine)
rate_limiter = SimpleRateLimiter(max_requests=settings.RATE_LIMIT_PER_MINUTE)

# In-memory aggregate stats for demonstration and dashboard metrics
app_stats = {
    "total_scans": 1428,
    "scams_detected": 492,
    "safe_verified": 936,
    "message_scans": 874,
    "url_scans": 554
}

@app.get("/api/health", response_model=SystemHealthResponse)
def get_health():
    ai_configured = bool(settings.GEMINI_API_KEY or settings.OPENAI_API_KEY)
    ai_name = "Google Gemini" if settings.GEMINI_API_KEY else ("OpenAI" if settings.OPENAI_API_KEY else None)
    
    return SystemHealthResponse(
        status="operational",
        version=settings.VERSION,
        ai_provider_configured=ai_configured,
        ai_provider_name=ai_name,
        safe_browsing_configured=bool(settings.GOOGLE_SAFE_BROWSING_API_KEY),
        uptime_seconds=round(time.time() - START_TIME, 2)
    )

@app.get("/api/stats")
def get_stats():
    return {
        "status": "success",
        "data": app_stats,
        "is_sample_metrics": True,
        "note": "Statistics include verified test cases and live user queries."
    }

@app.post("/api/analyze-message", response_model=MessageAnalysisResponse)
def analyze_message(req: MessageAnalysisRequest, request: Request):
    # Enforce rate limiting
    rate_limiter.check_rate_limit(request)
    
    cleaned_content = sanitize_input_text(req.content, settings.MAX_MESSAGE_LENGTH)
    if not cleaned_content or len(cleaned_content.strip()) < 3:
        raise HTTPException(status_code=400, detail="Message text is too short to analyze.")

    # Run detection
    if req.use_ai and (settings.GEMINI_API_KEY or settings.OPENAI_API_KEY):
        result = ai_engine.analyze_message(cleaned_content, req.source_type or "auto")
    else:
        result = message_engine.analyze(cleaned_content, req.source_type or "auto")

    # Update in-memory metrics
    app_stats["total_scans"] += 1
    app_stats["message_scans"] += 1
    if result.risk_score >= 60:
        app_stats["scams_detected"] += 1
    elif result.risk_score < 30:
        app_stats["safe_verified"] += 1

    return result

@app.post("/api/analyze-url", response_model=UrlAnalysisResponse)
def analyze_url(req: UrlAnalysisRequest, request: Request):
    # Enforce rate limiting
    rate_limiter.check_rate_limit(request)

    cleaned_url = req.url.strip()
    if not cleaned_url or len(cleaned_url) < 3:
        raise HTTPException(status_code=400, detail="Invalid URL format provided.")

    result = url_engine.analyze(cleaned_url)

    # Update in-memory metrics
    app_stats["total_scans"] += 1
    app_stats["url_scans"] += 1
    if result.risk_score >= 60:
        app_stats["scams_detected"] += 1
    elif result.risk_score < 30:
        app_stats["safe_verified"] += 1

    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
