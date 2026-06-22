(function() {
    "use strict";
    var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var $ = function(s, r) {
        return (r || document).querySelector(s);
    };
    var $$ = function(s, r) {
        return Array.prototype.slice.call((r || document).querySelectorAll(s));
    };

    /* platform-aware shortcut label: Cmd on Apple, Ctrl on Windows/Linux, tap on touch */
    var navPlat = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || '';
    var isApple = /Mac|iPhone|iPad|iPod/i.test(navPlat);
    var coarse = window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches;
    var MOD = isApple ? '\u2318' : 'Ctrl';
    (function() {
        var kKey = $('#kKey');
        if (kKey) kKey.textContent = isApple ? '\u2318K' : 'Ctrl K';
        var hint = $('#paletteHint');
        if (hint) {
            if (coarse) {
                hint.classList.add('tap');
                hint.textContent = 'Tap to open the menu';
            } else {
                var m = $('#modK1');
                if (m) m.textContent = MOD;
            }
        }
    })();

    /* one-time nudge toward the command menu */
    if (!RM) {
        setTimeout(function() {
            var c = $('#openCmd');
            if (!c) return;
            c.classList.add('nudge');
            setTimeout(function() {
                c.classList.remove('nudge');
            }, 2400);
        }, 1600);
    }

    /* top bar shadow */
    var topbar = $('#topbar');
    var onBar = function() {
        topbar.classList.toggle('stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onBar, {
        passive: true
    });
    onBar();

    /* theme toggle (in-memory; honours OS at load) */
    $('#themeToggle').addEventListener('click', function() {
        var cur = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
    });

    /* smooth in-page nav, reduced-motion aware, with focus handoff */
    function goTo(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({
            behavior: RM ? 'auto' : 'smooth',
            block: 'start'
        });
        setTimeout(function() {
            try {
                el.focus({
                    preventScroll: true
                });
            } catch (e) {
                el.focus();
            }
        }, RM ? 0 : 420);
    }
    $$('a[href^="#"]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            var id = a.getAttribute('href').slice(1);
            if (document.getElementById(id)) {
                e.preventDefault();
                goTo(id);
                history.replaceState(null, '', '#' + id);
            }
        });
    });

    /* index rail: scroll-spy + progress spine */
    var railLinks = $$('.rail a'),
        railMap = {};
    railLinks.forEach(function(a) {
        railMap[a.dataset.rail] = a;
    });
    var ids = ['masthead', 'overview', 'stack', 'experience', 'work', 'recognition', 'contact'];
    var spy = new IntersectionObserver(function(entries) {
        entries.forEach(function(en) {
            if (en.isIntersecting) {
                railLinks.forEach(function(a) {
                    a.classList.remove('active');
                });
                if (railMap[en.target.id]) railMap[en.target.id].classList.add('active');
            }
        });
    }, {
        rootMargin: '-45% 0px -50% 0px',
        threshold: 0
    });
    ids.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) spy.observe(el);
    });

    var railFill = $('#railFill'),
        rail = $('#rail'),
        scrollbar = $('#scrollbar'),
        spineTick = false;

    function updateSpine() {
        var h = document.documentElement;
        var frac = Math.min(1, Math.max(0, h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)));
        if (scrollbar) scrollbar.style.transform = 'scaleX(' + frac + ')';
        if (rail.offsetParent !== null) railFill.style.height = (rail.clientHeight * frac) + 'px';
    }
    window.addEventListener('scroll', function() {
        if (!spineTick) {
            spineTick = true;
            requestAnimationFrame(function() {
                updateSpine();
                spineTick = false;
            });
        }
    }, {
        passive: true
    });
    window.addEventListener('resize', updateSpine);
    updateSpine();

    /* reveal on scroll */
    if (!RM) {
        var rev = new IntersectionObserver(function(entries) {
            entries.forEach(function(en) {
                if (en.isIntersecting) {
                    en.target.classList.add('in');
                    rev.unobserve(en.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -8% 0px'
        });
        $$('.reveal').forEach(function(el, i) {
            el.style.setProperty('--i', i % 6);
            rev.observe(el);
        });
    }

    /* count-up numeric project metrics when a figure scrolls into view */
    (function() {
        var numRe = /^(\s*\u20B9?)(\d[\d,]*(?:\.\d+)?)(.*)$/;

        function fmt(v, dec, comma) {
            var s = v.toFixed(dec);
            if (comma) {
                var parts = s.split('.');
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                s = parts.join('.');
            }
            return s;
        }

        function animateDD(dd) {
            var m = dd.textContent.match(numRe);
            if (!m) return;
            var pre = m[1],
                numStr = m[2],
                suf = m[3];
            var dec = numStr.indexOf('.') >= 0 ? numStr.split('.')[1].length : 0;
            var comma = numStr.indexOf(',') >= 0 || (dec === 0 && parseFloat(numStr.replace(/,/g, '')) >= 1000);
            var target = parseFloat(numStr.replace(/,/g, ''));
            if (isNaN(target)) return;
            if (RM || target === 0) {
                dd.textContent = pre + fmt(target, dec, comma) + suf;
                return;
            }
            var start = performance.now(),
                dur = 1000;

            function step(now) {
                var p = Math.min(1, (now - start) / dur),
                    e = 1 - Math.pow(1 - p, 3);
                dd.textContent = pre + fmt(target * e, dec, comma) + suf;
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }

        function fire(fig) {
            $$('.readout dd', fig).forEach(animateDD);
        }
        if (!('IntersectionObserver' in window)) {
            $$('.fig').forEach(fire);
            return;
        }
        var o = new IntersectionObserver(function(ents) {
            ents.forEach(function(en) {
                if (en.isIntersecting) {
                    fire(en.target);
                    o.unobserve(en.target);
                }
            });
        }, {
            threshold: 0.25
        });
        $$('.fig').forEach(function(f) {
            o.observe(f);
        });
    })();

    /* fit each white section heading to a single line (responsive) */
    (function() {
        var CAP = 44;

        function fit() {
            $$('.h-sec').forEach(function(h) {
                h.style.whiteSpace = 'nowrap';
                h.style.fontSize = CAP + 'px';
                var avail = h.clientWidth,
                    textW = h.scrollWidth;
                if (textW > avail && avail > 0) h.style.fontSize = ((CAP * avail / textW) * 0.98) + 'px';
            });
        }
        fit();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
        var rt;
        window.addEventListener('resize', function() {
            clearTimeout(rt);
            rt = setTimeout(fit, 150);
        });
    })();

    /* project notes expand/collapse */
    $$('.notes-toggle').forEach(function(btn) {
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        btn.addEventListener('click', function() {
            var open = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!open));
            panel.style.maxHeight = open ? '0px' : (panel.firstElementChild.offsetHeight + 8) + 'px';
        });
    });

    /* email copy */
    var EMAIL = 'abhishek.tiwari.nitrr@gmail.com';

    function copyEmail() {
        var st = $('#copyState');
        var done = function() {
            st.textContent = '✓ copied to clipboard';
            setTimeout(function() {
                st.textContent = 'click to copy';
            }, 2200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(EMAIL).then(done).catch(function() {
                st.textContent = EMAIL;
            });
        } else {
            var t = document.createElement('textarea');
            t.value = EMAIL;
            document.body.appendChild(t);
            t.select();
            try {
                document.execCommand('copy');
                done();
            } catch (e) {
                st.textContent = EMAIL;
            }
            document.body.removeChild(t);
        }
    }
    $('#emailCopy').addEventListener('click', copyEmail);

    /* contact form (FormSubmit AJAX) */
    $('#contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        var f = e.target,
            btn = $('#cfSend'),
            st = $('#cfStatus');
        var name = f.name.value.trim(),
            email = f.email.value.trim(),
            msg = f.message.value.trim();
        st.className = 'form-status';
        if (!name || !email || !msg) {
            st.textContent = '> fill in all three fields to send.';
            st.classList.add('err');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            st.textContent = "> that email doesn't look right.";
            st.classList.add('err');
            return;
        }
        if (f._honey.value) return;
        btn.disabled = true;
        st.textContent = '> sending…';
        fetch('https://formsubmit.co/ajax/' + EMAIL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: msg,
                _subject: 'Portfolio message from ' + name,
                _template: 'table',
                _captcha: 'true'
            })
        }).then(function(r) {
            if (!r.ok) throw new Error('http ' + r.status);
            st.textContent = "✓ sent — I'll get back to you soon.";
            st.classList.add('ok');
            f.reset();
        }).catch(function() {
            st.textContent = "> couldn't send right now — email me directly instead.";
            st.classList.add('err');
        }).then(function() {
            btn.disabled = false;
        });
    });

    /* live GitHub telemetry */
    function settle(el, target) {
        if (RM || typeof target !== 'number' || isNaN(target)) {
            el.textContent = target;
            return;
        }
        var start = performance.now(),
            dur = 900,
            from = 0;

        function step(now) {
            var p = Math.min(1, (now - start) / dur),
                eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(from + (target - from) * eased);
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    var USER = 'abhishek-tiwari-nitrr';
    fetch('https://api.github.com/users/' + USER).then(function(r) {
            if (!r.ok) throw 0;
            return r.json();
        })
        .then(function(d) {
            settle($('#ghRepos'), d.public_repos);
        }).catch(function() {
            settle($('#ghRepos'), 34);
        });
    fetch('https://github-contributions-api.jogruber.de/v4/' + USER).then(function(r) {
            if (!r.ok) throw 0;
            return r.json();
        })
        .then(function(d) {
            var t = Object.values(d.total).reduce(function(a, b) {
                return a + b;
            }, 0);
            settle($('#ghContrib'), t);
        })
        .catch(function() {
            settle($('#ghContrib'), 850);
        });

    /* SIGNATURE: animate the training run — loss falls, accuracy rises */
    (function() {
        var statusEl = document.getElementById('trainStatus'),
            statusTxt = document.getElementById('statusTxt');
        var epochEl = document.getElementById('epochVal'),
            lossEl = document.getElementById('lossVal'),
            accEl = document.getElementById('accVal');
        var X0 = 44,
            X1 = 340,
            YT = 24,
            YB = 184,
            FINAL_EPOCH = 60,
            N = 64;

        function build(el, fn, lo, hi) {
            if (!el) return null;
            var pts = [];
            for (var i = 0; i < N; i++) {
                var t = i / (N - 1),
                    v = fn(t),
                    norm = (v - lo) / (hi - lo);
                pts.push([X0 + (X1 - X0) * t, YB - norm * (YB - YT), v]);
            }
            el.setAttribute('d', 'M' + pts.map(function(p) {
                return p[0].toFixed(1) + ' ' + p[1].toFixed(1);
            }).join(' L'));
            var len = el.getTotalLength();
            el.style.strokeDasharray = len;
            return {
                el: el,
                pts: pts,
                len: len
            };
        }

        function dotter(curve, dot, ring) {
            return function(end) {
                if (!curve) return;
                var pt = curve.el.getPointAtLength(curve.len * end);
                if (dot) {
                    dot.setAttribute('cx', pt.x);
                    dot.setAttribute('cy', pt.y);
                }
                if (ring) {
                    ring.setAttribute('cx', pt.x);
                    ring.setAttribute('cy', pt.y);
                }
            };
        }

        function lossAt(t) {
            return 0.12 + 0.9 * Math.exp(-3.4 * t) + Math.sin(t * 22) * 0.012 * (1 - t);
        }

        function accAt(t) {
            return 0.45 + 0.5 * (1 - Math.exp(-3.0 * t)) + Math.sin(t * 19) * 0.012 * (1 - t);
        }
        var loss = build(document.getElementById('lossLine'), lossAt, 0.1, 1.05);
        var acc = build(document.getElementById('accLine'), accAt, 0.4, 1.0);
        if (!loss) return;
        var setLoss = dotter(loss, document.getElementById('lossDot'), document.getElementById('lossDotRing'));
        var setAcc = dotter(acc, document.getElementById('accDot'), document.getElementById('accDotRing'));
        var ready = false;

        function finish() {
            statusEl.classList.add('done');
            statusTxt.textContent = 'converged';
            epochEl.textContent = FINAL_EPOCH;
            lossEl.textContent = loss.pts[loss.pts.length - 1][2].toFixed(3);
            if (acc) accEl.textContent = acc.pts[acc.pts.length - 1][2].toFixed(3);
            loss.el.style.strokeDashoffset = 0;
            setLoss(1);
            if (acc) {
                acc.el.style.strokeDashoffset = 0;
                setAcc(1);
            }
            document.getElementById('lossDotRing').classList.add('pulsing');
            if (acc) document.getElementById('accDotRing').classList.add('pulsing');
            ready = true;
        }
        var begun = false;

        function reset() {
            loss.el.style.strokeDashoffset = loss.len;
            setLoss(0);
            if (acc) {
                acc.el.style.strokeDashoffset = acc.len;
                setAcc(0);
            }
            statusEl.classList.remove('done');
            statusTxt.textContent = 'training';
            document.getElementById('lossDotRing').classList.remove('pulsing');
            if (acc) document.getElementById('accDotRing').classList.remove('pulsing');
            epochEl.textContent = '0';
            lossEl.textContent = '—';
            if (acc) accEl.textContent = '—';
            ready = false;
            begun = false;
        }

        function run() {
            if (begun) return;
            begun = true;
            var start = performance.now(),
                dur = 1850;

            function step(now) {
                var p = Math.min(1, (now - start) / dur),
                    e = 1 - Math.pow(1 - p, 3);
                loss.el.style.strokeDashoffset = loss.len * (1 - e);
                setLoss(e);
                if (acc) {
                    acc.el.style.strokeDashoffset = acc.len * (1 - e);
                    setAcc(e);
                }
                var li = Math.min(loss.pts.length - 1, Math.round(e * (loss.pts.length - 1)));
                epochEl.textContent = Math.round(e * FINAL_EPOCH);
                lossEl.textContent = loss.pts[li][2].toFixed(3);
                if (acc) accEl.textContent = acc.pts[li][2].toFixed(3);
                if (p < 1) requestAnimationFrame(step);
                else finish();
            }
            requestAnimationFrame(step);
        }
        var replayBtn = document.getElementById('replayRun');
        if (replayBtn) replayBtn.addEventListener('click', function() {
            if (RM) {
                finish();
                return;
            }
            reset();
            requestAnimationFrame(run);
        });
        if (RM) {
            finish();
            return;
        }
        reset();
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function(ents) {
                if (ents[0].isIntersecting) {
                    io.disconnect();
                    setTimeout(run, 450);
                }
            }, {
                threshold: 0.4
            });
            io.observe(document.getElementById('lossPlot'));
        } else {
            setTimeout(run, 450);
        }

        /* interactive crosshair — hover the chart to read epoch / loss / acc */
        if (!coarse) {
            var svg = document.getElementById('lossPlot'),
                plot = svg.parentNode;
            var xline = document.getElementById('xhairLine'),
                xL = document.getElementById('xhairLoss'),
                xA = document.getElementById('xhairAcc'),
                tip = document.getElementById('plotTip');
            var VW = 372,
                VH = 220,
                PX0 = 44,
                PX1 = 340;
            svg.addEventListener('pointermove', function(ev) {
                if (!ready) return;
                var rect = svg.getBoundingClientRect(),
                    prect = plot.getBoundingClientRect();
                var vx = Math.max(PX0, Math.min(PX1, (ev.clientX - rect.left) / rect.width * VW));
                var idx = Math.max(0, Math.min(N - 1, Math.round((vx - PX0) / (PX1 - PX0) * (N - 1))));
                var lp = loss.pts[idx],
                    ap = acc ? acc.pts[idx] : null;
                xline.setAttribute('x1', lp[0]);
                xline.setAttribute('x2', lp[0]);
                xL.setAttribute('cx', lp[0]);
                xL.setAttribute('cy', lp[1]);
                if (ap) {
                    xA.setAttribute('cx', ap[0]);
                    xA.setAttribute('cy', ap[1]);
                }
                var ep = Math.round(idx / (N - 1) * FINAL_EPOCH);
                tip.innerHTML = 'epoch <b>' + ep + '</b> · loss <b class="tl">' + lp[2].toFixed(3) + '</b>' + (ap ? ' · acc <b class="ta">' + ap[2].toFixed(3) + '</b>' : '');
                tip.style.left = ((rect.left - prect.left) + lp[0] / VW * rect.width) + 'px';
                tip.style.top = ((rect.top - prect.top) + Math.min(lp[1], ap ? ap[1] : lp[1]) / VH * rect.height) + 'px';
                plot.classList.add('inspect');
            });
            svg.addEventListener('pointerleave', function() {
                plot.classList.remove('inspect');
            });
        }
    })();

    /* hero name decode-in (sampling glyphs that resolve to the name) */
    (function() {
        if (RM) return;
        var glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&<>/*0123456789';
        var spans = $$('#heroName [data-decode]');
        if (!spans.length) return;
        var start = performance.now(),
            dur = 820;

        function frame(now) {
            var p = Math.min(1, (now - start) / dur),
                done = true;
            spans.forEach(function(sp) {
                var target = sp.getAttribute('data-decode'),
                    out = '',
                    reveal = Math.floor(p * target.length + 0.0001);
                for (var i = 0; i < target.length; i++) {
                    if (i < reveal || target.charAt(i) === ' ') out += target.charAt(i);
                    else {
                        out += glyphs.charAt((Math.random() * glyphs.length) | 0);
                        done = false;
                    }
                }
                sp.textContent = out;
            });
            if (p < 1 || !done) requestAnimationFrame(frame);
            else spans.forEach(function(sp) {
                sp.textContent = sp.getAttribute('data-decode');
            });
        }
        requestAnimationFrame(frame);
    })();

    /* ===== MATRIX MODE (easter egg) ===== */
    var mtx = null;

    function enterMatrix() {
        if (mtx) return;
        var cv = document.createElement('canvas');
        cv.style.cssText = 'position:fixed;inset:0;z-index:9998;background:#000;cursor:pointer;display:block';
        cv.setAttribute('aria-hidden', 'true');
        document.body.appendChild(cv);
        var hint = document.createElement('div');
        hint.textContent = '\u2588 wake up, Abhishek \u2014 press ESC or click to exit';
        hint.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:9999;font-family:var(--mono);font-size:.72rem;color:#37ff9b;letter-spacing:.12em;background:rgba(0,0,0,.55);padding:.55rem .95rem;border:1px solid rgba(55,255,155,.4);border-radius:8px;pointer-events:none;text-shadow:0 0 8px rgba(55,255,155,.55)';
        document.body.appendChild(hint);
        var prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        var cx = cv.getContext('2d'),
            fs = 16,
            cols, drops, raf;

        function size() {
            cv.width = window.innerWidth;
            cv.height = window.innerHeight;
            cols = Math.ceil(cv.width / fs);
            drops = [];
            for (var i = 0; i < cols; i++) drops[i] = Math.floor(Math.random() * -50);
        }
        size();
        var chars = '\u30A2\u30A4\u30AB\u30B5\u30BF\u30CA\u30CF\u30DE\u30E4\u30E9\u30EF\u30AC\u30B6\u30C0\u30D0\u30D1\u30D30123456789ABCDEF<>{}*+=/'.split('');

        function draw() {
            cx.fillStyle = 'rgba(0,0,0,0.08)';
            cx.fillRect(0, 0, cv.width, cv.height);
            cx.font = '700 ' + fs + 'px JetBrains Mono, monospace';
            for (var i = 0; i < drops.length; i++) {
                var y = drops[i] * fs,
                    ch = chars[(Math.random() * chars.length) | 0];
                cx.fillStyle = Math.random() > 0.975 ? '#e8fff3' : '#1fff8f';
                cx.fillText(ch, i * fs, y);
                if (y > cv.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
            raf = requestAnimationFrame(draw);
        }
        draw();

        function onResize() {
            size();
        }
        window.addEventListener('resize', onResize);
        cv.addEventListener('click', exitMatrix);
        mtx = {
            cv: cv,
            hint: hint,
            prevOverflow: prevOverflow,
            stop: function() {
                cancelAnimationFrame(raf);
                window.removeEventListener('resize', onResize);
            }
        };
    }

    function exitMatrix() {
        if (!mtx) return;
        mtx.stop();
        if (mtx.cv.parentNode) mtx.cv.parentNode.removeChild(mtx.cv);
        if (mtx.hint.parentNode) mtx.hint.parentNode.removeChild(mtx.hint);
        document.body.style.overflow = mtx.prevOverflow || '';
        mtx = null;
    }
    (function() {
        var buf = '';
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mtx) {
                exitMatrix();
                return;
            }
            var tag = (document.activeElement && document.activeElement.tagName) || '';
            if (/INPUT|TEXTAREA/.test(tag)) return;
            if (e.key && e.key.length === 1) {
                buf = (buf + e.key.toLowerCase()).slice(-6);
                if (buf === 'matrix') {
                    buf = '';
                    enterMatrix();
                }
            }
        });
        var ml = document.getElementById('mtxLink');
        if (ml) ml.addEventListener('click', enterMatrix);
    })();

    /* COMMAND PALETTE */
    (function() {
        var wrap = document.getElementById('cmdkWrap'),
            input = document.getElementById('cmdkInput'),
            list = document.getElementById('cmdkList'),
            backdrop = document.getElementById('cmdkBackdrop');
        var lastFocus = null,
            active = 0,
            visible = [];

        function ext(url) {
            window.open(url, '_blank', 'noopener');
        }
        var items = [{
                g: 'Navigate',
                ic: '§',
                lbl: 'Overview',
                meta: '01',
                kw: 'about intro who',
                run: function() {
                    goTo('overview');
                }
            },
            {
                g: 'Navigate',
                ic: '§',
                lbl: 'Stack',
                meta: '02',
                kw: 'skills tools python mlops methods',
                run: function() {
                    goTo('stack');
                }
            },
            {
                g: 'Navigate',
                ic: '§',
                lbl: 'Experience',
                meta: '03',
                kw: 'work history exl jobs career',
                run: function() {
                    goTo('experience');
                }
            },
            {
                g: 'Navigate',
                ic: '§',
                lbl: 'Selected work',
                meta: '04',
                kw: 'projects builds figures portfolio',
                run: function() {
                    goTo('work');
                }
            },
            {
                g: 'Navigate',
                ic: '§',
                lbl: 'Recognition',
                meta: '05',
                kw: 'awards certifications honours kaggle gate',
                run: function() {
                    goTo('recognition');
                }
            },
            {
                g: 'Navigate',
                ic: '§',
                lbl: 'Contact',
                meta: '06',
                kw: 'email message hire reach',
                run: function() {
                    goTo('contact');
                }
            },
            {
                g: 'Actions',
                ic: '✎',
                lbl: 'Copy email address',
                meta: 'clipboard',
                kw: 'mail gmail copy contact',
                run: function() {
                    goTo('contact');
                    copyEmail();
                }
            },
            {
                g: 'Actions',
                ic: '↗',
                lbl: 'Open résumé (PDF)',
                meta: 'drive',
                kw: 'cv resume download',
                run: function() {
                    ext('https://drive.google.com/file/d/1tfrmLjwJ9vj1Opdlo-NNkDRwArTj2Nsd/view?usp=sharing');
                }
            },
            {
                g: 'Actions',
                ic: '◐',
                lbl: 'Toggle light / dark theme',
                meta: 'theme',
                kw: 'dark light mode colour color',
                run: function() {
                    document.getElementById('themeToggle').click();
                }
            },
            {
                g: 'Projects',
                ic: '⎇',
                lbl: 'PhishGuard — live app',
                meta: 'streamlit',
                kw: 'phishing mlops project',
                run: function() {
                    ext('https://abhishek-tiwari-nitrr-phishguard.streamlit.app/');
                }
            },
            {
                g: 'Projects',
                ic: '⎇',
                lbl: 'System Performance Analyzer — live',
                meta: 'streamlit',
                kw: 'monitoring anomaly project',
                run: function() {
                    ext('https://abhishek-tiwari-nitrr-system-performance-analyzer.streamlit.app/');
                }
            },
            {
                g: 'Projects',
                ic: '⎇',
                lbl: 'Telco Churn — live app',
                meta: 'streamlit',
                kw: 'churn prediction project',
                run: function() {
                    ext('https://abhishek-tiwari-nitrr-churn-prediction.streamlit.app/');
                }
            },
            {
                g: 'Projects',
                ic: '⎇',
                lbl: 'Thunderstorm Forecasting — live',
                meta: 'streamlit',
                kw: 'weather forecast project',
                run: function() {
                    ext('https://abhishek-tiwari-nitrr-thunderstorm-forecasting.streamlit.app/');
                }
            },
            {
                g: 'Links',
                ic: '↗',
                lbl: 'GitHub',
                meta: 'profile',
                kw: 'code repos git',
                run: function() {
                    ext('https://github.com/abhishek-tiwari-nitrr');
                }
            },
            {
                g: 'Links',
                ic: '↗',
                lbl: 'LinkedIn',
                meta: 'profile',
                kw: 'connect professional',
                run: function() {
                    ext('https://linkedin.com/in/abhishek-tiwari-nitrr');
                }
            },
            {
                g: 'Links',
                ic: '↗',
                lbl: 'Kaggle',
                meta: 'profile',
                kw: 'competitions data',
                run: function() {
                    ext('https://kaggle.com/abhishek20182');
                }
            },
            {
                g: 'Links',
                ic: '↗',
                lbl: 'Medium',
                meta: 'profile',
                kw: 'blog writing articles',
                run: function() {
                    ext('https://medium.com/@abhishek-tiwari-nitrr');
                }
            },
            {
                g: 'Fun',
                ic: '▒',
                lbl: 'Enter the Matrix',
                meta: 'easter egg',
                kw: 'matrix rain neo green hack code red pill',
                run: enterMatrix
            }
        ];

        function render(q) {
            q = (q || '').trim().toLowerCase();
            var toks = q ? q.split(/\s+/) : [];
            visible = items.filter(function(it) {
                if (!toks.length) return true;
                var hay = (it.lbl + ' ' + it.g + ' ' + it.kw + ' ' + it.meta).toLowerCase();
                return toks.every(function(t) {
                    return hay.indexOf(t) !== -1;
                });
            });
            list.innerHTML = '';
            if (!visible.length) {
                var em = document.createElement('div');
                em.className = 'cmdk-empty';
                em.textContent = 'No matches. Try "work", "email", or "theme".';
                list.appendChild(em);
                return;
            }
            var lastG = null;
            visible.forEach(function(it, i) {
                if (it.g !== lastG) {
                    var gh = document.createElement('div');
                    gh.className = 'cmdk-group';
                    gh.textContent = it.g;
                    list.appendChild(gh);
                    lastG = it.g;
                }
                var row = document.createElement('div');
                row.className = 'cmdk-item';
                row.id = 'cmd-' + i;
                row.setAttribute('role', 'option');
                row.innerHTML = '<span class="ic"></span><span class="lbl"></span><span class="meta"></span>';
                row.querySelector('.ic').textContent = it.ic;
                row.querySelector('.lbl').textContent = it.lbl;
                row.querySelector('.meta').textContent = it.meta;
                row.addEventListener('mousemove', function() {
                    setActive(i);
                });
                row.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    choose(i);
                });
                list.appendChild(row);
            });
            setActive(0);
        }

        function rows() {
            return Array.prototype.slice.call(list.querySelectorAll('.cmdk-item'));
        }

        function setActive(i) {
            var r = rows();
            if (!r.length) return;
            active = (i + r.length) % r.length;
            r.forEach(function(el, k) {
                el.setAttribute('aria-selected', String(k === active));
            });
            input.setAttribute('aria-activedescendant', 'cmd-' + active);
            r[active].scrollIntoView({
                block: 'nearest'
            });
        }

        function choose(i) {
            if (visible[i]) {
                close();
                visible[i].run();
            }
        }
        var examples = ['try: phishguard', 'try: toggle theme', 'try: résumé', 'try: github', 'try: contact'];
        var ph = {
            i: 0,
            c: 0,
            del: false,
            timer: null
        };

        function typePH() {
            if (input.value) return;
            var w = examples[ph.i];
            if (!ph.del) {
                input.placeholder = w.slice(0, ph.c + 1);
                ph.c++;
                if (ph.c === w.length) {
                    ph.del = true;
                    ph.timer = setTimeout(typePH, 1100);
                    return;
                }
            } else {
                input.placeholder = w.slice(0, ph.c - 1);
                ph.c--;
                if (ph.c === 0) {
                    ph.del = false;
                    ph.i = (ph.i + 1) % examples.length;
                }
            }
            ph.timer = setTimeout(typePH, ph.del ? 38 : 72);
        }

        function startPH() {
            if (RM) {
                input.placeholder = 'Jump to a section, open a link, copy email…';
                return;
            }
            stopPH();
            ph.i = 0;
            ph.c = 0;
            ph.del = false;
            typePH();
        }

        function stopPH() {
            if (ph.timer) {
                clearTimeout(ph.timer);
                ph.timer = null;
            }
        }

        function open() {
            lastFocus = document.activeElement;
            wrap.hidden = false;
            input.value = '';
            render('');
            startPH();
            setTimeout(function() {
                input.focus();
            }, 10);
        }

        function close() {
            stopPH();
            wrap.hidden = true;
            if (lastFocus && lastFocus.focus) lastFocus.focus();
        }

        function isOpen() {
            return !wrap.hidden;
        }
        document.getElementById('openCmd').addEventListener('click', open);
        var phEl = document.getElementById('paletteHint');
        if (phEl) phEl.addEventListener('click', open);
        backdrop.addEventListener('click', close);
        input.addEventListener('input', function() {
            if (input.value) {
                stopPH();
                input.placeholder = '';
            } else {
                startPH();
            }
            render(input.value);
        });
        input.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive(active + 1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive(active - 1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                choose(active);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                close();
            }
        });
        document.addEventListener('keydown', function(e) {
            if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
                e.preventDefault();
                isOpen() ? close() : open();
            } else if (e.key === 'Escape' && isOpen()) {
                close();
            }
        });
    })();
})();