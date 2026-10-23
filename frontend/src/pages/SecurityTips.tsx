import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  KeyRound,
  MailWarning,
  Briefcase,
  Trophy,
  Package,
  UserX,
  QrCode,
  CheckSquare,
  Square,
  AlertOctagon,
  PhoneCall,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

export const SecurityTips: React.FC = () => {
  // Checklist interactive state
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [activeAccordion, setActiveAccordion] = useState<string | null>('banks');

  const checklist = [
    { id: 'c1', label: 'Does the sender request an OTP, CVV, ATM PIN, or banking password? (Legitimate entities NEVER ask for this).' },
    { id: 'c2', label: 'Does the message create intense panic, such as "Account suspended within 2 hours" or "Arrest warrant"?' },
    { id: 'c3', label: 'Are they asking you to scan a UPI QR code to "receive" money? (Scanning a QR code DEBITS your account!).' },
    { id: 'c4', label: 'Does the message ask you to install AnyDesk, TeamViewer, QuickSupport, or an unknown .apk file?' },
    { id: 'c5', label: 'Does the job offer require a "security deposit", "registration fee", or communication only via Telegram?' },
    { id: 'c6', label: 'Does the URL domain have subtle spelling oddities (e.g., paypa1, micros0ft, sbi-kyc-portal.xyz)?' },
    { id: 'c7', label: 'Did you enter a contest or lottery recently? If not, you CANNOT win an unsolicited prize.' }
  ];

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const educationalCards = [
    {
      id: 'banks',
      icon: CreditCard,
      title: 'Fake Bank & Account Suspension Alerts',
      tag: 'High Danger',
      summary: 'Scammers send urgent SMS warnings claiming your bank account or debit card will be blocked unless you verify immediately.',
      redFlags: [
        'Sender uses arbitrary personal mobile numbers instead of registered bank alphanumeric headers (like VM-HDFCBK, AX-SBINB).',
        'Directs you to an unverified third-party website with ".xyz", ".top", or hyphenated bank names.',
        'Asks you to re-verify KYC or update PAN details by clicking an embedded link.'
      ],
      safetyRule: 'Never click links in bank alerts. Open your bank’s official mobile app directly or call the toll-free number printed on the physical back of your credit/debit card.'
    },
    {
      id: 'otp',
      icon: KeyRound,
      title: 'OTP & Payment Fraud Scams',
      tag: 'Critical',
      summary: 'Fraudsters impersonate bank executives or tech support to manipulate you into sharing one-time authorization passwords.',
      redFlags: [
        'Caller claims they need the OTP to "cancel a fraudulent charge" or "process an account refund".',
        'They ask you to forward an SMS message to another phone number.',
        'Urgent pressure insisting the transaction will fail or incur heavy fines without the code.'
      ],
      safetyRule: 'An OTP is the digital equivalent of your handwritten signature. Bank staff are strictly prohibited from asking for it. Never share it with anyone under any circumstance.'
    },
    {
      id: 'qr',
      icon: QrCode,
      title: 'Deceptive QR Code Scams (UPI / Payment)',
      tag: 'Common Scam',
      summary: 'Scammers on online marketplaces (OLX, Facebook Marketplace) claim they want to pay you, but send a QR code to "receive funds".',
      redFlags: [
        'Buyer is in a rush to pay without even seeing the item.',
        'Claims: "I am sending a QR code, scan it and enter your UPI PIN to receive the money into your bank".',
        'Sends fake screenshots of bank transfers.'
      ],
      safetyRule: 'Golden Rule of Digital Payments: You NEVER enter your UPI PIN or scan a QR code to RECEIVE money. Entering your PIN ALWAYS withdraws money from your account!'
    },
    {
      id: 'job',
      icon: Briefcase,
      title: 'Fake Work-From-Home & Paid Task Scams',
      tag: 'Widespread',
      summary: 'Fraudsters promise ₹3,000–₹10,000/day for liking YouTube videos, rating hotels, or placing dummy merchant orders.',
      redFlags: [
        'Recruiter reaches out via WhatsApp or Telegram without any formal interview or resume.',
        'They give you a small initial payout ($5-$10 or ₹500) to build trust.',
        'They demand you deposit a "prepaid recharge" or "tax clearance fee" to withdraw your accumulated balance.'
      ],
      safetyRule: 'Legitimate employers never ask candidates to pay money to work. Any scheme requiring you to deposit money to "unlock commissions" is 100% advance-fee fraud.'
    },
    {
      id: 'lottery',
      icon: Trophy,
      title: 'Lottery, Gift Card & Lucky Draw Scams',
      tag: 'Classic Fraud',
      summary: 'Unsolicited messages announcing you won luxury cars, millions in foreign currency, or shopping vouchers.',
      redFlags: [
        'Mentions draws you never entered (e.g., "KBC Lucky Draw", "WhatsApp International Lottery").',
        'Requests a processing fee, customs duty, or GST upfront to dispatch the prize.',
        'Demands gift cards (Apple, Steam, Google Play) or crypto transfers.'
      ],
      safetyRule: 'You cannot win a lottery you never entered. Government fees and taxes are never paid via gift cards, wire transfers, or cryptocurrency.'
    },
    {
      id: 'delivery',
      icon: Package,
      title: 'Parcel Delivery & Customs Fee Phishing',
      tag: 'Surging',
      summary: 'Fake SMS notifications from FedEx, DHL, USPS, or India Post claiming a parcel cannot be delivered due to missing address or unpaid tax.',
      redFlags: [
        'SMS arrives when you are not expecting any international parcel.',
        'Link leads to a page demanding a nominal $1.50 or ₹50 fee, but steals your entire debit card details.',
        'URL shorteners like bit.ly, tinyurl, or odd lookalike domains.'
      ],
      safetyRule: 'Track parcels only using the official tracking number directly inside the official courier application or official portal.'
    },
    {
      id: 'impersonation',
      icon: UserX,
      title: 'Police, Customs & Digital Arrest Scams',
      tag: 'Severe Threat',
      summary: 'Criminals impersonating police, CBI, ED, or customs officers claim illegal contraband (drugs/passports) was sent in your name.',
      redFlags: [
        'Caller threatens immediate arrest and forces you to stay on a Skype/WhatsApp video call ("digital arrest").',
        'They display fake arrest warrants, Supreme Court summons, and forged police badges.',
        'They demand you transfer funds to a "government verification account" to clear your name.'
      ],
      safetyRule: 'There is NO legal concept of "Digital Arrest" under Indian law or any international police procedure. Law enforcement agencies NEVER conduct interrogations or demand fund transfers over video calls.'
    },
    {
      id: 'phishing',
      icon: MailWarning,
      title: 'Phishing Emails & Lookalike Portals',
      tag: 'Corporate & Personal',
      summary: 'Forged emails mimicking Microsoft 365, Google Workspace, IT departments, or HR asking for password resets.',
      redFlags: [
        'Display name says "IT Helpdesk", but actual sender address is from an unverified public domain (e.g., `@gmail.com` or `@mail-support.xyz`).',
        'Generic greetings like "Dear Customer" or "Dear Employee".',
        'High urgency insisting your inbox will be closed in 24 hours.'
      ],
      safetyRule: 'Always hover over links to inspect the actual target URL before clicking. Enable hardware security keys or authenticator app-based 2FA.'
    }
  ];

  const totalChecked = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Defense & Prevention
          </span>
          <span className="text-xs text-slate-400">• Cybersecurity Best Practices</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Scam Defense Guides & Incident Response
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Master the warning signs of social engineering. Learn how to verify suspicious requests, report cybercrime to official authorities, and secure your accounts.
        </p>
      </div>

      {/* Official Cybercrime Emergency Contacts Section (India & International) */}
      <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-[#111A2E] to-[#111A2E] p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <PhoneCall className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">Official Incident Response</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Already Defrauded or Transferred Money?</h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
          Act immediately within the <strong className="text-rose-300">"Golden Hour"</strong> (first 2 hours). Fast reporting allows authorities and bank nodal officers to freeze fraudulent fund transfers before cash is withdrawn at ATMs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* India Helpline */}
          <div className="p-4 rounded-2xl border border-rose-500/30 bg-slate-900/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">India: National Cyber Crime Helpline</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">Toll-Free 24x7</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white tracking-tight">1930</span>
              <span className="text-xs text-slate-400">Citizen Financial Cyber Fraud Reporting System</span>
            </div>
            <p className="text-xs text-slate-300">
              Official Portal:{' '}
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline font-semibold inline-flex items-center gap-1"
              >
                https://cybercrime.gov.in <ExternalLink className="w-3 h-3" />
              </a>
            </p>
            <p className="text-[11px] text-slate-400">
              Contact your bank immediately to block your compromised credit/debit card and net banking account.
            </p>
          </div>

          {/* International Resources */}
          <div className="p-4 rounded-2xl border border-slate-700 bg-slate-900/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">United States / Global Resources</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">Federal Portals</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300 pt-1">
              <div>
                • <strong className="text-white">US Federal Trade Commission (FTC):</strong>{' '}
                <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                  reportfraud.ftc.gov
                </a>
              </div>
              <div>
                • <strong className="text-white">FBI Internet Crime Complaint Center (IC3):</strong>{' '}
                <a href="https://www.ic3.gov" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                  ic3.gov
                </a>
              </div>
              <div>
                • <strong className="text-white">UK Action Fraud:</strong> Call <code className="text-cyan-300 font-mono">0300 123 2040</code> or visit{' '}
                <a href="https://www.actionfraud.police.uk" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                  actionfraud.police.uk
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Scam Safety Checklist */}
      <div className="rounded-3xl border border-slate-800 bg-[#111A2E] p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-cyan-400" />
              <span>Interactive Scam Safety Checklist</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Before clicking links or making payments, tick any questions that describe the message you received:
            </p>
          </div>

          <div className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 self-start sm:self-center">
            Flags Checked: <span className={totalChecked > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{totalChecked} / {checklist.length}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {checklist.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                  isChecked
                    ? 'border-rose-500/40 bg-rose-950/20 text-rose-200'
                    : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className="text-xs sm:text-sm leading-relaxed">{item.label}</span>
              </div>
            );
          })}
        </div>

        {totalChecked > 0 ? (
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/30 flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-200">
              <strong className="block text-sm font-bold text-rose-300">High Fraud Warning!</strong>
              You ticked {totalChecked} known scam indicator(s). Do NOT proceed, do NOT send money or OTPs, and block the sender immediately.
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-xs text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>If none of these apply, still exercise caution and verify unexpected requests through separate channels.</span>
          </div>
        )}
      </div>

      {/* Educational Guides (8 Categories) */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-violet-400" />
          <span>In-Depth Threat Breakdown Guides</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {educationalCards.map((card) => {
            const Icon = card.icon;
            const isOpen = activeAccordion === card.id;

            return (
              <div
                key={card.id}
                className="rounded-2xl border border-slate-800 bg-[#111A2E] p-5 shadow-lg transition-all hover:border-slate-700"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white">{card.title}</h3>
                      <span className="text-[10px] uppercase font-bold text-rose-400">{card.tag}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveAccordion(isOpen ? null : card.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  >
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {card.summary}
                </p>

                {isOpen && (
                  <div className="space-y-3 pt-3 border-t border-slate-800/80 animate-in fade-in">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Common Red Flags:
                      </span>
                      <ul className="space-y-1">
                        {card.redFlags.map((rf, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-rose-400 font-bold">•</span>
                            <span>{rf}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0B1020] border border-cyan-500/20 text-xs text-slate-300">
                      <strong className="text-cyan-400 block mb-0.5">Golden Rule:</strong>
                      {card.safetyRule}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
