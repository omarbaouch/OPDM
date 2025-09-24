const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/**
 * Hero metrics animation
 */
const heroMetrics = [
  {
    id: 'metric-ads',
    target: 870,
    prefix: '',
    suffix: '€',
    decimals: 0,
  },
  {
    id: 'metric-affil',
    target: 18400,
    format: 'currency',
  },
  {
    id: 'metric-don',
    target: 9200,
    format: 'currency',
  },
];

function animateValue({ element, target, duration = 1400, decimals = 0, prefix = '', suffix = '', format }) {
  const start = performance.now();
  const step = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const value = target * progress;
    if (format === 'currency') {
      element.textContent = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    } else {
      element.textContent = `${prefix}${value.toFixed(decimals).replace('.', ',')}${suffix}`;
    }
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

heroMetrics.forEach((metric) => {
  const element = document.getElementById(metric.id);
  if (!element) return;
  animateValue({ element, ...metric });
});

/**
 * Mix selector (scenarios)
 */
const mixes = {
  lancement: {
    cpm: 14,
    click: 1.9,
    don: 0.8,
    revenue: 12800,
  },
  croissance: {
    cpm: 21,
    click: 2.6,
    don: 1.3,
    revenue: 18640,
  },
  communautaire: {
    cpm: 24,
    click: 3.4,
    don: 2.8,
    revenue: 24360,
  },
};

const mixButtons = document.querySelectorAll('.mix-btn');
const mixCpm = document.getElementById('mix-cpm');
const mixClick = document.getElementById('mix-click');
const mixDon = document.getElementById('mix-don');
const mixRevenue = document.getElementById('mix-revenu');

function formatCurrency(value, options = {}) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
  }).format(value);
}

function setMix(name) {
  const mix = mixes[name];
  if (!mix) return;

  mixButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mix === name);
  });

  if (mixCpm) mixCpm.textContent = formatCurrency(mix.cpm, { maximumFractionDigits: 0 });
  if (mixClick) mixClick.textContent = `${mix.click.toFixed(1).replace('.', ',')}%`;
  if (mixDon) mixDon.textContent = `${mix.don.toFixed(1).replace('.', ',')}%`;
  if (mixRevenue) mixRevenue.textContent = formatCurrency(mix.revenue);
}

mixButtons.forEach((button) => {
  button.addEventListener('click', () => setMix(button.dataset.mix));
});

setMix('lancement');

/**
 * Engine ticker animation
 */
const tickerLines = [
  'Article SEO publié → push newsletter → 1 200 clics affiliés générés.',
  'Live Twitch programmé → capsule vidéo sponsorisée insérée automatiquement.',
  'Podcast diffusé → extrait court sur réseaux → 650 tips communautaires.',
  'Thread X autopilot → 3 offres green fintech mises en avant selon les intérêts.',
];

const ticker = document.getElementById('engine-ticker');
let tickerIndex = 0;

function renderTicker() {
  if (!ticker) return;
  ticker.textContent = tickerLines[tickerIndex];
  tickerIndex = (tickerIndex + 1) % tickerLines.length;
}

if (ticker) {
  renderTicker();
  setInterval(renderTicker, 4200);
}

const engineCounters = [
  { id: 'engine-seo', target: 42 },
  { id: 'engine-reels', target: 18 },
  { id: 'engine-mail', target: 9 },
];

engineCounters.forEach(({ id, target }) => {
  const el = document.getElementById(id);
  if (!el) return;
  animateValue({ element: el, target, decimals: 0 });
});

/**
 * Revenue simulator
 */
const trafficInput = document.getElementById('input-traffic');
const cpmInput = document.getElementById('input-cpm');
const fillInput = document.getElementById('input-fill');
const clickInput = document.getElementById('input-click');
const convInput = document.getElementById('input-conv');
const commissionInput = document.getElementById('input-commission');
const donorRateInput = document.getElementById('input-donateurs');
const donationInput = document.getElementById('input-don');
const calcBtn = document.getElementById('btn-calculer');

const adsOutput = document.getElementById('result-ads');
const affilOutput = document.getElementById('result-affil');
const donsOutput = document.getElementById('result-dons');
const totalOutput = document.getElementById('result-total');
const dailyOutput = document.getElementById('result-journalier');

function calculateRevenue() {
  if (
    !trafficInput ||
    !cpmInput ||
    !fillInput ||
    !clickInput ||
    !convInput ||
    !commissionInput ||
    !donorRateInput ||
    !donationInput ||
    !adsOutput ||
    !affilOutput ||
    !donsOutput ||
    !totalOutput ||
    !dailyOutput
  ) {
    return;
  }

  const traffic = Number(trafficInput.value) || 0;
  const cpm = Number(cpmInput.value) || 0;
  const fillRate = (Number(fillInput.value) || 0) / 100;
  const clickRate = (Number(clickInput.value) || 0) / 100;
  const conversionRate = (Number(convInput.value) || 0) / 100;
  const commission = Number(commissionInput.value) || 0;
  const donorRate = (Number(donorRateInput.value) || 0) / 100;
  const donation = Number(donationInput.value) || 0;

  const adRevenue = ((traffic * fillRate) / 1000) * cpm;
  const affiliateClicks = traffic * clickRate;
  const affiliateConversions = affiliateClicks * conversionRate;
  const affiliateRevenue = affiliateConversions * commission;
  const donationRevenue = traffic * donorRate * donation;

  const total = adRevenue + affiliateRevenue + donationRevenue;
  const daily = total / 30;

  adsOutput.textContent = formatCurrency(adRevenue, { maximumFractionDigits: 0 });
  affilOutput.textContent = formatCurrency(affiliateRevenue, { maximumFractionDigits: 0 });
  donsOutput.textContent = formatCurrency(donationRevenue, { maximumFractionDigits: 0 });
  totalOutput.textContent = formatCurrency(total, { maximumFractionDigits: 0 });
  dailyOutput.textContent = formatCurrency(daily, { maximumFractionDigits: 0 });
}

if (calcBtn) {
  calcBtn.addEventListener('click', calculateRevenue);
  calculateRevenue();
}

/**
 * Showcase tabs
 */
const showcaseTabs = document.querySelectorAll('.showcase-tab');
const showcaseSlots = document.querySelectorAll('.slot');

function setSlot(slotName) {
  showcaseTabs.forEach((tab) => {
    const isActive = tab.dataset.slot === slotName;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  showcaseSlots.forEach((slot) => {
    slot.classList.toggle('hidden', slot.dataset.slot !== slotName);
  });
}

showcaseTabs.forEach((tab) => {
  tab.addEventListener('click', () => setSlot(tab.dataset.slot));
});

setSlot('banner');

/**
 * Lead form persistence (local only)
 */
const leadForm = document.querySelector('.cta-form');
const emailInput = document.getElementById('input-email');
const siteInput = document.getElementById('input-site');

if (leadForm && emailInput && siteInput) {
  const stored = JSON.parse(localStorage.getItem('cashloop-lead') || 'null');
  if (stored) {
    emailInput.value = stored.email ?? '';
    siteInput.value = stored.site ?? '';
  }

  leadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const payload = {
      email: emailInput.value,
      site: siteInput.value,
      timestamp: Date.now(),
    };
    localStorage.setItem('cashloop-lead', JSON.stringify(payload));
    leadForm.classList.add('submitted');
    if (!leadForm.querySelector('.form-success')) {
      leadForm.insertAdjacentHTML(
        'beforeend',
        '<p class="form-success">Merci ! Nous revenons vers vous sous 24h ouvrées.</p>'
      );
    }
  });
}
