(() => {
  'use strict';
  const section = document.getElementById('form');
  const form = document.getElementById('application-form');
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const goTo = (element) => {
    element.focus({ preventScroll: true });
    element.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  };
  // Capture before the reference LP's general anchor handler; close its menu first.
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[data-b-contact-cta]');
    if (!link || !section || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const close = document.querySelector('#modal-menu[aria-hidden="false"] [data-modal-close]');
    if (close) close.click();
    if (location.hash !== '#form') history.pushState(null, '', '#form');
    requestAnimationFrame(() => goTo(section));
  }, true);
  const bar = document.querySelector('.l-header .b-agency-bar');
  if (bar) {
    const sync = () => document.documentElement.style.setProperty('--b-agency-offset', `${Math.max(0, bar.getBoundingClientRect().bottom)}px`);
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    if ('ResizeObserver' in window) new ResizeObserver(sync).observe(bar);
  }

})();
(() => {
  'use strict';
  const form = document.getElementById('application-form');
  if (!form) return;
  const config = window.LP_CONFIG;
  const button = form.querySelector('[type="submit"]');
  const status = document.getElementById('form-status');
  const input = name => form.elements.namedItem(name);
  const digits = value => value.normalize('NFKC').replace(/[\s\-ー−―]/g, '');
  let sending = false;
  let completed = false;
  button.disabled = false;
  form.addEventListener('input', event => {
    event.target.setCustomValidity?.('');
    event.target.removeAttribute('aria-invalid');
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || completed) return;
    input('name').setCustomValidity(input('name').value.trim() ? '' : '名前を入力してください。');
    input('addr').setCustomValidity(input('addr').value.trim() ? '' : '住所を入力してください。');
    input('tel').setCustomValidity(/^0\d{9,10}$/.test(digits(input('tel').value)) ? '' : '電話番号を10〜11桁の数字で入力してください。');
    input('zip').setCustomValidity(/^\d{7}$/.test(digits(input('zip').value)) ? '' : '郵便番号を7桁の数字で入力してください。');
    if (!form.reportValidity()) return;
    if (!config || location.protocol !== 'https:' || !config.productionHosts.includes(location.hostname)) {
      status.textContent = 'このプレビュー環境では送信できません。公開サイトからお申し込みください。';
      return;
    }
    const payload = {
      name: input('name').value.trim(), tel: digits(input('tel').value),
      zip: digits(input('zip').value), addr: input('addr').value.trim(),
      addr_type: input('addr_type').value, current_line: input('current_line').value,
      agree: input('agree').checked, privacy_policy_url: new URL('/privacy.html', location.origin).href,
      submitted_at: new Date().toISOString(), source_url: location.href,
      lp_path: location.pathname, referrer: document.referrer
    };
    const params = new URLSearchParams(location.search);
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','placement','keyword','matchtype','gclid','fbclid','lpv'].forEach(key => payload[key] = params.get(key) || '');
    sending = true;
    button.disabled = true;
    button.textContent = '送信しています…';
    status.textContent = '';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST', mode: 'cors', headers: {'Content-Type': 'text/plain;charset=UTF-8'},
        body: JSON.stringify(payload), signal: controller.signal
      });
      if (!response.ok) throw new Error('Submission rejected');
    } catch (_) {
      sending = false;
      button.disabled = false;
      button.textContent = 'この内容で申し込む →';
      status.textContent = '送信完了を確認できませんでした。通信状況をご確認ください。再送信すると重複して受け付けられる可能性があります。';
      return;
    } finally {
      clearTimeout(timeout);
    }
    // Receipt contains no personal information. Never automatically retry a POST.
    completed = true;
    let receiptStored = false;
    try {
      sessionStorage.setItem('lp-lead-receipt', String(Date.now()));
      receiptStored = true;
    } catch (_) { /* Storage-blocked browsers report GA on this page instead. */ }
    window.dataLayer = window.dataLayer || [];
    if (!receiptStored) window.gtag('event', 'generate_lead', {send_to: config.ga4Id});
    let navigated = false;
    const finish = () => {
      if (navigated) return;
      navigated = true;
      location.assign('/thanks.html');
    };
    // Give existing GTM tags time to dispatch, even when GTM is blocked.
    setTimeout(finish, 1800);
    window.dataLayer.push({event: 'form_submit_cv', eventCallback: finish, eventTimeout: 1500});
    status.textContent = '送信を受け付けました。完了ページへ移動します。';
  });
  const floating = document.querySelector('.c-floating-cta');
  if ('IntersectionObserver' in window && floating) {
    new IntersectionObserver(entries => floating.classList.toggle('b-contact-in-view', entries[0].isIntersecting)).observe(form);
  }
})();
