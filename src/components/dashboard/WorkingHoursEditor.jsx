import { Plus, X } from 'lucide-react'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function timeOptions() {
  const options = []
  for (let minutes = 6 * 60; minutes <= 23 * 60 + 30; minutes += 30) {
    const h = String(Math.floor(minutes / 60)).padStart(2, '0')
    const m = String(minutes % 60).padStart(2, '0')
    options.push(`${h}:${m}`)
  }
  return options
}

const OPTIONS = timeOptions()

export default function WorkingHoursEditor({ value = [], onChange }) {
  function toggleDay(dayOfWeek) {
    const exists = value.find((day) => day.dayOfWeek === dayOfWeek)
    if (exists) onChange(value.filter((day) => day.dayOfWeek !== dayOfWeek))
    else onChange([...value, { dayOfWeek, slots: [{ start: '10:00', end: '11:00' }] }])
  }

  function addSlot(dayOfWeek) {
    onChange(value.map((day) => (day.dayOfWeek === dayOfWeek
      ? { ...day, slots: [...day.slots, { start: '15:00', end: '16:00' }] }
      : day)))
  }

  function removeSlot(dayOfWeek, index) {
    onChange(value.map((day) => (day.dayOfWeek === dayOfWeek
      ? { ...day, slots: day.slots.filter((_, slotIndex) => slotIndex !== index) }
      : day)))
  }

  function updateSlot(dayOfWeek, index, key, next) {
    onChange(value.map((day) => (day.dayOfWeek === dayOfWeek
      ? { ...day, slots: day.slots.map((slot, slotIndex) => (slotIndex === index ? { ...slot, [key]: next } : slot)) }
      : day)))
  }

  return (
    <div className="grid gap-2">
      {DAY_LABELS.map((label, dayOfWeek) => {
        const day = value.find((entry) => entry.dayOfWeek === dayOfWeek)
        const enabled = Boolean(day)
        return (
          <div key={label} className={`rounded-xl border p-3 ${enabled ? 'border-indigo-200 bg-indigo-50/40 dark:border-[#2a3850] dark:bg-[#101b2c]' : 'border-slate-200 dark:border-[#1c3050]'}`}>
            <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 dark:text-[#ece5d6]">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => toggleDay(dayOfWeek)}
                aria-label={`${enabled ? 'Remove' : 'Add'} availability for ${label}`}
                className="h-4 w-4"
              />
              {label}
            </label>

            {enabled && (
              <div className="mt-3 grid gap-2">
                {day.slots.map((slot, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-2">
                    <select
                      aria-label={`${label} range ${index + 1} start`}
                      value={slot.start}
                      onChange={(event) => updateSlot(dayOfWeek, index, 'start', event.target.value)}
                      className="min-h-10 rounded-lg border border-slate-300 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] px-2 text-sm"
                    >
                      {OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                    <span className="text-slate-400">–</span>
                    <select
                      aria-label={`${label} range ${index + 1} end`}
                      value={slot.end}
                      onChange={(event) => updateSlot(dayOfWeek, index, 'end', event.target.value)}
                      className="min-h-10 rounded-lg border border-slate-300 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] px-2 text-sm"
                    >
                      {OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                    {day.slots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSlot(dayOfWeek, index)}
                        aria-label={`Remove ${label} range ${index + 1}`}
                        className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-[#162236]"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {day.slots.length < 16 && (
                  <button
                    type="button"
                    onClick={() => addSlot(dayOfWeek)}
                    className="inline-flex min-h-9 w-max items-center gap-1 rounded-lg border border-dashed border-slate-300 dark:border-[#374c62] px-3 text-xs font-semibold text-slate-600 dark:text-[#a8bbcc]"
                  >
                    <Plus size={13} /> Add range
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
