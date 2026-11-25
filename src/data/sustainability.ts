import type { ComponentType } from 'react'
import {
  BriefcaseBusiness,
  Building2,
  HeartHandshake,
  Leaf,
  Megaphone,
  UsersRound,
} from 'lucide-react'
import { getInputterAllowedPillars, type AppRole } from './users'

export type PillarKey = 'operations' | 'finance' | 'csi' | 'volunteering' | 'advocacy'
export type RecordStatus = 'Submitted' | 'Approved' | 'Rejected'
export type VerificationStage = 'Unverified' | 'Internal Review' | 'Externally Assured'
export type ReviewWorkflowStage = 'Group Head Review' | 'Sustainability Review'
export type FieldType = 'text' | 'number' | 'date' | 'select' | 'textarea' | 'file' | 'multi-text' | 'multi-select'

export interface EvidenceAttachment {
  id: string
  name: string
  type: string
  size: number
  file: File
}

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
  attachments?: EvidenceAttachment[]
  reviewedBy?: string
  reviewedAt?: string
  reviewFeedback?: string
  reviewChecks?: string[]
  reviewWorkflowStage?: ReviewWorkflowStage
  inputterDepartment?: string
  groupHeadReviewedBy?: string
  groupHeadReviewedAt?: string
  groupHeadReviewFeedback?: string
  groupHeadReviewChecks?: string[]
  verificationStage?: VerificationStage
  verificationUpdatedBy?: string
  verificationUpdatedAt?: string
  verificationReference?: string
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
  showWhen?: { field: string; equals?: string; notEquals?: string }
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

// Access Group markets represented in this workspace. Keep this list aligned with the
// current Group operating footprint as the business expands or restructures.
export const countries = [
  'Angola',
  'Botswana',
  'Cameroon',
  'Democratic Republic of the Congo',
  'Gambia',
  'Ghana',
  'Guinea',
  'Kenya',
  'Mozambique',
  'Nigeria',
  'Rwanda',
  'Sierra Leone',
  'South Africa',
  'Tanzania',
  'United Kingdom',
  'Zambia',
]
export const subsidiaries = ['Access Bank', 'Access Pensions', 'Access Insurance', 'Access Holdings']
export const businessUnits = ['Group Operations', 'Retail Banking', 'Corporate Banking', 'People & Culture', 'Sustainability']
export interface DataInputterField {
  name: string
  definition: string
  responsibleFunctions: string[]
  pillar: PillarKey
  focusArea?: string
}

const dataInputterFieldRows: [name: string, responsibleFunctions: string][] = [
  ['Non-Discrimination', 'HR'],
  ['Ethical Standards', 'Compliance'],
  ['Female Employees', 'HR'],
  ['Women in Senior Management', 'HR'],
  ['PWDs in Workforce', 'HR'],
  ['Accessible Buildings', 'Facilities'],
  ['Human Rights Violations', 'Legal / Compliance'],
  ['Lost Time Injury Frequency Rate', 'HR / HSE'],
  ['Total Recordable Incident Rate', 'HR / HSE'],
  ['Absenteeism Rate', 'HR'],
  ['Wellness Programme Participation', 'HR'],
  ['Employee Training Hours', 'HR'],
  ['Average Training Hours per Employee', 'HR'],
  ['Employees Trained', 'HR'],
  ['Volunteer Hours', 'CSI Unit'],
  ['Carbon Emissions – Scope 1', 'Sustainability / Operations'],
  ['Carbon Emissions – Scope 2', 'Sustainability / Operations'],
  ['Carbon Emissions – Scope 3', 'Sustainability / Operations'],
  ['Operational Emissions Intensity', 'Sustainability / Operations'],
  ['Operational Emissions Reduction', 'Sustainability / Operations'],
  ['Total Energy Consumption', 'Operations'],
  ['Grid Electricity Consumption', 'Operations'],
  ['Generator Fuel Consumption', 'Operations'],
  ['Renewable Energy Share', 'Operations'],
  ['Solar Installations', 'Facilities'],
  ['Solar-powered ATMs', 'Facilities'],
  ['EV / ULEV Fleet Share', 'Fleet / Facilities'],
  ['Paper Consumption', 'Operations / Procurement'],
  ['Sustainably Sourced Paper', 'Procurement'],
  ['Waste Generated', 'Operations'],
  ['Waste Recycled', 'Operations'],
  ['Waste Recycling Rate', 'Operations'],
  ['Waste to Landfill', 'Operations'],
  ['Locations with Waste Recycling', 'Facilities'],
  ['Water Withdrawal', 'Operations'],
  ['Water Intensity', 'Operations'],
  ['Business Travel Emissions', 'Operations / Admin'],
  ['Air Travel Reduction', 'Operations / Admin'],
  ['Employee Commute Emissions', 'HR / Sustainability'],
  ['Employee Commute Emissions Reduction', 'HR / Sustainability'],
  ['Carbon Sink / Offset Savings', 'Sustainability'],
  ['Offsets Retired', 'Sustainability'],
  ['Trees Planted', 'Sustainability / CSI Unit'],
  ['Tree Survival Rate', 'Sustainability / CSI Unit'],
  ['Green / IFC EDGE Certified Buildings', 'Facilities'],
  ['Certified Green Floor Area', 'Facilities'],
  ['Refrigerant Leakage Emissions', 'Facilities'],
  ['Data Centre PUE', 'IT / Facilities'],
  ['E&S Risk Management', 'Risk / Sustainability'],
  ['Sustainability KPIs in Scorecards', 'Sustainability / HR'],
  ['Sustainability Assessments & Audits', 'Sustainability / Audit'],
  ['Sustainability Training & Awareness', 'HR / Sustainability'],
  ['Stakeholder Partnerships & Engagements', 'Sustainability'],
]

