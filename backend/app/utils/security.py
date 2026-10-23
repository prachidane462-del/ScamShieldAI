import time
from typing import Dict, Tuple
from fastapi import HTTPException, Request

class SimpleRateLimiter:
    """
    Sliding window in-memory rate limiter to protect backend endpoints.
    Tracks request timestamps per IP address.
    """
    def __init__(self, max_requests: int = 60, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.history: Dict[str, list] = {}

    def check_rate_limit(self, request: Request):
        client_ip = request.client.host if request.client else "127.0.0.1"
        now = time.time()
        
        # Filter out timestamps older than the window
        timestamps = [ts for ts in self.history.get(client_ip, []) if now - ts < self.window_seconds]
        
        if len(timestamps) >= self.max_requests:
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded. Maximum {self.max_requests} requests per minute allowed."
            )
        
        timestamps.append(now)
        self.history[client_ip] = timestamps

def sanitize_input_text(text: str, max_length: int = 4000) -> str:
    """
    Sanitizes untrusted text input, trims whitespaces, and enforces length bounds.
    """
    if not text:
        return ""
    # Strip null bytes and normalize whitespace
    cleaned = text.replace("\x00", "").strip()
    if len(cleaned) > max_length:
        cleaned = cleaned[:max_length]
    return cleaned
