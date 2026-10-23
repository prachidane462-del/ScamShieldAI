import pytest
from backend.app.detectors.url_analyzer import UrlAnalyzer

@pytest.fixture
def url_analyzer():
    return UrlAnalyzer()

def test_safe_authentic_domain(url_analyzer):
    result = url_analyzer.analyze("https://www.google.com")
    assert result.risk_score < 30
    assert result.risk_level == "Low Risk"
    assert result.checks.has_https is True

def test_typosquatting_paypal(url_analyzer):
    # Homoglyph 1 replacing l in paypal
    result = url_analyzer.analyze("https://paypa1-security.xyz/login/verify")
    assert result.risk_score >= 60
    assert result.risk_level == "High Risk"
    assert result.checks.has_typosquatting is True
    assert result.checks.target_brand == "paypal"

def test_subdomain_masquerading(url_analyzer):
    result = url_analyzer.analyze("https://chase.com.account-recovery-system.xyz/banking/login")
    assert result.risk_score >= 60
    assert result.risk_level == "High Risk"
    assert result.checks.excessive_subdomains is True
    assert result.checks.target_brand == "chase"

def test_ssrf_internal_ip_blocking(url_analyzer):
    result = url_analyzer.analyze("http://127.0.0.1/admin")
    assert result.risk_score >= 60
    assert any(s.category == "SSRF / Internal Target" for s in result.detected_signals)

def test_public_raw_ip_address(url_analyzer):
    result = url_analyzer.analyze("http://185.190.140.2/login")
    assert result.risk_score >= 60
    assert result.checks.is_ip_address is True