const financeInputterFieldRows: [name: string, functions: string, definition: string][] = [
  ['Sustainable Finance Framework', 'Sustainability', 'Reported sustainable finance framework for the reporting boundary.'],
  ['DFI / Donor Funding Secured', 'Corporate / Project Finance', 'Funding raised from development finance institutions and donor agencies.'],
  ['DFI / Donor Facilities Closed', 'Corporate / Project Finance', 'Reported DFI / donor facilities closed for the reporting boundary.'],
  ['New MSMEs Onboarded', 'Retail / SME Banking', 'New micro, small and medium enterprises onboarded.'],
  ['Active MSME Customers', 'Retail / SME Banking', 'Reported active MSME customers for the reporting boundary.'],
  ['Women-owned MSMEs Financed', 'Retail / SME Banking', 'Reported women-owned MSMEs financed for the reporting boundary.'],
  ['Youth-owned MSMEs Financed', 'Retail / SME Banking', 'Reported youth-owned MSMEs financed for the reporting boundary.'],
  ['MSME Lending Disbursed', 'Retail / SME Banking', 'Reported MSME lending disbursed for the reporting boundary.'],
  ['Jobs Created / Sustained by MSMEs', 'Retail / SME Banking', 'Direct jobs reported by supported MSMEs.'],
  ['Financial Literacy Beneficiaries', 'CSI / Retail', 'Reported financial literacy beneficiaries for the reporting boundary.'],
  ['Low-income Individuals Reached', 'Retail', 'Low-income individuals receiving qualifying financial services.'],
  ['Women Financial Inclusion Customers', 'Retail', 'Reported women financial inclusion customers for the reporting boundary.'],
  ['Rural / Underserved Customers', 'Retail', 'Reported rural / underserved customers for the reporting boundary.'],
  ['Financial Inclusion NPL Ratio', 'Risk / Retail', 'Reported financial inclusion NPL ratio for the reporting boundary.'],
  ['Sustainable Lending Disbursed', 'Business / Sustainability', 'New lending meeting the sustainable finance taxonomy.'],
  ['Green Loan Portfolio Share', 'Business / Risk', 'Green loans as a percentage of gross loans.'],
  ['Climate Mitigation Finance', 'Business / Sustainability', 'Reported climate mitigation finance for the reporting boundary.'],
  ['Climate Adaptation Finance', 'Business / Sustainability', 'Reported climate adaptation finance for the reporting boundary.'],
  ['Social Finance', 'Business / Sustainability', 'Reported social finance for the reporting boundary.'],
  ['Sustainability-linked Lending', 'Business / Sustainability', 'Reported sustainability-linked lending for the reporting boundary.'],
  ['Corporate Clients ESRM Screened', 'Risk / Credit', 'Reported corporate clients ESRM screened for the reporting boundary.'],
  ['Portfolio ESRM Screening Coverage', 'Risk / Credit', 'In-scope portfolio with completed E&S risk screening.'],
  ['High-risk Transactions Assessed', 'Risk / Credit', 'Reported high-risk transactions assessed for the reporting boundary.'],
  ['Equator Principles Transactions', 'Project Finance / Risk', 'Reported Equator Principles transactions for the reporting boundary.'],
  ['IFC Performance Standards Transactions', 'Project Finance / Risk', 'Reported IFC Performance Standards transactions for the reporting boundary.'],
  ['Financed Emissions – Business Loans', 'Risk / Sustainability', 'Reported financed emissions – business loans for the reporting boundary.'],
  ['Financed Emissions – Project Finance', 'Risk / Sustainability', 'Reported financed emissions – project finance for the reporting boundary.'],
  ['Financed Emissions – Commercial Real Estate', 'Risk / Sustainability', 'Reported financed emissions – commercial real estate for the reporting boundary.'],
  ['Financed Emissions – Mortgages', 'Risk / Sustainability', 'Reported financed emissions – mortgages for the reporting boundary.'],
  ['Financed Emissions – Motor Vehicle Loans', 'Risk / Sustainability', 'Reported financed emissions – motor vehicle loans for the reporting boundary.'],
  ['Financed Emissions – Listed Equity & Bonds', 'Treasury / Sustainability', 'Reported financed emissions – listed equity & bonds for the reporting boundary.'],
  ['Financed Emissions Data Quality Score', 'Risk / Sustainability', 'Reported financed emissions data quality score for the reporting boundary.'],
  ['Financed Emissions Reduction', 'Risk / Sustainability', 'Reduction in financed emissions versus baseline.'],
  ['Carbon-intensive Sector Exposure Reduction', 'Risk / Business', 'Reported carbon-intensive sector exposure reduction for the reporting boundary.'],
  ['Clients Receiving Go-Green Support', 'Business / Sustainability', 'Reported clients receiving go-green support for the reporting boundary.'],
  ['Carbon Market Partnerships', 'Business / Sustainability', 'Reported carbon market partnerships for the reporting boundary.'],
]

const csiInputterFieldRows: [name: string, definition: string][] = [
  ['Learners Reached', 'Reported learners reached attributable to supported education programmes.'],
  ['Teachers Trained', 'Reported teachers trained attributable to supported education programmes.'],
  ['Classrooms / Learning Spaces Delivered', 'Reported classrooms / learning spaces delivered attributable to supported education programmes.'],
  ['Scholarships / Learning Materials Provided', 'Reported scholarships / learning materials provided attributable to supported education programmes.'],
  ['Education Investment', 'Reported education investment attributable to supported education programmes.'],
  ['Male Beneficiaries', 'Reported male beneficiaries attributable to supported education programmes.'],
  ['Female Beneficiaries', 'Reported female beneficiaries attributable to supported education programmes.'],
  ['Beneficiaries with Disabilities', 'Reported beneficiaries with disabilities attributable to supported education programmes.'],
  ['Programme Completion Rate', 'Reported programme completion rate attributable to supported education programmes.'],
  ['Attendance Improvement', 'Reported attendance improvement attributable to supported education programmes.'],
  ['Learning Assessment Improvement', 'Reported learning assessment improvement attributable to supported education programmes.'],
  ['Teachers Applying New Methods', 'Reported teachers applying new methods attributable to supported education programmes.'],
  ['Progression / Transition Rate', 'Reported progression / transition rate attributable to supported education programmes.'],
  ['Sustained Learning Outcome', 'Reported sustained learning outcome attributable to supported education programmes.'],
  ['Education SROI', 'Reported education SROI attributable to supported education programmes.'],
  ['Health Beneficiaries Reached', 'Reported health beneficiaries reached attributable to supported health programmes.'],
  ['Screenings Conducted', 'Reported screenings conducted attributable to supported health programmes.'],
  ['Treatments / Referrals Provided', 'Reported treatments / referrals provided attributable to supported health programmes.'],
  ['Health Facilities Supported', 'Reported health facilities supported attributable to supported health programmes.'],
  ['Health Workers Trained', 'Reported health workers trained attributable to supported health programmes.'],
  ['Health Investment', 'Reported health investment attributable to supported health programmes.'],
  ['Male Beneficiaries', 'Reported male beneficiaries attributable to supported health programmes.'],
  ['Female Beneficiaries', 'Reported female beneficiaries attributable to supported health programmes.'],
  ['Improved Health Knowledge', 'Reported improved health knowledge attributable to supported health programmes.'],
  ['Referral Completion Rate', 'Reported referral completion rate attributable to supported health programmes.'],
  ['Access to Essential Services', 'Reported access to essential services attributable to supported health programmes.'],
  ['Disease Risk Reduction', 'Reported disease risk reduction attributable to supported health programmes.'],
  ['Sustained Health Behaviour Change', 'Reported sustained health behaviour change attributable to supported health programmes.'],
  ['Health SROI', 'Reported health SROI attributable to supported health programmes.'],
  ['Entrepreneurs / MSMEs Reached', 'Reported entrepreneurs / MSMEs reached attributable to supported entrepreneurship programmes.'],
  ['Entrepreneurs Trained', 'Reported entrepreneurs trained attributable to supported entrepreneurship programmes.'],
  ['Businesses Funded', 'Reported businesses funded attributable to supported entrepreneurship programmes.'],
  ['Funding Deployed', 'Reported funding deployed attributable to supported entrepreneurship programmes.'],
  ['Mentoring Hours', 'Reported mentoring hours attributable to supported entrepreneurship programmes.'],
  ['Entrepreneurship Investment', 'Reported entrepreneurship investment attributable to supported entrepreneurship programmes.'],
  ['Women Beneficiaries', 'Reported women beneficiaries attributable to supported entrepreneurship programmes.'],
  ['Youth Beneficiaries', 'Reported youth beneficiaries attributable to supported entrepreneurship programmes.'],
  ['Businesses Formalised', 'Reported businesses formalised attributable to supported entrepreneurship programmes.'],
  ['Finance Access Rate', 'Reported finance access rate attributable to supported entrepreneurship programmes.'],
  ['Average Revenue Growth', 'Reported average revenue growth attributable to supported entrepreneurship programmes.'],
  ['Jobs Created / Sustained', 'Reported jobs created / sustained attributable to supported entrepreneurship programmes.'],
  ['12-month Business Survival Rate', 'Reported 12-month business survival rate attributable to supported entrepreneurship programmes.'],
  ['Entrepreneurship SROI', 'Reported entrepreneurship SROI attributable to supported entrepreneurship programmes.'],
  ['Environmental Beneficiaries Reached', 'Reported environmental beneficiaries reached attributable to supported environment programmes.'],
  ['Trees Planted', 'Reported trees planted attributable to supported environment programmes.'],
  ['Waste Collected', 'Reported waste collected attributable to supported environment programmes.'],
  ['Waste Recycled / Upcycled', 'Reported waste recycled / upcycled attributable to supported environment programmes.'],
  ['Sites Restored', 'Reported sites restored attributable to supported environment programmes.'],
  ['Environment Investment', 'Reported environment investment attributable to supported environment programmes.'],
  ['Male Beneficiaries', 'Reported male beneficiaries attributable to supported environment programmes.'],
  ['Female Beneficiaries', 'Reported female beneficiaries attributable to supported environment programmes.'],
  ['Tree Survival Rate', 'Reported tree survival rate attributable to supported environment programmes.'],
  ['Waste Diversion Rate', 'Reported waste diversion rate attributable to supported environment programmes.'],
  ['Climate Knowledge Improvement', 'Reported climate knowledge improvement attributable to supported environment programmes.'],
  ['GHG Emissions Avoided / Sequestered', 'Reported GHG emissions avoided / sequestered attributable to supported environment programmes.'],
  ['Green Jobs Created / Sustained', 'Reported green jobs created / sustained attributable to supported environment programmes.'],
  ['Environment SROI', 'Reported environment SROI attributable to supported environment programmes.'],
]

