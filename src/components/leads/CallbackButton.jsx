import { useState } from 'react'
import { Phone, X } from 'lucide-react'
import ModalFocusRegion from '../common/ModalFocusRegion'
import LeadCaptureForm from './LeadCaptureForm'

export default function CallbackButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="fixed bottom-5 right-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-indigo-700 px-5 text-sm font-semibold text-white shadow-xl transition hover:bg-indigo-800 sm:right-6">
        <Phone size={17} aria-hidden="true" /> Get a callback
      </button>
      {open && (
        <ModalFocusRegion labelledBy="callback-title" onClose={() => setOpen(false)} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4">
          <section className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#0c1728]">
            <button type="button" aria-label="Close callback form" onClick={() => setOpen(false)} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100 dark:hover:bg-[#162236]"><X size={18} /></button>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-700">Free lawyer matching</p>
            <h2 id="callback-title" className="mt-2 pr-10 text-2xl font-bold">Ask LegalEase to call you</h2>
            <p className="mb-5 mt-2 text-sm text-slate-600 dark:text-[#a8bbcc]">Leave your details and our team will help you find the right next step.</p>
            <LeadCaptureForm source="callback" compact />
          </section>
        </ModalFocusRegion>
      )}
    </>
  )
}
