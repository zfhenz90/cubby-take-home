import type { Product } from '../types/product'

/**
 * The Cubby 2 Bed product payload, transcribed from design/product.md and the
 * contact/documents/incentives details in design/product-detail-page.md.
 *
 * This is a typed `const` (not JSON) so TypeScript checks it against the `Product`
 * contract at build time — a mistyped field or a stray property is a compile error,
 * which catches data-entry mistakes in SKUs and prices before they reach Sarah.
 * It is served ONLY through services/productService, preserving the swap-to-API seam.
 *
 * Assumption (flagged in README): the "Group 1"/"Group 2" LMN guide PDFs correspond
 * to the "Group A"/"Group B" state lists in the design doc.
 */
export const CUBBY_2_PRODUCT: Product = {
  id: 'cubby-2',
  name: 'Cubby 2 Bed',
  tagline:
    'Medical-grade safety bed with integrated monitoring, built for daily wear and long-term use.',
  heroImage: '/images/Cubby-Bed-DoorsOpen_2.png',

  differentiators: [
    {
      title: 'Designed for a growing clinical need',
      description:
        'For children prone to wandering or self-injurious behaviours, often exhibited by children with autism and other complex conditions.',
    },
    {
      title: 'Integrated safety + monitoring',
      description:
        'Smart features and monitoring tools help caregivers stay informed and respond quickly when needed.',
    },
    {
      title: 'Built for durability + long-term use',
      description:
        'Medical-grade construction designed for stability, daily wear, and consistent performance in home and care settings.',
    },
    {
      title: 'Comprehensive family support',
      description:
        'Live assistance before and after delivery, including setup guidance, care coordination, and ongoing product support.',
    },
    {
      title: 'Continuous product innovation',
      description:
        'Regular design enhancements informed by clinical insight, caregiver feedback, and real-world use.',
    },
  ],

  researchStats: [
    {
      headline: 'Up to 2x longer sleep duration',
      detail: 'Median increase in sleep duration from 4–6 hours to 8–10 hours per night.',
    },
    {
      headline: 'Up to 50% fewer elopement incidents',
      detail: 'Median reduction in elopement incidents from 1–2 per month to less than 1 per month.',
    },
    {
      headline: 'Up to 70% fewer nighttime wakeups',
      detail: 'Median reduction in nighttime wakeups from 5–6 to 1–2 per night.',
    },
  ],

  improvements: [
    'Redesigned, inset frame connectors',
    'Zipper access covers on canopy doors',
    '8" adjustable height + caster wheels',
    'Reinforced zippers resist pulling apart',
    'Safety Sheet zipper, out-of-sight',
    'Metal, 3" slat gaps reduce elopement risk',
  ],

  bedOptions: [
    {
      id: 'cubby-2-dream-hub',
      name: 'Cubby 2 Bed with Dream Hub',
      includes: ['Dream Hub (1)', 'Frame (1)', 'Canopy (1)', 'Safety Sheets (3)', '8" Mattress (1)'],
      variants: [
        { sku: 'CUB-2101', label: 'No wheels', hasWheels: false, msrp: 14490 },
        { sku: 'CUB-2111', label: 'Wheels', hasWheels: true, msrp: 15390 },
      ],
    },
    {
      id: 'cubby-2-no-hub',
      name: 'Cubby 2 Bed (No Hub)',
      includes: ['Frame (1)', 'Canopy (1)', 'Safety Sheets (3)', '8" Mattress (1)'],
      variants: [
        { sku: 'CUB-2001', label: 'No wheels', hasWheels: false, msrp: 13335 },
        { sku: 'CUB-2011', label: 'Wheels', hasWheels: true, msrp: 14235 },
      ],
    },
  ],

  addOnPackages: [
    {
      id: 'pkg-incontinence-1',
      sku: 'PKG20001',
      name: 'Package 1 — Incontinence Level 1',
      msrp: 495,
      description:
        'Designed to support users managing frequent incontinence and the associated need for frequent sheet changes.',
      contents: ['Safety Sheet (1)', 'Mattress Protector (1)'],
    },
    {
      id: 'pkg-incontinence-2',
      sku: 'PKG20002',
      name: 'Package 2 — Incontinence Level 2',
      msrp: 7095,
      description:
        'Designed to support users who experience frequent incontinence episodes or display smearing behaviors requiring frequent sheet and canopy changes.',
      contents: ['Safety Sheet (1)', 'Mattress Protector (1)', 'Canopy (1)'],
    },
    {
      id: 'pkg-sensory',
      sku: 'PKG20003',
      name: 'Package 3 — Sensory Package',
      msrp: 935,
      description:
        'Designed to help manage sensory sensitivities, sleep difficulties, and incontinence, supporting improved comfort, independence, and overall quality of life.',
      contents: ['Safety Sheet (1)', 'Weighted Blanket (1)', 'Vibration Pad (1)'],
    },
  ],

  documents: [
    {
      id: 'order-form',
      title: 'Cubby Order Form',
      category: 'order-form',
      href: '/documents/CubbyOrderForm.pdf',
      description: 'Place a Cubby 2 order — the form to submit for a new bed order.',
    },
    {
      id: 'lmn-guide-group-a',
      title: 'LMN Guide for Clinical Providers — Group A',
      category: 'lmn-guide',
      href: '/documents/Cubby_Bed_LMN_Guide_for_Clinical_Providers_-_Group_1.pdf',
      description: 'Letter of Medical Necessity guidance for providers in Group A states.',
      lmnGroup: 'A',
    },
    {
      id: 'lmn-guide-group-b',
      title: 'LMN Guide for Clinical Providers — Group B',
      category: 'lmn-guide',
      href: '/documents/Cubby_Bed_LMN_Guide_for_Clinical_Providers_-_Group_2.pdf',
      description: 'Letter of Medical Necessity guidance for providers in Group B states.',
      lmnGroup: 'B',
    },
    {
      id: 'lmn-outline',
      title: 'LMN Outline for Providers',
      category: 'outline',
      href: '/documents/LMN_Outline_For_Provider.pdf',
      description: 'A structural outline to help a provider draft a Letter of Medical Necessity.',
    },
    {
      id: 'safety-worksheet',
      title: 'Safety Needs & Concerns Worksheet (LMN Prep)',
      category: 'worksheet',
      href: '/documents/Safety_Needs_and_Concerns_Worksheet_for_LMN_Prep.pdf',
      description: 'Capture the safety needs and concerns that support an LMN submission.',
    },
    {
      id: 'product-catalog',
      title: 'Product Catalog (Digital)',
      category: 'catalog',
      href: '/documents/Product-Catalog-Digital.pdf',
      description: 'Full digital product catalog covering the Cubby line and options.',
    },
    {
      id: 'equipment-package-print',
      title: 'Equipment Package Print',
      category: 'equipment',
      href: '/documents/Equipment_Package_Print.pdf',
      description: 'Printable equipment package reference sheet.',
    },
  ],

  incentives: [
    {
      id: 'demo-bed',
      title: 'Sell 5 beds, get a Demo Bed free',
      description: 'Reach 5 sales and receive a demo bed at no cost to help close the next family.',
      target: 5,
      unit: 'beds',
      reward: 'Free demo bed',
    },
    {
      id: 'rewards-1m',
      title: 'Sell $1,000,000, get $100,000 in rewards',
      description: 'Hit $1M in Cubby sales and unlock $100,000 in partner rewards.',
      target: 1_000_000,
      unit: 'usd',
      reward: '$100,000 in rewards',
    },
  ],

  contact: {
    website: 'CubbyBeds.com',
    email: 'Admin@CubbyBeds.com',
    phone: '(855) 964-2664',
  },
}
