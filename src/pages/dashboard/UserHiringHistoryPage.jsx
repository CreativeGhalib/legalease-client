import { useMutation, useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getMyHiringRequests } from '../../api/hiringRequestApi'
import { startHiringCheckout } from '../../api/paymentApi'
import { ErrorState } from '../../components/common/QueryFeedback'

function date(value) { return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value)) }
export default function UserHiringHistoryPage() {
  const requests = useQuery({ queryKey: ['hiring-requests', 'mine'], queryFn: getMyHiringRequests })
  const pay = useMutation({ mutationFn: startHiringCheckout, onSuccess: ({ checkoutUrl }) => window.location.assign(checkoutUrl) })
  if (requests.isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
  if (requests.isError) return <ErrorState message="Your hiring history could not be loaded." onRetry={() => requests.refetch()} />
  return <section><p className="text-sm font-semibold uppercase tracking-[.16em] text-indigo-700">Your requests</p><h1 className="mt-2 text-3xl font-bold text-slate-950">Hiring history</h1>{requests.data.length === 0 ? <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">You have not sent a hiring request yet.</div> : <div className="mt-6 grid gap-4">{requests.data.map((item) => <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"><img src={item.lawyer.professionalPhotoUrl || undefined} alt="" className="h-14 w-14 rounded-full bg-slate-100 object-cover" /><div className="min-w-0 flex-1"><h2 className="font-semibold text-slate-950">{item.lawyer.fullName}</h2><p className="text-sm text-slate-600">{item.specializationSnapshot} · ${(item.feeMinorSnapshot / 100).toFixed(2)} {item.currency}</p><p className="mt-1 text-xs text-slate-500">Requested {date(item.createdAt)}</p></div><div className="flex flex-wrap items-center gap-2 text-sm"><span className="rounded-full bg-indigo-50 px-3 py-1 font-semibold capitalize text-indigo-800">{item.status}</span><span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">{item.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}</span>{item.status === 'accepted' && item.paymentStatus !== 'paid' && <button type="button" disabled={pay.isPending} onClick={() => pay.mutate(item.id)} className="min-h-11 rounded-lg bg-indigo-700 px-3 font-semibold text-white disabled:opacity-60">{pay.isPending ? 'Opening…' : item.paymentStatus === 'checkout_created' ? 'Continue Payment' : 'Pay'}</button>}<Link to={`/lawyers/${item.lawyerProfileId}`} className="min-h-11 rounded-lg px-3 py-2 font-semibold text-indigo-700 hover:bg-indigo-50">View lawyer</Link></div></article>)}</div>}</section>
}
