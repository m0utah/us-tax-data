const test = require('node:test');
const assert = require('node:assert');
const t = require('..');
const ref = require('./reference.json');

test('matches the CalcVerseAI engine on reference cases', () => {
  for (const r of ref) {
    const st = r.status === 'married' ? 'married_filing_jointly' : 'single';
    const std = t.federal.standardDeduction[st];
    assert.ok(Math.abs(t.federalTax(Math.max(0, r.gross - std), st) - r.fedTax) < 0.01, `fed ${JSON.stringify(r)}`);
    assert.ok(Math.abs(t.stateTax(r.gross, r.state, { status: st }) - r.stateTax) < 0.01, `state ${JSON.stringify(r)}`);
  }
});

test('hand-checked federal value: single, $100k wages', () => {
  // taxable 100000-16100 = 83900 -> 1240 + 4560 + (83900-50400)*0.22 = 13170
  assert.strictEqual(Math.round(t.federalTax(83900, 'single')), 13170);
});

test('no-tax states return 0', () => {
  for (const c of ['TX', 'FL', 'WA', 'NV', 'TN', 'WY', 'SD', 'AK', 'NH']) assert.strictEqual(t.stateTax(150000, c), 0);
});

test('takeHome adds up', () => {
  const r = t.takeHome(100000, 'CA', { preTax: 5000 });
  assert.ok(Math.abs(r.takeHome - (100000 - 5000 - r.totalTax)) < 1e-6);
  assert.ok(r.effectiveRate > 0.15 && r.effectiveRate < 0.35);
});

test('FICA caps Social Security at the wage base', () => {
  assert.strictEqual(t.fica(1_000_000).socialSecurity, 184500 * 0.062);
});

test('inflation helper', () => {
  assert.ok(Math.abs(t.adjustForInflation(100, 2024, 2025) - 100 * 321.9 / 313.7) < 1e-9);
  assert.strictEqual(t.adjustForInflation(100, 1900, 2025), null);
});

test('data files are consistent: 51 jurisdictions, 3 filing statuses', () => {
  assert.strictEqual(Object.keys(t.states).length, 51);
  assert.strictEqual(Object.keys(t.federal.brackets).length, 3);
});

test('2026 laws enacted after January are applied', () => {
  assert.ok(Math.abs(t.stateTax(100000, 'GA') - 88000 * 0.0499) < 0.01);
  assert.strictEqual(t.states.WV.brackets.single.at(-1).rate, 0.0458);
  assert.strictEqual(t.states.SC.brackets.single.at(-1).rate, 0.0521);
  assert.strictEqual(t.states.UT.brackets.single[0].rate, 0.0445);
  assert.strictEqual(t.states.ME.brackets.single.at(-1).rate, 0.0915);
  // Utah credit is fully phased out well below $100k
  assert.ok(Math.abs(t.stateTax(100000, 'UT') - 100000 * 0.0445) < 0.01);
});

test('Oregon exemption credit is lost above $100k AGI (single)', () => {
  assert.ok(t.stateTax(100001, 'OR') - t.stateTax(100000, 'OR') > 200);
});

test('states with a known modelling gap say so', () => {
  for (const c of ['AL', 'MO', 'OR', 'SC']) assert.ok(t.states[c].modelNote, c);
});
