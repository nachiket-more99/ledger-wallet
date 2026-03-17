import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* NAV */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-10 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
            <img src="/favicon.svg" alt="Favicon" />
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-900">Ledger Wallet</span>
        </div>

        <ul className="hidden md:flex gap-8 text-sm text-gray-500 list-none">
          <li><a href="#features" className="hover:text-gray-900 transition-colors">Features</a></li>
          <li><a href="#stack" className="hover:text-gray-900 transition-colors">Tech Stack</a></li>
          <li>
            <a href="https://github.com/nachiket-more99/ledger-wallet" target="_blank" rel="noreferrer"
               className="hover:text-gray-900 transition-colors">
              GitHub
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          <Link to="/login"
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Sign in
          </Link>
          <Link to="/register"
            className="px-4 py-2 text-sm bg-primary text-white rounded-lg font-medium hover:bg-primary transition-colors">
            Try demo
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
<div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-4 py-2 rounded-full border border-primary/20 mb-8">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          Full-stack fintech demo · React + NestJS + PostgreSQL + Redis
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
          A digital wallet built<br />
          for <span className="text-primary">real-world</span> scale
        </h1>

        <p className="text-lg text-gray-500 font-light leading-relaxed max-w-xl mx-auto mb-10">
          Ledger-based accounting, real-time Redis caching, concurrency-safe transfers,
          mock Razorpay payments, and a full admin panel - production-grade from day one.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-4">
          <a href="https://github.com/nachiket-more99/ledger-wallet" target="_blank" rel="noreferrer"
             className="px-7 py-3.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary transition-colors">
            View source code
          </a>
        </div>
        <p className="text-xs text-gray-400">No credit card required · Use test credentials to explore</p>
      </section>

{/* DASHBOARD MOCKUP */}
<div className="max-w-3xl mx-auto px-6 pb-12">
  <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">

    {/* Title bar */}
    <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
      <span className="w-3 h-3 rounded-full bg-red-400"></span>
      <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
      <span className="w-3 h-3 rounded-full bg-green-400"></span>
      <div className="flex-1 mx-4 bg-gray-100 rounded-md text-xs text-gray-400 text-center py-1 px-2">
        ledger-wallet-tau.vercel.app/dashboard
      </div>
    </div>

    {/* Actual screenshot */}
    <img
      src="/dashboard.png"
      alt="Ledger Wallet dashboard screenshot"
      className="w-full block"
    />

  </div>
