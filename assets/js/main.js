const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/**
 * Hero metrics animation
 */
const heroMetrics = [
  {
    id: 'metric-visiteurs',
    target: 420,
    suffix: '%',
    prefix: '+',
    decimals: 0,
  },
  {
    id: 'metric-revenus',
    target: 78500,
    prefix: '',
    format: 'currency',
  },
  {
    id: 'metric-roi',
    target: 5.6,
    suffix: 'x',
    decimals: 1,
  },
];

function animateValue({ element, target, duration = 1600, decimals = 0, prefix = '', suffix = '', format }) {
  const start = performance.now();
  const animate = (time) => {
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
      const formatted = value.toFixed(decimals).replace('.', ',');
      element.textContent = `${prefix}${formatted}${suffix}`;
    }
    if (progress < 1) requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
}

heroMetrics.forEach((metric) => {
  const element = document.getElementById(metric.id);
  if (!element) return;
  const { target, decimals = 0, prefix = '', suffix = '', format } = metric;
  animateValue({ element, target, decimals, prefix, suffix, format });
});

/**
 * Plan handling
 */
const planConfigurations = {
  starter: {
    arpu: 59,
    conversion: 0.032,
    ltv: 420,
    projection: 18600,
    simulator: {
      visitors: 2800,
      conversion: 3.2,
      arpu: 59,
      retention: 48,
      cost: 9000,
    },
  },
  growth: {
    arpu: 112,
    conversion: 0.045,
    ltv: 840,
    projection: 38400,
    simulator: {
      visitors: 4200,
      conversion: 4.5,
      arpu: 112,
      retention: 58,
      cost: 14500,
    },
  },
  elite: {
    arpu: 189,
    conversion: 0.057,
    ltv: 1480,
    projection: 67200,
    simulator: {
      visitors: 6800,
      conversion: 5.7,
      arpu: 189,
      retention: 62,
      cost: 26000,
    },
  },
};

const planCards = document.querySelectorAll('.plan-card');
const kpiArpu = document.getElementById('kpi-arpu');
const kpiConv = document.getElementById('kpi-conv');
const kpiLtv = document.getElementById('kpi-ltv');
const projectionValue = document.getElementById('projection-value');

function formatCurrency(value, options = {}) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
  }).format(value);
}

function setPlan(planName) {
  const config = planConfigurations[planName];
  if (!config) return;

  planCards.forEach((card) => {
    card.classList.toggle('active', card.dataset.plan === planName);
  });

  if (kpiArpu) kpiArpu.textContent = formatCurrency(config.arpu, { maximumFractionDigits: 0 });
  if (kpiConv)
    kpiConv.textContent = `${(config.conversion * 100).toFixed(1).replace('.', ',')}%`;
  if (kpiLtv) kpiLtv.textContent = formatCurrency(config.ltv, { maximumFractionDigits: 0 });
  if (projectionValue)
    projectionValue.textContent = formatCurrency(config.projection, { maximumFractionDigits: 0 });

  populateSimulator(config.simulator);
}

planCards.forEach((card) => {
  const button = card.querySelector('.select-plan');
  if (!button) return;
  button.addEventListener('click', () => {
    setPlan(card.dataset.plan);
    calculateRevenue();
  });
});

/**
 * Revenue simulator
 */
const visitorsInput = document.getElementById('input-visiteurs');
const conversionInput = document.getElementById('input-conversion');
const arpuInput = document.getElementById('input-arpu');
const retentionInput = document.getElementById('input-retention');
const costInput = document.getElementById('input-cout');
const btnSimuler = document.getElementById('btn-simuler');
const revenueOutput = document.getElementById('result-revenue');
const clientsOutput = document.getElementById('result-clients');
const annualOutput = document.getElementById('result-annual');
const netOutput = document.getElementById('result-net');
const breakEvenOutput = document.getElementById('result-breakeven');

function populateSimulator(simulatorConfig) {
  if (!simulatorConfig) return;
  if (visitorsInput) visitorsInput.value = simulatorConfig.visitors;
  if (conversionInput) conversionInput.value = simulatorConfig.conversion;
  if (arpuInput) arpuInput.value = simulatorConfig.arpu;
  if (retentionInput) retentionInput.value = simulatorConfig.retention;
  if (costInput) costInput.value = simulatorConfig.cost;
}

function calculateRevenue() {
  if (
    !visitorsInput ||
    !conversionInput ||
    !arpuInput ||
    !retentionInput ||
    !costInput ||
    !revenueOutput ||
    !clientsOutput ||
    !annualOutput ||
    !netOutput ||
    !breakEvenOutput
  ) {
    return;
  }

  const visitors = Number(visitorsInput.value);
  const conversionRate = Number(conversionInput.value) / 100;
  const arpu = Number(arpuInput.value);
  const retentionRate = Number(retentionInput.value) / 100;
  const fixedCosts = Number(costInput.value);

  const payingClients = Math.round(visitors * conversionRate);
  const activeClients = Math.round(payingClients * retentionRate);
  const monthlyRevenue = Math.round(activeClients * arpu);
  const annualRevenue = monthlyRevenue * 12;
  const netProfit = monthlyRevenue - fixedCosts;
  const breakEven = arpu > 0 ? Math.ceil(fixedCosts / arpu) : 0;

  revenueOutput.textContent = formatCurrency(monthlyRevenue);
  clientsOutput.textContent = activeClients.toLocaleString('fr-FR');
  annualOutput.textContent = formatCurrency(annualRevenue);
  netOutput.textContent = formatCurrency(netProfit);
  breakEvenOutput.textContent = `${breakEven.toLocaleString('fr-FR')} clients`;
}

if (btnSimuler) {
  btnSimuler.addEventListener('click', calculateRevenue);
}

/**
 * Lead form handling
 */
const leadForm = document.getElementById('lead-form');
const leadMessage = document.getElementById('lead-message');

function storeLead(data) {
  const existing = JSON.parse(localStorage.getItem('jackpot-leads') || '[]');
  existing.push({ ...data, createdAt: new Date().toISOString() });
  localStorage.setItem('jackpot-leads', JSON.stringify(existing));
}

if (leadForm) {
  leadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(leadForm);
    const payload = Object.fromEntries(formData.entries());

    if (!payload.name || !payload.email || !payload.company || !payload.goal) {
      if (leadMessage) {
        leadMessage.textContent = 'Merci de compléter tous les champs obligatoires.';
        leadMessage.style.color = 'var(--danger)';
      }
      return;
    }

    storeLead(payload);
    leadForm.reset();

    if (leadMessage) {
      leadMessage.textContent = "Plan envoyé ! Vérifiez votre boîte mail dans les prochaines minutes.";
      leadMessage.style.color = 'var(--success)';
    }
  });
}

// Initialise default view
setPlan('growth');
calculateRevenue();
