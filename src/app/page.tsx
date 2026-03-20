import Image from "next/image";

const heroBenefits = [
  {
    title: "No Claim Forms",
    desc: "Automatic triggers based on weather and traffic data.",
    tone: "bg-blue-50 text-blue-900",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-blue-700">
        <path
          d="M8 12h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
  {
    title: "Instant UPI Payouts",
    desc: "Direct to your bank within seconds of a trigger.",
    tone: "bg-emerald-50 text-emerald-900",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald-700">
        <path
          d="M12 5v14m-5-5h10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
  {
    title: "₹15–₹30 Weekly",
    desc: "Premium auto-deducted from your wallet.",
    tone: "bg-amber-50 text-amber-900",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-amber-700">
        <rect
          x="4"
          y="6"
          width="16"
          height="12"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M7 12h10M10 9.5h.01M14 14.5h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const coverageTimeline = [
  {
    title: "Heavy Rain Trigger (62mm/hr)",
    amount: "+₹500",
    date: "July 14, 2024 • 14:32",
    id: "TXN-9921045582",
    color: "text-emerald-600",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  {
    title: "Storm Alert Trigger",
    amount: "+₹750",
    date: "July 10, 2024 • 18:15",
    id: "TXN-8812034911",
    color: "text-emerald-600",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  {
    title: "Heat Wave Threshold",
    amount: "+₹300",
    date: "July 02, 2024 • 11:05",
    id: "TXN-7734091120",
    color: "text-sky-700",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-700",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen w-full pb-16">
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-10 lg:px-10 xl:px-14">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
              <ShieldIcon />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-600">ShieldGrid</p>
              <p className="text-xl font-semibold text-slate-900 xl:text-2xl">Parametric Income Protection</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="flex h-10 items-center gap-2 rounded-full bg-white/70 px-4 shadow-sm ring-1 ring-slate-200 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="font-medium text-slate-800">Live triggers online</span>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          <HeroCard className="xl:col-span-7" />
          <DashboardCard className="xl:col-span-5" />
          <QuoteCard className="xl:col-span-7" />
          <HistoryCard className="xl:col-span-5" />
        </section>
      </main>
    </div>
  );
}

function HeroCard({ className = "" }: { className?: string }) {
  return (
    <article className={`flex h-full flex-col gap-6 overflow-hidden rounded-[28px] bg-white shadow-xl shadow-slate-200/70 ring-1 ring-slate-200 ${className}`}>
      <div className="relative overflow-hidden bg-[#0646c5] px-5 pt-8 pb-16 text-white lg:px-7 lg:pt-9">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0,rgba(255,255,255,0.08),transparent_28%)]" />
        <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-blue-900/40">
          <Image
            src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=900&q=80"
            alt="Delivery rider moving through city rain"
            width={900}
            height={600}
            className="h-[250px] w-full object-cover lg:h-[300px]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0646c5]/80 via-[#0646c5]/40 to-transparent" />
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
            <div className="flex h-24 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg shadow-blue-900/40">
              <ShieldIcon className="h-10 w-10 text-blue-700" />
            </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-200 px-4 py-2 text-emerald-900 shadow">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                Mumbai Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 lg:px-7 lg:pb-9">
        <h2 className="text-3xl font-extrabold leading-tight text-blue-800 lg:text-5xl">
          Instant Payouts During Floods & Blockades.
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 lg:text-xl lg:leading-8">
          The safety net for India&apos;s delivery backbone. Get paid when
          conditions stop the city.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {heroBenefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className={`flex items-start gap-3 rounded-2xl p-4 ring-1 ring-slate-100 ${benefit.tone}`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 ring-1 ring-white/40">
                  <Icon />
                </span>
                <div className="flex-1">
                  <p className="text-lg font-semibold leading-tight">
                    {benefit.title}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-700/80">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:bg-blue-800">
            Get Started
            <ArrowRightIcon />
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-blue-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-700">
              <WalletIcon />
            </span>
            Link UPI
          </button>
        </div>

        <div className="mt-7 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          <span>Powered by Infrastructure Trust</span>
          <span>Secure & Regulated</span>
        </div>
      </div>
    </article>
  );
}

function DashboardCard({ className = "" }: { className?: string }) {
  return (
    <article className={`flex h-full flex-col gap-5 rounded-[28px] bg-white p-6 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200 lg:p-7 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 ring-1 ring-blue-200">
            <ShieldIcon />
          </span>
          <div>
            <p className="text-lg font-semibold text-slate-900">ShieldGrid</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Dashboard
            </p>
          </div>
        </div>
        <span className="flex h-10 items-center gap-2 rounded-full bg-emerald-100 px-4 text-emerald-800 ring-1 ring-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Coverage Active
        </span>
      </div>

      <div className="rounded-2xl bg-emerald-100/80 p-5 text-emerald-900 ring-1 ring-emerald-200">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-800">
            Coverage Active
          </p>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white">
            <ShieldCheckIcon />
          </span>
        </div>
        <p className="mt-3 text-2xl font-bold">July 14 - July 20</p>
        <p className="mt-1 text-sm text-emerald-800">
          Your delivery rain-protection is currently live.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Rainfall Tracker
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">12mm/hr</p>
          <p className="text-sm font-semibold text-emerald-600">Below trigger</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Traffic Status
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">Moderate</p>
          <p className="text-sm font-semibold text-slate-500">No delay logged</p>
        </div>
      </div>

      <div className="rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Current Zone
            </p>
            <p className="mt-1 text-xl font-semibold text-slate-900">Bandra (West)</p>
          </div>
          <span className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Monitoring
          </span>
        </div>
        <div className="mt-4 h-36 rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 ring-1 ring-sky-200">
          <div className="flex h-full items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
              <span className="h-5 w-5 rounded-full bg-blue-600 shadow-inner" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-900">Next Week&apos;s Premium</p>
            <p className="text-sm text-slate-500">
              Forecast predicts heavy monsoons. Adjust now for better rates.
            </p>
          </div>
          <p className="text-2xl font-extrabold text-blue-700">₹149</p>
        </div>
        <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:bg-blue-800">
          <RefreshIcon /> Re-evaluate Premium
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatChip label="Weekly Payout" value="₹4,820" />
        <StatChip label="Safety Score" value="98%" accent="text-emerald-600" />
        <StatChip label="Claims" value="0" />
      </div>

      <div className="hidden items-center justify-between rounded-full bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 ring-1 ring-slate-200 md:flex">
        <span className="flex items-center gap-2">
          <GridIcon /> Dashboard
        </span>
        <span className="flex items-center gap-2 text-slate-800">
          <ShieldBadgeIcon /> Coverage
        </span>
        <span className="flex items-center gap-2">
          <HistoryIcon /> History
        </span>
      </div>
    </article>
  );
}

function QuoteCard({ className = "" }: { className?: string }) {
  return (
    <article className={`flex h-full flex-col gap-5 overflow-hidden rounded-[28px] bg-white p-6 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200 lg:p-7 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 ring-1 ring-blue-200">
            <ShieldIcon />
          </span>
          <div>
            <p className="text-lg font-semibold text-slate-900">ShieldGrid</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              AI Optimized Quote
            </p>
          </div>
        </div>
        <span className="flex items-center gap-2 text-blue-700">
          <SignalIcon />
        </span>
      </div>

      <div className="rounded-2xl bg-sky-50 p-5 ring-1 ring-sky-100">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-900">
            AI Optimized Quote
          </span>
          <p className="text-sm font-semibold text-slate-600">Location</p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xl font-semibold text-slate-900">Mumbai, MH</p>
          <span className="flex items-center gap-1 text-sm text-slate-600">
            <LocationIcon />
          </span>
        </div>
        <div className="mt-4 grid grid-cols-[auto,1fr] gap-x-4 gap-y-3">
          <div className="text-sm font-semibold text-slate-600">Weekly Premium</div>
          <div className="text-3xl font-extrabold text-blue-700">₹22 <span className="text-base text-slate-600">/ week</span></div>
          <div className="col-span-2 flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
              <RainIcon />
            </span>
            <div>
              <p className="text-lg font-semibold text-slate-900">High Rain Risk Forecasted</p>
              <p className="text-sm text-slate-600">July 21-27 • 88% Precipitation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Risk Score
          </p>
          <p className="mt-3 text-4xl font-extrabold text-amber-700">78</p>
          <p className="text-sm font-semibold text-amber-600">High risk level</p>
        </div>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Data Source
          </p>
          <p className="mt-3 text-base font-semibold text-slate-900">
            Based on IMD Rainfall Data for Mumbai
          </p>
          <div className="mt-2 flex gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
              <MoneyIcon />
            </span>
            <p className="text-lg font-semibold text-slate-900">Weather Replacement</p>
          </div>
          <p className="text-lg font-extrabold text-blue-700">₹500/day</p>
        </div>
        <div className="space-y-1 px-5 py-4 text-sm text-slate-700">
          <div className="flex items-start gap-3 py-1">
            <RainIcon className="text-slate-500" />
            <div>
              <p className="font-semibold text-slate-900">Heavy Rainfall Trigger</p>
              <p>Automatic activation when rain exceeds 15mm/hr in your delivery zone.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 py-1">
            <BoltIcon className="text-slate-500" />
            <div>
              <p className="font-semibold text-slate-900">Instant Payout</p>
              <p>Claims processed via UPI within 15 minutes of trigger event.</p>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-b-[24px] px-4 pb-4">
          <div className="h-32 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="flex h-full items-end justify-start px-4 pb-3 text-sm font-semibold text-slate-600">
              • Live risk monitoring
            </div>
          </div>
        </div>
      </div>

      <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:bg-blue-800">
        <BoltIcon className="text-white" /> Pay ₹22 & Activate Now
      </button>
    </article>
  );
}

function HistoryCard({ className = "" }: { className?: string }) {
  return (
    <article className={`flex h-full flex-col gap-5 rounded-[28px] bg-white p-6 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200 lg:p-7 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 ring-1 ring-blue-200">
            <ShieldIcon />
          </span>
          <div>
            <p className="text-lg font-semibold text-slate-900">ShieldGrid</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Payout History
            </p>
          </div>
        </div>
        <SignalIcon />
      </div>

      <div className="rounded-2xl bg-sky-50 p-5 ring-1 ring-sky-100">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Total Payouts Year-to-Date
        </p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-4xl font-extrabold text-blue-700">₹12,450</p>
          <span className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> All payouts completed
          </span>
        </div>
      </div>

      <div className="flex gap-3 text-sm font-semibold text-slate-600">
        <span className="rounded-full bg-blue-700 px-3 py-1 text-white">Recent Activity</span>
        <span className="rounded-full bg-slate-100 px-3 py-1">July 2024</span>
        <span className="rounded-full bg-slate-100 px-3 py-1">June 2024</span>
      </div>

      <div className="space-y-4">
        {coverageTimeline.map((item) => (
          <div key={item.id} className="space-y-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                    >
                  <RainIcon />
                </span>
                <div>
                  <p className="text-lg font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.date}</p>
                </div>
              </div>
              <p className={`text-lg font-extrabold ${item.color}`}>{item.amount}</p>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Transaction ID</p>
                <p className="font-semibold text-slate-800">{item.id}</p>
              </div>
              <span className="flex items-center gap-2 text-emerald-700">
                <WalletIcon /> Paid via UPI
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Active Plan
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">Elite Weather Guard</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Renewal In
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">14 Days</p>
        </div>
      </div>

      <div className="hidden items-center justify-between rounded-full bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 ring-1 ring-slate-200 md:flex">
        <span className="flex items-center gap-2">
          <GridIcon /> Dashboard
        </span>
        <span className="flex items-center gap-2 text-slate-800">
          <ShieldBadgeIcon /> Coverage
        </span>
        <span className="flex items-center gap-2">
          <HistoryIcon /> History
        </span>
      </div>
    </article>
  );
}

function StatChip({
  label,
  value,
  accent = "text-slate-900",
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 text-center ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-extrabold ${accent}`}>{value}</p>
    </div>
  );
}

function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`h-5 w-5 ${className}`}
    >
      <path d="M12 2 5 5v6c0 4.418 3.134 8.164 7 9 3.866-.836 7-4.582 7-9V5l-7-3Z" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path d="M12 3 5 6v6c0 4 3.134 7.468 7 8.4 3.866-.932 7-4.4 7-8.4V6l-7-3Z" />
      <path d="m9.5 12.5 1.8 1.8 3.2-3.6" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M5 12h14" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" strokeLinecap="round" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M16 12h2.5" strokeLinecap="round" />
      <path d="M12 9.5h.01M12 14.5h.01" strokeLinecap="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path
        d="M4 4v6h6M20 20v-6h-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 13a7 7 0 0 0 12 3m2-5a7 7 0 0 0-12-3" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  );
}

function ShieldBadgeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M12 3 5 6v6c0 4 3 7.5 7 8.5 4-1 7-4.5 7-8.5V6l-7-3Z" />
      <path d="M9.5 12.5 12 15l2.5-3" strokeLinecap="round" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M12 8v5l3 2" strokeLinecap="round" />
      <path d="M3.05 11a9 9 0 1 1 2.13 5.88" strokeLinecap="round" />
      <path d="M3 3v4h4" strokeLinecap="round" />
    </svg>
  );
}

function SignalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path d="M18 6a8.966 8.966 0 0 0-6-2" />
      <path d="M6 18a8.966 8.966 0 0 0 6 2" />
      <path d="M3 8a12 12 0 0 1 0 8" />
      <path d="M21 8a12 12 0 0 0 0 8" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function RainIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`h-5 w-5 ${className}`}
    >
      <path d="M7 15v3M12 15v3M17 15v3" strokeLinecap="round" />
      <path d="M18 9a6 6 0 0 0-11.8 1.2A4 4 0 0 0 7 17h10a4 4 0 0 0 1-7.9Z" />
    </svg>
  );
}

function BoltIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`h-5 w-5 ${className}`}
    >
      <path d="M13 2 4 14h7l-1 8 9-12h-7Z" strokeLinejoin="round" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <rect x="3" y="7" width="18" height="10" rx="3" />
      <path d="M7 12h10" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path d="M12 21s7-6.273 7-11.5S16.09 2 12 2 5 4.455 5 9.5 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}