const csiCurrencyUnitOptions = ['NGN', 'USD', 'GHS', 'KES', 'RWF', 'ZMW', 'XOF', 'Other']
const csiRateUnitOptions = ['%', 'Percentage points', 'Ratio', 'Other']
const csiPeopleUnitOptions = ['People', 'Beneficiaries', 'Count', 'Other']
const csiUnitOptionsByIndicator: Record<string, string[]> = {
  'Education Investment': csiCurrencyUnitOptions,
  'Health Investment': csiCurrencyUnitOptions,
  'Entrepreneurship Investment': csiCurrencyUnitOptions,
  'Environment Investment': csiCurrencyUnitOptions,
  'Funding Deployed': csiCurrencyUnitOptions,
  'Learners Reached': ['Learners', 'People', 'Count', 'Other'],
  'Teachers Trained': ['Teachers', 'People', 'Count', 'Other'],
  'Classrooms / Learning Spaces Delivered': ['Classrooms', 'Learning spaces', 'Count', 'Other'],
  'Scholarships / Learning Materials Provided': ['Scholarships', 'Learning materials', 'Count', 'Other'],
  'Male Beneficiaries': csiPeopleUnitOptions,
  'Female Beneficiaries': csiPeopleUnitOptions,
  'Beneficiaries with Disabilities': csiPeopleUnitOptions,
  'Programme Completion Rate': csiRateUnitOptions,
  'Attendance Improvement': ['%', 'Percentage points', 'Days', 'Other'],
  'Learning Assessment Improvement': ['Score', 'Points', '%', 'Percentage points', 'Other'],
  'Teachers Applying New Methods': ['Teachers', 'People', '%', 'Count', 'Other'],
  'Progression / Transition Rate': csiRateUnitOptions,
  'Sustained Learning Outcome': ['Outcomes', 'Score', '%', 'Other'],
  'Education SROI': ['Ratio', 'Score', 'Other'],
  'Health Beneficiaries Reached': csiPeopleUnitOptions,
  'Screenings Conducted': ['Screenings', 'People', 'Count', 'Other'],
  'Treatments / Referrals Provided': ['Treatments', 'Referrals', 'Count', 'Other'],
  'Health Facilities Supported': ['Facilities', 'Count', 'Other'],
  'Health Workers Trained': ['Health workers', 'People', 'Count', 'Other'],
  'Improved Health Knowledge': ['Score', 'Points', '%', 'Percentage points', 'Other'],
  'Referral Completion Rate': csiRateUnitOptions,
  'Access to Essential Services': ['People', 'Services', 'Count', 'Other'],
  'Disease Risk Reduction': ['%', 'Percentage points', 'Cases', 'Other'],
  'Sustained Health Behaviour Change': ['People', '%', 'Count', 'Other'],
  'Health SROI': ['Ratio', 'Score', 'Other'],
  'Entrepreneurs / MSMEs Reached': ['Entrepreneurs', 'MSMEs', 'Businesses', 'Count', 'Other'],
  'Entrepreneurs Trained': ['Entrepreneurs', 'People', 'Count', 'Other'],
  'Businesses Funded': ['Businesses', 'Count', 'Other'],
  'Mentoring Hours': ['Hours', 'Other'],
  'Women Beneficiaries': csiPeopleUnitOptions,
  'Youth Beneficiaries': csiPeopleUnitOptions,
  'Businesses Formalised': ['Businesses', 'Count', 'Other'],
  'Finance Access Rate': csiRateUnitOptions,
  'Average Revenue Growth': ['%', 'Percentage points', 'Other'],
  'Jobs Created / Sustained': ['Jobs', 'People', 'Count', 'Other'],
  '12-month Business Survival Rate': csiRateUnitOptions,
  'Entrepreneurship SROI': ['Ratio', 'Score', 'Other'],
  'Environmental Beneficiaries Reached': csiPeopleUnitOptions,
  'Trees Planted': ['Trees', 'Count', 'Other'],
  'Waste Collected': ['kg', 'Tonnes', 'Other'],
  'Waste Recycled / Upcycled': ['kg', 'Tonnes', 'Other'],
  'Sites Restored': ['Sites', 'Hectares', 'Other'],
  'Tree Survival Rate': csiRateUnitOptions,
  'Waste Diversion Rate': csiRateUnitOptions,
  'Climate Knowledge Improvement': ['Score', 'Points', '%', 'Percentage points', 'Other'],
  'GHG Emissions Avoided / Sequestered': ['tCO₂e', 'kgCO₂e', 'Other'],
  'Green Jobs Created / Sustained': ['Jobs', 'People', 'Count', 'Other'],
  'Environment SROI': ['Ratio', 'Score', 'Other'],
}

const csiUnitOptionsByFocusAreaAndIndicator: Record<string, string[]> = {
  'Education|Attendance Improvement': ['%', 'Percentage points', 'Days', 'Other'],
  'Education|Learning Assessment Improvement': ['Score', 'Points', '%', 'Percentage points', 'Other'],
  'Health|Improved Health Knowledge': ['Score', 'Points', '%', 'Percentage points', 'Other'],
  'Health|Disease Risk Reduction': ['%', 'Percentage points', 'Cases', 'Other'],
  'Environment|Climate Knowledge Improvement': ['Score', 'Points', '%', 'Percentage points', 'Other'],
}

export function getCsiInputterUnitOptions(focusArea: string, indicator: string) {
  if (!focusArea || !indicator) return []
  return csiUnitOptionsByFocusAreaAndIndicator[`${focusArea}|${indicator}`]
    ?? csiUnitOptionsByIndicator[indicator]
    ?? ['Count', 'Other']
}

