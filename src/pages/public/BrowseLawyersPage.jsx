import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { getPublicLawyers } from '../../api/lawyerDiscoveryApi'
import { EmptyState, ErrorState } from '../../components/common/QueryFeedback'
import LawyerCard from '../../components/lawyers/LawyerCard'
import LawyerCardSkeleton from '../../components/lawyers/LawyerCardSkeleton'
import { getApiErrorMessage } from '../../utils/apiError'

const specializations = ['Family Law', 'Criminal Law', 'Corporate Law', 'Property Law', 'Immigration Law', 'Employment Law', 'Civil Litigation', 'Intellectual Property']
const defaults = { search: '', specialization: '', minFee: '', maxFee: '', availability: '', sort: 'newest', page: '1' }

function FilterSelect({ label, value, placeholder, options, onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }

    function handleKeydown(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  const selectedLabel = options.find((option) => option.value === value)?.label ?? placeholder

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="theme-select flex min-h-11 w-full items-center justify-between rounded-lg border border-[#c5b89e] bg-[#ece5d6] px-3 pr-10 text-left text-sm text-[#0c1827] outline-none transition focus:border-[#1b3a6b] dark:border-[#243d66] dark:bg-[#0f1e33] dark:text-[#ece5d6]"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`size-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div role="listbox" className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-[#d8ccb8] bg-[#fdf9f2] shadow-xl dark:border-[#1c3050] dark:bg-[#0c1728]">
          {options.map((option) => {
            const active = option.value === value
            return (
              <button
                key={option.value || 'all'}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition ${active ? 'bg-[#e8eef8] text-[#1b3a6b] dark:bg-[#c09a4e]/10 dark:text-[#c09a4e]' : 'text-[#364358] hover:bg-[#e5dccf] dark:text-[#a8bbcc] dark:hover:bg-[#132540]'}`}
              >
                <span>{option.label}</span>
                {active && <span className="text-xs font-semibold">✓</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function normalizedParams(searchParams) {
  const values = Object.fromEntries(Object.keys(defaults).map((key) => [key, searchParams.get(key) ?? defaults[key]]))
  return { ...values, page: values.page || '1', sort: values.sort || 'newest' }
}

export default function BrowseLawyersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const values = normalizedParams(searchParams)
  const [searchText, setSearchText] = useState(values.search)
  useEffect(() => setSearchText(values.search), [values.search])
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchText.trim() !== values.search) updateParams({ search: searchText.trim(), page: '1' })
    }, 350)
    return () => window.clearTimeout(timeout)
  })

  function updateParams(changes = {}) {
    const next = { ...values, ...changes }
    const output = new URLSearchParams()
    for (const [key, value] of Object.entries(next)) {
      if (value && !(key === 'sort' && value === 'newest') && !(key === 'page' && value === '1')) output.set(key, value)
    }
    setSearchParams(output)
  }

  const queryParams = useMemo(() => Object.fromEntries(Object.entries(values).filter(([key, value]) => value && !(key === 'page' && value === '1') && !(key === 'sort' && value === 'newest'))), [values])
  const lawyersQuery = useQuery({ queryKey: ['public-lawyers', values], queryFn: () => getPublicLawyers(queryParams), placeholderData: (previous) => previous })
  const result = lawyersQuery.data
  const hasFilters = Object.entries(values).some(([key, value]) => value && value !== defaults[key])

  return (
    <section>
      <p className="text-sm font-semibold tracking-[0.16em] text-[#1b3a6b] dark:text-[#c09a4e]">PUBLIC DIRECTORY</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-semibold text-[#0c1827] dark:text-[#ece5d6] sm:text-4xl">Browse legal professionals</h1><p className="mt-2 max-w-2xl text-[#364358] dark:text-[#a8bbcc]">Search verified, published lawyer profiles by expertise, availability, and consultation fee.</p></div>{result && <p className="text-sm text-[#364358] dark:text-[#a8bbcc]">{result.meta.totalItems} professional{result.meta.totalItems === 1 ? '' : 's'} found</p>}</div>
      <div className="mt-8 rounded-2xl border border-[#d8ccb8] bg-[#fdf9f2] p-4 shadow-[0_10px_24px_rgba(7,16,31,0.05)] dark:border-[#1c3050] dark:bg-[#0c1728] sm:p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#0c1827] dark:text-[#ece5d6]"><SlidersHorizontal size={17} />Search &amp; filters</div>
        <div className="mt-4 grid gap-3 lg:grid-cols-6">
          <label className="relative lg:col-span-2"><span className="sr-only">Search lawyers</span><Search className="pointer-events-none absolute left-3 top-3 text-[#69798e] dark:text-[#6b84a0]" size={18} /><input value={searchText} onChange={(event) => setSearchText(event.target.value)} className="theme-input min-h-11 w-full rounded-lg border border-[#c5b89e] bg-[#ece5d6] py-2 pl-10 pr-3 text-sm text-[#0c1827] placeholder:text-[#69798e] focus:border-[#1b3a6b] focus:outline-none dark:border-[#243d66] dark:bg-[#0f1e33] dark:text-[#ece5d6] dark:placeholder:text-[#6b84a0]" placeholder="Name or specialization" /></label>
          <FilterSelect label="Specialization" value={values.specialization} placeholder="All specializations" onChange={(value) => updateParams({ specialization: value, page: '1' })} options={[{ label: 'All specializations', value: '' }, ...specializations.map((item) => ({ label: item, value: item }))]} />
          <label><span className="sr-only">Minimum consultation fee</span><input value={values.minFee} onChange={(event) => updateParams({ minFee: event.target.value, page: '1' })} type="number" min="0" step="0.01" className="theme-input min-h-11 w-full rounded-lg border border-[#c5b89e] bg-[#ece5d6] px-3 text-sm text-[#0c1827] placeholder:text-[#69798e] focus:border-[#1b3a6b] focus:outline-none dark:border-[#243d66] dark:bg-[#0f1e33] dark:text-[#ece5d6] dark:placeholder:text-[#6b84a0]" placeholder="Min fee" /></label>
          <label><span className="sr-only">Maximum consultation fee</span><input value={values.maxFee} onChange={(event) => updateParams({ maxFee: event.target.value, page: '1' })} type="number" min="0" step="0.01" className="theme-input min-h-11 w-full rounded-lg border border-[#c5b89e] bg-[#ece5d6] px-3 text-sm text-[#0c1827] placeholder:text-[#69798e] focus:border-[#1b3a6b] focus:outline-none dark:border-[#243d66] dark:bg-[#0f1e33] dark:text-[#ece5d6] dark:placeholder:text-[#6b84a0]" placeholder="Max fee" /></label>
          <FilterSelect label="Availability" value={values.availability} placeholder="All availability" onChange={(value) => updateParams({ availability: value, page: '1' })} options={[{ label: 'All availability', value: '' }, { label: 'Available', value: 'available' }, { label: 'Busy', value: 'busy' }]} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm text-[#364358] dark:text-[#a8bbcc]"><span>Sort</span><div className="min-w-[12rem]"><FilterSelect label="Sort" value={values.sort} placeholder="Newest" onChange={(value) => updateParams({ sort: value, page: '1' })} options={[{ label: 'Newest', value: 'newest' }, { label: 'Fee: Low to High', value: 'fee-low' }, { label: 'Fee: High to Low', value: 'fee-high' }, { label: 'Most Hired', value: 'most-hired' }]} /></div></div>{hasFilters && <button type="button" onClick={() => { setSearchText(''); setSearchParams(new URLSearchParams()) }} className="min-h-10 text-sm font-semibold text-[#1b3a6b] hover:text-[#0f2547] dark:text-[#c09a4e] dark:hover:text-[#d4af6a]">Clear filters</button>}</div>
      </div>
      <div className={`mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 ${lawyersQuery.isFetching ? 'opacity-70' : ''}`}>
        {lawyersQuery.isLoading ? Array.from({ length: 8 }, (_, index) => <LawyerCardSkeleton key={index} />) : lawyersQuery.isError ? null : result?.data.items.map((lawyer) => <LawyerCard key={lawyer.id} lawyer={lawyer} />)}
      </div>
      {lawyersQuery.isError && <div className="mt-8"><ErrorState message={getApiErrorMessage(lawyersQuery.error, 'Please check your filters and try again.')} onRetry={() => lawyersQuery.refetch()} /></div>}
      {!lawyersQuery.isLoading && !lawyersQuery.isError && result?.data.items.length === 0 && <div className="mt-8"><EmptyState title="No lawyers match those filters" description="Try removing a filter or searching for a broader area of legal expertise." action={<button type="button" onClick={() => { setSearchText(''); setSearchParams(new URLSearchParams()) }} className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Clear filters</button>} /></div>}
      {result?.meta.totalPages > 1 && <nav aria-label="Lawyer results pages" className="mt-10 flex flex-wrap items-center justify-center gap-3"><button type="button" disabled={Number(values.page) === 1 || lawyersQuery.isFetching} onClick={() => updateParams({ page: String(Number(values.page) - 1) })} className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40">Previous</button><span className="text-center text-sm text-slate-600">Page {result.meta.page} of {result.meta.totalPages}</span><button type="button" disabled={Number(values.page) >= result.meta.totalPages || lawyersQuery.isFetching} onClick={() => updateParams({ page: String(Number(values.page) + 1) })} className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40">Next</button></nav>}
    </section>
  )
}
