'use strict';
// us-tax-data: 2026 US federal & state income-tax tables, and CPI history,
// plus small helpers to estimate taxes. Data compiled by CalcVerseAI (https://calcverseai.com).

const federal = require('./data/federal-2026.json');
const states = require('./data/states-2026.json');
const cpi = require('./data/cpi-annual.json');

const FILING = ['single', 'married_filing_jointly', 'head_of_household'];

function norm(status = 'single') {
  const s = { married: 'married_filing_jointly', mfj: 'married_filing_jointly', hoh: 'head_of_household' }[status] || status;
  if (!FILING.includes(s)) throw new Error(`Unknown filing status: ${status}`);
  return s;
}

function throughBrackets(taxable, brackets) {
  let tax = 0;
  for (let i = 0; i < brackets.length; i++) {
    const floor = brackets[i].floor;
    if (taxable <= floor) break;
    const next = i + 1 < brackets.length ? brackets[i + 1].floor : (brackets[i].ceiling ?? Infinity);
    tax += (Math.min(taxable, next) - floor) * brackets[i].rate;
  }
  return tax;
}

/** Federal income tax on TAXABLE income (after deductions). */
function federalTax(taxableIncome, status = 'single') {
  return Math.max(0, throughBrackets(taxableIncome, federal.brackets[norm(status)]));
}

/** Marginal federal rate for a given taxable income. */
function marginalRate(taxableIncome, status = 'single') {
  const b = federal.brackets[norm(status)];
  const hit = [...b].reverse().find((x) => taxableIncome > x.floor);
  return hit ? hit.rate : b[0].rate;
}

/** Social Security + Medicare (employee share) on wages. */
function fica(gross, status = 'single') {
  const f = federal.fica;
  const socialSecurity = Math.min(gross, f.socialSecurityWageBase) * f.socialSecurityRate;
  const medicare = gross * f.medicareRate + Math.max(0, gross - f.additionalMedicareThreshold[norm(status)]) * f.additionalMedicareRate;
  return { socialSecurity, medicare };
}

/**
 * Estimated state income tax on wages. Model: (gross - pre-tax contributions - standard deduction
 * - personal exemption) taxed through the state's brackets, less any fixed credit.
 * Head of household uses the single schedule. No local taxes, dependents or itemizing.
 */
function stateTax(gross, stateCode, { status = 'single', preTax = 0 } = {}) {
  const s = states[String(stateCode).toUpperCase()];
  if (!s) throw new Error(`Unknown state code: ${stateCode}`);
  if (!s.taxesWages) return 0;
  const k = norm(status) === 'married_filing_jointly' ? 'married_filing_jointly' : 'single';
  const taxable = Math.max(0, gross - preTax - s.standardDeduction[k] - s.personalExemption[k]);
  let credit = s.credit[k];
  if (s.creditPhaseOut) credit = Math.max(0, credit - s.creditPhaseOut.ratePerDollar * Math.max(0, taxable - s.creditPhaseOut.overTaxableIncome[k]));
  if (s.creditDisallowedAboveAgi && gross - preTax > s.creditDisallowedAboveAgi[k]) credit = 0;
  return Math.max(0, throughBrackets(taxable, s.brackets[k]) - credit);
}

/** Estimated annual take-home pay for a W-2 employee. */
function takeHome(gross, stateCode, { status = 'single', preTax = 0 } = {}) {
  const st = norm(status);
  const fed = federalTax(Math.max(0, gross - preTax - federal.standardDeduction[st]), st);
  const f = fica(gross, st);
  const state = stateTax(gross, stateCode, { status: st, preTax });
  const totalTax = fed + f.socialSecurity + f.medicare + state;
  return { gross, federalTax: fed, socialSecurity: f.socialSecurity, medicare: f.medicare, stateTax: state, totalTax, takeHome: gross - preTax - totalTax, effectiveRate: gross > 0 ? totalTax / gross : 0 };
}

/** Convert an amount between years using annual-average CPI-U (null if a year is missing). */
function adjustForInflation(amount, fromYear, toYear) {
  const a = cpi[fromYear], b = cpi[toYear];
  return a && b ? (amount * b) / a : null;
}

module.exports = { federal, states, cpi, federalTax, marginalRate, fica, stateTax, takeHome, adjustForInflation, TAX_YEAR: federal.taxYear };
