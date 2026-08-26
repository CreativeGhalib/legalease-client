import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CalendarDays } from 'lucide-react'
import { bookAppointment, getLawyerSlots } from '../../api/appointmentApi'
import ModalFocusRegion from '../common/ModalFocusRegion'
import { getApiErrorMessage } from '../../utils/apiError'
import { showSuccessToast } from '../../utils/toast'

function nextSevenDates() {
  const dates = []
  const now = new Date()
  for (let offset = 1; offset <= 7; offset += 1) {
    const date = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000)
    dates.push({
      key: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(date),
      weekday: date.toLocaleDateString('en', { weekday: 'short', timeZone: 'Asia/Dhaka' }),
      dayNumber: date.getDate(),
    })
  }
  return dates
}

export default function AppointmentBookingModal({ lawyerId, lawyerName, onClose }) {
  const dates = nextSevenDates()
  const [selectedDate, setSelectedDate] = useState(dates[0].key)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [serverError, setServerError] = useState('')

  const slotsQuery = useQuery({
    queryKey: ['lawyer-slots', lawyerId, selectedDate],
    queryFn: () => getLawyerSlots(lawyerId, selectedDate),
    enabled: Boolean(lawyerId && selectedDate),
    staleTime: 30_000,
  })

  const bookingMutation = useMutation({
    mutationFn: () => bookAppointment({ lawyerProfileId: lawyerId, dateKey: selectedDate, start: selectedSlot }),
    onSuccess: (appointment) => {
      showSuccessToast(`Consultation booked for ${appointment.dateKey} at ${appointment.start}.`)
      onClose()
    },
    onError: (error) => setServerError(getApiErrorMessage(error)),
  })

  return (
    <ModalFocusRegion labelledBy="booking-title" onClose={onClose} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white dark:bg-[#0c1728] p-6 shadow-xl">
        <h2 id="booking-title" className="text-xl font-bold text-slate-950 dark:text-[#ece5d6]">Book a consultation</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-[#a8bbcc]">30-minute session with {lawyerName}. Times are Dhaka time.</p>

        <div role="group" aria-label="Choose a date" className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {dates.map(({ key, weekday, dayNumber }) => {
            const active = key === selectedDate
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => { setSelectedDate(key); setSelectedSlot('') }}
                className={`rounded-lg border px-1 py-2 text-center text-xs font-semibold transition ${
                  active ? 'border-indigo-700 bg-indigo-700 text-white' : 'border-slate-300 dark:border-[#1c3050] text-slate-600 dark:text-[#a8bbcc] hover:bg-slate-100 dark:hover:bg-[#162236]'
                }`}
              >
                <span className="block">{weekday}</span>
                <span className="block text-sm">{dayNumber}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-800 dark:text-[#ece5d6]">Available slots</p>
          {slotsQuery.isLoading && <div className="mt-3 h-16 animate-pulse rounded-lg bg-slate-200 dark:bg-[#101b2c]" aria-hidden="true" />}
          {slotsQuery.isError && <p role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">Slots could not be loaded. Try another day.</p>}
          {slotsQuery.data && slotsQuery.data.slots.length === 0 && (
            <p className="mt-3 text-sm text-slate-500 dark:text-[#a8bbcc]">No open slots on this day — pick another.</p>
          )}
          {slotsQuery.data && slotsQuery.data.slots.length > 0 && (
            <div role="radiogroup" aria-label="Choose a slot" className="mt-3 flex flex-wrap gap-2">
              {slotsQuery.data.slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  role="radio"
                  aria-checked={selectedSlot === slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`min-h-10 rounded-lg border px-3 text-sm font-semibold transition ${
                    selectedSlot === slot
                      ? 'border-indigo-700 bg-indigo-700 text-white'
                      : 'border-slate-300 dark:border-[#1c3050] text-slate-700 dark:text-[#ece5d6] hover:bg-slate-100 dark:hover:bg-[#162236]'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>

        {serverError && <p role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">{serverError}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={bookingMutation.isPending} className="le-button le-button-secondary">Cancel</button>
          <button
            type="button"
            disabled={!selectedSlot || bookingMutation.isPending}
            onClick={() => bookingMutation.mutate()}
            className="le-button le-button-primary inline-flex items-center gap-1.5"
          >
            <CalendarDays size={15} aria-hidden="true" />
            {bookingMutation.isPending ? 'Booking…' : 'Confirm booking'}
          </button>
        </div>
      </div>
    </ModalFocusRegion>
  )
}
