const test = require('node:test');
const assert = require('node:assert/strict');
const domain = require('../dist/domain.js');

const fixture = {
  accounts: [{id:'a', payroll:[{payroll:100000,rate:2},{payroll:50000,rate:.5}], experienceMod:1.1, scheduleCredit:250}],
  policies: [{id:'p1',accountId:'a'}],
  claims: [{id:'c1',policyId:'p1'}],
  products: {classifications:[{code:'8810',rate:.29}]}
};

test('manual premium uses payroll per $100 and experience modification', () => {
  assert.equal(domain.manualPremium(100000, 2, 1.1), 2200);
});
test('policy estimate applies credit after experience modification', () => {
  assert.deepEqual(domain.policyEstimate(fixture.accounts[0].payroll, 1.1, 250), {manual:2250, modified:2475, credit:250, estimated:2225});
});
test('audit adjustment is actual less estimated', () => {
  assert.equal(domain.auditAdjustment(5000, 5450.25), 450.25);
});
test('each role receives only supported navigation pages', () => {
  for (const role of ['Employer','Producer','Underwriter','Claims Adjuster','Injured Worker','Billing Specialist','Premium Auditor','Product Admin','System Administrator']) {
    assert.ok(domain.getRoleNavigation(role).length > 0);
  }
  assert.equal(domain.getRoleNavigation('System Administrator').length, 9);
});
test('seed-style account, policy, claim, and rate links pass integrity checks', () => {
  assert.ok(domain.runStaticChecks(fixture).every(check => check.passed));
});
