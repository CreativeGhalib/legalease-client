import { lazy, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/useAuth'
import { getMyPayments } from '../../api/paymentApi'
import { ErrorState } from '../../components/common/QueryFeedback'

const InvoiceButton = lazy(() => import('../../components/transactions/InvoiceButton'))

function date(value) { return value ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value)) : null }

function InvoiceAction({ item }) {
  if (item.status !== 'paid') return null
  return (
    <Suspense fallback={<span className="inline-flex min-h-9 items-center text-xs text-slate-400 dark:text-[#7090a4]">Loading invoice…</span>}>
      <InvoiceButton item={item} />
    </Suspense>
  )
}

export default function TransactionHistoryPage() {
  const { user } = useAuth()
  const payments = useQuery({ queryKey: ['payments', 'mine'], queryFn: getMyPayments })

  if (payments.isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#0c1728]" />
  if (payments.isError) return <ErrorState message="Transactions could not be loaded." onRetry={() => payments.refetch()} />

  const intro = user?.role === 'lawyer' ? 'Your verification payment and paid hiring fees connected to your professional profile.' : 'Payments you have made through LegalEase.'

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-700">Payment records</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-[#ece5d6] sm:text-4xl">Transactions</h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-[#a8bbcc]">{intro}</p>

      {payments.data.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-6 text-slate-600 dark:text-[#a8bbcc]">
          No payment records yet.
        </div>
      ) : (
        <div className="mt-7 grid gap-3">
          {payments.data.map((item) => (
            <article key={item.id} className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-5 shadow-sm">
              <div className="min-w-0">
                <p className="font-semibold text-slate-950 dark:text-[#ece5d6]">
                  {item.type === 'hiring_fee' ? 'Hiring consultation fee' : 'Publishing verification'}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-[#a8bbcc]">
                  ${(item.amountMinor / 100).toFixed(2)} {item.currency.toUpperCase()}
                </p>
                <p className="mt-2 text-xs text-slate-500 dark:text-[#a8bbcc]">
                  {item.status === 'paid' && item.paidAt ? `Paid ${date(item.paidAt)}` : `Created ${date(item.createdAt)}`}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2.5">
                <span className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${item.status === 'paid' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 dark:bg-[#0c1728] text-slate-700 dark:text-[#ece5d6]'}`}>
                  {item.status}
                </span>
                <InvoiceAction item={item} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
