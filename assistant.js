(function () {

  const CORPUS = [
    { tag: 'Profile', id: 'overview', text: 'Abhishek Tiwari is a machine-learning engineer and data scientist with nearly four years at EXL Service. He builds end-to-end ML systems - data pipelines, model serving, drift monitoring and CI/CD - and four of them run live today, each with experiment tracking and a test suite.' },
    { tag: 'Open to', id: 'overview', text: 'He is currently looking for ML Engineer, Applied AI or Data Scientist roles at product companies and AI-native startups, where shipping measured, reliable models is the job.' },
    { tag: 'Education', id: 'overview', text: 'Education: B.Tech in Mining Engineering from NIT Raipur, class of 2022. GATE 2025 qualified with All-India Rank 155 on the MN paper.' },
    { tag: 'Approach', id: 'overview', text: 'His working philosophy is Python-first and metrics-driven: scikit-learn to XGBoost to Streamlit, with experiment tracking, tests and drift monitoring so models stay reliable in production. Depth over breadth - nearly four years and two promotions at one company.' },
    { tag: 'Learning', id: 'stack', text: 'He is currently learning LangChain, RAG and PyTorch, extending an ML and MLOps background toward LLM and deep-learning systems.' },
    { tag: 'Experience 2026', id: 'experience', text: 'Since 2026 he is Lead Assistant Manager in the R&D and AI POC Lab at EXL Service (Noida, remote): the demo and experimentation track, building Python ML proofs-of-concept, presenting end-to-end ML demos to stakeholders, tracking every run in MLflow and packaging the best results into Streamlit apps.' },
    { tag: 'Experience 2024-25', id: 'experience', text: 'From 2024 to 2025, Assistant Manager in the AI POC Lab. He led an Agentic-AI proof-of-concept for short-term-disability claims on Appian that improved productivity 15%, as an early-access collaborator feeding feedback to Appian product team; architected a Digital Quality Assurance MVP that cut delivery time 10%; and built 15+ GenAI and Agentic-AI demos. He earned the Super Squad Award four times across two years.' },
    { tag: 'Experience 2022-23', id: 'experience', text: 'From 2022 to 2023, Senior Executive and Junior Developer. He built the Appian layer for an anomaly-detection POC, consuming ML predictions via API into the database and surfacing them to business users, shipped a real-estate BPM app in a nine-person team and standardised reusable Appian component libraries.' },
    { tag: 'Experience 2021', id: 'experience', text: 'In 2021 he was a Data Analyst Intern at Suven Consultants (Mumbai, remote): exploratory data analysis on meteorological datasets with pandas and NumPy and an MNIST digit-recognition model built with scikit-learn across the full pipeline.' },
    { tag: 'ML stack', id: 'stack', text: 'Core ML and Python skills: Python, scikit-learn, XGBoost and LightGBM, AdaBoost, SHAP, pandas, NumPy and imbalanced-learn.' },
    { tag: 'MLOps stack', id: 'stack', text: 'MLOps and deployment skills: MLflow, DagsHub, Docker, GitHub Actions, FastAPI, Streamlit, pytest and drift monitoring.' },
    { tag: 'Data stack', id: 'stack', text: 'Data and SQL skills: SQL with MariaDB and MySQL, SQLite, MongoDB Atlas, data wrangling, Plotly and Seaborn and A/B testing.' },
    { tag: 'Techniques', id: 'stack', text: 'Modelling techniques: SMOTE and ImbPipeline, SMOTETomek, Isolation Forest, GridSearchCV and cross-validation.' },
    { tag: 'AI & enterprise', id: 'stack', text: 'AI and enterprise skills: Appian BPM, Agentic AI, Generative AI, LLM concepts and RPA.' },
    { tag: 'PhishGuard', id: 'work', text: 'PhishGuard is a live end-to-end MLOps pipeline for phishing URL and domain detection. Six sequential stages - ingestion, validation, transformation, multi-model training with GridSearchCV, KS-test data-drift detection and an F1-gated promotion step that only ships a model beating production by at least 2% - over 30 URL and page features. It is served as a REST API with a Streamlit dashboard. Built with Python, FastAPI, scikit-learn, MLflow, DagsHub, Docker and GitHub Actions.' },
    { tag: 'System Performance Analyzer', id: 'work', text: 'System Performance Analyzer is a live app for real-time host telemetry with anomaly detection. It monitors CPU, RAM, network and processes, flags anomalies with Isolation Forest plus a z-score check, rolls up a 0 to 100 (A to F) health score, gates admin access with JWT and bcrypt and exports on-demand PDF reports with interactive Plotly charts. Built with Python, Streamlit, Plotly, scikit-learn, SQLite, PyJWT, bcrypt and ReportLab.' },
    { tag: 'Telco Customer Churn', id: 'work', text: 'Telco Customer Churn is a live churn-prediction app with a cost model. An AdaBoost classifier reaches ROC-AUC 0.8403 (0.8480 on 5-fold cross-validation) and recall 0.7727, up 41.6% with SMOTE, over 7,032 customers, protecting about 19.4 lakh rupees of net ROI per cycle. SHAP narrows inference to the top 20 features, with a drift dashboard, a SQLite audit trail and pytest CI. Built with Python, AdaBoost, SMOTE, SHAP, Streamlit, SQLite, pytest and GitHub Actions.' },
    { tag: 'Thunderstorm Forecasting', id: 'work', text: 'Thunderstorm Forecasting is a live next-day thunderstorm classifier on atmospheric sounding indices. QDA with SMOTETomek (oversampling plus Tomek-link cleaning) outperformed tree-based models on severe class imbalance, with every experiment tracked in MLflow. Built with Python, QDA, SMOTETomek, scikit-learn, MLflow, Streamlit and imbalanced-learn.' },
    { tag: 'Retail Data Insight', id: 'work', text: 'Retail Data Insight is a command-line analytics tool over 180,000+ e-commerce transactions: revenue, geographic and customer analysis, 8 publication-quality charts and auto-generated Level 1 to 3 PDF reports. Built with Python, pandas, Matplotlib, Seaborn and modular OOP. Repo only.' },
    { tag: 'Financial Tracker', id: 'work', text: 'Financial Tracker is a menu-driven command-line finance tracker built to be production-readable: add income and expense transactions, browse history and generate net-balance reports, with CSV persistence, rotating logs and custom exception classes. Built with Python, CSV, OOP and logging. Repo only.' },
    { tag: 'Live work', id: 'work', text: 'Four projects run live with public Streamlit apps and YouTube demos: PhishGuard, System Performance Analyzer, Telco Customer Churn and Thunderstorm Forecasting. All six project repositories are public on GitHub.' },
    { tag: 'Recognition', id: 'recognition', text: 'Honours include Global rank #8 in HR Analytics (Analytics Vidhya, 2023), GATE 2025 qualified at AIR 155, the 4x Super Squad Award at EXL (2024-25), Global rank #67 in a Power Plant AI challenge, an AWS Machine Learning Scholarship and a Bertelsmann Technology Scholarship from Udacity, two Kaggle bronze notebook medals and 1st prize at Vigyaan 19.' },
    { tag: 'Certifications', id: 'recognition', text: 'Certifications: Appian Certified Associate Developer valid through May 2027, Machine Learning by Stanford and Andrew Ng on Coursera, EXL Hyperautomation training and three Udacity Nanodegrees in Data Analytics, AI with Python and Predictive Analytics.' },
    { tag: 'Contact', id: 'contact', text: 'You can reach Abhishek by email at abhishek.tiwari.nitrr@gmail.com or through the contact form on this site. He is on GitHub as abhishek-tiwari-nitrr, LinkedIn at in/abhishek-tiwari-nitrr, Kaggle as abhishek20182 and Medium.' },
    { tag: 'Resume', id: 'contact', text: 'His resume is available as a PDF, linked from the top of the page and from the contact section.' }
  ];

  const SUGGESTIONS = [
    'What ML systems has he shipped?',
    'What is his MLOps stack?',
    'Tell me about PhishGuard',
    'What roles is he looking for?',
    'How do I get in touch?'
  ];

  const STOP = new Set('a an and the is are was were be of to in on for with at by from as it this that these those what which who whom how do does did can could would should will your my our you he his him she her they them their me us tell show about give more some any has have had'.split(' '));
  function tokens(s) { return s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 1 && !STOP.has(w)); }

  const ALIASES = {
    ml: 'machine learning model models', ai: 'artificial intelligence', dl: 'deep learning neural',
    mlops: 'deployment pipeline serving docker mlflow ci cd', model: 'machine learning ml',
    stack: 'skills tools technologies tech', skills: 'stack tools technologies tech expert good',
    tech: 'stack tools technologies skills', tools: 'stack technologies skills',
    experience: 'work career job role background history company exl', career: 'experience work job',
    job: 'experience work role career', jobs: 'experience work role career',
    work: 'experience projects built shipped', projects: 'work built shipped systems apps demos portfolio',
    project: 'work built shipped systems apps', built: 'projects work shipped systems',
    build: 'projects work shipped', shipped: 'projects built live systems', made: 'built projects work',
    contact: 'reach email connect touch', reach: 'contact email connect', connect: 'contact reach',
    hire: 'contact hiring open available recruit', email: 'contact reach', touch: 'contact reach',
    resume: 'cv', cv: 'resume',
    education: 'degree college university studied school nit gate', degree: 'education college university',
    college: 'education university degree nit', university: 'education college degree',
    gate: 'education rank exam', studied: 'education college university study',
    recognition: 'awards achievements honors rank prize scholarship kaggle', awards: 'recognition honors achievements',
    award: 'recognition honors achievement', achievement: 'recognition awards honors',
    certification: 'certifications certified certificate course nanodegree coursera', certified: 'certification certificate',
    certifications: 'certified certificate course nanodegree', learning: 'currently langchain rag pytorch llm',
    langchain: 'learning rag llm', rag: 'learning langchain retrieval llm', pytorch: 'learning deep neural',
    llm: 'learning langchain rag generative', phishing: 'phishguard url detection security',
    phishguard: 'phishing url detection security', churn: 'telco customer retention', telco: 'churn customer',
    performance: 'system analyzer telemetry monitoring anomaly', thunderstorm: 'weather forecasting atmospheric',
    looking: 'open seeking want available roles hire', open: 'looking seeking available roles',
    python: 'core ml programming language', sql: 'data database', who: 'profile abhishek about',
    about: 'profile who abhishek', best: 'strongest top', strongest: 'best top', good: 'skills expert'
  };
  function expand(q) {
    const base = tokens(q); const out = new Set(base);
    base.forEach(w => { if (ALIASES[w]) ALIASES[w].split(' ').forEach(x => out.add(x)); });
    return [...out];
  }
  function keywordScore(qWords, text, tag) {
    const tlist = tokens(text + ' ' + tag); const tset = new Set(tlist);
    if (!qWords.length || !tlist.length) return 0;
    let hit = 0;
    qWords.forEach(w => {
      if (tset.has(w)) hit += 1;
      else if (tlist.some(t => t.length > 3 && (t.startsWith(w) || w.startsWith(t)))) hit += 0.6;
    });
    return hit / qWords.length;
  }
  function retrieve(query, k) {
    const qw = expand(query);
    const scored = CORPUS.map(c => ({ c, s: keywordScore(qw, c.text, c.tag) }));
    scored.sort((a, b) => b.s - a.s);
    return scored.slice(0, k);
  }

  function byTag() { const t = [].slice.call(arguments); return t.map(x => CORPUS.find(c => c.tag === x)).filter(Boolean); }
  function pack(chunks, tail) {
    if (!chunks.length) return null;
    const text = chunks.map(c => c.text).join('\n\n') + (tail ? '\n\n' + tail : '');
    return { text, srcs: chunks.slice(0, 3) };
  }

  /* fast intent answers for the most common questions */
  function routed(q) {
    const ql = q.toLowerCase();
    const low = ' ' + ql.replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
    const hit = function () { return [].slice.call(arguments).some(w => low.indexOf(' ' + w + ' ') !== -1); };
    if (/^\s*(hi|hey|hello|yo|sup|hola|namaste|greetings|hii|hiii|heyy|heyyy)\b/.test(ql) && q.length < 18)
      return { text: "Hi! I'm Abhishek's portfolio assistant. Ask me about his ML and MLOps work, the projects he's shipped (PhishGuard, Telco churn, the system performance analyzer, thunderstorm forecasting), his experience at EXL, what roles he's after or how to reach him.", srcs: [] };
    if (hit('what can you', 'who are you', 'what do you do', 'help me', 'how does this'))
      return { text: "I answer questions about Abhishek from the content of this portfolio. Try: \u201cWhat ML systems has he shipped?\u201d, \u201cWhat's his MLOps stack?\u201d, \u201cTell me about the churn model\u201d, \u201cWhat is he looking for?\u201d or \u201cHow do I contact him?\u201d", srcs: [] };
    if (hit('contact', 'reach', 'email', 'get in touch', 'connect', 'linkedin', 'github', 'how do i', 'how can i'))
      return pack(byTag('Contact', 'Resume'));
    if (hit('looking', 'open to', 'seeking', 'available', 'what role', 'which role', 'kind of role', 'hiring', 'wants', 'want', 'after'))
      return pack(byTag('Open to'));
    if (hit('phishguard', 'phishing')) return pack(byTag('PhishGuard'));
    if (hit('churn', 'telco')) return pack(byTag('Telco Customer Churn'));
    if (hit('analyzer', 'telemetry') || (hit('performance') && hit('system'))) return pack(byTag('System Performance Analyzer'));
    if (hit('thunderstorm', 'weather', 'forecast', 'forecasting')) return pack(byTag('Thunderstorm Forecasting'));
    if (hit('retail', 'ecommerce')) return pack(byTag('Retail Data Insight'));
    if (hit('finance', 'financial')) return pack(byTag('Financial Tracker'));
    if (hit('projects', 'project', 'built', 'build', 'shipped', 'systems', 'apps', 'portfolio', 'live', 'demos', 'made', 'created', 'what has he', 'what did he'))
      return pack(byTag('Live work'), 'Ask about any one for details - e.g. \u201cTell me about PhishGuard\u201d or \u201cthe churn model\u201d.');
    if (hit('skill', 'skills', 'stack', 'tech', 'tools', 'technologies', 'good at', 'expertise', 'languages', 'know', 'frameworks'))
      return pack(byTag('ML stack', 'MLOps stack', 'Data stack'));
    if (hit('experience', 'career', 'background', 'work history', 'job', 'jobs', 'worked', 'company', 'promotion', 'promotions', 'years', 'exl'))
      return pack(byTag('Profile', 'Experience 2026'));
    if (hit('education', 'degree', 'college', 'university', 'studied', 'study', 'school', 'gate', 'nit', 'graduate'))
      return pack(byTag('Education'));
    if (hit('award', 'awards', 'achievement', 'achievements', 'recognition', 'honor', 'honors', 'rank', 'kaggle', 'prize', 'scholarship', 'certification', 'certifications', 'certified', 'nanodegree'))
      return pack(byTag('Recognition', 'Certifications'));
    if (hit('learning', 'currently learning', 'langchain', 'rag', 'pytorch'))
      return pack(byTag('Learning'));
    return null;
  }

  function compose(query, hits) {
    const intent = routed(query);
    if (intent) return intent;
    const top = hits[0];
    if (!top || top.s < 0.16)
      return { text: "I don't have that specific detail in the portfolio. I can tell you about his ML/MLOps stack, the projects he's shipped (PhishGuard, churn, the performance analyzer, thunderstorm forecasting), his experience at EXL, his education, what roles he's after or how to reach him - try one of those.", srcs: [] };
    const parts = [top.c.text];
    if (hits[1] && hits[1].s > top.s * 0.72 && hits[1].c.tag !== top.c.tag) parts.push(hits[1].c.text);
    const seen = new Set(), srcs = [];
    hits.forEach(h => { const key = h.c.tag + h.c.id; if (h.s > 0 && !seen.has(key) && srcs.length < 3) { seen.add(key); srcs.push(h.c); } });
    const lead = top.s < 0.5 ? "Closest I have in the portfolio:\n\n" : "";
    return { text: lead + parts.join('\n\n'), srcs };
  }


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
        <p class="ask-hello">Ask a question about my work or pick one above.
          <span class="ask-note">Instant search \u00b7 runs entirely in your browser, works offline.</span></p>
      </div>
      <div class="ask-foot"><span>keyword search \u00b7 nothing leaves your browser</span></div>
    </div>`;

    document.body.appendChild(launch);
    document.body.appendChild(modal);

    const input = modal.querySelector('#askInput');
    const send = modal.querySelector('#askSend');
    const body = modal.querySelector('#askBody');
    const sugs = modal.querySelector('#askSugs');

    SUGGESTIONS.forEach(q => {
      const b = el('button', 'ask-sug', q); b.type = 'button';
      b.addEventListener('click', () => { input.value = q; ask(); });
      sugs.appendChild(b);
    });

    let open = false, lastFocus = null;
    const HELLO = `<p class="ask-hello">Ask a question about my work or pick one above.
    <span class="ask-note">Instant search \u00b7 runs entirely in your browser, works offline.</span></p>`;
    function reset() { input.value = ''; setBody(HELLO); input.focus(); }
    function show() { open = true; modal.hidden = false; lastFocus = document.activeElement; document.body.style.overflow = 'hidden'; reset(); setTimeout(() => input.focus(), 30); }
    function hide() { open = false; modal.hidden = true; document.body.style.overflow = ''; if (lastFocus) try { lastFocus.focus(); } catch (e) { } }

    launch.addEventListener('click', show);
    modal.addEventListener('click', e => { if (e.target.hasAttribute('data-close')) hide(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) hide(); });

    function setBody(html) { body.innerHTML = html; body.scrollTop = 0; }

    function answerHTML(q, res) {
      const ans = res.text.split('\n\n').map(p => `<p>${p}</p>`).join('');
      const srcs = res.srcs.length
        ? `<div class="ask-src"><span class="ask-srclbl">sources</span>${res.srcs.map(s => `<a href="#${s.id}" class="ask-chip" data-go="${s.id}">${s.tag}</a>`).join('')}</div>` : '';
      return `<div class="ask-q">${q}</div><div class="ask-a">${ans}${srcs}<button type="button" class="ask-reset" id="askReset">\u21bb Ask another</button></div>`;
    }

    function ask() {
      const q = (input.value || '').trim();
      if (!q) return;
      const hits = retrieve(q, 4);
      setBody(answerHTML(q, compose(q, hits)));
      body.querySelectorAll('[data-go]').forEach(a => a.addEventListener('click', (ev) => {
        ev.preventDefault();
        const t = document.getElementById(a.getAttribute('data-go'));
        hide(); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }));
      const rb = body.querySelector('#askReset');
      if (rb) rb.addEventListener('click', reset);
    }

    send.addEventListener('click', ask);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); ask(); } });
  }

  init();

})();