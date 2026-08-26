const TIER_STYLES = {
  bronze:
    'border-[#d9b99a] bg-[#f4e6d6] text-[#7c4a21] dark:border-[#7a5230]/60 dark:bg-[#43290f]/60 dark:text-[#e8c39a]',
  silver:
    'border-slate-300 bg-slate-100 text-slate-600 dark:border-[#46596e] dark:bg-[#2a3644]/70 dark:text-[#c9d6e2]',
  gold:
    'border-[#ecd489] bg-[#fdf3d5] text-[#8a6a12] dark:border-[#d4a843]/50 dark:bg-[#d4a843]/15 dark:text-[#e8bf58]',
}

export default function TierBadge({ tier }) {
  if (!tier || !TIER_STYLES[tier]) return null
  return (
    <span
      title={`LegalEase trust tier: ${tier}`}
      className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] sm:px-2 sm:py-0.5 sm:text-xs ${TIER_STYLES[tier]}`}
    >
      {tier}
    </span>
  )
}
