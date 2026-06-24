(function () {
  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  function init() {
    if (typeof document === 'undefined') return;

    const launch = el('button', 'ask-launch', '<span class="ask-spark">\u2726</span> Ask my portfolio');
    launch.id = 'askLaunch'; launch.type = 'button'; launch.setAttribute('aria-label', 'Ask my portfolio');

    const modal = el('div', 'ask-modal'); modal.id = 'askModal'; modal.hidden = true;
    modal.innerHTML = `
      <div class="ask-backdrop" data-close></div>
      <div class="ask-panel" role="dialog" aria-modal="true" aria-label="Ask my portfolio">
        <div class="ask-head">
          <span class="ask-title"><span class="ask-spark">\u2726</span> Ask my portfolio</span>
          <button class="ask-x" data-close aria-label="Close">\u00d7</button>
        </div>
        <div class="ask-body">
          <p class="ask-hello">Work in progress \u2014 a small in-browser assistant is coming here soon.
            <span class="ask-note">Check back later.</span></p>
        </div>
        <div class="ask-foot"><span>coming soon</span></div>
      </div>`;

    document.body.appendChild(launch);
    document.body.appendChild(modal);

    let open = false, lastFocus = null;
    function show() { open = true; modal.hidden = false; lastFocus = document.activeElement; document.body.style.overflow = 'hidden'; }
    function hide() { open = false; modal.hidden = true; document.body.style.overflow = ''; if (lastFocus) { try { lastFocus.focus(); } catch (e) { } } }

    launch.addEventListener('click', show);
    modal.addEventListener('click', e => { if (e.target.hasAttribute('data-close')) hide(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) hide(); });
  }

  init();
})();