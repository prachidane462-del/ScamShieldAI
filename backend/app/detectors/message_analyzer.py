import re
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Tuple
from ..models import MessageAnalysisResponse, DetectedSignal

class MessageAnalyzer:
    """
    Transparent, multi-signal heuristic scam & fraud detection engine.
    Combines lexical, behavioral, contextual, and psychological indicators.
    """

    # Brand names frequently impersonated
    KNOWN_BRANDS = [
        "sbi", "state bank of india", "hdfc", "icici", "axis bank", "punjab national bank", "pnb",
        "chase", "wells fargo", "bank of america", "citi", "paypal", "venmo", "cash app", "zelle",
        "amazon", "apple", "netflix", "microsoft", "google", "meta", "facebook", "instagram",
        "fedex", "dhl", "usps", "ups", "india post", "royal mail",
        "income tax", "irs", "customs", "cyber police", "trai", "telecom regulatory"
    ]

    # Suspicious link shorteners & redirectors
    SUSPICIOUS_SHORTENERS = [
        "bit.ly", "tinyurl.com", "is.gd", "cutt.ly", "rb.gy", "shorturl.at", "t.co",
        "ow.ly", "buff.ly", "rebrand.ly", "t.me", "wa.me"
    ]

    # Legitimate security disclaimers (e.g. standard bank notifications that tell you NOT to share)
    SAFETY_DISCLAIMERS = [
        r"never share (your )?(otp|password|pin|cvv)",
        r"do not share (this )?(otp|code|password|pin)",
        r"bank never asks (you )?for (your )?(otp|pin|password)",
        r"neither bank nor any representative will ask",
        r"if not requested by you, (please )?call",
        r"beware of fraud",
        r"do not disclose",
        r"keep this confidential"
    ]

    def __init__(self):
        pass

    def analyze(self, content: str, source_type: str = "auto") -> MessageAnalysisResponse:
        sanitized_text = content.strip()
        lower_text = sanitized_text.lower()
        signals: List[DetectedSignal] = []
        all_evidence: List[str] = []
        
        # Check if this is an authentic defensive notification (e.g., standard OTP with safety warning)
        has_safety_warning = False
        for pattern in self.SAFETY_DISCLAIMERS:
            match = re.search(pattern, lower_text)
            if match:
                has_safety_warning = True
                break

        # 1. Credential & Sensitive Data Harvesting
        harvest_signals, harvest_evidence = self._check_credential_harvesting(lower_text, has_safety_warning)
        signals.extend(harvest_signals)
        all_evidence.extend(harvest_evidence)

        # 2. Urgency, Coercion & Intimidation
        urgency_signals, urgency_evidence = self._check_urgency_threats(lower_text)
        signals.extend(urgency_signals)
        all_evidence.extend(urgency_evidence)

        # 3. Advance Fee, Payment Scams & Money Transfer
        payment_signals, payment_evidence = self._check_payment_fraud(lower_text)
        signals.extend(payment_signals)
        all_evidence.extend(payment_evidence)

        # 4. Lottery, Prize, & Unrealistic Rewards
        lottery_signals, lottery_evidence = self._check_lottery_rewards(lower_text)
        signals.extend(lottery_signals)
        all_evidence.extend(lottery_evidence)

        # 5. Fake Job Offers & Task Scams
        job_signals, job_evidence = self._check_fake_jobs(lower_text)
        signals.extend(job_signals)
        all_evidence.extend(job_evidence)

        # 6. Brand & Authority Impersonation
        impersonation_signals, impersonation_evidence = self._check_impersonation(lower_text)
        signals.extend(impersonation_signals)
        all_evidence.extend(impersonation_evidence)

        # 7. Shortened Links & Suspicious URL patterns
        link_signals, link_evidence = self._check_suspicious_links(sanitized_text)
        signals.extend(link_signals)
        all_evidence.extend(link_evidence)

        # 8. Channel Diversion (WhatsApp, Telegram)
        diversion_signals, diversion_evidence = self._check_channel_diversion(lower_text)
        signals.extend(diversion_signals)
        all_evidence.extend(diversion_evidence)

        # 9. Remote Access & Malicious Apps
        remote_signals, remote_evidence = self._check_remote_access_apps(lower_text)
        signals.extend(remote_signals)
        all_evidence.extend(remote_evidence)

        # Deduplicate evidence
        unique_evidence = list(dict.fromkeys(all_evidence))

        # Calculate composite risk score
        risk_score = self._compute_risk_score(signals, has_safety_warning, lower_text)

        # Determine risk label based on specified bands:
        # 0–29: Low Risk, 30–59: Suspicious, 60–100: High Risk
        if risk_score >= 60:
            risk_level = "High Risk"
        elif risk_score >= 30:
            risk_level = "Suspicious"
        else:
            risk_level = "Low Risk"

        # Generate contextual plain-language explanation
        summary = self._generate_summary(risk_level, risk_score, signals, has_safety_warning)

        # Generate targeted recommendations
        recommended_actions = self._generate_recommendations(risk_level, signals)

        # Auto-detect source category if not provided
        detected_source = self._detect_source_type(lower_text, source_type)

        scan_id = f"scan-{uuid.uuid4().hex[:10]}"
        analyzed_at = datetime.now(timezone.utc).isoformat()

        limitations = (
            "This assessment is an algorithmic estimate based on detected lexical and behavioral signals. "
            "It is not a 100% guarantee that a message is authentic or fraudulent. "
            "Never share OTPs, passwords, or personal credentials regardless of test results."
        )

        return MessageAnalysisResponse(
            scan_id=scan_id,
            analyzed_at=analyzed_at,
            risk_score=risk_score,
            risk_level=risk_level,
            summary=summary,
            detected_signals=signals,
            evidence=unique_evidence,
            recommended_actions=recommended_actions,
            limitations=limitations,
            engine_used="heuristic",
            source_type_detected=detected_source
        )

    def _check_credential_harvesting(self, text: str, has_safety_warning: bool) -> Tuple[List[DetectedSignal], List[str]]:
        signals = []
        evidence = []

        # Patterns that actively ASK for credentials
        active_harvest_patterns = [
            (r"(enter|share|provide|send|submit|verify|forward)\s+(your\s+)?(otp|one.time.password|password|mpin|pin|cvv|credentials)", "Critical Credential Harvesting Request", "critical"),
            (r"(update|complete|verify)\s+(your\s+)?(kyc|pan|aadhaar|debit.card|net\s*banking)", "Urgent KYC / Credential Verification Request", "high"),
            (r"click\s+(here|link)?\s*(to\s+)?(verify|update|authenticate|reactivate)\s+(account|card|kyc|sim)", "Phishing Link for Account Verification", "high"),
            (r"sim\s*(swap|deactivation|verification|block)\s*(warning|notice)?", "SIM Swap / Telecom Verification Trap", "high")
        ]

        for pattern, title, severity in active_harvest_patterns:
            matches = re.findall(pattern, text)
            if matches:
                matched_phrases = [m if isinstance(m, str) else " ".join(part for part in m if part) for m in matches]
                evidence.extend(matched_phrases[:3])
                signals.append(DetectedSignal(
                    category="Credential Harvesting",
                    severity=severity,
                    title=title,
                    description="The message requests confidential credentials such as an OTP, password, PIN, or sensitive verification data. Legitimate organizations never request these over messages.",
                    evidence=matched_phrases[:3]
                ))
                break

        # Standard OTP notification check (passive, not requesting you to send it out)
        if not signals and re.search(r"\b(otp|one.time.password|verification code)\b", text):
            if has_safety_warning:
                evidence.append("legitimate otp disclaimer")
                # Positive safety signal
            else:
                signals.append(DetectedSignal(
                    category="Credential Notice",
                    severity="low",
                    title="Contains One-Time Password Mention",
                    description="The message mentions an OTP or verification code. Ensure you initiated this transaction yourself.",
                    evidence=["otp / verification code"]
                ))

        return signals, evidence

    def _check_urgency_threats(self, text: str) -> Tuple[List[DetectedSignal], List[str]]:
        signals = []
        evidence = []

        urgency_patterns = [
            (r"(account\s+(will\s+be\s+)?(blocked|suspended|disabled|frozen|terminated|deactivated))", "Account Suspension / Block Threat", "high"),
            (r"(within\s+\d+\s*(hours?|hrs?|minutes?|mins?)|immediately|urgent action required|expires today|final notice|last chance)", "Artificial Urgency & Time Pressure", "medium"),
            (r"(legal\s+action|arrest\s+warrant|police\s+case|court\s+summons|fir\s+registered|customs\s+arrest)", "Legal Intimidation & Coercion", "critical"),
            (r"(electricity|power|service)\s+(will\s+be\s+)?(disconnected|cut\s*off)\s+(tonight|today|by\s+\d+)", "Utility Disconnection Threat Scam", "high")
        ]

        for pattern, title, severity in urgency_patterns:
            matches = re.findall(pattern, text)
            if matches:
                matched_phrases = [m if isinstance(m, str) else " ".join(part for part in m if part) for m in matches]
                evidence.extend(matched_phrases[:2])
                signals.append(DetectedSignal(
                    category="Urgency & Coercion",
                    severity=severity,
                    title=title,
                    description="Scammers fabricate extreme urgency, disconnection threats, or legal action to panic victims into acting without thinking.",
                    evidence=matched_phrases[:2]
                ))

        return signals, evidence

    def _check_payment_fraud(self, text: str) -> Tuple[List[DetectedSignal], List[str]]:
        signals = []
        evidence = []

        payment_patterns = [
            (r"(pay|transfer|send|deposit)\s+([\$€£₹]?\s*\d+\s+)?(registration\s+fee|processing\s+fee|security\s+deposit|advance\s+payment|training\s+fee|charges)", "Advance-Fee Fraud Indicator", "critical"),
            (r"(scan\s+(this\s+)?(qr|upi\s*qr|code)\s+(to\s+)?(receive|claim|get)\s+(money|cashback|payment|funds))", "Deceptive UPI QR Scam (Scanning Pays, Doesn't Receive)", "critical"),
            (r"(crypto|bitcoin|usdt|gift\s*card|itunes|steam\s*card|google\s*play\s*card)\s+(payment|transfer|to\s+release)", "High-Risk Unconventional Payment Demand", "high"),
            (r"(unpaid\s+customs\s+fee|delivery\s+fee\s+of\s+[\$€£₹]\s*\d+|parcel\s+held)", "Postal Delivery Fee Trick", "medium")
        ]

        for pattern, title, severity in payment_patterns:
            matches = re.findall(pattern, text)
            if matches:
                matched_phrases = [m if isinstance(m, str) else " ".join(part for part in m if part) for m in matches]
                evidence.extend(matched_phrases[:2])
                signals.append(DetectedSignal(
                    category="Payment Fraud",
                    severity=severity,
                    title=title,
                    description="Requests for upfront registration fees, scanning QR codes to 'receive' money, or unusual payment methods (crypto/gift cards) are classic hallmarks of financial scams.",
                    evidence=matched_phrases[:2]
                ))

        return signals, evidence

    def _check_lottery_rewards(self, text: str) -> Tuple[List[DetectedSignal], List[str]]:
        signals = []
        evidence = []

        lottery_patterns = [
            (r"(congratulations|congrats|you\s+have\s+won|selected\s+as\s+(the\s+)?winner|lottery\s+winner|lucky\s+draw)", "Unsolicited Prize / Lottery Claim", "high"),
            (r"([\$€£₹]\s*\d+([,\.]\d+)*\s*(million|crore|lakh|thousand|cash\s*prize))", "Unrealistic Reward Sum", "medium"),
            (r"(claim\s+(your\s+)?(prize|reward|gift|bonus|grant)\s+(now|today|before))", "Prize Claim Call-to-Action", "medium")
        ]

        detected_count = 0
        for pattern, title, severity in lottery_patterns:
            matches = re.findall(pattern, text)
            if matches:
                matched_phrases = [m if isinstance(m, str) else " ".join(part for part in m if part) for m in matches]
                evidence.extend(matched_phrases[:2])
                detected_count += 1

        if detected_count >= 2:
            signals.append(DetectedSignal(
                category="Lottery / Prize Scam",
                severity="high",
                title="Unrealistic Prize / Lottery Claim",
                description="Claims of winning a lottery, lucky draw, or massive cash reward in a contest you never entered are standard advance-fee lottery scams.",
                evidence=evidence[:3]
            ))
        elif detected_count == 1:
            signals.append(DetectedSignal(
                category="Prize / Reward Mention",
                severity="low",
                title="Promotional Reward Language",
                description="Mentions rewards or prize terms. Verify the sender's identity carefully.",
                evidence=evidence[:2]
            ))

        return signals, evidence

    def _check_fake_jobs(self, text: str) -> Tuple[List[DetectedSignal], List[str]]:
        signals = []
        evidence = []

        job_patterns = [
            (r"(part\s*time\s*job|work\s+from\s+home\s+job|hiring\s+urgently|online\s+job\s+offer)", "Unsolicited Job Offer", "medium"),
            (r"(earn\s+[\$€£₹]?\s*\d+\s*[-–to]+\s*[\$€£₹]?\s*\d+\s*(daily|per\s+day|hourly))", "Inflated Daily Earnings Claim", "high"),
            (r"(youtube\s+(like|subscribe|video)\s+task|hotel\s+review\s+task|rating\s+task|merchant\s+order\s+task)", "Prepaid Task / Rating Scam Trap", "critical"),
            (r"(no\s+experience\s+needed|no\s+skills\s+required|anyone\s+can\s+do|just\s+using\s+your\s+phone)", "Low-Effort High-Payout Lure", "medium")
        ]

        matched_job_signs = []
        for pattern, title, severity in job_patterns:
            matches = re.findall(pattern, text)
            if matches:
                matched_phrases = [m if isinstance(m, str) else " ".join(part for part in m if part) for m in matches]
                evidence.extend(matched_phrases[:2])
                matched_job_signs.append((title, severity))

        if len(matched_job_signs) >= 2 or any(s == "critical" for _, s in matched_job_signs):
            signals.append(DetectedSignal(
                category="Fake Employment & Task Scam",
                severity="high",
                title="Suspicious Remote Job / Paid Task Scheme",
                description="Promises of high daily payouts for simple tasks (liking YouTube videos, reviewing hotels) are rampant scams that lure victims with small initial payouts before demanding large deposits.",
                evidence=evidence[:3]
            ))
        elif len(matched_job_signs) == 1:
            signals.append(DetectedSignal(
                category="Employment Opportunity",
                severity="low",
                title="Job Offer Keywords Detected",
                description="Contains standard job recruiting phrasing. Verify company official email address.",
                evidence=evidence[:2]
            ))

        return signals, evidence

    def _check_impersonation(self, text: str) -> Tuple[List[DetectedSignal], List[str]]:
        signals = []
        evidence = []

        matched_brands = [brand for brand in self.KNOWN_BRANDS if re.search(r"\b" + re.escape(brand) + r"\b", text)]
        if matched_brands:
            evidence.extend(matched_brands)
            # Check if brand mention is paired with urgency or verification link
            has_urgent_call = bool(re.search(r"(update|verify|blocked|suspended|click|link|login|call)", text))
            if has_urgent_call:
                signals.append(DetectedSignal(
                    category="Brand Impersonation",
                    severity="high" if len(matched_brands) > 1 or "bank" in text else "medium",
                    title=f"Brand Reference Detected ({', '.join(b.title() for b in matched_brands[:3])})",
                    description=f"Mentions recognizable institutions ({', '.join(b.title() for b in matched_brands[:3])}) alongside action triggers. Phishers impersonate trustworthy brands to lower defenses.",
                    evidence=matched_brands[:3]
                ))

        return signals, evidence

    def _check_suspicious_links(self, text: str) -> Tuple[List[DetectedSignal], List[str]]:
        signals = []
        evidence = []

        # Find URLs
        url_matches = re.findall(r"(https?://[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:/[^\s]*)?)", text)
        for url in url_matches:
            url_lower = url.lower()
            # Check for suspicious shorteners
            if any(shortener in url_lower for shortener in self.SUSPICIOUS_SHORTENERS):
                evidence.append(url)
                signals.append(DetectedSignal(
                    category="Suspicious Link",
                    severity="high",
                    title="Obfuscated Link Shortener Detected",
                    description=f"The URL '{url}' uses a link-shortening service that masks the real destination. Phishers use this to evade security filters.",
                    evidence=[url]
                ))
            # Check for raw IP address in URL
            elif re.search(r"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b", url):
                evidence.append(url)
                signals.append(DetectedSignal(
                    category="Suspicious Link",
                    severity="critical",
                    title="Direct IP Address Link Detected",
                    description=f"The link '{url}' points directly to a raw numeric IP address instead of an authenticated domain name.",
                    evidence=[url]
                ))
            # Check for misleading hyphens/subdomains (e.g. paypal.com-login-verify.xyz)
            elif re.search(r"(login|verify|secure|update|banking|account).*(free|bonus|gift|xyz|top|live|tk|ml)", url_lower):
                evidence.append(url)
                signals.append(DetectedSignal(
                    category="Suspicious Link",
                    severity="high",
                    title="Deceptive Phishing Domain Structure",
                    description=f"The URL '{url}' contains security buzzwords combined with suspicious domain patterns.",
                    evidence=[url]
                ))

        return signals, evidence

    def _check_channel_diversion(self, text: str) -> Tuple[List[DetectedSignal], List[str]]:
        signals = []
        evidence = []

        diversion_patterns = [
            (r"(contact|dm|message|chat|reply)\s+(me\s+)?(on|via)\s+(whatsapp|telegram|signal|viber)", "Channel Diversion (WhatsApp/Telegram)", "medium"),
            (r"(t\.me/[a-zA-Z0-9_]+|wa\.me/\d+|chat\.whatsapp\.com/[a-zA-Z0-9]+)", "Direct Messaging App Link", "high"),
            (r"(join\s+our\s+telegram\s+channel|add\s+on\s+whatsapp\s+for\s+details)", "Off-Platform Communication Lure", "high")
        ]

        for pattern, title, severity in diversion_patterns:
            matches = re.findall(pattern, text)
            if matches:
                matched_phrases = [m if isinstance(m, str) else " ".join(part for part in m if part) for m in matches]
                evidence.extend(matched_phrases[:2])
                signals.append(DetectedSignal(
                    category="Channel Diversion",
                    severity=severity,
                    title=title,
                    description="Scammers steer conversations to encrypted messaging platforms (WhatsApp, Telegram) to avoid corporate email filters and remain anonymous.",
                    evidence=matched_phrases[:2]
                ))
                break

        return signals, evidence

    def _check_remote_access_apps(self, text: str) -> Tuple[List[DetectedSignal], List[str]]:
        signals = []
        evidence = []

        remote_apps = ["anydesk", "teamviewer", "quicksupport", "rustdesk", "zoho assist", "ultraviewer"]
        matched_apps = [app for app in remote_apps if app in text]

        if matched_apps:
            evidence.extend(matched_apps)
            signals.append(DetectedSignal(
                category="Remote Access Attack",
                severity="critical",
                title=f"Remote Screen Sharing Request ({', '.join(a.title() for a in matched_apps)})",
                description="The message instructs you to install remote desktop control software. Fraudsters use this to seize control of your device and empty bank accounts.",
                evidence=matched_apps
            ))

        if ".apk" in text or "install app" in text or "download app" in text:
            evidence.append(".apk / app download")
            signals.append(DetectedSignal(
                category="Malicious Software",
                severity="high",
                title="Unknown Application / APK Download Request",
                description="Requests to side-load third-party Android APK files or untrusted software are used to install SMS-stealing trojans.",
                evidence=[".apk / download application"]
            ))

        return signals, evidence

    def _compute_risk_score(self, signals: List[DetectedSignal], has_safety_warning: bool, text: str) -> int:
        if not signals:
            # Baseline clean message
            return 5 if len(text) < 10 else 10

        # Weights per severity
        severity_weights = {
            "critical": 40,
            "high": 28,
            "medium": 16,
            "low": 8
        }

        raw_score = sum(severity_weights.get(s.severity, 10) for s in signals)

        # Cross-signal synergy: multiple distinct categories compound the risk
        categories = {s.category for s in signals}
        if len(categories) >= 3:
            raw_score += 18
        elif len(categories) == 2:
            raw_score += 10

        # If it has genuine safety disclaimers and NO critical harvesting
        if has_safety_warning and not any(s.severity == "critical" for s in signals):
            raw_score = max(5, raw_score - 20)

        # Cap between 0 and 98 (reserve 100 for verified exploits)
        final_score = max(5, min(raw_score, 98))
        return final_score

    def _generate_summary(self, risk_level: str, score: int, signals: List[DetectedSignal], has_safety_warning: bool) -> str:
        if risk_level == "High Risk":
            top_categories = ", ".join(dict.fromkeys(s.category for s in signals))
            return (
                f"High-risk alert ({score}/100): This message demonstrates multiple aggressive indicators of fraud, "
                f"specifically: {top_categories}. Do not click any links, do not transfer money, and never disclose sensitive information."
            )
        elif risk_level == "Suspicious":
            categories = ", ".join(dict.fromkeys(s.category for s in signals))
            return (
                f"Caution advised ({score}/100): This communication contains suspicious traits ({categories}). "
                f"While not definitively confirmed malicious, exercise high vigilance and verify through independent official channels."
            )
        else:
            if has_safety_warning:
                return (
                    f"Low Risk ({score}/100): This text resembles a standard transactional alert with legitimate security warnings. "
                    f"Always adhere to the warning and never disclose OTPs to anyone."
                )
            return (
                f"Low Risk ({score}/100): No aggressive fraud patterns were detected in this message. "
                f"However, always stay observant of unexpected solicitations or future payment requests."
            )

    def _generate_recommendations(self, risk_level: str, signals: List[DetectedSignal]) -> List[str]:
        recommendations = []
        categories = {s.category for s in signals}

        if risk_level == "High Risk":
            recommendations.append("Do NOT reply, click any embedded links, or call the telephone number provided in the message.")
            if "Credential Harvesting" in categories or "Remote Access Attack" in categories:
                recommendations.append("NEVER share OTPs, PINs, passwords, or install AnyDesk/TeamViewer apps under any circumstance.")
            if "Payment Fraud" in categories:
                recommendations.append("Do NOT scan any QR code or transfer advance fees to 'receive' money or prizes.")
            recommendations.append("If this claims to be from your bank or utility, call the official number printed on the back of your card or utility bill.")
            recommendations.append("For Indian users: Report financial cyber frauds immediately to helpline 1930 or file a complaint at https://cybercrime.gov.in/.")
            recommendations.append("Block and report the sender's phone number or email address on your device.")
        elif risk_level == "Suspicious":
            recommendations.append("Verify the sender's identity through an independent, bookmarked official website or verified customer care number.")
            recommendations.append("Inspect any links carefully without clicking them directly.")
            recommendations.append("Do not succumb to artificial urgency or pressure to act immediately.")
            recommendations.append("If unsure, forward suspicious SMS messages to your telecom operator's spam reporting shortcode (e.g., 1909 in India or 7726 in UK/US).")
        else:
            recommendations.append("Keep your personal information safe and never share one-time security codes.")
            recommendations.append("Always verify that notifications match transactions you personally initiated.")
            recommendations.append("Ensure multi-factor authentication (MFA) is enabled on all your critical accounts.")

        return recommendations

    def _detect_source_type(self, text: str, hint: str) -> str:
        if hint in ["sms", "whatsapp", "email", "job", "social"]:
            return hint
        if "telegram" in text or "t.me" in text:
            return "telegram"
        if "whatsapp" in text or "wa.me" in text:
            return "whatsapp"
        if "dear customer" in text or "subject:" in text or "regards" in text:
            return "email"
        if "job" in text or "hiring" in text or "daily task" in text:
            return "job"
        return "sms"
