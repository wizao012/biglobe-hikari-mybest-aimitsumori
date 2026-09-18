(() => {
  'use strict';
  const config = window.LP_CONFIG;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  if (location.protocol !== 'https:' || !config.productionHosts.includes(location.hostname)) return;
  window.dataLayer.push({'gtm.start': Date.now(), event: 'gtm.js'});
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(config.gtmId);
  document.head.appendChild(script);
  // The existing GTM container supplies the Google tag; do not add a second config tag.
  if (/^\/thanks(?:\.html)?\/?$/.test(location.pathname)) {
    try {
      const receipt = Number(sessionStorage.getItem('lp-lead-receipt'));
      sessionStorage.removeItem('lp-lead-receipt');
      const age = Date.now() - receipt;
      if (receipt && age >= 0 && age < 15 * 60 * 1000) {
        window.gtag('event', 'generate_lead', {send_to: config.ga4Id});
      }
    } catch (_) { /* Submission page handles unavailable storage. */ }
  }
})();
