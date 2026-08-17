import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { createHiringRequest } from '../../api/hiringRequestApi'
import useBodyScrollLock from '../../hooks/useBodyScrollLock'
import useModalFocus from '../../hooks/useModalFocus'
import { getApiErrorMessage } from '../../utils/apiError'
import { showSuccessToast } from '../../utils/toast'

export default function HireModal({ lawyer, onClose }) {
  const client = useQueryClient()
  const request = useMutation({
    mutationFn: () => createHiringRequest(lawyer.id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['hiring-requests', 'mine'] })
      showSuccessToast('Demo email notification queued for the lawyer.')
      onClose()
    },
  })

  useBodyScrollLock(true)
  const modalRef = useModalFocus(true, onClose, !request.isPending)

  return (
    <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="hire-modal-title" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 p-4 sm:grid sm:place-items-center">
      <section className="my-auto w-full max-w-md rounded-2xl bg-white dark:bg-[#0c1728] p-5 shadow-xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-700">Hiring request</p>
            <h2 id="hire-modal-title" className="mt-2 text-2xl font-bold text-slate-950 dark:text-[#ece5d6]">Hire Legal Counsel</h2>
          </div>
          <button type="button" onClick={onClose} disabled={request.isPending} aria-label="Close hire confirmation" className="grid min-h-11 min-w-11 place-items-center rounded-lg text-slate-700 dark:text-[#ece5d6] hover:bg-slate-100"><X /></button>
        </div>
        <dl className="mt-6 space-y-3 rounded-xl bg-slate-50 dark:bg-[#0c1728] p-4 text-sm">
          <div><dt className="text-slate-500 dark:text-[#a8bbcc]">Lawyer</dt><dd className="break-words font-semibold text-slate-950 dark:text-[#ece5d6]">{lawyer.fullName}</dd></div>
          <div><dt className="text-slate-500 dark:text-[#a8bbcc]">Specialization</dt><dd className="break-words font-semibold text-slate-950 dark:text-[#ece5d6]">{lawyer.specialization}</dd></div>
          <div><dt className="text-slate-500 dark:text-[#a8bbcc]">Consultation fee</dt><dd className="font-semibold text-slate-950 dark:text-[#ece5d6]">${(lawyer.consultationFeeMinor / 100).toFixed(2)} USD</dd></div>
          <div><dt className="text-slate-500 dark:text-[#a8bbcc]">Availability</dt><dd className="font-semibold capitalize text-emerald-700 dark:text-emerald-300">{lawyer.availability}</dd></div>
        </dl>
        <p className="mt-4 text-sm text-slate-600 dark:text-[#a8bbcc]">The lawyer reviews this request first. If accepted, you can pay securely from My hiring requests.</p>
        {request.isError && <p role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">{getApiErrorMessage(request.error)}</p>}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button type="button" onClick={onClose} disabled={request.isPending} className="min-h-11 rounded-lg px-4 text-sm font-semibold text-slate-700 dark:text-[#ece5d6]">Cancel</button>
          <button type="button" onClick={() => request.mutate()} disabled={request.isPending} className="min-h-11 rounded-lg bg-indigo-700 px-4 text-sm font-semibold text-white disabled:opacity-60">{request.isPending ? 'Sending…' : 'Send hiring request'}</button>
        </div>
      </section>
    </div>
  )
}
