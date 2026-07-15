/**
 * Domain types for a Cubby product detail page.
 *
 * These describe the *shape a view consumes*, deliberately decoupled from how the
 * data is stored or fetched. The mock service returns objects of these types today;
 * a real API can return the same shapes tomorrow without touching any component.
 */

/** A stock-keeping unit, e.g. "CUB-2101" or "PKG20003". */
export type Sku = string

/** A purchasable configuration of a bed model (wheels vs. no wheels). */
export interface BedVariant {
  sku: Sku
  /** Human label for the variant, e.g. "No wheels". */
  label: string
  hasWheels: boolean
  /** Manufacturer suggested retail price, in whole US dollars. */
  msrp: number
}

/** A bed model with one or more purchasable variants. */
export interface BedOption {
  id: string
  name: string
  /** What ships in the box, e.g. "Frame (1)", "8\" Mattress (1)". */
  includes: string[]
  variants: BedVariant[]
}

/** An optional add-on package sold alongside a bed. */
export interface AddOnPackage {
  id: string
  sku: Sku
  name: string
  msrp: number
  description: string
  contents: string[]
}

/** A reason the product stands apart (marketing/clinical differentiator). */
export interface Differentiator {
  title: string
  description: string
}

/** A peer-reviewed outcome statistic with its supporting detail. */
export interface ResearchStat {
  headline: string
  detail: string
}

/** Coarse grouping used to organize the documents section. */
export type DocumentCategory =
  | 'order-form'
  | 'lmn-guide'
  | 'catalog'
  | 'worksheet'
  | 'equipment'
  | 'outline'

/** Which Letter of Medical Necessity guide a document corresponds to. */
export type LmnGroup = 'A' | 'B'

/** A downloadable supplier document (PDF served from /public/documents). */
export interface ProductDocument {
  id: string
  title: string
  category: DocumentCategory
  /** Absolute, stable URL under public/, e.g. "/documents/CubbyOrderForm.pdf". */
  href: string
  description: string
  /** Set only on the two LMN guide PDFs; links them to state coverage results. */
  lmnGroup?: LmnGroup
}

/** How the reward for a supplier incentive is measured. */
export type IncentiveUnit = 'beds' | 'usd'

/** A supplier sales incentive ("sell 5 beds, get a demo bed free"). */
export interface Incentive {
  id: string
  title: string
  description: string
  /** Goal amount expressed in `unit` (e.g. 5 beds, or 1_000_000 dollars). */
  target: number
  unit: IncentiveUnit
  reward: string
}

/** Contact details for the supplier support team. */
export interface Contact {
  website: string
  email: string
  phone: string
}

/** The full product detail payload a PDP renders. */
export interface Product {
  id: string
  name: string
  tagline: string
  /** Absolute URL under public/, e.g. "/images/Cubby-Bed-DoorsOpen_2.png". */
  heroImage: string
  differentiators: Differentiator[]
  researchStats: ResearchStat[]
  improvements: string[]
  bedOptions: BedOption[]
  addOnPackages: AddOnPackage[]
  documents: ProductDocument[]
  incentives: Incentive[]
  contact: Contact
}
