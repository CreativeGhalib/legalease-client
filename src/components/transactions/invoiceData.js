export function formatInvoiceAmount(amountMinor, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(amountMinor / 100)
}

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
}

export function typeLabel(type) {
  if (type === 'hiring_fee') return 'Consultation fee'
  if (type === 'lawyer_verification') return 'Publishing verification'
  return 'LegalEase payment'
}

export function buildInvoiceData(item) {
  return {
    number: `LE-${item.id}`,
    issuedAt: item.paidAt ?? item.createdAt,
    issuedLabel: formatDate(item.paidAt ?? item.createdAt),
    status: item.status,
    typeLabel: typeLabel(item.type),
    description:
      item.type === 'hiring_fee'
        ? `${item.engagementSpecialization || 'Legal engagement'} — consultation fee`
        : 'One-time profile publishing verification',
    clientName: item.payerName || '—',
    lawyerName: item.lawyerName || '—',
    engagementReference: item.hiringRequestId ? `#${item.hiringRequestId.slice(-8)}` : null,
    amountMinor: item.amountMinor,
    currency: item.currency,
    amountLabel: formatInvoiceAmount(item.amountMinor, item.currency),
  }
}
