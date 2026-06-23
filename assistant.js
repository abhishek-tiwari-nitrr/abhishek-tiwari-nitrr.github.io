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
      <div class="ask-inputwrap">
        <input class="ask-input" id="askInput" type="text" autocomplete="off" spellcheck="false"
               placeholder="Ask about projects, ML stack, experience\u2026" />
        <button class="ask-send" id="askSend" aria-label="Ask">\u2192</button>
      </div>
      <div class="ask-sugs" id="askSugs"></div>
      <div class="ask-body" id="askBody">
        <p class="ask-hello">Work In Progress
          <span class="ask-note">Will be updated once done.</span></p>
      </div>
      <div class="ask-foot"><span id="askMode">Just Check in Later.....</span></div>
    </div>`;

    document.body.appendChild(launch);
    document.body.appendChild(modal);

    let open = false, lastFocus = null;
    function show() { open = true; modal.hidden = false; lastFocus = document.activeElement; document.body.style.overflow = 'hidden'; setTimeout(() => input.focus(), 30); }
    function hide() { open = false; modal.hidden = true; document.body.style.overflow = ''; if (lastFocus) try { lastFocus.focus(); } catch (e) { } }

    launch.addEventListener('click', show);
    launch.addEventListener('click', warm);
    modal.addEventListener('click', e => { if (e.target.hasAttribute('data-close')) hide(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) hide(); });

    function setBody(html) { body.innerHTML = html; body.scrollTop = 0; }

    let warming = false, warmed = false, busy = false;
    async function warm() {
        if (warming || warmed) return;
        warming = true;
        modeEl.textContent = 'loading semantic model\u2026';
        await buildIndex(p => { modeEl.textContent = 'loading semantic model\u2026 ' + p + '%'; });
        warmed = true; warming = false;
        modeEl.textContent = mode === 'semantic'
            ? 'embeddings run locally \u00b7 no data leaves your browser'
            : 'keyword mode \u00b7 still answers; embeddings unavailable';
    }


    send.addEventListener('click', ask);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); ask(); } });
}

init();

