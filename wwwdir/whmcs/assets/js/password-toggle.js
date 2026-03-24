/* WHMCS: password visibility toggles; idempotent. */
(function () {
  'use strict';

  var ATTR = 'data-whmcs-pw-toggle';
  var WRAP = 'whmcs-password-field-wrap';

  function injectStyles() {
    if (document.getElementById('whmcs-password-toggle-styles')) return;
    var s = document.createElement('style');
    s.id = 'whmcs-password-toggle-styles';
    s.textContent =
      '.' +
      WRAP +
      '{position:relative;display:block;width:100%;}' +
      '.' +
      WRAP +
      '>.form-control,.' +
      WRAP +
      '>.field{padding-right:2.75rem!important;}' +
      '.whmcs-password-toggle{position:absolute;right:0.25rem;top:50%;transform:translateY(-50%);z-index:5;border:none;background:transparent;color:#6c757d;min-width:44px;min-height:44px;padding:0;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;border-radius:0.25rem;}' +
      '.whmcs-password-toggle:hover,.whmcs-password-toggle:focus{color:#495057;}' +
      '.whmcs-password-toggle:focus{outline:2px solid #007bff;outline-offset:2px;}' +
      '@media (prefers-reduced-motion:reduce){.whmcs-password-toggle{transition:none;}}';
    document.head.appendChild(s);
  }

  function setIcon(btn, masked) {
    var icon = btn.querySelector('i');
    if (!icon) return;
    icon.className = masked ? 'far fa-eye' : 'far fa-eye-slash';
    btn.setAttribute('aria-label', masked ? 'Show password' : 'Hide password');
    btn.setAttribute('aria-pressed', masked ? 'false' : 'true');
  }

  function wrap(input) {
    if (input.getAttribute(ATTR) === '1') return;
    if (input.getAttribute('data-no-password-toggle') !== null) return;

    input.setAttribute(ATTR, '1');

    var wrapEl = document.createElement('div');
    wrapEl.className = WRAP;

    var parent = input.parentNode;
    parent.insertBefore(wrapEl, input);
    wrapEl.appendChild(input);

    if (!/\bpr-\d\b/.test(input.className) && !/\bpe-\d\b/.test(input.className)) {
      input.classList.add('pr-5');
    }

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'whmcs-password-toggle';
    btn.setAttribute('aria-label', 'Show password');
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML = '<i class="far fa-eye" aria-hidden="true"></i>';

    wrapEl.appendChild(btn);

    btn.addEventListener('click', function () {
      input.type = input.type === 'password' ? 'text' : 'password';
      setIcon(btn, input.type === 'password');
    });
  }

  function init(root) {
    injectStyles();
    root = root || document;
    var list = root.querySelectorAll ? root.querySelectorAll('input[type="password"]') : [];
    for (var i = 0; i < list.length; i++) {
      wrap(list[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init(document);
    });
  } else {
    init(document);
  }

  if (typeof jQuery !== 'undefined') {
    jQuery(document).on('shown.bs.modal', function (e) {
      init(e.target);
    });
    jQuery(document).ajaxComplete(function () {
      init(document);
    });
  }
})();
