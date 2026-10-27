import type { ComponentType } from 'react'
import {
  BriefcaseBusiness,
  Building2,
  HeartHandshake,
  Leaf,
  Megaphone,
  UsersRound,
} from 'lucide-react'
import type { AppRole } from './users'

export type PillarKey = 'operations' | 'finance' | 'csi' | 'volunteering' | 'advocacy'
export type RecordStatus = 'Submitted' | 'In review' | 'Approved' | 'Returned'
export type FieldType = 'text' | 'number' | 'date' | 'select' | 'textarea' | 'file'

export interface SustainabilityRecord {
  id: string
  pillar: PillarKey
  name: string
  category: string
  period: string
  country: string
  subsidiary: string
  businessUnit: string
  location: string
  status: RecordStatus
  submittedBy: string
  submittedAt: string
  values: Record<string, string>
}

export interface FormField {
  name: string
  label: string
  type: FieldType
  required?: boolean
  options?: string[]
  hint?: string
  fullWidth?: boolean
  min?: number
  step?: number
}

export interface PillarDefinition {
  key: PillarKey
  title: string
  shortTitle: string
  path: string
  description: string
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
  formTitle: string
  formDescription: string
  categoryLabel: string
  categories: string[]
  fields: FormField[]
}

export const periods = [
  { value: '2026-10', label: 'October 2026' },
  { value: '2026-09', label: 'September 2026' },
  { value: '2026-08', label: 'August 2026' },
  { value: '2026-07', label: 'July 2026' },
  { value: '2026-06', label: 'June 2026' },
]

export const countries = ['Nigeria', 'Ghana', 'Kenya', 'Rwanda', 'Zambia']
export const subsidiaries = ['Access Bank', 'Access Pensions', 'Access Insurance', 'Access Holdings']
export const businessUnits = ['Group Operations', 'Retail Banking', 'Corporate Banking', 'People & Culture', 'Sustainability']
export const focusAreas = ['Education', 'Health', 'Entrepreneurship', 'Environment']
export const sdgOptions = [
  'SDG 1 · No poverty',
  'SDG 3 · Good health and well-being',
  'SDG 4 · Quality education',
  'SDG 5 · Gender equality',
  'SDG 7 · Affordable and clean energy',
  'SDG 8 · Decent work and economic growth',
  'SDG 9 · Industry, innovation and infrastructure',
  'SDG 10 · Reduced inequalities',
  'SDG 11 · Sustainable cities and communities',
  'SDG 13 · Climate action',
  'SDG 17 · Partnerships for the goals',
]

const reportingFields: FormField[] = [
  {
    name: 'period',
    label: 'Reporting period',
    type: 'select',
    required: true,
    options: periods.map(({ value, label }) => `${value}|${label}`),
  },
  { name: 'country', label: 'Country', type: 'select', required: true, options: countries },
  { name: 'subsidiary', label: 'Subsidiary', type: 'select', required: true, options: subsidiaries },
  { name: 'businessUnit', label: 'Business unit', type: 'select', required: true, options: businessUnits },
  { name: 'location', label: 'Location / branch', type: 'text', required: true },
]

