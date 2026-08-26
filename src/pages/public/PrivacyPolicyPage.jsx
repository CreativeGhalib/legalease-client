import LegalPageLayout, { LegalSection } from '../../components/common/LegalPageLayout'

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <LegalSection title="1. Scope">
        <p>
          This policy explains what personal data LegalEase collects, why, who processes it, and
          the choices available to you. It applies to the LegalEase web application and its
          supporting API.
        </p>
      </LegalSection>

      <LegalSection title="2. Data we collect">
        <p>
          <strong>Account data:</strong> your name and email address, and a profile photo if you add
          one. If you sign in with Google, we receive your Google account name, email, profile
          picture, and a unique identifier — we never receive your Google password.
          <br />
          <strong>Lawyer profile data:</strong> professional photo, practice areas, bio, fees,
          experience, license details, location, languages, and availability you provide.
          <br />
          <strong>Payment metadata:</strong> transaction identifiers, amounts, currency, and status
          received from Stripe. Card numbers are never collected or stored by LegalEase — checkout
          is handled entirely on Stripe&rsquo;s hosted page.
          <br />
          <strong>Engagement data:</strong> hiring requests, decisions, payment states, comments,
          and reviews connected to your account.
        </p>
      </LegalSection>

      <LegalSection title="3. How we use data">
        <p>
          To operate the marketplace: authenticating sessions, showing published lawyer profiles,
          processing hiring requests and payments, sending transactional emails (such as password
          resets and engagement updates), preventing fraud and abuse through rate limiting and
          logging, and meeting legal obligations. We do not sell personal data and do not run
          advertising trackers.
        </p>
      </LegalSection>

      <LegalSection title="4. Third-party processors">
        <p>
          LegalEase relies on: <strong>Stripe</strong> for payment processing; <strong>Google
          Identity Services</strong> for optional sign-in; <strong>imgBB</strong> for image hosting;
          <strong> Mailtrap SMTP</strong> for transactional email delivery; <strong>Vercel</strong>
          for application hosting; and <strong>MongoDB Atlas</strong> for database hosting. These
          services may process or store data outside Bangladesh. Each is bound by its own terms to
          process data on our behalf for the purposes described here.
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies and local storage">
        <p>
          We use one essential, HTTP-only session cookie to keep you signed in — it cannot be read
          by scripts and contains no personal data beyond an opaque signed token. We also store
          small non-identifying preferences in your browser&rsquo;s local storage (such as theme choice and
          shortlisted lawyers). No advertising or analytics cookies are used today.
        </p>
      </LegalSection>

      <LegalSection title="6. Retention">
        <p>
          Account and profile data are kept while your account is active. Transaction records are
          retained after account closure where needed for accounting, dispute handling, or legal
          requirements. Deleted profiles and removed content are soft-deleted so historical
          references remain accurate.
        </p>
      </LegalSection>

      <LegalSection title="7. Your rights">
        <p>
          You may access, correct, or request deletion of your personal data by using the contact
          channel published on our Contact page. Deletion removes your account, profile content,
          and personal identifiers; records of payments connected to engagements are retained in
          anonymised or minimal form as described above. You will not be discriminated against for
          exercising these rights.
        </p>
      </LegalSection>

      <LegalSection title="8. Security">
        <p>
          Passwords are hashed, sessions use signed HTTP-only cookies, traffic is encrypted in
          transit, administrative actions are restricted server-side, and targeted rate limiting
          protects authentication and payment flows. No system is perfectly secure, but we design
          LegalEase to limit what any single compromise can expose.
        </p>
      </LegalSection>

      <LegalSection title="9. Children">
        <p>LegalEase is not directed at anyone under 18, and accounts for minors are prohibited.</p>
      </LegalSection>

      <LegalSection title="10. Bangladesh Digital Security Act 2018">
        <p>
          LegalEase operates with respect for applicable Bangladeshi law, including the Digital
          Security Act 2018. Where we receive a lawful government request for data, we require
          proper legal process and respond as that law requires, with the limited disclosure such
          process authorises.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to this policy">
        <p>
          Material updates will be posted on this page with a new &ldquo;last updated&rdquo; date. Continued use
          of LegalEase after changes take effect constitutes acknowledgement of the updated policy.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>Privacy questions and requests can be raised through the contact channel on our Contact page.</p>
      </LegalSection>
    </LegalPageLayout>
  )
}
