/* ============================================
   DeepTrace — Interactive Behavior
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------------
     DOM references
     ------------------------------------------------ */
  const navbar      = document.getElementById('navbar');
  const burger      = document.getElementById('burger');
  const hero        = document.getElementById('hero');
  const dropzone    = document.getElementById('dropzone');
  const chooseBtn   = document.getElementById('choose-file-btn');
  const fileInput   = document.getElementById('file-input');
  const analyzeBtn  = document.getElementById('analyze-btn');
  const linkField   = document.getElementById('link-url');

  // Analyzing screen
  const analyzeScreen = document.getElementById('analyzing-screen');
  const ringFill      = document.getElementById('ring-fill');
  const pctText       = document.getElementById('pct-text');
  const stepList      = document.getElementById('step-list');

  const CIRCUMFERENCE = 2 * Math.PI * 78; // ≈ 490.09

  // Results screen
  const resultsScreen = document.getElementById('results-screen');
  const backToHome    = document.getElementById('back-to-home');

  /* ------------------------------------------------
     Navbar scroll shadow
     ------------------------------------------------ */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  /* ------------------------------------------------
     Mobile burger toggle
     ------------------------------------------------ */
  burger.addEventListener('click', () => {
    navbar.classList.toggle('nav-open');
  });

  /* ------------------------------------------------
     File chooser
     ------------------------------------------------ */
  chooseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
      handleFile(fileInput.files[0]);
    }
  });

  /* ------------------------------------------------
     Drag & Drop
     ------------------------------------------------ */
  dropzone.addEventListener('click', () => fileInput.click());

  ['dragenter', 'dragover'].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  /* ------------------------------------------------
     Handle file → transition to analyzing
     ------------------------------------------------ */
  function handleFile(file) {
    const allowed = ['image/jpeg', 'image/png', 'video/mp4'];
    const maxSize = 100 * 1024 * 1024; // 100 MB

    if (!allowed.includes(file.type)) {
      alert('Please upload a JPG, PNG, or MP4 file.');
      return;
    }
    if (file.size > maxSize) {
      alert('File exceeds the 100 MB size limit.');
      return;
    }

    // Transition to analyzing screen
    startAnalyzing();
  }

  /* ------------------------------------------------
     Analyze button (link input)
     ------------------------------------------------ */
  analyzeBtn.addEventListener('click', () => {
    const url = linkField.value.trim();
    if (!url) {
      linkField.focus();
      linkField.style.borderColor = '#ef4444';
      setTimeout(() => { linkField.style.borderColor = ''; }, 1500);
      return;
    }
    startAnalyzing();
  });

  linkField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') analyzeBtn.click();
  });

  /* ================================================
     ANALYZING SIMULATION
     ================================================ */

  // Step definitions: label, percentage range [start, end]
  const STEPS = [
    { end: 15 },   // Uploading file
    { end: 45 },   // Analyzing content
    { end: 70 },   // Checking AI patterns
    { end: 88 },   // Tracing origin
    { end: 100 },  // Compiling results
  ];

  function startAnalyzing() {
    // Hide hero, show analyzing screen
    hero.classList.add('hidden');
    analyzeScreen.classList.add('visible');
    analyzeScreen.setAttribute('aria-hidden', 'false');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Reset state
    resetSteps();
    setProgress(0);

    // Run the simulated pipeline
    runPipeline();
  }

  function resetSteps() {
    const items = stepList.querySelectorAll('.step');
    items.forEach((item) => {
      item.className = 'step step--pending';
    });
  }

  function setStepState(index, state) {
    const items = stepList.querySelectorAll('.step');
    if (items[index]) {
      items[index].className = `step step--${state}`;
    }
  }

  function setProgress(pct) {
    const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
    ringFill.style.strokeDashoffset = offset;
    pctText.textContent = `${Math.round(pct)}%`;
  }

  /**
   * Animate the percentage counter from `from` to `to` over `duration` ms,
   * resolves when done.
   */
  function animateProgress(from, to, duration) {
    return new Promise((resolve) => {
      const start = performance.now();
      function tick(now) {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        // ease-out quad
        const eased = 1 - (1 - t) * (1 - t);
        const current = from + (to - from) * eased;
        setProgress(current);
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(tick);
    });
  }

  async function runPipeline() {
    let prevEnd = 0;

    for (let i = 0; i < STEPS.length; i++) {
      // Mark step as active
      setStepState(i, 'active');

      // Animate progress for this step
      const stepDuration = 1200 + Math.random() * 1200; // 1.2 – 2.4 s
      await animateProgress(prevEnd, STEPS[i].end, stepDuration);

      // Mark step as done
      setStepState(i, 'done');
      prevEnd = STEPS[i].end;

      // Small pause between steps
      if (i < STEPS.length - 1) {
        await delay(300 + Math.random() * 200);
      }
    }

    // All done — transition to results
    await delay(600);
    showResults();
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /* ================================================
     RESULTS SCREEN
     ================================================ */

  function showResults() {
    // Hide analyzing, show results
    analyzeScreen.classList.remove('visible');
    analyzeScreen.setAttribute('aria-hidden', 'true');

    resultsScreen.classList.add('visible');
    resultsScreen.setAttribute('aria-hidden', 'false');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Animate the probability bar fill after a short delay
    const bar = document.getElementById('results-bar');
    bar.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.width = '87.4%';
      });
    });
  }

  /* ---- Back to home ---- */
  backToHome.addEventListener('click', (e) => {
    e.preventDefault();

    // Hide results
    resultsScreen.classList.remove('visible');
    resultsScreen.setAttribute('aria-hidden', 'true');

    // Show hero
    hero.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ================================================
     ORIGIN TRACE SCREEN
     ================================================ */

  const traceScreen  = document.getElementById('trace-screen');
  const viewTraceBtn = document.getElementById('view-trace-btn');

  viewTraceBtn.addEventListener('click', () => {
    // Hide results, show trace
    resultsScreen.classList.remove('visible');
    resultsScreen.setAttribute('aria-hidden', 'true');

    // Reset animations by removing & re-adding class
    traceScreen.classList.remove('visible');
    void traceScreen.offsetWidth; // force reflow
    traceScreen.classList.add('visible');
    traceScreen.setAttribute('aria-hidden', 'false');

    // Re-trigger entry animations
    traceScreen.querySelectorAll('.trace__entry').forEach((el) => {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ================================================
     SCAN HISTORY (localStorage)
     ================================================ */

  const STORAGE_KEY    = 'deeptrace_scans';
  const historySection = document.getElementById('history-screen');
  const historyList    = document.getElementById('history-list');
  const historyEmpty   = document.getElementById('history-empty');
  const clearBtn       = document.getElementById('clear-history');

  // Seed sample data on first visit so the UI is visible
  function seedSampleData() {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const samples = [
      { filename: 'image.jpg', dimensions: '1280 x 720', result: 'ai', probability: 87.4, date: '2024-05-15T10:30:00', thumb: 'assets/sample-scan.jpg' },
      { filename: 'portrait.png', dimensions: '1024 x 1280', result: 'real', probability: 12.7, date: '2024-05-14T21:15:00', thumb: 'assets/sample-scan.jpg' },
      { filename: 'video.mp4', dimensions: '1920 x 1080', result: 'uncertain', probability: 48.2, date: '2024-05-14T18:42:00', thumb: 'assets/sample-scan.jpg' },
      { filename: 'scene.jpg', dimensions: '1600 x 900', result: 'ai', probability: 91.3, date: '2024-05-13T11:20:00', thumb: 'assets/sample-scan.jpg' },
      { filename: 'photo.png', dimensions: '1080 x 1080', result: 'real', probability: 8.9, date: '2024-05-12T18:05:00', thumb: 'assets/sample-scan.jpg' },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
  }

  function getScans() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function formatDate(iso) {
    const d = new Date(iso);
    const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { day, time };
  }

  function badgeClass(result) {
    if (result === 'ai')        return 'history__badge--ai';
    if (result === 'real')      return 'history__badge--real';
    return 'history__badge--uncertain';
  }

  function badgeLabel(result) {
    if (result === 'ai')        return 'Likely AI Generated';
    if (result === 'real')      return 'Likely Real';
    return 'Uncertain';
  }

  function renderHistory() {
    const scans = getScans();
    historyList.innerHTML = '';

    if (scans.length === 0) {
      historySection.classList.add('is-empty');
      historyEmpty.classList.add('show');
      return;
    }

    historySection.classList.remove('is-empty');
    historyEmpty.classList.remove('show');

    scans.forEach((scan) => {
      const { day, time } = formatDate(scan.date);
      const li = document.createElement('li');
      li.className = 'history__row';
      li.innerHTML = `
        <img src="${scan.thumb || ''}" alt="" class="history__thumb" />
        <div class="history__file">
          <span class="history__filename">${scan.filename}</span>
          <span class="history__dimensions">${scan.dimensions}</span>
        </div>
        <span class="history__badge ${badgeClass(scan.result)}">${badgeLabel(scan.result)}</span>
        <span class="history__prob">${scan.probability}%</span>
        <div class="history__date">
          <span class="history__date-day">${day}</span>
          <span class="history__date-time">${time}</span>
        </div>
        <span class="history__chevron">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      `;
      historyList.appendChild(li);
    });
  }

  // Clear history
  clearBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
  });

  /**
   * Public helper — call window.DeepTrace.saveScan({...}) to add a scan.
   * Expected shape: { filename, dimensions, result, probability, date, thumb }
   *   result: 'ai' | 'real' | 'uncertain'
   */
  window.DeepTrace = window.DeepTrace || {};
  window.DeepTrace.saveScan = function (scan) {
    const scans = getScans();
    scans.unshift(scan);
    // Keep only last 10
    if (scans.length > 10) scans.length = 10;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
    renderHistory();
  };

  // Init
  seedSampleData();
  renderHistory();

  /* ================================================
     NAVIGATION
     ================================================ */
  const navHowBtn = document.getElementById('nav-how');
  const howItWorksScreen = document.getElementById('how-it-works-screen');
  const navAboutBtn = document.getElementById('nav-about');
  const aboutScreen = document.getElementById('about-screen');
  const navDetectBtn = document.getElementById('nav-detect');
  const navHistoryBtn = document.getElementById('nav-history');
  const historyScreenNode = document.getElementById('history-screen'); // renamed to avoid conflict
  const logoBtn = document.getElementById('logo');

  function hideAllScreens() {
    hero.classList.add('hidden');
    analyzeScreen.classList.remove('visible');
    analyzeScreen.setAttribute('aria-hidden', 'true');
    resultsScreen.classList.remove('visible');
    resultsScreen.setAttribute('aria-hidden', 'true');
    traceScreen.classList.remove('visible');
    traceScreen.setAttribute('aria-hidden', 'true');
    howItWorksScreen.classList.remove('visible');
    howItWorksScreen.setAttribute('aria-hidden', 'true');
    if (aboutScreen) {
      aboutScreen.classList.remove('visible');
      aboutScreen.setAttribute('aria-hidden', 'true');
    }
    if (historyScreenNode) {
      historyScreenNode.classList.remove('visible');
      historyScreenNode.setAttribute('aria-hidden', 'true');
    }
  }

  // Detect -> Hero
  navDetectBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllScreens();
    hero.classList.remove('hidden');
    navbar.classList.remove('nav-open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Logo -> Hero
  logoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllScreens();
    hero.classList.remove('hidden');
    navbar.classList.remove('nav-open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // History
  if (navHistoryBtn && historyScreenNode) {
    navHistoryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      hideAllScreens();
      historyScreenNode.classList.add('visible');
      historyScreenNode.setAttribute('aria-hidden', 'false');
      navbar.classList.remove('nav-open');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // How it works
  navHowBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllScreens();
    howItWorksScreen.classList.add('visible');
    howItWorksScreen.setAttribute('aria-hidden', 'false');
    navbar.classList.remove('nav-open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // About
  if (navAboutBtn && aboutScreen) {
    navAboutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      hideAllScreens();
      aboutScreen.classList.add('visible');
      aboutScreen.setAttribute('aria-hidden', 'false');
      navbar.classList.remove('nav-open');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
