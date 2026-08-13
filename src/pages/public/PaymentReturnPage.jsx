import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, Clock3, XCircle } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { getVerificationPaymentStatus } from '../../api/paymentApi'
import { ErrorState } from '../../components/common/QueryFeedback'

export default function PaymentReturnPage({ cancelled = false }) {
  const [params] = useSearchParams()
  const transactionId = params.get('transactionId')
  const payment = useQuery({ queryKey: ['verification-payment', transactionId], queryFn: () => getVerificationPaymentStatus(transactionId), enabled: Boolean(transactionId) && !cancelled, refetchInterval: (query) => query.state.data?.transactionStatus === 'paid' ? false : 2500, retry: 2 })
  if (!transactionId) return <ErrorState message="This payment return link is incomplete." />
  if (cancelled) return <section className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center"><XCircle className="mx-auto text-amber-700" size={40} /><h1 className="mt-4 text-2xl font-semibold text-slate-950">Payment was not confirmed</h1><p className="mt-3 text-slate-700">You can return to your legal profile and try again when ready.</p><Link to="/dashboard/lawyer/manage-legal-profile" className="mt-6 inline-flex rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Return to legal profile</Link></section>
  if (payment.isLoading) return <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center"><Clock3 className="mx-auto animate-pulse text-indigo-700" size={40} /><h1 className="mt-4 text-2xl font-semibold">Confirming your verification</h1><p className="mt-3 text-slate-600">We are checking the secure server confirmation.</p></section>
  if (payment.isError) return <ErrorState message="We could not confirm this payment yet. Return to your legal profile and check again shortly." />
  const paid = payment.data.transactionStatus === 'paid'
  return <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center"><>{paid ? <CheckCircle2 className="mx-auto text-emerald-600" size={42} /> : <Clock3 className="mx-auto animate-pulse text-indigo-700" size={42} />}</><h1 className="mt-4 text-2xl font-semibold text-slate-950">{paid ? 'Verification successful' : 'Verification is still being confirmed'}</h1><p className="mt-3 text-slate-600">{paid ? 'Your profile remains private until you explicitly publish it.' : 'Do not submit another payment. This page checks the verified server status automatically.'}</p><Link to="/dashboard/lawyer/manage-legal-profile" className="mt-6 inline-flex rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Return to legal profile</Link></section>
}
