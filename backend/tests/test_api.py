from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "operational"
    assert "version" in data

def test_stats_endpoint():
    res = client.get("/api/stats")
    assert res.status_code == 200
    data = res.json()
    assert "data" in data
    assert "total_scans" in data["data"]

def test_analyze_message_endpoint():
    payload = {
        "content": "Urgent: Your HDFC account is suspended. Send your OTP immediately to reactivate.",
        "source_type": "sms",
        "use_ai": False
    }
    res = client.post("/api/analyze-message", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["risk_score"] >= 60
    assert data["risk_level"] == "High Risk"
    assert len(data["detected_signals"]) > 0

def test_analyze_message_empty_validation():
    payload = {"content": "   ", "source_type": "sms"}
    res = client.post("/api/analyze-message", json=payload)
    assert res.status_code in [400, 422]

def test_analyze_url_endpoint():
    payload = {"url": "https://g00gle-security.xyz/login"}
    res = client.post("/api/analyze-url", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "risk_score" in data
    assert "checks" in data
