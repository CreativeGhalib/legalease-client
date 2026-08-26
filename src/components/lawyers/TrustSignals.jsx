import { CalendarDays, Gavel, ShieldCheck } from 'lucide-react'

function monthYear(value) {
  if (!value) return null
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(value))
}

export default function TrustSignals({ joinedAt, paidHireCount = 0, barAssociationBranch }) {
  const signals = []

  const since = monthYear(joinedAt)
  if (since) signals.push({ icon: CalendarDays, key: `member-${since}`, text: `Member since ${since}`, emphasis: false })
  if (paidHireCount > 0) {
    signals.push({
      icon: Gavel,
      key: `hires-${paidHireCount}`,
      text: `${paidHireCount} engagement${paidHireCount === 1 ? '' : 's'} completed`,
      emphasis: false,
    })
  }
  signals.push({
    icon: ShieldCheck,
    key: 'verified',
    text: `Bar Council Verified${barAssociationBranch ? ` · ${barAssociationBranch}` : ''}`,
    emphasis: true,
  })

  return (
    <ul role="list" aria-label="Trust signals" className="grid gap-2">
      {signals.map(({ icon: Icon, key, text, emphasis }) => (
        <li
          key={key}
          className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm font-medium ${
            emphasis
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-900/20 dark:text-emerald-300'
              : 'border-slate-200 bg-white text-slate-700 dark:border-[#1c3050] dark:bg-[#0c1728] dark:text-[#ece5d6]'
          }`}
        >
          <Icon
            size={16}
            className={`shrink-0 ${emphasis ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-700 dark:text-[#d4a843]'}`}
            aria-hidden="true"
          />
          {text}
        </li>
      ))}
    </ul>
  )
}
