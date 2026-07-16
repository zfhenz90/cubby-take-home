import type { DocumentCategory, ProductDocument } from '../../types/product'
import { documentAnchorId } from '../../lib/anchors'
import { Badge } from '../common/Badge'
import { Section } from '../common/Section'

interface DocumentsProps {
  documents: ProductDocument[]
}

/** Human labels for the category badge on each card. */
const CATEGORY_LABEL: Record<DocumentCategory, string> = {
  'order-form': 'Ordering',
  'lmn-guide': 'LMN guide',
  catalog: 'Catalog',
  worksheet: 'LMN prep',
  equipment: 'Reference',
  outline: 'LMN prep',
}

/** Visible groupings, in display order, mapped to the categories they contain. */
const GROUPS: { label: string; categories: DocumentCategory[] }[] = [
  { label: 'Ordering', categories: ['order-form'] },
  { label: 'LMN guides & prep', categories: ['lmn-guide', 'outline', 'worksheet'] },
  { label: 'Catalog & reference', categories: ['catalog', 'equipment'] },
]

function DocumentCard({ doc }: { doc: ProductDocument }) {
  return (
    <a
      id={documentAnchorId(doc.id)}
      href={doc.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group jump-target flex flex-col rounded-xl border border-line p-4 transition hover:border-accent hover:bg-accent/5"
    >
      <div className="flex items-center justify-between gap-2">
        <Badge tone={doc.lmnGroup ? 'accent' : 'neutral'}>
          {doc.lmnGroup ? `LMN Group ${doc.lmnGroup}` : CATEGORY_LABEL[doc.category]}
        </Badge>
        <span aria-hidden="true" className="text-ink-soft transition group-hover:text-accent-ink">
          ↗
        </span>
      </div>
      <h3 className="mt-3 font-heading font-bold text-ink group-hover:text-accent-ink">
        {doc.title}
      </h3>
      <p className="mt-1 text-sm text-ink-soft">{doc.description}</p>
      <span className="mt-3 text-xs font-semibold text-accent-ink">Open PDF</span>
    </a>
  )
}

export function Documents({ documents }: DocumentsProps) {
  return (
    <Section
      id="documents"
      title="Documents & resources"
      description="Forms, LMN guides, and references — no more hunting through PDFs."
    >
      <div className="space-y-6">
        {GROUPS.map((group) => {
          const docs = documents.filter((d) => group.categories.includes(d.category))
          if (docs.length === 0) return null
          return (
            <div key={group.label}>
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-ink-soft uppercase">
                {group.label}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {docs.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
