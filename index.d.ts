export type FilingStatus = 'single' | 'married_filing_jointly' | 'head_of_household' | 'married' | 'mfj' | 'hoh';
export interface Bracket { floor: number; ceiling?: number | null; rate: number }
export interface TakeHome { gross: number; federalTax: number; socialSecurity: number; medicare: number; stateTax: number; totalTax: number; takeHome: number; effectiveRate: number }
export const TAX_YEAR: number;
export const federal: any;
export const states: Record<string, { name: string; taxesWages: boolean; topMarginalRate: number; brackets: Record<'single' | 'married_filing_jointly', Bracket[]>; standardDeduction: Record<string, number>; personalExemption: Record<string, number>; credit: Record<string, number> }>;
export const cpi: Record<string, number>;
export function federalTax(taxableIncome: number, status?: FilingStatus): number;
export function marginalRate(taxableIncome: number, status?: FilingStatus): number;
export function fica(gross: number, status?: FilingStatus): { socialSecurity: number; medicare: number };
export function stateTax(gross: number, stateCode: string, opts?: { status?: FilingStatus; preTax?: number }): number;
export function takeHome(gross: number, stateCode: string, opts?: { status?: FilingStatus; preTax?: number }): TakeHome;
export function adjustForInflation(amount: number, fromYear: number, toYear: number): number | null;
