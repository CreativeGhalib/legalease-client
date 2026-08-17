export default function AvailabilityBadge({ availability }) {
  const isBusy = availability === 'busy'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isBusy ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'}`}>{isBusy ? 'Busy' : 'Available'}</span>
}