</div>

      {/* STAT STRIP */}
      <div className="max-w-3xl mx-auto px-6 pb-10 grid grid-cols-3 gap-3">
        {[
          { value: "ACID", label: "Ledger accounting model" },
          { value: "Redis", label: "Concurrency locks + caching" },
          { value: "JWT", label: "Role-based auth (USER / ADMIN)" },
        ].map((s) => (
          <div key={s.value} className="bg-white border border-gray-200 rounded-xl p-5 text-center">
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section id="features" className="max-w-3xl mx-auto px-6 pb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Features</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">Built like a real fintech product</h2>
        <p className="text-sm text-gray-400 font-light mb-8">Not a tutorial project - every feature has production-grade considerations baked in.</p>

<div className="grid grid-cols-2 gap-3">
  {[
    {
      iconBg: "bg-emerald-50",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="5" width="14" height="10" rx="2" stroke="#059669" strokeWidth="1.4"/>
          <path d="M5 5V4a4 4 0 018 0v1" stroke="#059669" strokeWidth="1.4"/>
          <circle cx="9" cy="10" r="1.5" fill="#059669"/>
        </svg>
      ),
      title: "Secure auth with JWT",
      desc: "User registration, login, and role-based access control (USER / ADMIN). Passport.js strategies with NestJS guards protecting every route.",
    },
    {
      iconBg: "bg-orange-50",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3 9h12M9 3v12" stroke="#ea580c" strokeWidth="1.4" strokeLinecap="round"/>
          <circle cx="9" cy="9" r="6" stroke="#ea580c" strokeWidth="1.4"/>
        </svg>
      ),
      title: "Ledger-based accounting",
      desc: "Every transaction is a DEBIT or CREDIT entry. Balance is computed from the ledger - the same model used by real banks and payment systems.",
    },
    {
      iconBg: "bg-blue-50",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M4 9l4 4 6-8" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="9" r="7" stroke="#2563eb" strokeWidth="1.4"/>
        </svg>
      ),
      title: "Concurrency-safe transfers",
      desc: "Redis distributed locks prevent double-spend. Two users transferring simultaneously won't corrupt balances - race conditions handled gracefully.",
    },
    {
      iconBg: "bg-yellow-50",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="4" width="14" height="10" rx="2" stroke="#d97706" strokeWidth="1.4"/>
          <path d="M2 7h14" stroke="#d97706" strokeWidth="1.4"/>
          <circle cx="5.5" cy="11" r="1" fill="#d97706"/>
        </svg>
      ),
      title: "Mock Razorpay + webhooks",
      desc: "Add money flow with a simulated Razorpay integration and webhook confirmation - mirrors how production payment gateways work.",
    },
    {
      iconBg: "bg-purple-50",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="6" cy="9" r="3" stroke="#7c3aed" strokeWidth="1.4"/>
          <circle cx="13" cy="5" r="2" stroke="#7c3aed" strokeWidth="1.4"/>
          <circle cx="13" cy="13" r="2" stroke="#7c3aed" strokeWidth="1.4"/>
          <path d="M9 8l2-2M9 10l2 2" stroke="#7c3aed" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Admin panel",
      desc: "View all users and their transaction history. Search and filter. Role guard ensures only ADMIN-role JWTs can access these backend routes.",
    },
    {
      iconBg: "bg-emerald-50",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 2v3M9 13v3M2 9h3M13 9h3" stroke="#059669" strokeWidth="1.4" strokeLinecap="round"/>
          <circle cx="9" cy="9" r="3.5" stroke="#059669" strokeWidth="1.4"/>
        </svg>
      ),
      title: "Redis caching",
      desc: "Wallet balances are cached with Upstash Redis in production. Cache invalidates on every transaction - fast reads without stale data.",
    },
  ].map((f) => (
    <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-5">
      <div className={`w-9 h-9 ${f.iconBg} rounded-lg mb-4 flex items-center justify-center`}>
        {f.icon}
      </div>
      <p className="font-semibold text-sm text-gray-900 mb-2">{f.title}</p>
      <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
    </div>
  ))}
</div>
      </section>

      {/* TECH STACK */}
      <section id="stack" className="max-w-3xl mx-auto px-6 pb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Tech Stack</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">Modern, production-grade choices</h2>
        <p className="text-sm text-gray-400 font-light mb-8">Every layer chosen for real-world scalability - not just demo convenience.</p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { color: "bg-blue-400", layer: "Frontend", name: "React + TypeScript" },
            { color: "bg-purple-400", layer: "Styling", name: "TailwindCSS + Vite" },
            { color: "bg-red-400", layer: "Backend", name: "NestJS + TypeScript" },
            { color: "bg-primary", layer: "ORM", name: "Prisma + PostgreSQL" },
            { color: "bg-yellow-400", layer: "Cache / Locks", name: "Redis / Upstash" },
            { color: "bg-gray-400", layer: "Deploy", name: "Vercel + Render" },
          ].map((s) => (
            <div key={s.name} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${s.color} flex-shrink-0`}></div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">{s.layer}</p>
                <p className="text-sm font-medium text-gray-800">{s.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-primary rounded-2xl px-10 py-12 text-center">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">Explore the app</h2>
          <p className="text-sm text-secondary font-light mb-8">
            Register a test account in seconds and try every feature - transfers, top-ups, and the admin panel.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/register"
              className="px-6 py-3 bg-white text-primary rounded-lg text-sm font-medium hover:bg-secodary transition-colors">
              Create test account
            </Link>
            <a href="https://github.com/nachiket-more99/ledger-wallet" target="_blank" rel="noreferrer"
               className="px-6 py-3 border border-secondary text-white rounded-lg text-sm hover:border-secondary transition-colors">
              Read the source code
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 px-10 py-5 flex items-center justify-between text-xs text-gray-400 bg-white">
        <span>© 2026 Ledger Wallet · Built by Nachiket More</span>
        <div className="flex gap-6">
          <a href="https://github.com/nachiket-more99/ledger-wallet" target="_blank" rel="noreferrer"
             className="hover:text-gray-700 transition-colors">GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
