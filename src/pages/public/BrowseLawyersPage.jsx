import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { getPublicLawyers } from '../../api/lawyerDiscoveryApi'
import { EmptyState, ErrorState } from '../../components/common/QueryFeedback'
import LawyerCard from '../../components/lawyers/LawyerCard'
import LawyerCardSkeleton from '../../components/lawyers/LawyerCardSkeleton'
import { getApiErrorMessage } from '../../utils/apiError'

const specializations = ['Family Law', 'Criminal Law', 'Corporate Law', 'Property Law', 'Immigration Law', 'Employment Law', 'Civil Litigation', 'Intellectual Property']
const defaults = { search: '', specialization: '', minFee: '', maxFee: '', availability: '', sort: 'newest', page: '1' }

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
      <p className="text-sm font-semibold tracking-[0.16em] text-indigo-700">PUBLIC DIRECTORY</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Browse legal professionals</h1><p className="mt-2 max-w-2xl text-slate-600">Search verified, published lawyer profiles by expertise, availability, and consultation fee.</p></div>{result && <p className="text-sm text-slate-600">{result.meta.totalItems} professional{result.meta.totalItems === 1 ? '' : 's'} found</p>}</div>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><SlidersHorizontal size={17} />Search &amp; filters</div>
        <div className="mt-4 grid gap-3 lg:grid-cols-6">
          <label className="relative lg:col-span-2"><span className="sr-only">Search lawyers</span><Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} /><input value={searchText} onChange={(event) => setSearchText(event.target.value)} className="min-h-11 w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm focus:border-indigo-600 focus:outline-none" placeholder="Name or specialization" /></label>
          <label><span className="sr-only">Specialization</span><select value={values.specialization} onChange={(event) => updateParams({ specialization: event.target.value, page: '1' })} className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"><option value="">All specializations</option>{specializations.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label><span className="sr-only">Minimum consultation fee</span><input value={values.minFee} onChange={(event) => updateParams({ minFee: event.target.value, page: '1' })} type="number" min="0" step="0.01" className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm" placeholder="Min fee" /></label>
          <label><span className="sr-only">Maximum consultation fee</span><input value={values.maxFee} onChange={(event) => updateParams({ maxFee: event.target.value, page: '1' })} type="number" min="0" step="0.01" className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm" placeholder="Max fee" /></label>
          <label><span className="sr-only">Availability</span><select value={values.availability} onChange={(event) => updateParams({ availability: event.target.value, page: '1' })} className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"><option value="">All availability</option><option value="available">Available</option><option value="busy">Busy</option></select></label>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><label className="text-sm text-slate-700">Sort <select value={values.sort} onChange={(event) => updateParams({ sort: event.target.value, page: '1' })} className="ml-2 min-h-10 rounded-lg border border-slate-300 px-3 text-sm"><option value="newest">Newest</option><option value="fee-low">Fee: Low to High</option><option value="fee-high">Fee: High to Low</option><option value="most-hired">Most Hired</option></select></label>{hasFilters && <button type="button" onClick={() => { setSearchText(''); setSearchParams(new URLSearchParams()) }} className="min-h-10 text-sm font-semibold text-indigo-700 hover:text-indigo-900">Clear filters</button>}</div>
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
