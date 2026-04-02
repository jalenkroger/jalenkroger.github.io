# The Budget Paradox: Methodology & Data Collection

This document outlines the step-by-step methodology used to investigate, calculate, and implement the data visualizations for the "The Budget Paradox" project regarding the University of Nebraska and President Jeffery Gold.

## Step 1: Establishing the Salary Disparity and Growth Baseline
**Focus:** "The Cost of Leadership"

* **Data Sources:** 
  * [Nebraska Public Media (Historical compensation reporting)](https://nebraskapublicmedia.org/en/news/)
  * [NU Board of Regents Operating Budgets](https://nebraska.edu/board/operating-budgets)
  * [U.S. Bureau of Labor Statistics (BLS) CPI Inflation Calculator](https://data.bls.gov/cgi-bin/cpicalc.pl)
* **Process:**
  1. We identified a logical baseline year (2000) for historical comparison. In 2000, the baseline university president salary was approximately $250,000, and the average faculty baseline was $68,000.
  2. We calculated the cumulative inflation from 2000 to 2024 using the standard BLS CPI calculator, which yielded an inflation rate of roughly **72%**.
  3. We projected what those salaries *should* be today if they simply matched inflation: $430,000 (President) and $118,000 (Faculty).
  4. We pulled the 2024 actuals: Jeffery Gold's base package of **$1,062,573** and the current average faculty salary of **$108,712**.
  5. **Implementation in Code:** This data was translated into the `index.html` structure under the `#executive-cost` section. In `script.js`, we built the `salary-intro`, `salary-inflation`, and `salary-compare` scroll events to dynamically resize the height of the CSS pillars (representing salary) out of a defined `$1.5M` max scale, showcasing how the presidential salary outpaced inflation by 2.5x while faculty lagged behind.

## Step 2: Tracking the Academic Hollow-Out
**Focus:** "The Budget Pipeline" 

* **Data Sources:** 
  * [Flatwater Free Press investigation ("University spending on managers triples")](https://flatwaterfreepress.org/) 
  * [National Center for Education Statistics (NCES) IPEDS Data (2014-2024)](https://nces.ed.gov/ipeds/)
* **Process:**
  1. We targeted institutional headcount data and spending allocations to see if the reduction in tenured faculty correlated with administrative savings.
  2. The data indicated a distinct inversion: Over a 10-year span, real-dollar spending on NU instructional faculty dropped by **10%**, with full-time tenure-track positions declining.
  3. Conversely, the university relied on non-tenured adjuncts as a budgetary stopgap, increasing their ranks by **38.7%**.
  4. During this same exact period, spending and headcounts for the administrative stream swelled by **54%**.
  5. **Implementation in Code:** We created an SVG "Budget Pipeline" in `index.html`. Using `IntersectionObserver` in `script.js`, as the user scrolls, the stroke widths of the SVG paths (`svg-faculty`, `svg-adjunct`, `svg-admin`) mathematically shift to visually represent these percentage changes over time.

## Step 3: Calculating The Tuition Paradox
**Focus:** "The Tuition Paradox"

* **Data Sources:** 
  * [NU Board of Regents Historical Budget Reports](https://nebraska.edu/board/operating-budgets)
  * [Historical UNL Tuition Rates](https://nebraska.edu/about/tuition)
* **Process:**
  1. We analyzed the breakdown of the university's operating budget streams over the last 24 years, specifically isolating Student Tuition & Fees vs. State Appropriations.
  2. We compared the growth of these funding streams against our established **72%** inflation baseline.
  3. The findings demonstrated that while state aid effectively depreciated (falling **44%** below relative 2000 value), student costs surged wildly, growing **200%** over the same timeframe.
  4. **Implementation in Code:** This was formulated as a divergence chart using an SVG coordinate system. The x-axis represents time, while the y-axis represents the percentage change. In `script.js`, as the user reaches the step, the state aid line plunges below the inflation baseline, creating an illuminated "dead zone" (shaded via an SVG path in `index.html`) that cleanly illustrates the financial gap students are now forced to cover.

## Step 4: Benchmarking Against Institutional Peers
**Focus:** "The Peer Comparison"

* **Data Sources:** 
  * [IPEDS 2023 Data (4-Year Cohort Graduation Rates)](https://nces.ed.gov/ipeds/)
  * [Public University Compensation/Fiscal Records (Institutional Peer Universities)](https://nces.ed.gov/)
* **Process:**
  1. High administrative costs are frequently justified by institutions as an "investment in student success." We set out to test this hypothesis among institutional peers.
  2. We cataloged base executive compensations for peer universities (e.g., Ohio State, Illinois, Indiana) and mapped them directly against their official IPEDS 4-year graduation rates. 
  3. We found a glaring efficiency gap: while universities like Illinois pay high salaries ($950K) but yield high outcomes (71% grad rate), the University of Nebraska pays a premium executive compensation ($1.06M) but yields a comparatively poor outcome (**46% grad rate**)—the lowest among the sampled peers.
  4. **Implementation in Code:** An array of objects `peerData` was established in `script.js` containing each university's compensation and graduation rate. A loop injects HTML bars matching these percentages into the DOM. Two different scrollytelling triggers (`peer-intro` and `peer-efficiency`) animate the width of the bars, allowing the user to first view the raw compensation gap, and then toggle the view to see the actual graduation rate performance.

## Appendix: "Vibecoding" the Application
This website was built using a "vibecoding" approach—relying on natural language prompts to dictate the design, architecture, and logic of the application to an AI agent, rather than writing traditional raw code. 

The following logical progression of prompts was used to generate the final website:

1. **The Initial Architecture & Concept:**
   > *"Investigate the university's budget paradox... transform this investigation into a compelling, multimedia journalistic website for the Daily Nebraskan, styled after their existing design system."*
2. **Iterating on Data Visualizations:**
   > *"Implement a new visual narrative for the website, replacing the previous 'Academic Hollow-Out' structural column with a more intuitive 'Budget Pipeline' SVG graphic... visually representing the shift in university funding from faculty to administration."*
3. **Refining the Aesthetics & Animations:**
   > *"Refine the three existing graphics: Fix overlapping text labels, increase the visual emphasis and height disparity between the President's and Faculty's salary pillars to make the change more drastic... ensure the SVG animations reset correctly on scroll-up."*
4. **Expanding Context & Data Logic:**
   > *"Fix the visual bug in the Cost of Leadership graphic and expand the Peer Comparison section to include administrative efficiency metrics, comparing administrative spending against outcomes like graduation rates."*
