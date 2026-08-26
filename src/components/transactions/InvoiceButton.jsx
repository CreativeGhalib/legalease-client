import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download } from 'lucide-react'
import InvoicePDF from './InvoiceDocument'
import { buildInvoiceData } from './invoiceData'

export default function InvoiceButton({ item }) {
  const invoice = buildInvoiceData(item)

  return (
    <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} />}
      fileName={`legalease-invoice-${invoice.number}.pdf`}
      aria-label={`Download invoice ${invoice.number}`}
      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 dark:border-[#1c3050] px-3 text-xs font-semibold text-slate-700 dark:text-[#a8bbcc] transition hover:bg-slate-100 dark:hover:bg-[#162236]"
    >
      {({ loading }) => (
        <>
          <Download size={14} aria-hidden="true" />
          {loading ? 'Preparing…' : 'Download Invoice'}
        </>
      )}
    </PDFDownloadLink>
  )
}
