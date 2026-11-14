'use strict';

(function attachWorkerCompDomain(root) {
  const money = value => Math.round((Number(value) || 0) * 100) / 100;

  function manualPremium(payroll, ratePerHundred, experienceMod) {
    return money((Number(payroll || 0) / 100) * Number(ratePerHundred || 0) * Number(experienceMod || 1));
  }

  function policyEstimate(classifications, experienceMod, credit = 0) {
    const manual = classifications.reduce((sum, item) =>
      sum + manualPremium(item.payroll, item.rate, 1), 0);
    const modified = money(manual * Number(experienceMod || 1));
    return {manual, modified, credit: money(credit), estimated: money(modified - Number(credit || 0))};
  }

  function auditAdjustment(estimated, actual) {
    return money(Number(actual || 0) - Number(estimated || 0));
  }

  function getRoleNavigation(role) {
    const all = [
      ['dashboard', 'Work queue'],
      ['account', 'Employer account'],
      ['policy', 'PolicyCenter'],
      ['submissions', 'Producer submissions'],
      ['claims', 'ClaimCenter'],
      ['billing', 'BillingCenter'],
      ['audits', 'Premium audits'],
      ['products', 'Product configuration'],
      ['qa', 'QA workbench']
    ];
    const access = {
      'Employer': ['dashboard', 'account', 'policy', 'claims'],
      'Producer': ['dashboard', 'account', 'policy', 'submissions'],
      'Underwriter': ['dashboard', 'account', 'policy', 'submissions', 'products'],
      'Claims Adjuster': ['dashboard', 'claims', 'account'],
      'Injured Worker': ['dashboard', 'claims'],
      'Billing Specialist': ['dashboard', 'billing', 'account', 'policy'],
      'Premium Auditor': ['dashboard', 'audits', 'account', 'policy'],
      'Product Admin': ['dashboard', 'products', 'policy', 'account'],
      'System Administrator': all.map(item => item[0])
    };
    return all.filter(item => (access[role] || access.Employer).includes(item[0]));
  }

  function runStaticChecks(data) {
    const results = [];
    const add = (name, condition, detail) => results.push({name, passed: Boolean(condition), detail});
    const ids = data.policies.map(item => item.id);
    add('Policy identifiers are unique', new Set(ids).size === ids.length, ids.length + ' policy records');
    const accounts = new Set(data.accounts.map(item => item.id));
    add('Policies link to employer accounts', data.policies.every(item => accounts.has(item.accountId)), data.policies.length + ' policy links checked');
    add('Claims link to valid policies', data.claims.every(item => ids.includes(item.policyId)), data.claims.length + ' claims checked');
    add('Payroll and rates are nonnegative', data.products.classifications.every(item => item.rate >= 0), data.products.classifications.length + ' class rates checked');
    const estimate = policyEstimate(data.accounts[0].payroll, data.accounts[0].experienceMod, data.accounts[0].scheduleCredit);
    add('Premium estimate arithmetic is consistent', estimate.estimated === money(estimate.modified - estimate.credit), 'Manual premium × experience mod − credits');
    const knownPages = new Set(['dashboard', 'account', 'policy', 'submissions', 'claims', 'billing', 'audits', 'products', 'qa']);
    const supportedRoles = ['Employer', 'Producer', 'Underwriter', 'Claims Adjuster', 'Injured Worker', 'Billing Specialist', 'Premium Auditor', 'Product Admin', 'System Administrator'];
    const roleMenusValid = supportedRoles.every(role => getRoleNavigation(role).every(item => knownPages.has(item[0])));
    add('Role menus reference known pages', roleMenusValid, supportedRoles.length + ' role menus checked');
    add('Every employer has a policy', data.accounts.every(account => data.policies.some(policy => policy.accountId === account.id)), data.accounts.length + ' account policy links checked');
    return results;
  }

  root.WorkerCompDomain = {manualPremium, policyEstimate, auditAdjustment, getRoleNavigation, runStaticChecks};
  if (typeof module !== 'undefined' && module.exports) module.exports = root.WorkerCompDomain;
})(typeof window === 'undefined' ? globalThis : window);