export const dataInputterFields: DataInputterField[] = [
  ...dataInputterFieldRows.map(([name, functions]) => ({
    name,
    definition: name,
    responsibleFunctions: functions.split(' / '),
    pillar: 'operations' as const,
  })),
  ...financeInputterFieldRows.map(([name, functions, definition]) => ({
    name,
    definition,
    responsibleFunctions: functions.split(' / '),
    pillar: 'finance' as const,
  })),
  ...csiInputterFieldRows.map(([name, definition]) => ({
    name,
    definition,
    responsibleFunctions: ['CSI Unit'],
    pillar: 'csi' as const,
    focusArea: ['Education', 'Health', 'Entrepreneurship', 'Environment'].find((area) => definition.toLowerCase().includes(`${area.toLowerCase()} programme`)),
  })),
]

export const dataInputterUnitOptions = [
  'Count',
  '%',
  'Hours',
  'Hours per employee',
  'Incidents per million hours',
  'tCO₂e',
  'tCO₂e per employee',
  'kWh',
  'MWh',
  'GJ',
  'L',
  'm³',
  'Tonnes',
  'Buildings',
  'ATMs',
  'Vehicles',
  'Ratio',
  'Score',
  'Not applicable',
  'Other',
]

export function getDataInputterFields(department: string, pillar?: PillarKey) {
  const normalizedDepartment = department.trim().toLowerCase()
  return dataInputterFields.filter((field) => (!pillar || field.pillar === pillar)
    && field.responsibleFunctions.some((functionName) => functionName.toLowerCase() === normalizedDepartment))
}

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
  { name: 'subsidiary', label: 'Subsidiary', type: 'select', required: true, options: subsidiaries },
  { name: 'country', label: 'Country', type: 'select', required: true, options: countries },
  { name: 'businessUnit', label: 'Business unit', type: 'select', required: true, options: businessUnits },
  { name: 'location', label: 'Location / branch', type: 'text', required: true },
]

const reportingFieldsWithoutLocation = reportingFields.filter((field) => field.name !== 'location')

