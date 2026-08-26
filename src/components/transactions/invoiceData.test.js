import { describe, expect, it } from 'vitest'
import { buildInvoiceData, formatInvoiceAmount, typeLabel } from './invoiceData'

const paidHiringFee = {
  id: '507f1f77bcf86cd799439011',
  type: 'hiring_fee',
  amountMinor: 22000,
  currency: 'usd',
  status: 'paid',
  paidAt: '2026-08-26T10:00:00.000Z',
  createdAt: '2026-08-25T09:00:00.000Z',
  hiringRequestId: '507f191e810c19729de860ea',
  payerName: 'Invoice Client',
  lawyerName: 'Invoice Lawyer',
  engagementSpecialization: 'Property Law',
}

describe('invoice data builder', () => {
  it('formats minor units as localized currency strings', () => {
    expect(formatInvoiceAmount(22000)).toBe('$220.00')
    expect(formatInvoiceAmount(500)).toBe('$5.00')
  })

  it('maps transaction types to human labels', () => {
    expect(typeLabel('hiring_fee')).toBe('Consultation fee')
    expect(typeLabel('lawyer_verification')).toBe('Publishing verification')
    expect(typeLabel('unknown')).toBe('LegalEase payment')
  })

  it('builds a branded invoice payload with LE- number, parties, and engagement reference', () => {
    const invoice = buildInvoiceData(paidHiringFee)
    expect(invoice.number).toBe(`LE-${paidHiringFee.id}`)
    expect(invoice.issuedLabel).toMatch(/2026/)
    expect(invoice.typeLabel).toBe('Consultation fee')
    expect(invoice.description).toContain('Property Law')
    expect(invoice.clientName).toBe('Invoice Client')
    expect(invoice.lawyerName).toBe('Invoice Lawyer')
    expect(invoice.engagementReference).toBe(`#${paidHiringFee.hiringRequestId.slice(-8)}`)
    expect(invoice.amountLabel).toBe('$220.00')
  })

  it('falls back to dashes and creation date when party names or payment date are missing', () => {
    const verification = buildInvoiceData({
      id: '507fabc1234567890def4567',
      type: 'lawyer_verification',
      amountMinor: 5000,
      currency: 'USD',
      status: 'pending',
      createdAt: '2026-08-01T00:00:00.000Z',
      paidAt: null,
      hiringRequestId: null,
      payerName: null,
      lawyerName: null,
      engagementSpecialization: null,
    })
    expect(verification.clientName).toBe('—')
    expect(verification.lawyerName).toBe('—')
    expect(verification.engagementReference).toBeNull()
    expect(verification.issuedLabel).toMatch(/Aug 2026/i)
    expect(verification.description).toContain('publishing verification')
  })
})
