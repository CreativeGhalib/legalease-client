import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { paddingVertical: 42, paddingHorizontal: 48, fontSize: 10, color: '#0c1827', fontFamily: 'Helvetica' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  wordmark: { fontSize: 20, fontFamily: 'Times-Bold', color: '#1b3a6b' },
  tagline: { fontSize: 8, letterSpacing: 2, color: '#69798e', marginTop: 3 },
  invoiceLabel: { fontSize: 22, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
  goldRule: { height: 3, backgroundColor: '#d4a843', marginTop: 14, marginBottom: 20 },
  sectionTitle: { fontSize: 8, letterSpacing: 1.5, color: '#69798e', marginBottom: 4 },
  partyBlock: { flex: 1, paddingRight: 18 },
  partyName: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1b3a6b', color: '#ffffff', paddingVertical: 7, paddingHorizontal: 10, fontSize: 9, fontFamily: 'Helvetica-Bold' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e4d9c5', paddingVertical: 9, paddingHorizontal: 10 },
  colDescription: { width: '70%' },
  colAmount: { width: '30%', textAlign: 'right', fontFamily: 'Helvetica-Bold' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 10, backgroundColor: '#f4eee1', marginTop: 16 },
  totalLabel: { fontFamily: 'Helvetica-Bold', fontSize: 11 },
  totalAmount: { fontFamily: 'Helvetica-Bold', fontSize: 12, color: '#1b3a6b' },
  footer: { position: 'absolute', bottom: 34, left: 48, right: 48, fontSize: 8, color: '#69798e', lineHeight: 1.6 },
})

export default function InvoicePDF({ invoice }) {
  return (
    <Document
      title={`Invoice ${invoice.number} — LegalEase`}
      author="LegalEase"
      subject="LegalEase payment invoice"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.wordmark}>LegalEase</Text>
            <Text style={styles.tagline}>LEGAL COUNSEL MARKETPLACE</Text>
          </View>
          <Text style={styles.invoiceLabel}>INVOICE</Text>
        </View>
        <View style={styles.goldRule} />

        <View style={{ flexDirection: 'row', marginBottom: 22 }}>
          <View style={styles.partyBlock}>
            <Text style={styles.sectionTitle}>BILLED TO (CLIENT)</Text>
            <Text style={styles.partyName}>{invoice.clientName}</Text>
          </View>
          <View style={styles.partyBlock}>
            <Text style={styles.sectionTitle}>LEGAL SERVICES BY (LAWYER)</Text>
            <Text style={styles.partyName}>{invoice.lawyerName}</Text>
          </View>
          <View style={[styles.partyBlock, { paddingRight: 0 }]}>
            <Text style={styles.sectionTitle}>INVOICE DETAILS</Text>
            <View style={styles.metaRow}><Text>Number</Text><Text style={{ fontFamily: 'Helvetica-Bold' }}>{invoice.number}</Text></View>
            <View style={styles.metaRow}><Text>Issued</Text><Text>{invoice.issuedLabel}</Text></View>
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.colDescription}>DESCRIPTION</Text>
          <Text style={styles.colAmount}>AMOUNT</Text>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.colDescription}>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>{invoice.typeLabel}</Text>
            <Text style={{ color: '#364358', marginTop: 3 }}>{invoice.description}</Text>
            {invoice.engagementReference && (
              <Text style={{ color: '#69798e', marginTop: 3 }}>Engagement ref {invoice.engagementReference}</Text>
            )}
          </View>
          <Text style={styles.colAmount}>{invoice.amountLabel}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL PAID ({invoice.currency.toUpperCase()})</Text>
          <Text style={styles.totalAmount}>{invoice.amountLabel}</Text>
        </View>

        <Text style={styles.footer}>
          Computer-generated invoice for a verified LegalEase transaction. LegalEase is an independent
          marketplace platform, not a law firm. · LegalEase, Dhaka, Bangladesh
        </Text>
      </Page>
    </Document>
  )
}
