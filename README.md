# WorkerComp Insurance

A role-based California workers compensation workflow workspace aligned to Guidewire InsuranceSuite concepts. The app demonstrates how one employer account moves through producer intake, PolicyCenter underwriting and policy administration, ClaimCenter injury handling, BillingCenter transactions, premium audit, and product configuration.

**Live app:** [WorkerComp Insurance](https://workercomp-insurance.onrender.com)

## Open the workspace

The homepage explains the demo, gives a four-step walkthrough, and provides direct launch cards for each role and work area. Each card selects the matching role and opens its page. **Demo home** remains available in the sidebar. Sample state is saved in the browser with `localStorage`; use **Reset sample data** in QA Workbench to restore the original records.

## Role views

- Employer and Producer: employer account, payroll updates, policy information, injury reports, submission pipeline
- Underwriter: referral queue, information requests, clear-to-quote and decline decisions
- Claims Adjuster: claim inventory, reserves, medical management, modified duty and closure
- Injured Worker: personal claim status, work status and next steps
- Billing Specialist: invoices, balances, payment posting
- Premium Auditor: payroll reconciliation and audit adjustment handoff
- Product Admin: class-code references, training-rate editing and underwriting controls
- System Administrator: all pages

## Connected sample scenarios

The workspace contains Sierra Peak Machine Works, Harborline Industrial Supply, and Canyon Office Systems, each with distinct operations, payroll classes, policy terms and renewal states. The records include employer locations and payroll, submissions and underwriting referrals, medical-only and lost-time claims, invoices, audit periods, product controls, and activity history.

Actions update shared records across role views: payroll submissions are visible to audit and renewal, injury reports create ClaimCenter records, adjuster changes show in the worker or employer view, posted payments update BillingCenter balances, and completed audits can create an invoice adjustment.

All names, businesses, payrolls, claims and policy records are fictional. Class descriptions reference WCIRB phraseology. Rates and premiums are training assumptions, not filed or quoted rates. This is a front-end learning workspace and does not connect to Guidewire or handle actual insurance transactions.

## Run locally

Serve the static files from `dist` with any static web server, for example:

```bash
python -m http.server 8000 --directory dist
```

Then open `http://localhost:8000`.

## QA

```bash
npm test
```

The browser QA Workbench includes interactive workspace integrity checks and reset controls. The Node test suite covers premium calculations, role navigation and record integrity.

## References

- [Guidewire PolicyCenter audit jobs](https://docs.guidewire.com/cloud/is/202603/cloudapibf/cloudAPI/PolicyCenter/job-types/audits.html)
- [WCIRB classification system](https://www.wcirb.com/research-and-education/online-guide-workers%E2%80%99-compensation/standard-classification-system)
- [WCIRB payroll or remuneration](https://www.wcirb.com/research-and-education/online-guide-workers%E2%80%99-compensation/standard-classification-system/payroll-or-remuneration)