export const pillars: PillarDefinition[] = [
  {
    key: 'operations',
    title: 'Sustainable Operations',
    shortTitle: 'Operations',
    path: '/operations',
    description: 'Capture climate, energy, resource, workforce and DEI data across the Group.',
    icon: Leaf,
    formTitle: 'Add an operations record',
    formDescription: 'Report climate, energy, resource, people and inclusion KPIs against baselines and targets. Group volumes sum; rates and intensities average.',
    categoryLabel: 'Operational KPI',
    categories: ['Diesel', 'Petrol', 'Natural gas', 'Electricity', 'Renewable electricity', 'Water consumption', 'Waste generated', 'Waste recycled', 'Paper usage', 'Air travel', 'Ground transport', 'Employee commuting', 'Supplier sustainability training', 'Solar-powered ATMs', 'Emissions', 'Solar generation', 'Offsets retired', 'Green building', 'Workforce', 'Diversity & inclusion', 'Employee engagement'],
    fields: [
      ...reportingFields,
      { name: 'category', label: 'Operational KPI', type: 'select', required: true, options: ['Diesel', 'Petrol', 'Natural gas', 'Electricity', 'Renewable electricity', 'Water consumption', 'Waste generated', 'Waste recycled', 'Paper usage', 'Air travel', 'Ground transport', 'Employee commuting', 'Supplier sustainability training', 'Solar-powered ATMs', 'Emissions', 'Solar generation', 'Offsets retired', 'Green building', 'Workforce', 'Diversity & inclusion', 'Employee engagement'] },
      { name: 'metricGroup', label: 'Reporting group', type: 'select', required: true, options: ['Climate & emissions', 'Energy & renewables', 'Water & materials', 'Waste & circularity', 'Mobility', 'People & workforce', 'Diversity, equity & inclusion', 'Green buildings & offsets'] },
      { name: 'scope', label: 'GHG scope / classification', type: 'select', options: ['Scope 1', 'Scope 2', 'Scope 3', 'Non-GHG operational KPI', 'To be validated'] },
      { name: 'facilityOrAsset', label: 'Facility / asset / activity', type: 'text', required: true, hint: 'Branch, office, vehicle fleet, ATM network or other reporting boundary.' },
      { name: 'consumptionValue', label: 'Actual activity / consumption', type: 'number', required: true, min: 0, step: 0.01 },
      { name: 'unit', label: 'Source unit', type: 'text', required: true, hint: 'Use the unit shown in the source record; do not convert.' },
      { name: 'targetValue', label: 'Target for this period', type: 'number', min: 0, step: 0.01 },
      { name: 'targetUnit', label: 'Target unit', type: 'text', hint: 'Use the same unit as the reported actual value.' },
      { name: 'baselineValue', label: 'Baseline value', type: 'number', min: 0, step: 0.01 },
      { name: 'baselinePeriod', label: 'Baseline period', type: 'text', hint: 'For example, FY2024 or 2024-12.' },
      { name: 'aggregationRule', label: 'Group aggregation rule', type: 'select', options: ['Sum volumes', 'Average rates / intensities', 'Weighted average', 'Report separately by unit'] },
      { name: 'emissionsBaseline', label: 'Emissions baseline value', type: 'number', min: 0, step: 0.01 },
      { name: 'emissionsActual', label: 'Emissions actual value', type: 'number', min: 0, step: 0.01 },
      { name: 'emissionsUnit', label: 'Emissions unit', type: 'text', hint: 'For example, tCO₂e. Enter only a validated reported result.' },
      { name: 'renewableEnergyValue', label: 'Renewable energy generated / consumed', type: 'number', min: 0, step: 0.01 },
      { name: 'solarCapacity', label: 'Installed solar capacity', type: 'number', min: 0, step: 0.01 },
      { name: 'solarCapacityUnit', label: 'Solar capacity unit', type: 'text', hint: 'For example, kW or MW.' },
      { name: 'offsetsRetired', label: 'Carbon offsets retired', type: 'number', min: 0, step: 0.01 },
      { name: 'greenBuildingCertifiedArea', label: 'Certified green-building floor area', type: 'number', min: 0, step: 0.01 },
      { name: 'greenBuildingCertification', label: 'Green-building certification', type: 'text' },
      { name: 'workforceTotal', label: 'Workforce headcount', type: 'number', min: 0, step: 1 },
      { name: 'womenEmployees', label: 'Women in workforce', type: 'number', min: 0, step: 1 },
      { name: 'womenInLeadership', label: 'Women in leadership', type: 'number', min: 0, step: 1 },
      { name: 'employeesWithDisability', label: 'Employees with disabilities', type: 'number', min: 0, step: 1 },
      { name: 'populationGroup', label: 'People / DEI population group', type: 'text', hint: 'Specify the population represented by the reported measure.' },
      { name: 'peopleMetricRate', label: 'People / DEI rate or intensity', type: 'number', min: 0, step: 0.01 },
      { name: 'rateUnit', label: 'Rate / intensity unit', type: 'text', hint: 'For example, percentage or per-employee.' },
      { name: 'spend', label: 'Related spend', type: 'number', min: 0, step: 0.01 },
      { name: 'currency', label: 'Spend currency', type: 'text', hint: 'Currency code, if spend is reported.' },
      { name: 'supplier', label: 'Supplier / service provider', type: 'text' },
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
    formDescription: 'Capture financing classification, committed and disbursed amounts, beneficiary results and impact targets.',
    categoryLabel: 'Finance activity',
    categories: ['Green loans', 'Social loans', 'MSMEs onboarded', 'MSMEs financed', 'Low-income individuals financed', 'Nano-loans', 'DFI funds received', 'DFI funds utilization', 'Financial inclusion', 'Sustainability-linked lending'],
    fields: [
      ...reportingFields,
      { name: 'category', label: 'Finance activity', type: 'select', required: true, options: ['Green loans', 'Social loans', 'MSMEs onboarded', 'MSMEs financed', 'Low-income individuals financed', 'Nano-loans', 'DFI funds received', 'DFI funds utilization', 'Financial inclusion', 'Sustainability-linked lending'] },
      { name: 'customerName', label: 'Customer / recipient name', type: 'text', hint: 'Enter only where permitted by data policy.' },
      { name: 'businessFunction', label: 'Business function', type: 'text', required: true },
      { name: 'productType', label: 'Product type', type: 'text', required: true },
      { name: 'useOfFunds', label: 'Use of funds', type: 'textarea', required: true, fullWidth: true },
      { name: 'sustainableFinanceClassification', label: 'Sustainable finance classification', type: 'select', required: true, options: ['Green', 'Social', 'Sustainability-linked', 'Development finance', 'Other / pending classification'] },
      { name: 'amountFinanced', label: 'Amount financed', type: 'number', required: true, min: 0, step: 0.01 },
      { name: 'amountCommitted', label: 'Amount committed', type: 'number', min: 0, step: 0.01 },
      { name: 'amountDisbursed', label: 'Amount disbursed', type: 'number', min: 0, step: 0.01 },
      { name: 'outstandingBalance', label: 'Outstanding balance', type: 'number', min: 0, step: 0.01 },
      { name: 'currency', label: 'Currency', type: 'text', required: true, hint: 'Use the currency code in the source record (for example, NGN).' },
      { name: 'facilityCount', label: 'Number of facilities / accounts', type: 'number', min: 0, step: 1 },
      { name: 'beneficiaries', label: 'Beneficiaries / businesses', type: 'number', min: 0, step: 1 },
      { name: 'womenBeneficiaries', label: 'Women-owned / women beneficiaries', type: 'number', min: 0, step: 1 },
      { name: 'youthBeneficiaries', label: 'Youth beneficiaries', type: 'number', min: 0, step: 1 },
      { name: 'msmesOnboarded', label: 'MSMEs onboarded', type: 'number', min: 0, step: 1 },
      { name: 'msmesFinanced', label: 'MSMEs financed', type: 'number', min: 0, step: 1 },
      { name: 'lowIncomeIndividualsFinanced', label: 'Low-income individuals financed', type: 'number', min: 0, step: 1 },
      { name: 'nanoLoans', label: 'Nano-loans issued', type: 'number', min: 0, step: 1 },
      { name: 'dfiFundsReceived', label: 'DFI funds received', type: 'number', min: 0, step: 0.01 },
      { name: 'dfiFundsUtilized', label: 'DFI funds utilized', type: 'number', min: 0, step: 0.01 },
      { name: 'jobsCreated', label: 'Jobs created / supported', type: 'number', min: 0, step: 1 },
      { name: 'femaleOwnedMsmes', label: 'Women-owned MSMEs financed', type: 'number', min: 0, step: 1 },
      { name: 'youthOwnedMsmes', label: 'Youth-owned MSMEs financed', type: 'number', min: 0, step: 1 },
      { name: 'ruralCustomers', label: 'Rural customers / businesses reached', type: 'number', min: 0, step: 1 },
      { name: 'firstTimeBorrowers', label: 'First-time borrowers reached', type: 'number', min: 0, step: 1 },
      { name: 'inclusionQuality', label: 'Financial inclusion quality measure', type: 'select', options: ['Access', 'Affordability', 'Usage', 'Service quality', 'Customer outcome', 'Other / not assessed'] },
      { name: 'inclusionOutcome', label: 'Financial inclusion outcome', type: 'textarea', fullWidth: true },
      { name: 'esrmScreeningStatus', label: 'ESRM screening status', type: 'select', options: ['Screened', 'Not screened', 'In progress', 'Not applicable'] },
      { name: 'esrmRiskCategory', label: 'ESRM risk category', type: 'select', options: ['Category A / High', 'Category B / Medium', 'Category C / Low', 'Not classified', 'Not applicable'] },
      { name: 'esrmActionPlanStatus', label: 'ESRM action plan status', type: 'select', options: ['Not required', 'Required · open', 'In progress', 'Completed', 'Overdue'] },
      { name: 'esrmExclusionStatus', label: 'Exclusion-list screening', type: 'select', options: ['Cleared', 'Flagged', 'Pending', 'Not applicable'] },
      { name: 'pcafAssetClass', label: 'PCAF asset class', type: 'select', options: ['Listed equity & corporate bonds', 'Business loans & unlisted equity', 'Project finance', 'Commercial real estate', 'Mortgages', 'Motor vehicle loans', 'Sovereign debt', 'Other / pending classification'] },
      { name: 'pcafPortfolioExposure', label: 'PCAF portfolio exposure', type: 'number', min: 0, step: 0.01 },
      { name: 'pcafExposureCurrency', label: 'PCAF exposure currency', type: 'text' },
      { name: 'financedEmissions', label: 'PCAF financed emissions (reported)', type: 'number', min: 0, step: 0.01, hint: 'Enter the validated financed-emissions result; the portal does not calculate it.' },
      { name: 'financedEmissionsUnit', label: 'Financed-emissions unit', type: 'text', hint: 'For example, tCO₂e.' },
      { name: 'pcafDataQualityScore', label: 'PCAF data-quality score', type: 'select', options: ['1', '2', '3', '4', '5', 'Not assessed'] },
      { name: 'pcafMethodology', label: 'PCAF methodology / reference', type: 'text' },
      { name: 'targetBeneficiaries', label: 'Target beneficiaries', type: 'number', min: 0, step: 1 },
      { name: 'outcomeMeasure', label: 'Outcome / impact measure', type: 'textarea', fullWidth: true, hint: 'Describe the intended outcome and how it is measured.' },
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
    formDescription: 'Track investment, disbursement, delivery partners, target-versus-actual results and validated community outcomes.',
    categoryLabel: 'Focus area',
    categories: focusAreas,
    fields: [
      ...reportingFieldsWithoutLocation,
      { name: 'location', label: 'Location / branch', type: 'multi-text', required: true, fullWidth: true, hint: 'Add one or more locations or branches covered by this initiative.' },
      { name: 'name', label: 'Initiative name', type: 'text', required: true },
      { name: 'category', label: 'Focus area', type: 'select', required: true, options: focusAreas },
      { name: 'initiativeDetails', label: 'Initiative details', type: 'textarea', required: true, fullWidth: true },
      { name: 'projectStatus', label: 'Project status', type: 'select', required: true, options: ['Planned', 'Ongoing', 'Completed', 'On hold', 'Cancelled'] },
      { name: 'budget', label: 'Approved project budget', type: 'number', min: 0, step: 0.01 },
      { name: 'amountDisbursed', label: 'Amount disbursed to date', type: 'number', min: 0, step: 0.01 },
      { name: 'amountSupported', label: 'Total investment / amount supported', type: 'number', min: 0, step: 0.01 },
      { name: 'currency', label: 'Currency', type: 'text', hint: 'Enter the currency code for budget and disbursement values.' },
      { name: 'targetBeneficiaries', label: 'Target beneficiaries', type: 'number', min: 0, step: 1 },
      { name: 'livesImpacted', label: 'Actual beneficiaries reached', type: 'number', required: true, min: 0, step: 1 },
      { name: 'womenBeneficiaries', label: 'Women beneficiaries reached', type: 'number', min: 0, step: 1 },
      { name: 'youthBeneficiaries', label: 'Youth beneficiaries reached', type: 'number', min: 0, step: 1 },
      { name: 'populationSegment', label: 'Population segment', type: 'text', hint: 'Use the segment values approved for Group reporting.' },
      { name: 'implementationLocation', label: 'Implementation location', type: 'text', required: true },
      { name: 'implementingPartner', label: 'Implementing partner', type: 'text' },
      { name: 'partnerType', label: 'Partner type', type: 'select', options: ['NGO / nonprofit', 'Government', 'Community organisation', 'Academic institution', 'Private sector', 'Internal delivery', 'Other'] },
      { name: 'outcomeTarget', label: 'Target outcome / result', type: 'textarea', fullWidth: true },
      { name: 'outcomeActual', label: 'Actual outcome / result', type: 'textarea', fullWidth: true },
      { name: 'outputMeasure', label: 'Output indicator', type: 'text' },
      { name: 'outputTarget', label: 'Output target', type: 'number', min: 0, step: 0.01 },
      { name: 'outputActual', label: 'Output actual', type: 'number', min: 0, step: 0.01 },
      { name: 'outputUnit', label: 'Output unit', type: 'text' },
      { name: 'outcomeMeasure', label: 'Outcome indicator and unit', type: 'text', hint: 'For example, learners completing training; hectares restored.' },
      { name: 'impactMeasure', label: 'Long-term impact indicator', type: 'text' },
      { name: 'impactTarget', label: 'Impact target', type: 'textarea', fullWidth: true },
      { name: 'impactActual', label: 'Impact actual / validated result', type: 'textarea', fullWidth: true },
      { name: 'impactTimeHorizon', label: 'Impact measurement time horizon', type: 'text', hint: 'For example, 12 months after project completion.' },
      { name: 'strategicAlignment', label: 'Strategic priority / SDG alignment', type: 'text' },
      { name: 'impactValidationMethod', label: 'Impact validation method', type: 'select', options: ['Beneficiary survey', 'Partner report', 'Independent evaluation', 'Site visit', 'Administrative data', 'Other / pending validation'] },
      { name: 'impactValidatedBy', label: 'Impact validated by', type: 'text' },
      { name: 'impactValidationDate', label: 'Impact validation date', type: 'date' },
      { name: 'sdgs', label: 'Relevant SDGs', type: 'text', hint: 'List applicable SDG numbers or names.' },
    ],
  },
  {
    key: 'volunteering',
    title: 'Capacity Building',
    shortTitle: 'Capacity Building',
    path: '/capacity-building',
    description: 'Track learning sessions, participants, completion, learning gains and sustainability champion engagement.',
    icon: UsersRound,
    formTitle: 'Add a capacity-building activity',
    formDescription: 'Capture training delivery, audience reach, completion and learning outcomes, or log a Sustainability Champions activity.',
    categoryLabel: 'Capacity-building area',
    categories: ['Climate literacy', 'ESG fundamentals', 'Sustainable finance', 'Data & reporting', 'Education', 'Health', 'Entrepreneurship', 'Environment', 'Supplier training', 'Other'],
    fields: [
      ...reportingFields.map((field) => field.name === 'location' ? { ...field, required: false } : field),
      { name: 'name', label: 'Initiative name', type: 'text', required: true },
      { name: 'recordType', label: 'Tracker type', type: 'select', required: true, options: ['Capacity building', 'Employee volunteering', 'Sustainability champions'] },
      { name: 'category', label: 'Capacity-building area', type: 'select', required: true, options: ['Climate literacy', 'ESG fundamentals', 'Sustainable finance', 'Data & reporting', 'Education', 'Health', 'Entrepreneurship', 'Environment', 'Supplier training', 'Other'] },
      { name: 'sessionsDelivered', label: 'Sessions delivered', type: 'number', min: 0, step: 1 },
      { name: 'audienceGroups', label: 'Audience groups', type: 'multi-text', fullWidth: true, hint: 'Add each audience group reached, such as employees, MSMEs, suppliers or community members.' },
      { name: 'targetParticipants', label: 'Target participants', type: 'number', min: 0, step: 1 },
      { name: 'participantsTotal', label: 'Participants / attendees', type: 'number', required: true, min: 0, step: 1 },
      { name: 'participantsCompleted', label: 'Participants completing', type: 'number', min: 0, step: 1 },
      { name: 'completionRate', label: 'Completion rate (%)', type: 'number', min: 0, step: 0.01 },
      { name: 'trainingHours', label: 'Training hours delivered', type: 'number', min: 0, step: 0.25 },
      { name: 'preTrainingScore', label: 'Average pre-training score', type: 'number', min: 0, step: 0.01 },
      { name: 'postTrainingScore', label: 'Average post-training score', type: 'number', min: 0, step: 0.01 },
      { name: 'learningGain', label: 'Validated learning gain (%)', type: 'number', min: 0, step: 0.01 },
      { name: 'volunteeringGroup', label: 'Volunteering group', type: 'text' },
      { name: 'participatingStaff', label: 'Participating staff', type: 'number', min: 0, step: 1 },
      { name: 'volunteeringHours', label: 'Volunteering hours', type: 'number', min: 0, step: 0.25 },
      { name: 'cashContribution', label: 'Cash contribution', type: 'number', min: 0, step: 0.01 },
      { name: 'currency', label: 'Currency', type: 'text', hint: 'Enter a currency code if a cash contribution is provided.' },
      { name: 'beneficiaries', label: 'Beneficiaries / lives impacted', type: 'number', min: 0, step: 1 },
      { name: 'partners', label: 'Partners', type: 'text' },
      { name: 'awards', label: 'Awards / recognitions', type: 'text' },
      { name: 'workforceTotal', label: 'Entity workforce total', type: 'number', min: 0, step: 1 },
      { name: 'activeChampions', label: 'Active sustainability champions', type: 'number', min: 0, step: 1 },
      { name: 'championActivities', label: 'Champion activities delivered', type: 'number', min: 0, step: 1 },
      { name: 'ideasSubmitted', label: 'Sustainability ideas submitted', type: 'number', min: 0, step: 1 },
      { name: 'engagementParticipants', label: 'Engagement participants', type: 'number', min: 0, step: 1 },
      { name: 'championCoverageRate', label: 'Active champion coverage (%)', type: 'number', min: 0, step: 0.01, hint: 'Report the validated entity coverage rate; rates are averaged for Group reporting.' },
      { name: 'sdgs', label: 'Relevant SDGs', type: 'text' },
    ],
  },
  {
    key: 'advocacy',
    title: 'Thought Leadership & Awards',
    shortTitle: 'Thought Leadership & Awards',
    path: '/thought-leadership-awards',
    description: 'Track speaking engagements, working groups, global awards and credible recognition against entity targets.',
    icon: Megaphone,
    formTitle: 'Add a thought leadership or awards record',
    formDescription: 'Capture engagements, award credibility, audience reach and actual results against entity targets.',
    categoryLabel: 'Engagement type',
    categories: ['Speaking engagement', 'Working group', 'Taskforce', 'Publication / knowledge product', 'Award / recognition'],
    fields: [
      ...reportingFields,
      { name: 'name', label: 'Engagement / recognition name', type: 'text', required: true },
      { name: 'category', label: 'Engagement type', type: 'select', required: true, options: ['Speaking engagement', 'Working group', 'Taskforce', 'Publication / knowledge product', 'Award / recognition'] },
      { name: 'entityTarget', label: 'Entity target for reporting period', type: 'number', min: 0, step: 1 },
      { name: 'entityActual', label: 'Entity actual for reporting period', type: 'number', min: 0, step: 1 },
      { name: 'targetMeasure', label: 'Target measure / unit', type: 'text', hint: 'For example, qualified engagements, awards or publications.' },
      { name: 'staffInvolved', label: 'Executive / management staff involved', type: 'text', required: true, showWhen: { field: 'category', notEquals: 'Speaking engagement' } },
      { name: 'speakerName', label: 'Name of speaker', type: 'text', required: true, showWhen: { field: 'category', equals: 'Speaking engagement' } },
      { name: 'speakingEngagementType', label: 'Type of speaking engagement', type: 'select', required: true, options: ['Local', 'Global', 'International'], showWhen: { field: 'category', equals: 'Speaking engagement' } },
      { name: 'topic', label: 'Topic of discussion', type: 'text', required: true, fullWidth: true, showWhen: { field: 'category', equals: 'Speaking engagement' } },
      { name: 'organizers', label: 'Organizers', type: 'text', required: true, showWhen: { field: 'category', equals: 'Speaking engagement' } },
      { name: 'eventDate', label: 'Date', type: 'date', required: true },
      { name: 'eventLocation', label: 'Location', type: 'text', required: true },
      { name: 'audienceCount', label: 'Number of addressed audience', type: 'number', required: true, min: 0, step: 1, showWhen: { field: 'category', equals: 'Speaking engagement' } },
      { name: 'awardClass', label: 'Award classification', type: 'select', required: true, options: ['Local', 'International', 'Global awards'], showWhen: { field: 'category', equals: 'Award / recognition' } },
      { name: 'awardingBody', label: 'Awarding body', type: 'text', required: true, showWhen: { field: 'category', equals: 'Award / recognition' } },
      { name: 'recognitionReach', label: 'Recognition reach', type: 'select', options: ['Local', 'National', 'Regional', 'International', 'Global'], showWhen: { field: 'category', equals: 'Award / recognition' } },
      { name: 'awardCriteria', label: 'Award criteria / credibility basis', type: 'textarea', fullWidth: true, hint: 'Describe the independent assessment, eligibility or judging criteria.', showWhen: { field: 'category', equals: 'Award / recognition' } },
      { name: 'publishedReference', label: 'Published reference / URL', type: 'text', hint: 'Public award announcement, publication or event reference.' },
      { name: 'details', label: 'Details', type: 'textarea', fullWidth: true },
    ],
  },
]

export const pillarByKey = Object.fromEntries(pillars.map((pillar) => [pillar.key, pillar])) as Record<PillarKey, PillarDefinition>

export const formatPeriod = (period: string) => {
  const match = periods.find((item) => item.value === period)
  return match?.label ?? period
}

export function canReview(role: AppRole) {
  return role === 'Sustainability Reviewer' || role === 'Group Head' || role === 'Portal Administrator'
}

export function canViewPillar(role: AppRole, pillar: PillarKey, department = '') {
  const allowedPillars = getInputterAllowedPillars(role, department)
  return !allowedPillars || allowedPillars.some((allowedPillar) => allowedPillar === pillar)
}

export function canSubmitRecords(role: AppRole) {
  return role === 'Portal Administrator' || role === 'Data Inputter' || role === 'Sustainability Inputter'
}

const baseDemoRecords: SustainabilityRecord[] = [
  {
    id: 'SDM-OPS-1042', pillar: 'operations', name: 'Head Office · Diesel', category: 'Diesel', period: '2026-10', country: 'Nigeria', subsidiary: 'Access Holdings', businessUnit: 'Group Operations', location: 'Victoria Island, Lagos', status: 'Submitted', submittedBy: 'Amara Okafor', submittedAt: '2026-10-22',
    values: { category: 'Diesel', consumptionValue: '1,250', unit: 'L', sourceReference: 'DEMO-INV-1042', evidence: '' },
  },
  {
    id: 'SDM-OPS-1038', pillar: 'operations', name: 'Lagos Branch · Electricity', category: 'Electricity', period: '2026-10', country: 'Nigeria', subsidiary: 'Access Bank', businessUnit: 'Retail Banking', location: 'Victoria Island, Lagos', status: 'Submitted', submittedBy: 'Amara Okafor', submittedAt: '2026-10-21',
    values: { category: 'Electricity', consumptionValue: '8,460', unit: 'kWh', sourceReference: 'DEMO-MTR-1038', evidence: '' },
  },
  {
    id: 'SDM-OPS-1027', pillar: 'operations', name: 'Regional travel · Air', category: 'Air travel', period: '2026-09', country: 'Ghana', subsidiary: 'Access Bank', businessUnit: 'Corporate Banking', location: 'Accra', status: 'Approved', submittedBy: 'Amara Okafor', submittedAt: '2026-10-02', reviewedBy: 'Tunde Bakare', reviewedAt: '2026-10-05T10:30:00.000Z', reviewChecks: ['Required reporting fields are complete', 'Reported values are consistent with the reporting period and units', 'Source evidence has been reviewed or marked not applicable'],
    values: { category: 'Air travel', consumptionValue: '14', unit: 'trips', sourceReference: 'DEMO-TRV-1027', evidence: '' },
  },
  {
    id: 'SDM-FIN-0814', pillar: 'finance', name: 'Sunrise Solar Cooperative', category: 'Green loans', period: '2026-10', country: 'Nigeria', subsidiary: 'Access Bank', businessUnit: 'Corporate Banking', location: 'Abuja', status: 'Submitted', submittedBy: 'Amara Okafor', submittedAt: '2026-10-22',
    values: { category: 'Green loans', businessFunction: 'Corporate Banking', productType: 'Renewable energy facility', useOfFunds: 'Illustrative financing for distributed solar installations.', amountFinanced: '75,000,000', currency: 'NGN', beneficiaries: '18', sdgs: '7, 8, 13', evidence: '' },
  },
  {
    id: 'SDM-FIN-0809', pillar: 'finance', name: 'Community Health Network', category: 'Social loans', period: '2026-09', country: 'Kenya', subsidiary: 'Access Bank', businessUnit: 'Retail Banking', location: 'Nairobi', status: 'Submitted', submittedBy: 'Amara Okafor', submittedAt: '2026-10-04',
    values: { category: 'Social loans', businessFunction: 'Retail Banking', productType: 'Social impact facility', useOfFunds: 'Illustrative funding for community health services.', amountFinanced: '18,500,000', currency: 'KES', beneficiaries: '6', sdgs: '3, 10', evidence: '' },
  },
  {
    id: 'SDM-FIN-0796', pillar: 'finance', name: 'DFI facility utilization', category: 'DFI funds', period: '2026-08', country: 'Nigeria', subsidiary: 'Access Bank', businessUnit: 'Corporate Banking', location: 'Lagos', status: 'Approved', submittedBy: 'Amara Okafor', submittedAt: '2026-09-06', reviewedBy: 'Tunde Bakare', reviewedAt: '2026-09-09T13:15:00.000Z', reviewChecks: ['Required reporting fields are complete', 'Reported values are consistent with the reporting period and units', 'Source evidence has been reviewed or marked not applicable'],
    values: { category: 'DFI funds', businessFunction: 'Corporate Banking', productType: 'Development finance', useOfFunds: 'Illustrative utilization record.', amountFinanced: '120,000,000', currency: 'NGN', beneficiaries: '42', sdgs: '8, 9', evidence: '' },
  },
  {
    id: 'SDM-CSI-0412', pillar: 'csi', name: 'Learning for Tomorrow', category: 'Education', period: '2026-10', country: 'Nigeria', subsidiary: 'Access Bank', businessUnit: 'Sustainability', location: 'Ikeja, Lagos', status: 'Submitted', submittedBy: 'Amara Okafor', submittedAt: '2026-10-20',
    values: { initiativeDetails: 'Illustrative community learning and digital literacy programme.', livesImpacted: '320', populationSegment: 'Secondary school students', implementationLocation: 'Ikeja, Lagos', implementingPartner: 'Demo Community Foundation', amountSupported: '12,000,000', currency: 'NGN', sdgs: '4, 10', evidence: '' },
  },
  {
    id: 'SDM-CSI-0407', pillar: 'csi', name: 'Community Health Outreach', category: 'Health', period: '2026-09', country: 'Ghana', subsidiary: 'Access Bank', businessUnit: 'Sustainability', location: 'Kumasi', status: 'Approved', submittedBy: 'Amara Okafor', submittedAt: '2026-10-01', reviewedBy: 'Tunde Bakare', reviewedAt: '2026-10-03T09:00:00.000Z', reviewChecks: ['Required reporting fields are complete', 'Reported values are consistent with the reporting period and units', 'Source evidence has been reviewed or marked not applicable'],
    values: { initiativeDetails: 'Illustrative preventive health outreach.', livesImpacted: '190', populationSegment: 'Community residents', implementationLocation: 'Kumasi', implementingPartner: 'Demo Health Partners', amountSupported: '4,500,000', currency: 'GHS', sdgs: '3, 10', evidence: '' },
  },
  {
    id: 'SDM-CSI-0399', pillar: 'csi', name: 'Green Neighbourhoods', category: 'Environment', period: '2026-08', country: 'Kenya', subsidiary: 'Access Bank', businessUnit: 'Sustainability', location: 'Nairobi', status: 'Rejected', submittedBy: 'Amara Okafor', submittedAt: '2026-09-05', reviewedBy: 'Tunde Bakare', reviewedAt: '2026-09-08T14:10:00.000Z', reviewFeedback: 'Add evidence of the number of trees planted and a verified beneficiary count before resubmitting.',
    values: { initiativeDetails: 'Illustrative urban greening activity.', livesImpacted: '85', populationSegment: 'Urban communities', implementationLocation: 'Nairobi', implementingPartner: 'Demo Green Network', amountSupported: '2,200,000', currency: 'KES', sdgs: '11, 13', evidence: '' },
  },
  {
    id: 'SDM-VOL-0208', pillar: 'volunteering', name: 'Skills for Small Business', category: 'Entrepreneurship', period: '2026-10', country: 'Nigeria', subsidiary: 'Access Bank', businessUnit: 'People & Culture', location: 'Lagos', status: 'Approved', submittedBy: 'Amara Okafor', submittedAt: '2026-10-18', reviewedBy: 'Tunde Bakare', reviewedAt: '2026-10-20T08:45:00.000Z', reviewChecks: ['Required reporting fields are complete', 'Reported values are consistent with the reporting period and units', 'Source evidence has been reviewed or marked not applicable'],
    values: { volunteeringGroup: 'Access Volunteers Lagos', participatingStaff: '34', volunteeringHours: '102', cashContribution: '250,000', currency: 'NGN', beneficiaries: '74', partners: 'Demo Enterprise Network', awards: '', sdgs: '8, 10', evidence: '' },
  },
  {
    id: 'SDM-VOL-0201', pillar: 'volunteering', name: 'Books & Brighter Futures', category: 'Education', period: '2026-09', country: 'Rwanda', subsidiary: 'Access Bank', businessUnit: 'People & Culture', location: 'Kigali', status: 'Rejected', submittedBy: 'Amara Okafor', submittedAt: '2026-10-03', reviewedBy: 'Tunde Bakare', reviewedAt: '2026-10-06T11:20:00.000Z', reviewFeedback: 'Confirm the beneficiary headcount and attach the partner activity summary before resubmitting.',
    values: { volunteeringGroup: 'Access Volunteers Kigali', participatingStaff: '16', volunteeringHours: '48', cashContribution: '0', currency: 'RWF', beneficiaries: '58', partners: 'Demo Learning Trust', awards: '', sdgs: '4, 10', evidence: '' },
  },
  {
    id: 'SDM-VOL-0194', pillar: 'volunteering', name: 'Coastal Clean-up Day', category: 'Environment', period: '2026-08', country: 'Ghana', subsidiary: 'Access Bank', businessUnit: 'People & Culture', location: 'Accra', status: 'Submitted', submittedBy: 'Amara Okafor', submittedAt: '2026-09-08',
    values: { volunteeringGroup: 'Access Volunteers Accra', participatingStaff: '23', volunteeringHours: '69', cashContribution: '', currency: 'GHS', beneficiaries: '160', partners: 'Demo Coastal Alliance', awards: '', sdgs: '11, 13', evidence: '' },
  },
  {
    id: 'SDM-ADV-0116', pillar: 'advocacy', name: 'Regional Climate Finance Forum', category: 'Platform / forum', period: '2026-10', country: 'Nigeria', subsidiary: 'Access Holdings', businessUnit: 'Sustainability', location: 'Lagos', status: 'Submitted', submittedBy: 'Amara Okafor', submittedAt: '2026-10-19',
    values: { staffInvolved: 'Group Sustainability Lead', eventDate: '2026-10-14', eventLocation: 'Lagos', awardClass: 'Not applicable', details: 'Illustrative participation in a regional forum.', evidence: '' },
  },
  {
    id: 'SDM-ADV-0109', pillar: 'advocacy', name: 'Sustainable Banking Working Group', category: 'Working group', period: '2026-09', country: 'Nigeria', subsidiary: 'Access Holdings', businessUnit: 'Sustainability', location: 'Abuja', status: 'Approved', submittedBy: 'Amara Okafor', submittedAt: '2026-10-01', reviewedBy: 'Tunde Bakare', reviewedAt: '2026-10-04T16:00:00.000Z', reviewChecks: ['Required reporting fields are complete', 'Reported values are consistent with the reporting period and units', 'Source evidence has been reviewed or marked not applicable'],
    values: { staffInvolved: 'Executive Director, Risk', eventDate: '2026-09-23', eventLocation: 'Abuja', awardClass: 'Not applicable', details: 'Illustrative working group participation.', evidence: '' },
  },
  {
    id: 'SDM-ADV-0101', pillar: 'advocacy', name: 'Responsible Business Recognition', category: 'Award / recognition', period: '2026-08', country: 'Kenya', subsidiary: 'Access Bank', businessUnit: 'Sustainability', location: 'Nairobi', status: 'Submitted', submittedBy: 'Amara Okafor', submittedAt: '2026-09-02',
    values: { staffInvolved: 'Regional Managing Director', eventDate: '2026-08-18', eventLocation: 'Nairobi', awardClass: 'International', awardingBody: 'Illustrative Business Council', details: 'Illustrative recognition record.' },
  },
]

export const demoRecords: SustainabilityRecord[] = baseDemoRecords.map((record) => ({
  ...record,
  verificationStage: record.status === 'Submitted' ? 'Unverified' : 'Internal Review',
}))

export const dataInputterBranchOptions = [...new Set(demoRecords.map((record) => record.location).filter(Boolean))].sort()

export const iconForPillar = {
  operations: Leaf,
  finance: BriefcaseBusiness,
  csi: HeartHandshake,
  volunteering: UsersRound,
  advocacy: Megaphone,
  overview: Building2,
}
