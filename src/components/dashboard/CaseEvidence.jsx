import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FolderOpen, ImagePlus, Trash2 } from 'lucide-react'
import { deleteCaseDocument, getCaseDocuments, uploadCaseDocument } from '../../api/caseApi'
import { getApiErrorMessage } from '../../utils/apiError'

const MAX_SIZE_BYTES = 3 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function CaseEvidence({ hiringRequestId, isLawyer = false }) {
  const queryClient = useQueryClient()
  const inputRef = useRef(null)
  const [error, setError] = useState('')

  const documentsQuery = useQuery({
    queryKey: ['case-documents', hiringRequestId],
    queryFn: () => getCaseDocuments(hiringRequestId),
    retry: false,
  })

  const uploadMutation = useMutation({
    mutationFn: (file) => uploadCaseDocument(hiringRequestId, file),
    onSuccess: () => { setError(''); queryClient.invalidateQueries({ queryKey: ['case-documents', hiringRequestId] }) },
    onError: (mutationError) => setError(getApiErrorMessage(mutationError)),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCaseDocument,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['case-documents', hiringRequestId] }),
    onError: (mutationError) => setError(getApiErrorMessage(mutationError)),
  })

  function chooseFile(event) {
    setError('')
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG, or WebP images are allowed.')
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('Images must be 3 MB or smaller.')
      return
    }
    uploadMutation.mutate(file)
  }

  function removeDocument(doc) {
    if (!window.confirm(`Remove "${doc.originalName || 'this image'}" from the case?`)) return
    deleteMutation.mutate(doc.id)
  }

  const documents = documentsQuery.data ?? []

  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#1c3050] bg-slate-50 dark:bg-[#0c1728] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-[#ece5d6]">
          <FolderOpen size={16} className="text-indigo-700" /> 📁 Case evidence
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50 dark:border-[#2a3850] dark:bg-[#1b3a6b]/20 dark:text-[#a8bbcc] dark:hover:bg-[#1b3a6b]/40"
        >
          <ImagePlus size={14} aria-hidden="true" />
          {uploadMutation.isPending ? 'Uploading…' : 'Add evidence image'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={chooseFile}
          className="sr-only"
          aria-label="Upload evidence image"
        />
      </div>

      <p className="mt-1.5 text-[11px] text-slate-500 dark:text-[#7090a4]">
        JPG/PNG/WebP · max 3 MB · visible to both parties of this case.
      </p>

      {error && <p role="alert" className="mt-2 text-sm text-rose-700 dark:text-rose-300">{error}</p>}

      {documentsQuery.isLoading ? (
        <div className="mt-3 h-16 animate-pulse rounded-lg bg-slate-200 dark:bg-[#101b2c]" aria-hidden="true" />
      ) : documents.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500 dark:text-[#a8bbcc]">No evidence images uploaded yet.</p>
      ) : (
        <ul role="list" className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {documents.map((doc) => (
            <li key={doc.id} className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-[#1c3050]">
              <a href={doc.imageUrl} target="_blank" rel="noopener noreferrer" className="block">
                <img src={doc.imageUrl} alt={doc.originalName || 'Case evidence'} loading="lazy" className="aspect-square w-full object-cover transition group-hover:opacity-90" />
              </a>
              {(isLawyer || doc.uploadedByMe) && (
                <button
                  type="button"
                  onClick={() => removeDocument(doc)}
                  disabled={deleteMutation.isPending}
                  aria-label={`Remove ${doc.originalName || 'evidence image'}`}
                  className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-slate-900/70 text-white opacity-0 transition focus:opacity-100 group-hover:opacity-100"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {deleteMutation.isError && (
        <p role="alert" className="mt-2 text-sm text-rose-700 dark:text-rose-300">{getApiErrorMessage(deleteMutation.error)}</p>
      )}
    </div>
  )
}
