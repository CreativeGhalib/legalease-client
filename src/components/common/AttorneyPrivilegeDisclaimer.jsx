import { CircleAlert } from 'lucide-react'

const DISCLAIMER_TEXT =
  '⚠️ LegalEase is an independent marketplace platform, not a law firm. Communications here are not protected by attorney-client privilege.'

export default function AttorneyPrivilegeDisclaimer({ className = '' }) {
  return (
    <p
      role="note"
      aria-label="Platform and privilege disclaimer"
      className={`flex items-start gap-2 rounded-xl border border-amber-300/70 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200 ${className}`}
    >
      <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{DISCLAIMER_TEXT}</span>
    </p>
  )
}

export { DISCLAIMER_TEXT }
