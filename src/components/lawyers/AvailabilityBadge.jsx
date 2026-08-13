export default function AvailabilityBadge({ availability }) {
  const isBusy = availability === 'busy'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isBusy ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{isBusy ? 'Busy' : 'Available'}</span>
}
