# us-tax-data

2026 US **federal and state income tax tables**, FICA, capital-gains thresholds, retirement limits, **CPI (1913–2025)**, as CSV and JSON, plus small helpers to estimate take-home pay.

Compiled and maintained by [CalcVerseAI](https://calcverseai.com) (see the interactive [take-home pay by state](https://calcverseai.com/data/take-home-pay-by-state) page), which uses the same tables in its free [take-home pay](https://calcverseai.com/calculators/finance/take-home-pay) and [income tax](https://calcverseai.com/calculators/finance/income-tax) calculators. Figures last verified **2026-11-20**.

```bash
npm install us-tax-data
```

```js
const tax = require('us-tax-data');

tax.takeHome(100000, 'CA', { status: 'single', preTax: 5000 });
// { gross, federalTax, socialSecurity, medicare, stateTax, totalTax, takeHome, effectiveRate }

tax.federalTax(83900, 'single');          // tax on TAXABLE income
tax.stateTax(100000, 'NY', { status: 'married' });
tax.adjustForInflation(100, 1985, 2025);  // CPI-U annual averages
tax.states.TX.taxesWages;                 // false
```

## Data files (`data/`)

| File | Contents |
|---|---|
| `federal-brackets-2026.csv` | Federal brackets for single, married filing jointly, head of household |
| `federal-deductions-thresholds-2026.csv` | Standard deductions, capital-gains 0%/15% limits, NIIT and Additional Medicare thresholds |
| `federal-2026.json` | All federal figures above plus FICA and 401(k)/IRA limits |
| `state-income-tax-brackets-2026.csv` | State brackets (single and married filing jointly), all 50 states + DC |
| `state-income-tax-summary-2026.csv` | State standard deductions, personal exemptions, credits, top rate |
| `states-2026.json` | The same state data, structured |
| `cpi-annual-1913-2025.csv` / `cpi-annual.json` | BLS CPI-U annual averages and year-over-year inflation |

## Sources

- Federal brackets, standard deduction, capital-gains thresholds: IRS Rev. Proc. 2025-32
- Retirement limits: IRS Notice 2025-67 · Social Security wage base: SSA
- State brackets and deductions: Tax Foundation, *2026 State Income Tax Rates and Brackets* (snapshot as of 2026-01-01), plus 2026 laws enacted afterwards and applied retroactively: Georgia HB 463, Arkansas HB 1001/SB 1, South Carolina H.4216 (Act 110), Utah SB 60, West Virginia SB 392, Maine LD 2212. Hawaii's new 13% bracket (2027) and Washington's 9.9% tax on income over $1M (2028) are not in effect for 2026 and are not included.
- CPI-U: Bureau of Labor Statistics (series CUUR0000SA0). The 2025 value is the average of the 11 published months, because BLS did not publish October 2025.

## Example: $100,000 salary, single filer, 2026 — take-home by state

Estimates for a W-2 employee with no pre-tax deductions (federal + FICA + state income tax).

| Rank | State | State tax | Total tax | Take-home | Effective rate |
|---:|---|---:|---:|---:|---:|
| 1 | Alaska | $0 | $20,820 | $79,180 | 20.8% |
| 2 | Florida | $0 | $20,820 | $79,180 | 20.8% |
| 3 | Nevada | $0 | $20,820 | $79,180 | 20.8% |
| 4 | New Hampshire | $0 | $20,820 | $79,180 | 20.8% |
| 5 | South Dakota | $0 | $20,820 | $79,180 | 20.8% |
| 6 | Tennessee | $0 | $20,820 | $79,180 | 20.8% |
| 7 | Texas | $0 | $20,820 | $79,180 | 20.8% |
| 8 | Washington | $0 | $20,820 | $79,180 | 20.8% |
| 9 | Wyoming | $0 | $20,820 | $79,180 | 20.8% |
| 10 | North Dakota | $691 | $21,511 | $78,489 | 21.5% |
| 11 | Ohio | $1,968 | $22,788 | $77,212 | 22.8% |
| 12 | Arizona | $2,291 | $23,111 | $76,889 | 23.1% |
| 13 | Louisiana | $2,614 | $23,434 | $76,566 | 23.4% |
| 14 | Indiana | $2,921 | $23,741 | $76,260 | 23.7% |
| 15 | Pennsylvania | $3,070 | $23,890 | $76,110 | 23.9% |
| 16 | Rhode Island | $3,148 | $23,968 | $76,032 | 24.0% |
| 17 | Iowa | $3,148 | $23,968 | $76,032 | 24.0% |
| 18 | Mississippi | $3,268 | $24,088 | $75,912 | 24.1% |
| 19 | Kentucky | $3,382 | $24,202 | $75,798 | 24.2% |
| 20 | South Carolina * | $3,463 | $24,283 | $75,718 | 24.3% |
| 21 | North Carolina | $3,481 | $24,301 | $75,699 | 24.3% |
| 22 | Arkansas | $3,500 | $24,320 | $75,680 | 24.3% |
| 23 | New Mexico | $3,569 | $24,389 | $75,611 | 24.4% |
| 24 | Nebraska | $3,670 | $24,490 | $75,510 | 24.5% |
| 25 | West Virginia | $3,691 | $24,511 | $75,489 | 24.5% |
| 26 | Colorado | $3,692 | $24,512 | $75,488 | 24.5% |
| 27 | Missouri * | $3,763 | $24,583 | $75,417 | 24.6% |
| 28 | Wisconsin | $3,919 | $24,739 | $75,261 | 24.7% |
| 29 | Connecticut | $3,925 | $24,745 | $75,255 | 24.7% |
| 30 | Oklahoma | $3,955 | $24,775 | $75,226 | 24.8% |
| 31 | Michigan | $3,999 | $24,819 | $75,181 | 24.8% |
| 32 | Vermont | $4,140 | $24,960 | $75,040 | 25.0% |
| 33 | New Jersey | $4,182 | $25,002 | $74,998 | 25.0% |
| 34 | Idaho | $4,192 | $25,012 | $74,988 | 25.0% |
| 35 | Montana | $4,289 | $25,109 | $74,891 | 25.1% |
| 36 | Maryland | $4,386 | $25,206 | $74,794 | 25.2% |
| 37 | Georgia | $4,391 | $25,211 | $74,789 | 25.2% |
| 38 | Utah | $4,450 | $25,270 | $74,730 | 25.3% |
| 39 | Alabama * | $4,735 | $25,555 | $74,445 | 25.6% |
| 40 | Massachusetts | $4,780 | $25,600 | $74,400 | 25.6% |
| 41 | Kansas | $4,780 | $25,600 | $74,400 | 25.6% |
| 42 | Illinois | $4,805 | $25,625 | $74,375 | 25.6% |
| 43 | New York | $4,860 | $25,680 | $74,320 | 25.7% |
| 44 | Virginia | $4,936 | $25,756 | $74,244 | 25.8% |
| 45 | California | $5,070 | $25,890 | $74,110 | 25.9% |
| 46 | Delaware | $5,259 | $26,079 | $73,921 | 26.1% |
| 47 | Minnesota | $5,277 | $26,097 | $73,903 | 26.1% |
| 48 | Washington D.C. | $5,532 | $26,352 | $73,649 | 26.4% |
| 49 | Maine | $5,654 | $26,474 | $73,526 | 26.5% |
| 50 | Hawaii | $6,070 | $26,890 | $73,110 | 26.9% |
| 51 | Oregon * | $7,920 | $28,740 | $71,260 | 28.7% |

* This state has a known simplification in the model (see `modelNote` in the data and the Limits section), so its figure is less precise.

## Limits (read before relying on it)

This project is independent and is **not affiliated with or endorsed by** the IRS, the Social Security Administration, the BLS or any state tax agency.

This is an **estimate, not tax advice or a tax return.** It does not model local or city taxes, dependents, credits other than fixed state credits, itemized deductions, or state-specific adjustments (for example California SDI). Head of household uses the single state schedule. **Known gaps by state:** Alabama and Oregon let you subtract federal income tax, and Missouri may allow a limited deduction; none of that is modelled, so those states' tax is overstated for many filers. South Carolina's new deduction can shrink with income; that phase-out is not modelled, so tax may be understated at higher incomes. State rules can also change mid-year (several 2026 cuts were passed after January), so check the source before relying on a figure. Always check figures against the primary sources above before filing.

## Changelog

- **1.0.1** (2026-11-20): applied 2026 laws enacted after the January snapshot (GA 4.99%, AR top rate 3.7%, SC 1.99%/5.21% with new deduction, UT 4.45% with credit phase-out, WV about 5% cut, ME 2% surcharge over $1M); Oregon exemption credit cutoff; credit phase-out fields and per-state model notes in the data. Every state row was compared against the Tax Foundation table (no transcription differences).
- **1.0.0** (2026-11-19): first release.

## Tests

```bash
npm test
```

The tests check the helpers against hand-computed values and against reference results from the CalcVerseAI engine.

## Contributing

Found a wrong number? Open an issue with the source. See also the [take-home pay by state page](https://calcverseai.com/data/take-home-pay-by-state) and the other [data pages](https://calcverseai.com/data/inflation-by-year) and [embeddable calculators](https://calcverseai.com/embed).

## License

Code: MIT. Data: CC BY 4.0, with attribution to [CalcVerseAI](https://calcverseai.com). See `LICENSE-DATA.md`.
