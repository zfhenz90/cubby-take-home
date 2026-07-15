import type { Contact as ContactInfo } from '../../types/product'
import { Section } from '../common/Section'

interface ContactProps {
  contact: ContactInfo
}

/** Strips formatting from a phone string for a tel: href. */
function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

export function Contact({ contact }: ContactProps) {
  return (
    <Section
      id="contact"
      title="Contact & support"
      description="Reach the Cubby supplier support team."
    >
      <dl className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line p-4">
          <dt className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
            Website
          </dt>
          <dd className="mt-1">
            <a
              href={`https://${contact.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent-ink hover:underline"
            >
              {contact.website}
            </a>
          </dd>
        </div>
        <div className="rounded-xl border border-line p-4">
          <dt className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
            Email
          </dt>
          <dd className="mt-1">
            <a
              href={`mailto:${contact.email}`}
              className="font-semibold text-accent-ink hover:underline"
            >
              {contact.email}
            </a>
          </dd>
        </div>
        <div className="rounded-xl border border-line p-4">
          <dt className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
            Phone
          </dt>
          <dd className="mt-1">
            <a
              href={telHref(contact.phone)}
              className="font-semibold text-accent-ink hover:underline"
            >
              {contact.phone}
            </a>
          </dd>
        </div>
      </dl>
    </Section>
  )
}
