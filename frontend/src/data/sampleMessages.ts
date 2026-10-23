export interface SampleMessage {
  id: string;
  category: string;
  title: string;
  tag: 'Scam' | 'Suspicious' | 'Safe';
  content: string;
  source_type: string;
}

export const SAMPLE_MESSAGES: SampleMessage[] = [
  {
    id: "sample-prize",
    category: "Lottery & Prize",
    title: "Unsolicited International Lottery Winner",
    tag: "Scam",
    content: "CONGRATULATIONS! You have been selected as the 1st prize lucky winner of $1,500,000 in the Global Mobile Draw 2026. To claim your cash reward, verify details and pay $150 processing fee at http://bit.ly/claim-prize-global immediately.",
    source_type: "sms"
  },
  {
    id: "sample-job",
    category: "Fake Job Offer",
    title: "Remote Task / YouTube Like Scam",
    tag: "Scam",
    content: "Urgent Hiring! Work from Home Part-Time Job. Earn ₹4,000 - ₹8,000 daily by simply liking YouTube videos & reviewing hotels. No experience needed. Immediate payout. Pay ₹500 refundable security deposit to start. Contact HR on Telegram @task_director_hr",
    source_type: "job"
  },
  {
    id: "sample-otp",
    category: "Banking & OTP",
    title: "Aggressive Account Suspension & OTP Request",
    tag: "Scam",
    content: "Dear Customer, your SBI Net Banking account is blocked due to incomplete KYC verification. Click http://sbi-kyc-update.xyz/login and enter your OTP and debit card PIN within 2 hours to avoid permanent deactivation.",
    source_type: "sms"
  },
  {
    id: "sample-safe-otp",
    category: "Legitimate Notification",
    title: "Authentic Banking Security Alert",
    tag: "Safe",
    content: "948201 is the OTP for your online transaction of USD 24.50 at CloudServices on card ending 4092. Valid for 10 mins. NEVER share this OTP with anyone, including bank representatives.",
    source_type: "sms"
  },
  {
    id: "sample-safe-chat",
    category: "Routine Communication",
    title: "Personal Friendly Meeting",
    tag: "Safe",
    content: "Hi Prachi, thanks for sending over the project slides. Let's do a quick sync tomorrow at 11:30 AM before the team presentation. See you in conference room B!",
    source_type: "whatsapp"
  },
  {
    id: "sample-utility",
    category: "Utility Threat",
    title: "Electricity Disconnection Phishing",
    tag: "Scam",
    content: "Dear Consumer, your electricity power connection will be disconnected tonight at 9:30 PM from the power sub-station because previous month bill was not updated. Immediately call electricity officer at 9812345678 to update bill.",
    source_type: "sms"
  }
];

export const SAMPLE_URLS = [
  {
    title: "Deceptive Typosquatting (PayPal)",
    url: "https://paypa1-security-verification.xyz/login/verify",
    tag: "High Risk"
  },
  {
    title: "Subdomain Brand Spoofing (Chase)",
    url: "https://chase.com.account-recovery-system.xyz/banking/login",
    tag: "High Risk"
  },
  {
    title: "Direct Raw IP Address Link",
    url: "http://185.190.140.2/auth/login",
    tag: "High Risk"
  },
  {
    title: "Official Authentic Domain (Google)",
    url: "https://www.google.com",
    tag: "Safe"
  }
];
