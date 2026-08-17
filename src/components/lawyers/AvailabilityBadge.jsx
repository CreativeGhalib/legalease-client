export default function AvailabilityBadge({ availability }) {
  const isBusy = availability === 'busy'
  return (
    <span
      className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-semibold sm:px-2.5 sm:py-1 sm:text-xs ${
        isBusy
          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
      }`}
    >
      {isBusy ? 'Busy' : 'Available'}
    </span>
  )
}
