import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import ModalFocusRegion from '../common/ModalFocusRegion'
import LeadCaptureForm from './LeadCaptureForm'

const SESSION_KEY = 'legalease_exit_lead_seen'

export default function ExitIntentPopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (window.matchMedia?.('(pointer: coarse)').matches || sessionStorage.getItem(SESSION_KEY)) return undefined
    function handleExit(event) {
      if (event.clientY > 8 || event.relatedTarget) return
      sessionStorage.setItem(SESSION_KEY, '1')
      setOpen(true)
      document.removeEventListener('mouseout', handleExit)
    }
    document.addEventListener('mouseout', handleExit)
    return () => document.removeEventListener('mouseout', handleExit)
  }, [])

  if (!open) return null
  return (
    <ModalFocusRegion labelledBy="exit-lead-title" onClose={() => setOpen(false)} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4">
      <section className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#0c1728]">
        <button type="button" aria-label="Close free matching form" onClick={() => setOpen(false)} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100 dark:hover:bg-[#162236]"><X size={18} /></button>
        <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-700">Before you go</p>
        <h2 id="exit-lead-title" className="mt-2 pr-10 text-2xl font-bold">Get matched with a lawyer for free</h2>
        <p className="mb-5 mt-2 text-sm text-slate-600 dark:text-[#a8bbcc]">Tell us what you need. There is no obligation to hire.</p>
        <LeadCaptureForm source="exit_intent" compact />
      </section>
    </ModalFocusRegion>
  )
}
