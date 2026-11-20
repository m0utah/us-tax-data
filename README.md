# us-tax-data

2026 US **federal and state income tax tables**, FICA, capital-gains thresholds, retirement limits, **CPI (1913–2025)**, as CSV and JSON, plus small helpers to estimate take-home pay.

Compiled and maintained by [CalcVerseAI](https://calcverseai.com), which uses the same tables in its free [take-home pay](https://calcverseai.com/calculators/finance/take-home-pay) and [income tax](https://calcverseai.com/calculators/finance/income-tax) calculators. Figures last verified **2026-11-19**.

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
- State brackets and deductions: Tax Foundation, *2026 State Income Tax Rates and Brackets*
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
| 20 | North Carolina | $3,481 | $24,301 | $75,699 | 24.3% |
| 21 | Utah | $3,534 | $24,354 | $75,646 | 24.4% |
| 22 | New Mexico | $3,569 | $24,389 | $75,611 | 24.4% |
| 23 | Nebraska | $3,670 | $24,490 | $75,510 | 24.5% |
| 24 | Arkansas | $3,687 | $24,507 | $75,493 | 24.5% |
| 25 | Colorado | $3,692 | $24,512 | $75,488 | 24.5% |
| 26 | Missouri | $3,763 | $24,583 | $75,417 | 24.6% |
| 27 | West Virginia | $3,885 | $24,705 | $75,295 | 24.7% |
| 28 | Wisconsin | $3,919 | $24,739 | $75,261 | 24.7% |
| 29 | Connecticut | $3,925 | $24,745 | $75,255 | 24.7% |
| 30 | Oklahoma | $3,955 | $24,775 | $75,226 | 24.8% |
| 31 | Michigan | $3,999 | $24,819 | $75,181 | 24.8% |
| 32 | Vermont | $4,140 | $24,960 | $75,040 | 25.0% |
| 33 | New Jersey | $4,182 | $25,002 | $74,998 | 25.0% |
| 34 | Idaho | $4,192 | $25,012 | $74,988 | 25.0% |
| 35 | Montana | $4,289 | $25,109 | $74,891 | 25.1% |
| 36 | Maryland | $4,386 | $25,206 | $74,794 | 25.2% |
| 37 | Georgia | $4,567 | $25,387 | $74,613 | 25.4% |
| 38 | Alabama | $4,735 | $25,555 | $74,445 | 25.6% |
| 39 | Massachusetts | $4,780 | $25,600 | $74,400 | 25.6% |
| 40 | Kansas | $4,780 | $25,600 | $74,400 | 25.6% |
| 41 | Illinois | $4,805 | $25,625 | $74,375 | 25.6% |
| 42 | South Carolina | $4,843 | $25,663 | $74,337 | 25.7% |
| 43 | New York | $4,860 | $25,680 | $74,320 | 25.7% |
| 44 | Virginia | $4,936 | $25,756 | $74,244 | 25.8% |
| 45 | California | $5,070 | $25,890 | $74,110 | 25.9% |
| 46 | Delaware | $5,259 | $26,079 | $73,921 | 26.1% |
| 47 | Minnesota | $5,277 | $26,097 | $73,903 | 26.1% |
| 48 | Washington D.C. | $5,532 | $26,352 | $73,649 | 26.4% |
| 49 | Maine | $5,654 | $26,474 | $73,526 | 26.5% |
| 50 | Hawaii | $6,070 | $26,890 | $73,110 | 26.9% |
| 51 | Oregon | $7,920 | $28,740 | $71,260 | 28.7% |

## Limits (read before relying on it)

This project is independent and is **not affiliated with or endorsed by** the IRS, the Social Security Administration, the BLS or any state tax agency.

This is an **estimate, not tax advice or a tax return.** It does not model local or city taxes, dependents, credits other than fixed state credits, itemized deductions, or state-specific adjustments (for example Oregon's federal-tax subtraction or California SDI). Head of household uses the single state schedule. Always check figures against the primary sources above before filing.

## Tests

```bash
npm test
```

The tests check the helpers against hand-computed values and against reference results from the CalcVerseAI engine.

## Contributing

Found a wrong number? Open an issue with the source. See also the [online data pages](https://calcverseai.com/data/inflation-by-year) and [embeddable calculators](https://calcverseai.com/embed).

## License

Code: MIT. Data: CC BY 4.0, with attribution to [CalcVerseAI](https://calcverseai.com). See `LICENSE-DATA.md`.