export const pillars: PillarDefinition[] = [
  {
    key: 'operations',
    title: 'Sustainable Operations',
    shortTitle: 'Operations',
    path: '/operations',
    description: 'Capture energy, fuel and business travel consumption across the Group.',
    icon: Leaf,
    formTitle: 'Add an operations record',
    formDescription: 'Enter the source consumption and its original unit. Emissions are unavailable until approved factors are connected.',
    categoryLabel: 'Consumption type',
    categories: ['Diesel', 'Petrol', 'Electricity', 'Air travel', 'Uber', 'Bolt'],
    fields: [
      ...reportingFields,
      { name: 'category', label: 'Consumption type', type: 'select', required: true, options: ['Diesel', 'Petrol', 'Electricity', 'Air travel', 'Uber', 'Bolt'] },
      { name: 'consumptionValue', label: 'Consumption value', type: 'number', required: true, min: 0, step: 0.01 },
      { name: 'unit', label: 'Source unit', type: 'text', required: true, hint: 'Use the unit shown in the source record; do not convert.' },
      { name: 'sourceReference', label: 'Source reference', type: 'text', hint: 'Invoice, meter, travel log or other evidence reference.' },
    ],
  },
  {
    key: 'finance',
    title: 'Sustainable Development Finance',
    shortTitle: 'Development Finance',
    path: '/development-finance',
    description: 'Record sustainable lending, MSME finance and development fund utilization.',
    icon: BriefcaseBusiness,
    formTitle: 'Add a finance record',
    formDescription: 'Capture the financing activity and its intended beneficiaries.',
    categoryLabel: 'Finance activity',
    categories: ['Green loans', 'Social loans', 'MSMEs onboarded', 'MSMEs financed', 'Low-income individuals financed', 'Nano-loans', 'DFI funds received', 'DFI funds utilization'],
    fields: [
      ...reportingFields,
      { name: 'category', label: 'Finance activity', type: 'select', required: true, options: ['Green loans', 'Social loans', 'MSMEs onboarded', 'MSMEs financed', 'Low-income individuals financed', 'Nano-loans', 'DFI funds received', 'DFI funds utilization'] },
      { name: 'customerName', label: 'Customer / recipient name', type: 'text', hint: 'Enter only where permitted by data policy.' },
      { name: 'businessFunction', label: 'Business function', type: 'text', required: true },
      { name: 'productType', label: 'Product type', type: 'text', required: true },
      { name: 'useOfFunds', label: 'Use of funds', type: 'textarea', required: true, fullWidth: true },
      { name: 'amountFinanced', label: 'Amount financed', type: 'number', required: true, min: 0, step: 0.01 },
      { name: 'currency', label: 'Currency', type: 'text', required: true, hint: 'Use the currency code in the source record (for example, NGN).' },
      { name: 'beneficiaries', label: 'Beneficiaries / businesses', type: 'number', min: 0, step: 1 },
      { name: 'msmesOnboarded', label: 'MSMEs onboarded', type: 'number', min: 0, step: 1 },
      { name: 'msmesFinanced', label: 'MSMEs financed', type: 'number', min: 0, step: 1 },
      { name: 'lowIncomeIndividualsFinanced', label: 'Low-income individuals financed', type: 'number', min: 0, step: 1 },
      { name: 'nanoLoans', label: 'Nano-loans issued', type: 'number', min: 0, step: 1 },
      { name: 'dfiFundsReceived', label: 'DFI funds received', type: 'number', min: 0, step: 0.01 },
      { name: 'dfiFundsUtilized', label: 'DFI funds utilized', type: 'number', min: 0, step: 0.01 },
      { name: 'sdgs', label: 'Relevant SDGs', type: 'text', hint: 'List applicable SDG numbers or names.' },
    ],
  },
  {
    key: 'csi',
    title: 'Corporate Social Investment',
    shortTitle: 'Corporate Social Investment',
    path: '/corporate-social-investment',
    description: 'Manage community initiatives, investments and supporting evidence.',
    icon: HeartHandshake,
    formTitle: 'Add a CSI initiative',
    formDescription: 'Record initiative details, location, partners, impact and supporting evidence.',
    categoryLabel: 'Focus area',
    categories: focusAreas,
    fields: [
      ...reportingFields,
      { name: 'name', label: 'Initiative name', type: 'text', required: true },
      { name: 'category', label: 'Focus area', type: 'select', required: true, options: focusAreas },
      { name: 'initiativeDetails', label: 'Initiative details', type: 'textarea', required: true, fullWidth: true },
      { name: 'livesImpacted', label: 'Number of lives impacted', type: 'number', required: true, min: 0, step: 1 },
      { name: 'populationSegment', label: 'Population segment', type: 'text', hint: 'Use the segment values approved for Group reporting.' },
      { name: 'implementationLocation', label: 'Implementation location', type: 'text', required: true },
      { name: 'implementingPartner', label: 'Implementing partner', type: 'text' },
      { name: 'amountSupported', label: 'Amount supported', type: 'number', min: 0, step: 0.01 },
      { name: 'currency', label: 'Currency', type: 'text', hint: 'Enter a currency code if an amount is provided.' },
      { name: 'sdgs', label: 'Relevant SDGs', type: 'text', hint: 'List applicable SDG numbers or names.' },
      { name: 'evidence', label: 'Supporting evidence', type: 'file', hint: 'Demonstration only: files are not uploaded to a server.' },
    ],
  },
  {
    key: 'volunteering',
    title: 'Employee Volunteering',
    shortTitle: 'Employee Volunteering',
    path: '/employee-volunteering',
    description: 'Capture employee participation, volunteering hours and community impact.',
    icon: UsersRound,
    formTitle: 'Add a volunteering initiative',
    formDescription: 'Record the participating staff, contribution and community outcomes.',
    categoryLabel: 'Focus area',
    categories: focusAreas,
    fields: [
      ...reportingFields,
      { name: 'name', label: 'Initiative name', type: 'text', required: true },
      { name: 'category', label: 'Focus area', type: 'select', required: true, options: focusAreas },
      { name: 'volunteeringGroup', label: 'Volunteering group', type: 'text', required: true },
      { name: 'participatingStaff', label: 'Participating staff', type: 'number', required: true, min: 0, step: 1 },
      { name: 'volunteeringHours', label: 'Volunteering hours', type: 'number', min: 0, step: 0.25 },
      { name: 'cashContribution', label: 'Cash contribution', type: 'number', min: 0, step: 0.01 },
      { name: 'currency', label: 'Currency', type: 'text', hint: 'Enter a currency code if a cash contribution is provided.' },
      { name: 'beneficiaries', label: 'Beneficiaries / lives impacted', type: 'number', min: 0, step: 1 },
      { name: 'partners', label: 'Partners', type: 'text' },
      { name: 'awards', label: 'Awards / recognitions', type: 'text' },
      { name: 'sdgs', label: 'Relevant SDGs', type: 'text' },
    ],
  },
  {
    key: 'advocacy',
    title: 'Advocacy & Governance',
    shortTitle: 'Advocacy & Governance',
    path: '/advocacy-governance',
    description: 'Track sustainability engagement, forums, taskforces and recognition.',
    icon: Megaphone,
    formTitle: 'Add an advocacy or governance record',
    formDescription: 'Capture the engagement, participants and supporting references.',
    categoryLabel: 'Engagement type',
    categories: ['Speaking engagement', 'Platform / forum', 'Working group', 'Taskforce', 'Award / recognition'],
    fields: [
      ...reportingFields,
      { name: 'name', label: 'Engagement / recognition name', type: 'text', required: true },
      { name: 'category', label: 'Engagement type', type: 'select', required: true, options: ['Speaking engagement', 'Platform / forum', 'Working group', 'Taskforce', 'Award / recognition'] },
      { name: 'staffInvolved', label: 'Executive / management staff involved', type: 'text', required: true },
      { name: 'eventDate', label: 'Date', type: 'date', required: true },
      { name: 'eventLocation', label: 'Location', type: 'text', required: true },
      { name: 'awardClass', label: 'Award classification', type: 'select', options: ['Local', 'International', 'Not applicable'] },
      { name: 'details', label: 'Details', type: 'textarea', fullWidth: true },
      { name: 'evidence', label: 'Supporting evidence', type: 'file', hint: 'Demonstration only: files are not uploaded to a server.' },
    ],
  },
]

