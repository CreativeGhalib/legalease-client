import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/useAuth'
import { getMyPayments } from '../../api/paymentApi'
import { ErrorState } from '../../components/common/QueryFeedback'

function date(value) { return value ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value)) : null }

export default function TransactionHistoryPage() {
  const { user } = useAuth(); const payments = useQuery({ queryKey: ['payments', 'mine'], queryFn: getMyPayments })
  if (payments.isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
  if (payments.isError) return <ErrorState message="Transactions could not be loaded." onRetry={() => payments.refetch()} />
  const intro = user?.role === 'lawyer' ? 'Your verification payment and paid hiring fees connected to your professional profile.' : 'Payments you have made through LegalEase.'
  return <section><p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-700">Payment records</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Transactions</h1><p className="mt-3 max-w-2xl text-slate-600">{intro}</p>{payments.data.length === 0 ? <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">No payment records yet.</div> : <div className="mt-7 grid gap-3">{payments.data.map((item) => <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div><p className="font-semibold text-slate-950">{item.type === 'hiring_fee' ? 'Hiring consultation fee' : 'Publishing verification'}</p><p className="mt-1 text-sm text-slate-600">${(item.amountMinor / 100).toFixed(2)} {item.currency.toUpperCase()}</p><p className="mt-2 text-xs text-slate-500">{item.status === 'paid' && item.paidAt ? `Paid ${date(item.paidAt)}` : `Created ${date(item.createdAt)}`}</p></div><span className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${item.status === 'paid' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>{item.status}</span></article>)}</div>}</section>
}
