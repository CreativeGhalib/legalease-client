import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BadgeCheck, CalendarDays, CalendarClock, FileCheck2, Mail, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { getMyAccountProfile } from '../../api/userProfileApi'
import {
  cancelAppointment as apiCancelAppointment,
  completeAppointment as apiCompleteAppointment,
  getLawyerAppointments,
  getMyAppointments,
  startAppointmentCheckoutSslcommerz,
  startAppointmentCheckoutStripe,
} from '../../api/appointmentApi'
import { getMyLawyerProfile } from '../../api/lawyerProfileApi'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readableDate(value) {
  return value
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value))
    : '—'
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DetailCard({ icon: Icon, label, value }) {
  return (
    <div className="flex min-h-28 gap-3 rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-5 shadow-sm">
      <Icon className="mt-0.5 shrink-0 text-indigo-700 dark:text-[#d4a843]" size={19} />
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-[#a8bbcc]">
          {label}
        </p>
        <p className="mt-2 break-words text-sm font-semibold text-slate-900 dark:text-[#ece5d6]">
          {value || '—'}
        </p>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#0c1728]" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#0c1728]" />
        <div className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#0c1728]" />
      </div>
    </div>
  )
}

// ─── Role-specific panels ─────────────────────────────────────────────────────

function UserPanel() {
  return (
    <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 dark:border-[#6f582b] dark:bg-[#d4a843]/10 p-6">
      <h2 className="font-semibold text-slate-950 dark:text-[#ece5d6]">Manage your account</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-700 dark:text-[#ece5d6]">
        Keep your display name and account photo up to date. Your hiring history and transactions
        are available from the dashboard navigation.
      </p>
      <Link
        to="/dashboard/user/update-profile"
        className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-indigo-700 px-4 text-sm font-semibold text-white transition hover:bg-indigo-800 dark:bg-[#d4a843] dark:text-[#0c1827] dark:hover:bg-[#e2bd61]"
      >
        Update profile
      </Link>
    </div>
  )
}

function LawyerPanel({ lawyerProfile }) {
  return (
    <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 dark:border-[#6f582b] dark:bg-[#d4a843]/10 p-6">
      <div className="flex items-start gap-3">
        <FileCheck2 className="mt-0.5 shrink-0 text-indigo-700 dark:text-[#d4a843]" size={21} />
        <div>
          <h2 className="font-semibold text-slate-950 dark:text-[#ece5d6]">
            Professional profile status
          </h2>

          {lawyerProfile.isLoading && (
            <p className="mt-2 text-sm text-slate-600 dark:text-[#a8bbcc]">
              Loading your professional profile…
            </p>
          )}

          {lawyerProfile.data && (
            <div className="mt-3 grid gap-1.5 text-sm text-slate-700 dark:text-[#ece5d6]">
              <p>
                Profile:{' '}
                {lawyerProfile.data.isCompleteForPublishing
                  ? 'Complete for publishing'
                  : 'Draft incomplete'}
              </p>
              <p>Availability: {lawyerProfile.data.availability}</p>
              <p>Verification: {lawyerProfile.data.verificationStatus}</p>
              <p>Publication: {lawyerProfile.data.publicationStatus}</p>
            </div>
          )}

          {!lawyerProfile.isLoading && !lawyerProfile.data && (
            <p className="mt-2 text-sm text-slate-700 dark:text-[#ece5d6]">
              Create your professional profile to prepare it for public discovery.
            </p>
          )}

          <Link
            to="/dashboard/lawyer/manage-legal-profile"
            className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-indigo-700 px-4 text-sm font-semibold text-white transition hover:bg-indigo-800 dark:bg-[#d4a843] dark:text-[#0c1827] dark:hover:bg-[#e2bd61]"
          >
            Manage legal profile
          </Link>
        </div>
      </div>
    </div>
  )
}

function AdminPanel() {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-6">
      <BadgeCheck className="text-indigo-700 dark:text-[#d4a843]" size={21} />
      <h2 className="mt-3 font-semibold text-slate-950 dark:text-[#ece5d6]">
        Administration workspace
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-[#ece5d6]">
        Manage users, moderate lawyer profiles, review transactions, and view analytics from the
        dashboard sidebar.
      </p>
    </div>
  )
}

// ─── Upcoming consultations (user + lawyer) ──────────────────────────────────

function UpcomingConsultations({ role }) {
  const queryClient = useQueryClient()
  const isLawyer = role === 'lawyer'
  const appointmentsQuery = useQuery({
    queryKey: ['appointments', role],
    queryFn: isLawyer ? getLawyerAppointments : getMyAppointments,
  })

  const cancelMutation = useMutation({ mutationFn: apiCancelAppointment, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }) })
  const completeMutation = useMutation({ mutationFn: apiCompleteAppointment, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }) })
  const checkoutStripeMutation = useMutation({
    mutationFn: startAppointmentCheckoutStripe,
    onSuccess: (data) => { if (data?.checkoutUrl) window.location.href = data.checkoutUrl },
  })
  const checkoutSslMutation = useMutation({
    mutationFn: startAppointmentCheckoutSslcommerz,
    onSuccess: (data) => { if (data?.redirectUrl) window.location.href = data.redirectUrl },
  })

  if (appointmentsQuery.isLoading) return <div className="mt-10 h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#0c1728]" aria-hidden="true" />
  if (appointmentsQuery.isError) return null

  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date())
  const scheduled = (appointmentsQuery.data ?? [])
    .filter((appointment) => appointment.status === 'scheduled' && appointment.dateKey >= today)
    .sort((a, b) => `${a.dateKey}${a.start}`.localeCompare(`${b.dateKey}${b.start}`))
    .slice(0, 5)

  if (scheduled.length === 0) return null

  return (
    <div className="mt-10 rounded-2xl border border-indigo-100 bg-indigo-50/60 dark:border-[#6f582b] dark:bg-[#d4a843]/10 p-6">
      <h2 className="flex items-center gap-2 font-semibold text-slate-950 dark:text-[#ece5d6]">
        <CalendarClock size={18} className="text-indigo-700 dark:text-[#d4a843]" /> Upcoming consultations
      </h2>
      <ul role="list" className="mt-4 grid gap-3">
        {scheduled.map((appointment) => (
          <li key={appointment.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white dark:bg-[#0c1728] px-4 py-3 shadow-sm">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold text-slate-900 dark:text-[#ece5d6]">
                {appointment.dateKey} · {appointment.start}–{appointment.end}
                <span className="ml-2 font-normal text-slate-600 dark:text-[#a8bbcc]">with {appointment.counterpartName}</span>
              </p>
              {appointment.amountMinor > 0 && (
                <span className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  appointment.paymentStatus === 'paid'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {appointment.paymentStatus === 'paid'
                    ? `Paid · $${(appointment.amountMinor / 100).toFixed(2)}`
                    : `Unpaid · $${(appointment.amountMinor / 100).toFixed(2)}`}
                </span>
              )}
            </div>
            <span className="flex flex-wrap gap-2">
              {!isLawyer && appointment.paymentStatus === 'unpaid' && appointment.amountMinor > 0 && (
                <>
                  <button
                    type="button"
                    id={`pay-stripe-${appointment.id}`}
                    disabled={checkoutStripeMutation.isPending || checkoutSslMutation.isPending}
                    onClick={() => checkoutStripeMutation.mutate(appointment.id)}
                    className="min-h-9 rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white hover:bg-indigo-700 dark:bg-[#d4a843] dark:text-[#0c1827] dark:hover:bg-[#e2bd61] disabled:opacity-50"
                  >
                    {checkoutStripeMutation.isPending ? 'Redirecting…' : 'Pay (Card)'}
                  </button>
                  <button
                    type="button"
                    id={`pay-ssl-${appointment.id}`}
                    disabled={checkoutSslMutation.isPending || checkoutStripeMutation.isPending}
                    onClick={() => checkoutSslMutation.mutate(appointment.id)}
                    className="min-h-9 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {checkoutSslMutation.isPending ? 'Redirecting…' : 'Pay (bKash/Nagad)'}
                  </button>
                </>
              )}
              {isLawyer && (
                <button type="button" disabled={completeMutation.isPending} onClick={() => completeMutation.mutate(appointment.id)} className="min-h-9 rounded-lg bg-emerald-700 px-3 text-xs font-semibold text-white disabled:opacity-50">
                  Mark completed
                </button>
              )}
              <button
                type="button"
                disabled={cancelMutation.isPending || (!isLawyer && appointment.paymentStatus === 'paid')}
                onClick={() => cancelMutation.mutate(appointment.id)}
                className="min-h-9 rounded-lg border border-slate-300 dark:border-[#1c3050] px-3 text-xs font-semibold text-slate-600 dark:text-[#a8bbcc] disabled:opacity-40"
              >
                Cancel
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardOverviewPage() {
  const { user } = useAuth()
  const role = user?.role?.trim().toLowerCase()

  const accountQuery = useQuery({
    queryKey: ['account', 'me'],
    queryFn: getMyAccountProfile,
  })

  const lawyerProfileQuery = useQuery({
    queryKey: ['lawyer-profile', 'me'],
    queryFn: getMyLawyerProfile,
    enabled: role === 'lawyer',
    retry: false,
  })

  if (accountQuery.isLoading) return <LoadingSkeleton />

  if (accountQuery.isError) {
    return (
      <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 p-6">
        <p className="font-semibold text-rose-800 dark:text-rose-300">
          Account details could not be loaded.
        </p>
        <p className="mt-2 text-sm text-rose-700 dark:text-rose-400">
          Your session is still active. Try refreshing the page.
        </p>
        <button
          type="button"
          onClick={() => accountQuery.refetch()}
          className="mt-4 min-h-10 rounded-lg bg-rose-700 px-4 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    )
  }

  // Prefer fresh account data; fall back to session user for immediate display
  const current = accountQuery.data ?? user

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700 dark:text-[#d4a843]">
        Account overview
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-[#ece5d6] sm:text-4xl">
        Welcome back, {current?.fullName}
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-[#a8bbcc]">
        Your account details and available LegalEase tools are shown here.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DetailCard icon={Mail} label="Email" value={current?.email} />
        <DetailCard icon={UserRound} label="Account role" value={current?.role} />
        <DetailCard
          icon={CalendarDays}
          label="Joined LegalEase"
          value={readableDate(current?.createdAt)}
        />
      </div>

      {role === 'user' && <UserPanel />}
      {role === 'lawyer' && <LawyerPanel lawyerProfile={lawyerProfileQuery} />}
      {role === 'admin' && <AdminPanel />}
      {(role === 'user' || role === 'lawyer') && <UpcomingConsultations role={role} />}
    </div>
  )
}