export const pillarByKey = Object.fromEntries(pillars.map((pillar) => [pillar.key, pillar])) as Record<PillarKey, PillarDefinition>

export const formatPeriod = (period: string) => {
  const match = periods.find((item) => item.value === period)
  return match?.label ?? period
}

export function canReview(role: AppRole) {
  return role === 'Sustainability Reviewer' || role === 'Portal Administrator'
}

export const demoRecords: SustainabilityRecord[] = [
  {
    id: 'SDM-OPS-1042', pillar: 'operations', name: 'Head Office · Diesel', category: 'Diesel', period: '2026-10', country: 'Nigeria', subsidiary: 'Access Holdings', businessUnit: 'Group Operations', location: 'Victoria Island, Lagos', status: 'In review', submittedBy: 'Amara Okafor', submittedAt: '2026-10-22',
    values: { category: 'Diesel', consumptionValue: '1,250', unit: 'L', sourceReference: 'DEMO-INV-1042' },
  },
  {
    id: 'SDM-OPS-1038', pillar: 'operations', name: 'Lagos Branch · Electricity', category: 'Electricity', period: '2026-10', country: 'Nigeria', subsidiary: 'Access Bank', businessUnit: 'Retail Banking', location: 'Victoria Island, Lagos', status: 'Submitted', submittedBy: 'Kelechi Eze', submittedAt: '2026-10-21',
    values: { category: 'Electricity', consumptionValue: '8,460', unit: 'kWh', sourceReference: 'DEMO-MTR-1038' },
  },
  {
    id: 'SDM-OPS-1027', pillar: 'operations', name: 'Regional travel · Air', category: 'Air travel', period: '2026-09', country: 'Ghana', subsidiary: 'Access Bank', businessUnit: 'Corporate Banking', location: 'Accra', status: 'Approved', submittedBy: 'Kelechi Eze', submittedAt: '2026-10-02',
    values: { category: 'Air travel', consumptionValue: '14', unit: 'trips', sourceReference: 'DEMO-TRV-1027' },
  },
  {
    id: 'SDM-FIN-0814', pillar: 'finance', name: 'Sunrise Solar Cooperative', category: 'Green loans', period: '2026-10', country: 'Nigeria', subsidiary: 'Access Bank', businessUnit: 'Corporate Banking', location: 'Abuja', status: 'In review', submittedBy: 'Amara Okafor', submittedAt: '2026-10-22',
    values: { category: 'Green loans', businessFunction: 'Corporate Banking', productType: 'Renewable energy facility', useOfFunds: 'Illustrative financing for distributed solar installations.', amountFinanced: '75,000,000', currency: 'NGN', beneficiaries: '18', sdgs: '7, 8, 13' },
  },
  {
    id: 'SDM-FIN-0809', pillar: 'finance', name: 'Community Health Network', category: 'Social loans', period: '2026-09', country: 'Kenya', subsidiary: 'Access Bank', businessUnit: 'Retail Banking', location: 'Nairobi', status: 'Submitted', submittedBy: 'Kelechi Eze', submittedAt: '2026-10-04',
    values: { category: 'Social loans', businessFunction: 'Retail Banking', productType: 'Social impact facility', useOfFunds: 'Illustrative funding for community health services.', amountFinanced: '18,500,000', currency: 'KES', beneficiaries: '6', sdgs: '3, 10' },
  },
  {
    id: 'SDM-FIN-0796', pillar: 'finance', name: 'DFI facility utilization', category: 'DFI funds', period: '2026-08', country: 'Nigeria', subsidiary: 'Access Bank', businessUnit: 'Corporate Banking', location: 'Lagos', status: 'Approved', submittedBy: 'Amara Okafor', submittedAt: '2026-09-06',
    values: { category: 'DFI funds', businessFunction: 'Corporate Banking', productType: 'Development finance', useOfFunds: 'Illustrative utilization record.', amountFinanced: '120,000,000', currency: 'NGN', beneficiaries: '42', sdgs: '8, 9' },
  },
  {
    id: 'SDM-CSI-0412', pillar: 'csi', name: 'Learning for Tomorrow', category: 'Education', period: '2026-10', country: 'Nigeria', subsidiary: 'Access Bank', businessUnit: 'Sustainability', location: 'Ikeja, Lagos', status: 'Submitted', submittedBy: 'Amara Okafor', submittedAt: '2026-10-20',
    values: { initiativeDetails: 'Illustrative community learning and digital literacy programme.', livesImpacted: '320', populationSegment: 'Secondary school students', implementationLocation: 'Ikeja, Lagos', implementingPartner: 'Demo Community Foundation', amountSupported: '12,000,000', currency: 'NGN', sdgs: '4, 10', evidence: '' },
  },
  {
    id: 'SDM-CSI-0407', pillar: 'csi', name: 'Community Health Outreach', category: 'Health', period: '2026-09', country: 'Ghana', subsidiary: 'Access Bank', businessUnit: 'Sustainability', location: 'Kumasi', status: 'Approved', submittedBy: 'Kelechi Eze', submittedAt: '2026-10-01',
    values: { initiativeDetails: 'Illustrative preventive health outreach.', livesImpacted: '190', populationSegment: 'Community residents', implementationLocation: 'Kumasi', implementingPartner: 'Demo Health Partners', amountSupported: '4,500,000', currency: 'GHS', sdgs: '3, 10', evidence: '' },
  },
  {
    id: 'SDM-CSI-0399', pillar: 'csi', name: 'Green Neighbourhoods', category: 'Environment', period: '2026-08', country: 'Kenya', subsidiary: 'Access Bank', businessUnit: 'Sustainability', location: 'Nairobi', status: 'In review', submittedBy: 'Amara Okafor', submittedAt: '2026-09-05',
    values: { initiativeDetails: 'Illustrative urban greening activity.', livesImpacted: '85', populationSegment: 'Urban communities', implementationLocation: 'Nairobi', implementingPartner: 'Demo Green Network', amountSupported: '2,200,000', currency: 'KES', sdgs: '11, 13', evidence: '' },
  },
  {
    id: 'SDM-VOL-0208', pillar: 'volunteering', name: 'Skills for Small Business', category: 'Entrepreneurship', period: '2026-10', country: 'Nigeria', subsidiary: 'Access Bank', businessUnit: 'People & Culture', location: 'Lagos', status: 'Approved', submittedBy: 'Amara Okafor', submittedAt: '2026-10-18',
    values: { volunteeringGroup: 'Access Volunteers Lagos', participatingStaff: '34', volunteeringHours: '102', cashContribution: '250,000', currency: 'NGN', beneficiaries: '74', partners: 'Demo Enterprise Network', awards: '', sdgs: '8, 10' },
  },
  {
    id: 'SDM-VOL-0201', pillar: 'volunteering', name: 'Books & Brighter Futures', category: 'Education', period: '2026-09', country: 'Rwanda', subsidiary: 'Access Bank', businessUnit: 'People & Culture', location: 'Kigali', status: 'In review', submittedBy: 'Kelechi Eze', submittedAt: '2026-10-03',
    values: { volunteeringGroup: 'Access Volunteers Kigali', participatingStaff: '16', volunteeringHours: '48', cashContribution: '0', currency: 'RWF', beneficiaries: '58', partners: 'Demo Learning Trust', awards: '', sdgs: '4, 10' },
  },
  {
    id: 'SDM-VOL-0194', pillar: 'volunteering', name: 'Coastal Clean-up Day', category: 'Environment', period: '2026-08', country: 'Ghana', subsidiary: 'Access Bank', businessUnit: 'People & Culture', location: 'Accra', status: 'Submitted', submittedBy: 'Amara Okafor', submittedAt: '2026-09-08',
    values: { volunteeringGroup: 'Access Volunteers Accra', participatingStaff: '23', volunteeringHours: '69', cashContribution: '', currency: 'GHS', beneficiaries: '160', partners: 'Demo Coastal Alliance', awards: '', sdgs: '11, 13' },
  },
  {
    id: 'SDM-ADV-0116', pillar: 'advocacy', name: 'Regional Climate Finance Forum', category: 'Platform / forum', period: '2026-10', country: 'Nigeria', subsidiary: 'Access Holdings', businessUnit: 'Sustainability', location: 'Lagos', status: 'In review', submittedBy: 'Amara Okafor', submittedAt: '2026-10-19',
    values: { staffInvolved: 'Group Sustainability Lead', eventDate: '2026-10-14', eventLocation: 'Lagos', awardClass: 'Not applicable', details: 'Illustrative participation in a regional forum.', evidence: '' },
  },
  {
    id: 'SDM-ADV-0109', pillar: 'advocacy', name: 'Sustainable Banking Working Group', category: 'Working group', period: '2026-09', country: 'Nigeria', subsidiary: 'Access Holdings', businessUnit: 'Sustainability', location: 'Abuja', status: 'Approved', submittedBy: 'Kelechi Eze', submittedAt: '2026-10-01',
    values: { staffInvolved: 'Executive Director, Risk', eventDate: '2026-09-23', eventLocation: 'Abuja', awardClass: 'Not applicable', details: 'Illustrative working group participation.', evidence: '' },
  },
  {
    id: 'SDM-ADV-0101', pillar: 'advocacy', name: 'Responsible Business Recognition', category: 'Award / recognition', period: '2026-08', country: 'Kenya', subsidiary: 'Access Bank', businessUnit: 'Sustainability', location: 'Nairobi', status: 'Submitted', submittedBy: 'Amara Okafor', submittedAt: '2026-09-02',
    values: { staffInvolved: 'Regional Managing Director', eventDate: '2026-08-18', eventLocation: 'Nairobi', awardClass: 'International', details: 'Illustrative recognition record.', evidence: '' },
  },
]

export const iconForPillar = {
  operations: Leaf,
  finance: BriefcaseBusiness,
  csi: HeartHandshake,
  volunteering: UsersRound,
  advocacy: Megaphone,
  overview: Building2,
}
