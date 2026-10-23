import pytest
from backend.app.detectors.message_analyzer import MessageAnalyzer

@pytest.fixture
def analyzer():
    return MessageAnalyzer()

def test_prize_scam_detection(analyzer):
    text = "CONGRATULATIONS! You have won $1,000,000 in the international lucky draw! Claim your prize now at http://bit.ly/claim-prize-today"
    result = analyzer.analyze(text)
    assert result.risk_score >= 60
    assert result.risk_level == "High Risk"
    assert any(s.category == "Lottery / Prize Scam" for s in result.detected_signals)
    assert len(result.evidence) > 0

def test_fake_job_offer_with_fee(analyzer):
    text = "Urgent hiring! Work from home part-time job, earn 5000 daily. Just like YouTube videos. Pay 500 registration fee to start immediately. Contact on Telegram @task_manager"
    result = analyzer.analyze(text)
    assert result.risk_score >= 60
    assert result.risk_level == "High Risk"
    assert any(s.category in ["Fake Employment & Task Scam", "Payment Fraud"] for s in result.detected_signals)

def test_otp_credential_harvesting(analyzer):
    text = "Dear customer, your SBI bank account will be blocked within 24 hours. Enter your OTP immediately to verify your debit card and update KYC."
    result = analyzer.analyze(text)
    assert result.risk_score >= 60
    assert result.risk_level == "High Risk"
    assert any(s.category == "Credential Harvesting" for s in result.detected_signals)

def test_normal_legitimate_otp_message(analyzer):
    text = "Your login OTP for Acme Portal is 482910. Valid for 5 minutes. Do not share this OTP with anyone, including bank representatives."
    result = analyzer.analyze(text)
    assert result.risk_score < 30
    assert result.risk_level == "Low Risk"

def test_routine_friendly_message(analyzer):
    text = "Hey Prachi, are we still meeting for coffee tomorrow afternoon at 3 PM? Let me know if that time works."
    result = analyzer.analyze(text)
    assert result.risk_score < 30
    assert result.risk_level == "Low Risk"
    assert len(result.detected_signals) == 0

def test_remote_access_trojan_scam(analyzer):
    text = "Customer care: To fix your net banking issue, please install AnyDesk application immediately and share your 9 digit code."
    result = analyzer.analyze(text)
    assert result.risk_score >= 60
    assert result.risk_level == "High Risk"
    assert any(s.category == "Remote Access Attack" for s in result.detected_signals)
