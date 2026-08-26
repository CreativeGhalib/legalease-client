import LegalPageLayout, { LegalSection } from '../../components/common/LegalPageLayout'

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service">
      <LegalSection title="1. About LegalEase">
        <p>
          LegalEase is an online marketplace that connects people seeking legal services with
          independent, licensed lawyers who publish professional profiles on the platform.
          LegalEase is not a law firm, does not practise law, and is not a lawyer referral service
          of any bar association. Nothing on LegalEase constitutes legal advice, and no
          attorney-client relationship is created between you and LegalEase, or between users and
          lawyers, by mere use of the platform.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility and accounts">
        <p>
          You must be at least 18 years old to create an account. Accounts are registered as client
          or lawyer accounts; administrative accounts are created internally by LegalEase only. You
          agree to provide accurate, current information, to keep your credentials confidential, and
          to accept responsibility for all activity under your account. LegalEase may suspend or
          remove accounts that breach these terms or applicable law.
        </p>
      </LegalSection>

      <LegalSection title="3. Lawyer profiles and verification">
        <p>
          Lawyers are solely responsible for the accuracy of their profile information, including
          qualifications, experience, license details, and availability. The one-time verification
          fee covers platform review of profile completeness and hosting; it is not a Bar Council
          certification and does not guarantee a lawyer&rsquo;s competence or the outcome of any matter.
          Only profiles that have completed verification are publicly listed.
        </p>
      </LegalSection>

      <LegalSection title="4. Hiring engagements">
        <p>
          Clients send hiring requests to available lawyers; the lawyer may accept or decline. A
          consultation fee becomes payable only after a lawyer accepts a request. The legal services
          themselves are provided directly by the lawyer to the client. LegalEase is not a party to
          that engagement, does not supervise the work, and disclaims responsibility for advice
          given, deadlines met, or results achieved.
        </p>
      </LegalSection>

      <LegalSection title="5. Payments">
        <p>
          Payments are processed through Stripe. The lawyer publishing verification fee is charged
          to the lawyer when they request verification. Consultation fees are quoted in USD,
          derived from the lawyer&rsquo;s published rate at the time of the request, and collected from the
          client after acceptance. LegalEase holds no funds in escrow and does not currently offer
          automatic refunds. You are responsible for any taxes applicable to your use of the
          platform.
        </p>
      </LegalSection>

      <LegalSection title="6. Comments and content">
        <p>
          Clients with an accepted, paid engagement may publish one comment per lawyer. Comments
          must be lawful, truthful, and respectful. You grant LegalEase a non-exclusive right to
          display your comments on the relevant profile. You may edit or delete your own comment;
          LegalEase may remove content that violates these terms or applicable law.
        </p>
      </LegalSection>

      <LegalSection title="7. Prohibited conduct">
        <p>
          You must not misrepresent your identity or qualifications; scrape, reverse-engineer, or
          disrupt the platform; upload malicious content; impersonate others; use the platform for
          unlawful purposes; or attempt to circumvent fees through off-platform arrangements made
          through features of the platform.
        </p>
      </LegalSection>

      <LegalSection title="8. Suspension and termination">
        <p>
          LegalEase may unpublish, suspend, or soft-delete lawyer listings, and may deactivate
          accounts, where these terms are breached or where required by law. Historical transaction
          records are retained even after an account or listing is removed.
        </p>
      </LegalSection>

      <LegalSection title="9. Disclaimers and limitation of liability">
        <p>
          The platform is provided &ldquo;as is&rdquo;. To the fullest extent permitted by law, LegalEase disclaims
          all implied warranties and shall not be liable for indirect or consequential losses, or
          for the quality, legality, or outcome of legal services provided by lawyers. Where
          liability cannot be excluded, it is limited to the amounts you paid through the platform
          in the three months preceding the claim.
        </p>
      </LegalSection>

      <LegalSection title="10. Disputes and governing law">
        <p>
          Concerns about a lawyer or a payment should first be raised through the contact channel
          published on our Contact page so that moderation can assist. These terms are governed by
          the laws of Bangladesh, and the courts of Dhaka have exclusive jurisdiction over disputes
          that cannot be resolved informally.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to these terms">
        <p>
          We may update these terms as the platform evolves. Material changes will be reflected on
          this page with a new &ldquo;last updated&rdquo; date, and continued use of LegalEase after changes take
          effect constitutes acceptance.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>Questions about these terms can be raised through the contact channel on our Contact page.</p>
      </LegalSection>
    </LegalPageLayout>
  )
}
