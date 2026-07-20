import type { Project, TradeSection, WorkItem } from '../types'

const tradeDefinitions = [
  ['plumbing', 'Plumbing and Heating', '#2d6a8a'],
  ['carpentry', 'Carpentry and Joinery', '#9a6737'],
  ['roofing', 'Roofing and Insulation', '#607d56'],
  ['drylining', 'Drylining and Plastering', '#8c7297'],
  ['flooring', 'Flooring and Tiling', '#a45c4a'],
  ['electrical', 'Electrical', '#d19b2a'],
  ['kitchen', 'Kitchen and Utility', '#47776b'],
  ['painting', 'Painting and Decorating', '#bd7180'],
  ['external', 'External Works', '#56764c'],
  ['appliances', 'Appliances', '#586a79'],
  ['furniture', 'Furniture', '#856f64'],
  ['fees', 'Professional Fees and Grants', '#62688b'],
] as const

export const tradeSections: TradeSection[] = tradeDefinitions.map(([id, name, colour], order) => ({ id, name, colour, order }))

type SeedEntry = string | [string, number, string]

const schedule: Record<string, SeedEntry[]> = {
  plumbing: [
    ['Toilet suites', 2, 'suite'], ['Wash-hand basins', 2, 'unit'], ['Shower tray, approximately 900 × 1000 mm', 1, 'unit'],
    ['Sliding shower door or enclosure', 1, 'unit'], ['Bath', 1, 'unit'], 'Plumbing connections for toilets, basins, shower and bath',
    'Remove plumbing from the existing utility room', 'Move plumbing to the new shed', ['Radiators, approximately 1800 × 900 mm; final sizing to be confirmed', 8, 'unit'],
    ['New oil boiler', 1, 'unit'], ['Bunded oil tank', 1, 'unit'], 'Smart heating controls', 'Heating system testing and commissioning',
    'Grant investigation for heating controls and energy upgrades',
  ],
  carpentry: [
    ['Internal door sets, 900 mm wide', 4, 'set'], 'Internal door set fittings: frame, architrave, lock, handle and hinges',
    ['Double-door sets, approximately 1500 mm wide', 2, 'set'], 'Double-door set fittings: frame, architrave, lock, handles and hinges',
    ['Staircase', 15, 'step'], 'Newels', 'Posts', 'Stair handrail', ['Extend wall-mounted handrail', 15, 'ft'], 'Skirting boards throughout',
    'Wardrobes, dimensions and design to be determined', 'Window boards', 'Finish exposed timber panelling',
    'Prepare and paint exposed timber panelling white', 'Kitchen units and worktops, specification to be confirmed',
    'Utility units and worktops, specification to be confirmed',
  ],
  roofing: [
    ['Velux roof windows', 2, 'unit'], 'Confirm Velux sizes before ordering', 'Make roof airtight', 'Seal roof joints, penetrations and junctions',
    'Inspect existing roof insulation', 'Upgrade insulation where required', 'Consider spray foam only after technical assessment',
    'Roof covering or replacement; area and final material to be measured', 'Flashings, valleys, trims and roof accessories',
    'Investigate insulation grant options',
  ],
  drylining: [
    'Insulate and slab utility-room walls', 'Repair ceilings', 'Remove or close redundant downlighter holes', 'Tape and joint ceilings',
    'Plaster and make good damaged areas', ['Form new doorway', 1, 'unit'], 'Include lintel if structurally required',
    'Extend bedroom wall into utility area', 'Create additional wardrobe space',
  ],
  flooring: [
    'Measure and cost kitchen flooring', 'Measure and cost living-room flooring', 'Measure and cost hallway flooring',
    'Measure and cost bedroom flooring', 'Measure and cost utility-room flooring', 'Measure and cost bathroom flooring',
    'Bathroom wall tiles', 'Bathroom floor tiles', 'Utility floor insulation', 'Utility floor build-up', 'Utility floor finish',
    'Optional acoustic flooring in the annex',
  ],
  electrical: [
    'Complete electrical inspection', 'Electrical works specification', 'New fuse board or consumer unit in utility room', 'Smart sockets',
    'Heating-control wiring', 'Kitchen appliance circuits', 'Bathroom lighting and electrical works', 'Bathroom extractor fans',
    'Smoke alarms', 'Heat alarms', 'External lighting', 'Remove redundant downlights', 'Electrical certification',
  ],
  kitchen: [
    'Kitchen units', 'Kitchen worktops', 'Utility units', 'Utility worktops', 'Final layouts to be confirmed',
    'Plumbing and electrical coordination', 'Cooker connection', 'Extractor connection', 'Washing-machine connection', 'Dryer connection',
  ],
  painting: [
    'Painting throughout', 'Walls', 'Ceilings', 'Internal doors', 'Door frames', 'Skirting boards', 'Architraves', 'Window boards',
    'Exposed timber panelling', 'Final touch-ups and sealants',
  ],
  external: [
    ['Concrete base for a 15 × 10 ft shed', 1, 'unit'], ['15 × 10 ft single-storey shed', 1, 'unit'], 'Front paving', 'Rear paving',
    'Drainage checks and alterations', 'Gardening and landscaping allowance', 'Waste removal and skips',
  ],
  appliances: ['Washing machine', 'Dryer', 'Cooker', 'Extractor hood'],
  furniture: ['Bed', 'Couch', 'Armchair', 'Kitchen table', 'Chairs'],
  fees: [
    'Roof and insulation survey', 'Structural assessment where required', 'Electrical certification', 'Plumbing and heating commissioning',
    'Final measurements', 'Energy grant investigation', 'Boiler and heating-control grant investigation', 'Contingency allowance',
  ],
}

const needsMeasurement = (description: string): boolean =>
  /measure|size|dimension|area|layout|specification|determin|inspect|assessment/i.test(description)

const now = '2026-07-20T00:00:00.000Z'

const workItems: WorkItem[] = Object.entries(schedule).flatMap(([tradeSectionId, entries]) =>
  entries.map((entry, index) => {
    const [description, quantity = 1, unit = 'item'] = typeof entry === 'string' ? [entry] : entry
    return {
      id: `${tradeSectionId}-${index + 1}`,
      tradeSectionId,
      description,
      notes: '',
      quantity,
      unit,
      estimatedMaterialCost: 0,
      estimatedLabourCost: 0,
      estimatedOtherCost: 0,
      estimatedTotal: 0,
      quotedCost: 0,
      actualCost: 0,
      supplierOrContractor: '',
      status: needsMeasurement(description) ? 'To Measure' : 'Awaiting Quote',
      priority: 'Medium',
      createdAt: now,
      updatedAt: now,
    }
  }),
)

export const createSeedProject = (): Project => ({
  id: 'home-renovation',
  name: 'Home Renovation',
  currency: 'EUR',
  locale: 'en-IE',
  createdAt: now,
  updatedAt: now,
  tradeSections,
  workItems,
  quotes: [],
  suppliers: [],
})
