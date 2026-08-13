import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Clock3, XCircle } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { getVerificationPaymentStatus } from '../../api/paymentApi'
import { ErrorState } from '../../components/common/QueryFeedback'

export default function PaymentReturnPage({ cancelled = false }) {
  const [params] = useSearchParams(); const transactionId = params.get('transactionId'); const client = useQueryClient()
  const payment = useQuery({ queryKey: ['payment-status', transactionId], queryFn: () => getVerificationPaymentStatus(transactionId), enabled: Boolean(transactionId), refetchInterval: (query) => !cancelled && query.state.data?.transactionStatus !== 'paid' ? 2500 : false, retry: 2 })
  const paid = payment.data?.transactionStatus === 'paid'; const hiring = payment.data?.type === 'hiring_fee'; const destination = hiring ? '/dashboard/user/hiring-history' : '/dashboard/lawyer/manage-legal-profile'
  useEffect(() => { if (paid) { client.invalidateQueries({ queryKey: ['hiring-requests'] }); client.invalidateQueries({ queryKey: ['payments', 'mine'] }); client.invalidateQueries({ queryKey: ['public-lawyers'] }); client.invalidateQueries({ queryKey: ['top-lawyers'] }) } }, [client, paid])
  if (!transactionId) return <ErrorState message="This payment return link is incomplete." />
  if (payment.isLoading) return <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center"><Clock3 className="mx-auto animate-pulse text-indigo-700" size={40} /><h1 className="mt-4 text-2xl font-semibold">Checking your payment</h1><p className="mt-3 text-slate-600">We are checking the verified server status.</p></section>
  if (payment.isError) return <ErrorState message="We could not confirm this payment yet. Return to your dashboard and check again shortly." />
  if (cancelled && !paid) return <section className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center"><XCircle className="mx-auto text-amber-700" size={40} /><h1 className="mt-4 text-2xl font-semibold text-slate-950">Payment was not confirmed</h1><p className="mt-3 text-slate-700">No payment was marked complete. You can return and try again when ready.</p><Link to={destination} className="mt-6 inline-flex rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">{hiring ? 'Return to my hiring requests' : 'Return to legal profile'}</Link></section>
  return <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center"><>{paid ? <CheckCircle2 className="mx-auto text-emerald-600" size={42} /> : <Clock3 className="mx-auto animate-pulse text-indigo-700" size={42} />}</><h1 className="mt-4 text-2xl font-semibold text-slate-950">{paid ? (hiring ? 'Hiring payment successful' : 'Verification successful') : 'Payment is still being confirmed'}</h1><p className="mt-3 text-slate-600">{paid ? (hiring ? 'Your hiring request is now marked paid.' : 'Your profile remains private until you explicitly publish it.') : 'Do not submit another payment. This page checks the verified server status automatically.'}</p><Link to={destination} className="mt-6 inline-flex rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">{hiring ? 'Return to my hiring requests' : 'Return to legal profile'}</Link></section>
}
