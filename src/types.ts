export const STATUSES = ['To Measure', 'Awaiting Quote', 'Quoted', 'Approved', 'Ordered', 'In Progress', 'Complete', 'Paid', 'On Hold'] as const
export const PRIORITIES = ['High', 'Medium', 'Low'] as const

export type WorkStatus = (typeof STATUSES)[number]
export type Priority = (typeof PRIORITIES)[number]

export interface WorkItem {
  id: string
  tradeSectionId: string
  description: string
  notes: string
  quantity: number
  unit: string
  estimatedMaterialCost: number
  estimatedLabourCost: number
  estimatedOtherCost: number
  estimatedTotal: number
  quotedCost: number
  actualCost: number
  supplierOrContractor: string
  status: WorkStatus
  priority: Priority
  createdAt: string
  updatedAt: string
}

export interface TradeSection {
  id: string
  name: string
  colour: string
  order: number
}

export interface Quote {
  id: string
  workItemId: string
  supplierId?: string
  amount: number
  reference: string
  notes: string
  receivedAt: string
}

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  notes: string
}

export interface Project {
  id: string
  name: string
  currency: 'EUR'
  locale: 'en-IE'
  createdAt: string
  updatedAt: string
  tradeSections: TradeSection[]
  workItems: WorkItem[]
  quotes: Quote[]
  suppliers: Supplier[]
}

export interface CostSummary {
  estimatedTotal: number
  quotedTotal: number
  actualTotal: number
  remainingProjectedCost: number
  materialsTotal: number
  labourTotal: number
  otherTotal: number
  awaitingMeasurement: number
  awaitingQuotation: number
  completed: number
}
