import re
import ipaddress
import urllib.parse
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional, Tuple
import httpx
from ..models import UrlAnalysisResponse, UrlSecurityCheck, DetectedSignal
from ..config import settings

class UrlAnalyzer:
    """
    URL cybersecurity inspection engine with SSRF protection,
    typosquatting detection, homoglyph analysis, and threat intelligence.
    Does NOT visit or execute suspicious pages.
    """

    # Top targeted brands for phishing
    HIGH_PROFILE_TARGETS = [
        "paypal", "google", "apple", "microsoft", "amazon", "netflix",
        "chase", "wellsfargo", "bankofamerica", "citi", "sbi", "hdfc", "icici",
        "facebook", "instagram", "whatsapp", "telegram", "binance", "coinbase",
        "fedex", "dhl", "usps", "ups", "irs", "incometax"
    ]

    # Suspicious / high abuse TLDs often used for ephemeral phishing
    HIGH_RISK_TLDS = {
        "xyz", "top", "tk", "ml", "ga", "cf", "gq", "buzz", "work", "rest",
        "click", "cam", "sbs", "skin", "monster", "icu", "bar", "lat", "fit"
    }

    # Phishing lures commonly embedded in subdomains or paths
    PHISHING_KEYWORDS = [
        "login", "signin", "verify", "verification", "secure", "security",
        "account", "update", "banking", "wallet", "recover", "authenticate",
        "billing", "confirm", "suspension", "re-activate", "free-gift",
        "claim", "airdrop", "reward", "support"
    ]

    # Lookalike character mappings (homoglyphs / leetspeak)
    LOOKALIKE_MAP = {
        '0': 'o', '1': 'l', '3': 'e', '4': 'a', '5': 's',
        '@': 'a', '$': 's', 'v': 'u', 'vv': 'w', 'rn': 'm'
    }

    def __init__(self):
        pass

    def analyze(self, raw_url: str) -> UrlAnalysisResponse:
        sanitized = raw_url.strip()
        if not re.match(r"^[a-zA-Z]+://", sanitized):
            # Prepend https for standard parsing if protocol was omitted
            sanitized = "https://" + sanitized

        signals: List[DetectedSignal] = []
        evidence: List[str] = []

        try:
            parsed = urllib.parse.urlsplit(sanitized)
            hostname = parsed.hostname or ""
            domain = self._extract_root_domain(hostname)
        except Exception:
            hostname = ""
            domain = ""

        # Basic validity check
        is_valid_url = bool(hostname and "." in hostname)
        has_https = parsed.scheme.lower() == "https" if parsed else False

        # 1. SSRF Protection check (Internal / Private IP addresses)
        is_ip, is_private_ip = self._check_ip_address(hostname)
        if is_private_ip:
            signals.append(DetectedSignal(
                category="SSRF / Internal Target",
                severity="critical",
                title="Private / Loopback IP Address Blocked",
                description="The target points to a private, loopback, or cloud metadata IP address (e.g., 127.0.0.1 or 169.254.169.254). Accessing internal networks via URL scanners is blocked for security.",
                evidence=[hostname]
            ))
            evidence.append(hostname)

        # 2. Public IP-based URL
        elif is_ip:
            signals.append(DetectedSignal(
                category="Direct IP Address",
                severity="critical",
                title="Direct IP Address in URL",
                description="Legitimate consumer services virtually never use raw numerical IP addresses in web addresses. Cybercriminals host phishing pages directly on compromised IP addresses to bypass domain reputation checks.",
                evidence=[hostname]
            ))
            evidence.append(hostname)

        # 3. Suspicious / High-Abuse TLD
        tld = domain.split(".")[-1].lower() if "." in domain else ""
        suspicious_tld = tld in self.HIGH_RISK_TLDS
        if suspicious_tld:
            signals.append(DetectedSignal(
                category="Abuse-Prone TLD",
                severity="medium",
                title=f"Unusual / High-Abuse Domain Extension (.{tld})",
                description=f"The top-level domain '.{tld}' is disproportionately leveraged by ephemeral phishing campaigns due to low acquisition costs and lack of strict registrar verification.",
                evidence=[f".{tld}"]
            ))
            evidence.append(f".{tld}")

        # 4. Punycode / Internationalized Domain Names (IDN Homograph Attack)
        punycode_detected = "xn--" in hostname.lower()
        if punycode_detected:
            signals.append(DetectedSignal(
                category="IDN Homograph Phishing",
                severity="high",
                title="Punycode / Homograph Obfuscation Detected",
                description="The domain uses Punycode encoding (starting with 'xn--') which displays deceptive Cyrillic or Greek characters that look identical to standard Latin letters in browsers (e.g., Cyrillic 'а' replacing Latin 'a').",
                evidence=[hostname]
            ))
            evidence.append(hostname)

        # 5. Typosquatting & Brand Spoofing Check
        has_typosquatting, target_brand = self._check_typosquatting(domain)
        if has_typosquatting and target_brand:
            signals.append(DetectedSignal(
                category="Typosquatting & Impersonation",
                severity="critical",
                title=f"Lookalike Typosquatting Targeting {target_brand.title()}",
                description=f"The domain name appears intentionally engineered to imitate '{target_brand.title()}' with deceptive character substitutions, transposed letters, or visual twins.",
                evidence=[domain, target_brand]
            ))
            evidence.append(f"Imitates {target_brand.title()} with {domain}")

        # 6. Deceptive Subdomain Stacking (e.g. paypal.com.attacker.xyz)
        excessive_subdomains, subdomain_brand = self._check_subdomain_spoofing(hostname, domain)
        if excessive_subdomains and subdomain_brand:
            target_brand = target_brand or subdomain_brand
            signals.append(DetectedSignal(
                category="Subdomain Spoofing",
                severity="critical",
                title=f"Subdomain Masquerading as {subdomain_brand.title()}",
                description=f"The URL prepends '{subdomain_brand}' in its subdomain to trick users, but the actual owning root domain is '{domain}'.",
                evidence=[hostname]
            ))
            evidence.append(f"Fake subdomain: {hostname}")

        # 7. Phishing keywords in Path / Query
        full_path_query = (parsed.path + "?" + parsed.query).lower() if parsed else ""
        matched_keywords = [kw for kw in self.PHISHING_KEYWORDS if kw in full_path_query]
        if matched_keywords:
            signals.append(DetectedSignal(
                category="Deceptive URL Path",
                severity="medium" if len(matched_keywords) == 1 else "high",
                title=f"Sensitive Phishing Keywords in URL Path ({', '.join(matched_keywords[:3])})",
                description=f"The URL path contains security and authentication terms commonly utilized in credential phishing pages to mimic legitimate login or verification endpoints.",
                evidence=matched_keywords
            ))
            evidence.extend(matched_keywords)

        # 8. HTTPS Inspection
        if not has_https:
            signals.append(DetectedSignal(
                category="Insecure Protocol",
                severity="medium",
                title="Missing HTTPS Encryption",
                description="This URL does not use TLS/HTTPS. Any data submitted would travel in cleartext. Note that having HTTPS does not guarantee safety, but missing HTTPS on modern portals is a clear red flag.",
                evidence=["http:// (unencrypted)"]
            ))
            evidence.append("unencrypted http")

        # 9. URL Length Anomalies
        url_length = len(raw_url)
        if url_length > 120:
            signals.append(DetectedSignal(
                category="Obfuscated URL Length",
                severity="low",
                title="Excessively Long URL",
                description="Long URLs with complex query parameters are often used to bury the real target hostname or pass tracking tokens.",
                evidence=[f"Length: {url_length} chars"]
            ))

        # 10. External Threat Intel (Google Safe Browsing v4 if key available)
        safe_browsing_checked = bool(settings.GOOGLE_SAFE_BROWSING_API_KEY)
        safe_browsing_flagged = None
        if safe_browsing_checked:
            safe_browsing_flagged = self._check_google_safe_browsing(raw_url)
            if safe_browsing_flagged:
                signals.append(DetectedSignal(
                    category="Threat Intelligence Match",
                    severity="critical",
                    title="Flagged by Google Safe Browsing Threat Intelligence",
                    description="This URL has been actively identified as malicious, deceptive, or hosting malware in verified threat intelligence feeds.",
                    evidence=["Google Safe Browsing Flag"]
                ))
                evidence.append("Threat intelligence database flag")

        # Compute Risk Score
        risk_score = self._compute_url_risk(signals, has_https, is_valid_url)

        # Risk level categorization
        if risk_score >= 60:
            risk_level = "High Risk"
        elif risk_score >= 30:
            risk_level = "Suspicious"
        else:
            risk_level = "Low Risk"

        summary = self._generate_url_summary(risk_level, risk_score, domain, signals, has_https)
        recommendations = self._generate_url_recommendations(risk_level, domain, target_brand)

        unique_evidence = list(dict.fromkeys(evidence))
        scan_id = f"url-scan-{uuid.uuid4().hex[:10]}"
        analyzed_at = datetime.now(timezone.utc).isoformat()

        security_checks = UrlSecurityCheck(
            is_valid_url=is_valid_url,
            has_https=has_https,
            is_ip_address=is_ip,
            suspicious_tld=suspicious_tld,
            excessive_subdomains=excessive_subdomains,
            has_typosquatting=has_typosquatting,
            target_brand=target_brand,
            suspicious_path_keywords=matched_keywords,
            punycode_detected=punycode_detected,
            url_length=url_length,
            safe_browsing_checked=safe_browsing_checked,
            safe_browsing_flagged=safe_browsing_flagged
        )

        limitations = (
            "Static and structural URL heuristics do not require visiting the website and cannot guarantee 100% "
            "classification of newly registered zero-day domains. Never enter passwords or payment details on untrusted sites."
        )

        return UrlAnalysisResponse(
            scan_id=scan_id,
            analyzed_at=analyzed_at,
            url=raw_url,
            domain=domain,
            hostname=hostname,
            risk_score=risk_score,
            risk_level=risk_level,
            summary=summary,
            checks=security_checks,
            detected_signals=signals,
            evidence=unique_evidence,
            recommended_actions=recommendations,
            limitations=limitations,
            engine_used="threat-heuristic" if not safe_browsing_flagged else "threat-intelligence"
        )

    def _extract_root_domain(self, hostname: str) -> str:
        parts = hostname.split(".")
        if len(parts) >= 2:
            # Handle standard co.uk, com.au, gov.in
            if len(parts) >= 3 and parts[-2] in ["co", "com", "gov", "org", "edu", "net"] and len(parts[-1]) <= 3:
                return ".".join(parts[-3:])
            return ".".join(parts[-2:])
        return hostname

    def _check_ip_address(self, hostname: str) -> Tuple[bool, bool]:
        try:
            ip = ipaddress.ip_address(hostname)
            is_private = ip.is_private or ip.is_loopback or ip.is_reserved or ip.is_link_local
            return True, is_private
        except ValueError:
            return False, False

    def _check_typosquatting(self, domain: str) -> Tuple[bool, Optional[str]]:
        domain_name = domain.split(".")[0].lower()
        if not domain_name:
            return False, None

        # Check the whole domain name as well as hyphen-split components
        candidate_tokens = [domain_name] + [t for t in domain_name.split("-") if t]

        for token in candidate_tokens:
            normalized = token
            for k, v in self.LOOKALIKE_MAP.items():
                normalized = normalized.replace(k, v)

            for target in self.HIGH_PROFILE_TARGETS:
                if token == target:
                    # Legitimate brand token (could be genuine if root domain is official)
                    if domain_name == target:
                        return False, None
                    continue

                # Lookalike substitution match (e.g., paypa1 -> paypal, g00gle -> google)
                if normalized == target:
                    return True, target

                # Levenshtein distance 1 match (e.g., amzon -> amazon)
                if abs(len(token) - len(target)) <= 1 and self._levenshtein(token, target) == 1:
                    return True, target

                # Lookalike within normalized token
                if abs(len(normalized) - len(target)) <= 1 and self._levenshtein(normalized, target) == 1:
                    return True, target

        return False, None

    def _check_subdomain_spoofing(self, hostname: str, root_domain: str) -> Tuple[bool, Optional[str]]:
        if not hostname or hostname == root_domain:
            return False, None

        subdomains = hostname.rsplit(".", 2)[0] if "." in hostname else ""
        for target in self.HIGH_PROFILE_TARGETS:
            # If target brand is in subdomain but NOT in root domain
            if target in subdomains.lower() and target not in root_domain.lower():
                return True, target

        return False, None

    def _levenshtein(self, s1: str, s2: str) -> int:
        if len(s1) < len(s2):
            return self._levenshtein(s2, s1)
        if len(s2) == 0:
            return len(s1)

        previous_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        return previous_row[-1]

    def _compute_url_risk(self, signals: List[DetectedSignal], has_https: bool, is_valid: bool) -> int:
        if not is_valid:
            return 80

        if not signals:
            return 5 if has_https else 25

        weights = {
            "critical": 45,
            "high": 30,
            "medium": 15,
            "low": 6
        }

        total = sum(weights.get(s.severity, 10) for s in signals)
        if not has_https:
            total += 10

        return max(5, min(total, 99))

    def _generate_url_summary(self, risk_level: str, score: int, domain: str, signals: List[DetectedSignal], has_https: bool) -> str:
        if risk_level == "High Risk":
            return (
                f"High-Risk Phishing Link ({score}/100): The URL for domain '{domain}' exhibits critical deceptive patterns, "
                f"such as brand impersonation, spoofed subdomains, or suspicious IP routing. Do NOT open this link."
            )
        elif risk_level == "Suspicious":
            return (
                f"Suspicious URL Detected ({score}/100): The link structure contains warning signs like unusual extensions, "
                f"authentication query strings, or lack of standard security controls. Verify with caution."
            )
        else:
            return (
                f"Low Risk ({score}/100): The URL structure appears consistent with standard web addressing. "
                f"{'Uses secure HTTPS encryption.' if has_https else 'Notice: Missing HTTPS.'}"
            )

    def _generate_url_recommendations(self, risk_level: str, domain: str, target_brand: Optional[str]) -> List[str]:
        recs = []
        if risk_level == "High Risk":
            recs.append(f"Do NOT click or open '{domain}' on any device or browser.")
            if target_brand:
                recs.append(f"If you intended to access {target_brand.title()}, open a new tab and type the official address directly.")
            recs.append("Never submit passwords, debit card numbers, or personal details on this website.")
            recs.append("Report this phishing URL to Google Safe Browsing and your organization's IT security.")
        elif risk_level == "Suspicious":
            recs.append("Carefully verify the true destination domain before submitting any credentials.")
            recs.append("Avoid clicking links sent in unsolicited emails or SMS messages.")
            recs.append("Check if the organization has an official mobile app or verified portal.")
        else:
            recs.append("Remember that HTTPS only encrypts communication; always verify the domain name spelling.")
            recs.append("Keep your browser and security extensions updated.")

        return recs

    def _check_google_safe_browsing(self, url: str) -> bool:
        """
        Optional Google Safe Browsing Lookup v4 API query.
        Gracefully handles network errors and unavailable services.
        """
        if not settings.GOOGLE_SAFE_BROWSING_API_KEY:
            return False

        endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={settings.GOOGLE_SAFE_BROWSING_API_KEY}"
        payload = {
            "client": {
                "clientId": "scamshield-ai",
                "clientVersion": "1.0.0"
            },
            "threatInfo": {
                "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                "platformTypes": ["ANY_PLATFORM"],
                "threatEntryTypes": ["URL"],
                "threatEntries": [{"url": url}]
            }
        }
        try:
            with httpx.Client(timeout=4.0) as client:
                res = client.post(endpoint, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    return "matches" in data and len(data["matches"]) > 0
        except Exception:
            # Graceful fallback if external threat intel is unreachable
            return False
        return False
