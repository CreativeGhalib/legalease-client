import LegalPageLayout, { LegalSection } from '../../components/common/LegalPageLayout'

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout eyebrow="REFUNDS" title="Refund Policy">
      <LegalSection title="1. Scope">
        <p>
          This policy describes how payments made through LegalEase are treated. It should be read
          together with our Terms of Service. Consultation fees are recorded in escrow status at
          fulfillment and marked released to the lawyer after client confirmation, or automatically
          7 days after payment. Actual payouts to lawyers are settled manually via bKash or bank transfer.
        </p>
      </LegalSection>

      <LegalSection title="2. Lawyer publishing verification fee">
        <p>
          The one-time verification fee covers platform review of a lawyer&rsquo;s profile completeness and
          continued listing infrastructure. Once verification has been paid and granted, the fee is
          non-refundable — including where a profile is later unpublished by the lawyer, or suspended
          following a policy violation. If a checkout session is started but never completed, no
          charge is made.
        </p>
      </LegalSection>

      <LegalSection title="3. Consultation fees for accepted engagements">
        <p>
          A consultation fee can only be paid after a lawyer accepts a hiring request, and the amount
          is fixed by the rate published when the request was created. The fee supports the engagement
          directly with that lawyer. Once paid, the funds are marked released to the lawyer when you
          confirm completion, or automatically 7 days after payment. If something goes wrong, raise it
          through the contact channel on our Contact page — LegalEase moderation can review the record
          of the engagement and assist both parties toward a fair outcome, and may issue a refund at its
          discretion where warranted.
        </p>
      </LegalSection>

      <LegalSection title="4. Cancelled and expired checkouts">
        <p>
          Leaving Stripe Checkout, closing the payment window, or letting a session expire never
          results in a charge. If a payment attempt fails, you can safely retry from your dashboard;
          you are only ever charged once per successful, verified payment for a given obligation.
        </p>
      </LegalSection>

      <LegalSection title="5. Chargebacks">
        <p>
          Before contacting your bank, please raise the matter with us through the contact channel on
          our Contact page — verified records of every engagement and payment allow issues to be
          reviewed far faster than a card dispute. Unwarranted chargebacks may lead to account
          suspension.
        </p>
      </LegalSection>

      <LegalSection title="6. Changes to this policy">
        <p>
          If refund capabilities change — for example if escrow or moderated refunds are introduced —
          this page will be updated before those features go live, and the version in force when you
          paid governs your payment.
        </p>
      </LegalSection>

      <LegalSection title="7. Contact">
        <p>Refund questions can be raised through the contact channel on our Contact page.</p>
      </LegalSection>
    </LegalPageLayout>
  )
}
