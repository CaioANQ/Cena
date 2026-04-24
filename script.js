const STORAGE_KEY = "sethub-mvp-state-v1";

const ROLE_CONFIG = {
  ac: {
    label: "1º Assistente de Câmera",
    eyebrow: "Solicitante",
    defaultView: "catalog",
    nav: [
      { id: "catalog", label: "Busca", icon: "search" },
      { id: "quotes", label: "Cotações", icon: "clipboard" },
      { id: "schedule", label: "Agenda", icon: "calendar" },
      { id: "profile", label: "Meus dados", icon: "user" },
    ],
  },
  df: {
    label: "Diretor de Fotografia",
    eyebrow: "Aprovação técnica",
    defaultView: "catalog",
    nav: [
      { id: "catalog", label: "Busca", icon: "search" },
      { id: "quotes", label: "Aprovar", icon: "clipboard" },
      { id: "schedule", label: "Agenda", icon: "calendar" },
      { id: "profile", label: "Meus dados", icon: "user" },
    ],
  },
  staff: {
    label: "Equipe da locadora",
    eyebrow: "Operação",
    defaultView: "operations",
    nav: [
      { id: "operations", label: "Retiradas", icon: "truck" },
      { id: "quotesAdmin", label: "Cotações", icon: "clipboard" },
      { id: "inventory", label: "Equipamentos", icon: "camera" },
      { id: "profile", label: "Conta", icon: "user" },
    ],
  },
  admin: {
    label: "Administrador da locadora",
    eyebrow: "Gestão",
    defaultView: "admin",
    nav: [
      { id: "admin", label: "Painel", icon: "chart" },
      { id: "quotesAdmin", label: "Cotações", icon: "clipboard" },
      { id: "inventory", label: "Inventário", icon: "camera" },
      { id: "security", label: "LGPD", icon: "shield" },
      { id: "reports", label: "Relatórios", icon: "chart" },
    ],
  },
};

const VIEW_TITLES = {
  catalog: "Busca de equipamentos",
  quotes: "Cotações e aprovações",
  schedule: "Agenda de retirada",
  profile: "Dados e consentimento",
  admin: "Painel da locadora",
  quotesAdmin: "Fila de cotações",
  inventory: "Cadastro de equipamentos",
  operations: "Checagem e retirada",
  security: "Governança LGPD",
  reports: "Relatórios operacionais",
};

const CATEGORY_IMAGE = {
  "Câmeras": "assets/camera-body.svg",
  "Lentes": "assets/lens-set.svg",
  "Monitoramento": "assets/monitor.svg",
  "Wireless": "assets/wireless-video.svg",
  "Grip": "assets/grip-kit.svg",
  "Luz": "assets/light-kit.svg",
};

const CHECK_ITEMS = [
  ["tables", "Fotos da mesa de equipamentos"],
  ["camera", "Corpo de câmera e acessórios"],
  ["lenses", "Lentes, tampas e cases"],
  ["power", "Baterias, carregadores e cabos"],
  ["media", "Mídias, leitores e etiquetas"],
  ["electronics", "Testes eletrônicos gravados"],
];

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

let state = loadState();
const runtimePhotos = new Map();

const els = {
  view: document.querySelector("#view"),
  sideNav: document.querySelector("#sideNav"),
  roleSwitch: document.querySelector("#roleSwitch"),
  contextPanel: document.querySelector("#contextPanel"),
  roleEyebrow: document.querySelector("#roleEyebrow"),
  pageTitle: document.querySelector("#pageTitle"),
  primaryAction: document.querySelector("#primaryAction"),
  resetDemo: document.querySelector("#resetDemo"),
  quoteDialog: document.querySelector("#quoteDialog"),
  quoteForm: document.querySelector("#quoteForm"),
  quoteError: document.querySelector("#quoteError"),
  equipmentDialog: document.querySelector("#equipmentDialog"),
  equipmentDetailTitle: document.querySelector("#equipmentDetailTitle"),
  equipmentDetailBody: document.querySelector("#equipmentDetailBody"),
  toast: document.querySelector("#toast"),
};

function createSeedState() {
  const pickupDate = addDaysInput(4);
  const returnDate = addDaysInput(7);

  return {
    version: 1,
    currentRole: "ac",
    currentView: "catalog",
    currentRentalId: "cineforte",
    filters: {
      query: "",
      category: "Todos",
      rental: "Todas",
      date: pickupDate,
      onlyAvailable: true,
    },
    cart: [],
    profile: {
      name: "Marina Costa",
      cpf: "529.982.247-25",
      phone: "(11) 98765-4321",
      email: "marina.camera@example.com",
      requesterRole: "1º Assistente de Câmera",
      consent: true,
    },
    rentalHouses: [
      {
        id: "cineforte",
        name: "CineForte Rental",
        district: "Vila Leopoldina",
        city: "São Paulo",
        rating: 4.8,
        responseTime: "1h40",
        pickupSlots: ["08:30", "10:00", "14:00", "17:00"],
        admin: "Lia Ramos",
        phone: "(11) 3030-1122",
      },
      {
        id: "focoalfa",
        name: "Foco Alfa",
        district: "Barra Funda",
        city: "São Paulo",
        rating: 4.7,
        responseTime: "2h10",
        pickupSlots: ["09:00", "11:00", "15:00", "18:00"],
        admin: "Nuno Reis",
        phone: "(11) 4090-4400",
      },
      {
        id: "luznorte",
        name: "Luz Norte",
        district: "Santa Cecília",
        city: "São Paulo",
        rating: 4.6,
        responseTime: "3h",
        pickupSlots: ["08:00", "13:00", "16:30"],
        admin: "Patrícia Mello",
        phone: "(11) 3777-9050",
      },
    ],
    equipment: [
      {
        id: "eq-alexa-mini-lf",
        rentalHouseId: "cineforte",
        name: "ARRI Alexa Mini LF",
        category: "Câmeras",
        description: "Corpo de câmera cinema digital para sets publicitários e ficção.",
        technical: "Large Format, ARRIRAW, ProRes, LPL mount, SDI out, 4.5K",
        tech: ["4.5K", "ARRIRAW", "LPL", "SDI"],
        quantity: 2,
        available: 2,
        dailyValue: 2800,
        image: "assets/camera-body.svg",
        status: "Disponível",
      },
      {
        id: "eq-sony-fx6",
        rentalHouseId: "focoalfa",
        name: "Sony FX6 kit documentário",
        category: "Câmeras",
        description: "Kit leve para diária externa, entrevistas e câmera B.",
        technical: "Full-frame 4K, E-mount, ND eletrônico, XLR handle, 10-bit",
        tech: ["4K", "ND", "XLR", "E-mount"],
        quantity: 3,
        available: 3,
        dailyValue: 950,
        image: "assets/camera-body.svg",
        status: "Disponível",
      },
      {
        id: "eq-venice2",
        rentalHouseId: "luznorte",
        name: "Sony Venice 2",
        category: "Câmeras",
        description: "Corpo principal para longa, publicidade e fluxo high-end.",
        technical: "8.6K, X-OCN, PL mount, Rialto ready, dual base ISO",
        tech: ["8.6K", "PL", "X-OCN", "Rialto"],
        quantity: 1,
        available: 0,
        dailyValue: 3600,
        image: "assets/camera-body.svg",
        status: "Reservado",
      },
      {
        id: "eq-zeiss-cp3",
        rentalHouseId: "cineforte",
        name: "Zeiss CP.3 kit 6 lentes",
        category: "Lentes",
        description: "Jogo prime com cobertura full-frame e case dedicado.",
        technical: "18, 25, 35, 50, 85, 135mm, T2.1-T2.9, PL mount",
        tech: ["FF", "PL", "T2.1", "6 lentes"],
        quantity: 1,
        available: 1,
        dailyValue: 1800,
        image: "assets/lens-set.svg",
        status: "Disponível",
      },
      {
        id: "eq-sigma-cine",
        rentalHouseId: "focoalfa",
        name: "Sigma Cine FF kit",
        category: "Lentes",
        description: "Primes full-frame para sets compactos com follow focus.",
        technical: "20, 24, 35, 50, 85mm, T1.5, EF/PL, 95mm front",
        tech: ["T1.5", "FF", "95mm", "5 lentes"],
        quantity: 2,
        available: 2,
        dailyValue: 1150,
        image: "assets/lens-set.svg",
        status: "Disponível",
      },
      {
        id: "eq-smallhd",
        rentalHouseId: "cineforte",
        name: "SmallHD Cine 7",
        category: "Monitoramento",
        description: "Monitor on-board de alto brilho com ferramentas de exposição.",
        technical: "7 polegadas, 1800 nits, SDI/HDMI, LUT, waveform, false color",
        tech: ["1800 nits", "SDI", "LUT", "Waveform"],
        quantity: 4,
        available: 3,
        dailyValue: 320,
        image: "assets/monitor.svg",
        status: "Disponível",
      },
      {
        id: "eq-teradek",
        rentalHouseId: "focoalfa",
        name: "Teradek Bolt 4K LT 750",
        category: "Wireless",
        description: "Transmissão de vídeo sem fio para vídeo village e foco.",
        technical: "4K HDR, 750ft, zero-delay, SDI/HDMI, DFS",
        tech: ["4K HDR", "750ft", "SDI", "HDMI"],
        quantity: 2,
        available: 1,
        dailyValue: 680,
        image: "assets/wireless-video.svg",
        status: "Disponível",
      },
      {
        id: "eq-aputure-600",
        rentalHouseId: "luznorte",
        name: "Aputure LS 600d Pro",
        category: "Luz",
        description: "Fonte daylight potente para locação interna e externa.",
        technical: "600W, Bowens, DMX, Sidus Link, V-mount control box",
        tech: ["600W", "DMX", "Bowens", "Sidus"],
        quantity: 5,
        available: 4,
        dailyValue: 430,
        image: "assets/light-kit.svg",
        status: "Disponível",
      },
      {
        id: "eq-easyrig",
        rentalHouseId: "luznorte",
        name: "Easyrig Vario 5",
        category: "Grip",
        description: "Suporte corporal para jornadas longas de câmera na mão.",
        technical: "Carga 5-17kg, colete ajustável, braço padrão, case rígido",
        tech: ["5-17kg", "Colete", "Case", "Braço"],
        quantity: 2,
        available: 2,
        dailyValue: 390,
        image: "assets/grip-kit.svg",
        status: "Disponível",
      },
    ],
    quotes: [
      {
        id: "CT-1842",
        project: "Curta Horizonte",
        createdAt: addDaysInput(-2),
        pickupDate: addDaysInput(5),
        pickupTime: "10:00",
        returnDate: addDaysInput(8),
        requester: {
          name: "Marina Costa",
          cpf: "529.982.247-25",
          phone: "(11) 98765-4321",
          email: "marina.camera@example.com",
          requesterRole: "1º Assistente de Câmera",
        },
        notes: "Retirada com prep de câmera e teste de wireless.",
        items: [
          { equipmentId: "eq-alexa-mini-lf", quantity: 1 },
          { equipmentId: "eq-zeiss-cp3", quantity: 1 },
          { equipmentId: "eq-smallhd", quantity: 2 },
        ],
        responses: [
          {
            rentalHouseId: "cineforte",
            status: "Enviada",
            total: 16640,
            expiresAt: addDaysInput(1),
            conditions: "Inclui prep assistido, cases conferidos e seguro sob aprovação.",
          },
        ],
        status: "Cotação recebida",
        approvedRentalHouseId: null,
        approvedRentalHouseIds: [],
        checkStatus: "Pendente",
      },
      {
        id: "RS-1088",
        project: "Clipe Rua Alta",
        createdAt: addDaysInput(-8),
        pickupDate,
        pickupTime: "08:30",
        returnDate,
        requester: {
          name: "Rafael Oliveira",
          cpf: "111.444.777-35",
          phone: "(21) 99888-1100",
          email: "rafael.df@example.com",
          requesterRole: "Diretor de Fotografia",
        },
        notes: "Motorista chega de van às 11h após checagem.",
        items: [
          { equipmentId: "eq-sony-fx6", quantity: 1 },
          { equipmentId: "eq-sigma-cine", quantity: 1 },
          { equipmentId: "eq-teradek", quantity: 1 },
        ],
        responses: [
          {
            rentalHouseId: "focoalfa",
            status: "Aprovada",
            total: 11120,
            expiresAt: addDaysInput(-3),
            conditions: "Reserva confirmada. Van credenciada: placa final 42.",
          },
        ],
        status: "Reserva aprovada",
        approvedRentalHouseId: "focoalfa",
        approvedRentalHouseIds: ["focoalfa"],
        checkStatus: "Em checagem",
        checklist: {
          tables: true,
          camera: true,
          lenses: false,
          power: false,
          media: false,
          electronics: false,
        },
      },
    ],
    security: {
      mfa: true,
      audit: true,
      quoteExpiry: true,
      retention: "180 dias",
      dataExport: true,
    },
    audit: [
      {
        at: new Date().toISOString(),
        actor: "Sistema",
        action: "Ambiente de validação iniciado",
      },
      {
        at: addDaysIso(-1),
        actor: "Foco Alfa",
        action: "Cotação RS-1088 aprovada pelo solicitante",
      },
    ],
  };
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return createSeedState();
    const parsed = JSON.parse(saved);
    if (!parsed || parsed.version !== 1) return createSeedState();
    return parsed;
  } catch (error) {
    return createSeedState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    showToast("Não foi possível salvar no navegador.");
  }
}

function renderApp() {
  ensureCurrentView();
  renderRoleSwitch();
  renderNav();
  renderTopbar();
  renderView();
  renderContext();
  saveState();
}

function ensureCurrentView() {
  const role = ROLE_CONFIG[state.currentRole];
  if (!role.nav.some((item) => item.id === state.currentView)) {
    state.currentView = role.defaultView;
  }
}

function renderRoleSwitch() {
  els.roleSwitch.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.role === state.currentRole);
  });
}

function renderNav() {
  const nav = ROLE_CONFIG[state.currentRole].nav;
  els.sideNav.innerHTML = nav
    .map((item) => {
      const count = getNavCount(item.id);
      return `
        <button class="nav-button ${state.currentView === item.id ? "active" : ""}" type="button" data-view="${item.id}">
          <svg><use href="#icon-${item.icon}"></use></svg>
          <span>${escapeHtml(item.label)}</span>
          <small>${count}</small>
        </button>
      `;
    })
    .join("");
}

function renderTopbar() {
  const role = ROLE_CONFIG[state.currentRole];
  els.roleEyebrow.textContent = `${role.eyebrow} · ${role.label}`;
  els.pageTitle.textContent = VIEW_TITLES[state.currentView] || "SetHub";

  const action = getPrimaryAction();
  els.primaryAction.disabled = action.disabled;
  els.primaryAction.dataset.action = action.action;
  els.primaryAction.querySelector("use").setAttribute("href", `#icon-${action.icon}`);
  els.primaryAction.querySelector("span").textContent = action.label;
}

function getPrimaryAction() {
  if (isRequesterRole()) {
    return {
      action: "open-quote",
      icon: "clipboard",
      label: state.cart.length ? "Pedir cotação" : "Nova cotação",
      disabled: !state.cart.length,
    };
  }

  if (state.currentView === "inventory") {
    return { action: "focus-equipment-form", icon: "plus", label: "Cadastrar", disabled: false };
  }

  if (state.currentView === "operations") {
    return { action: "focus-checklist", icon: "check", label: "Checar retirada", disabled: false };
  }

  return { action: "export-report", icon: "chart", label: "Exportar", disabled: false };
}

function renderView() {
  const renderers = {
    catalog: renderCatalog,
    quotes: renderRequesterQuotes,
    schedule: renderSchedule,
    profile: renderProfile,
    admin: renderAdmin,
    quotesAdmin: renderAdminQuotes,
    inventory: renderInventory,
    operations: renderOperations,
    security: renderSecurity,
    reports: renderReports,
  };
  const renderer = renderers[state.currentView] || renderCatalog;
  els.view.innerHTML = renderer();
  attachViewSideEffects();
}

function renderCatalog() {
  const categories = ["Todos", ...new Set(state.equipment.map((item) => item.category))];
  const rentals = ["Todas", ...state.rentalHouses.map((rental) => rental.id)];
  const filtered = getFilteredEquipment();

  return `
    <section class="workspace-band">
      <div class="workspace-copy">
        <div>
          <p class="eyebrow">Cotação multi-locadora</p>
          <h2>Monte a lista por disponibilidade, peça orçamento e reserve a retirada sem perder o histórico.</h2>
        </div>
        <div class="pill-row">
          <span class="pill"><svg><use href="#icon-lock"></use></svg> valores sob cotação</span>
          <span class="pill"><svg><use href="#icon-calendar"></use></svg> retirada agendada</span>
          <span class="pill"><svg><use href="#icon-shield"></use></svg> consentimento registrado</span>
        </div>
      </div>
      <div class="workspace-media" aria-label="Equipamentos em destaque">
        ${["assets/camera-body.svg", "assets/lens-set.svg", "assets/monitor.svg", "assets/grip-kit.svg"]
          .map((src) => `<div class="media-tile"><img src="${src}" alt="" /></div>`)
          .join("")}
      </div>
    </section>

    <section class="filter-bar" aria-label="Filtros de busca">
      <label class="input-shell">
        <svg><use href="#icon-search"></use></svg>
        <input data-filter="query" value="${escapeAttr(state.filters.query)}" placeholder="Buscar câmera, lente, monitor..." />
      </label>
      <label>
        Categoria
        <select data-filter="category">
          ${categories.map((category) => option(category, state.filters.category)).join("")}
        </select>
      </label>
      <label>
        Locadora
        <select data-filter="rental">
          ${rentals
            .map((rental) => option(rental, state.filters.rental, rental === "Todas" ? "Todas" : getRental(rental).name))
            .join("")}
        </select>
      </label>
      <label>
        Data
        <input type="date" data-filter="date" value="${escapeAttr(state.filters.date)}" />
      </label>
    </section>

    <div class="chip-row" aria-label="Categorias rápidas">
      ${categories
        .map(
          (category) => `
            <button class="chip ${state.filters.category === category ? "active" : ""}" type="button" data-category="${escapeAttr(category)}">
              ${escapeHtml(category)}
            </button>
          `,
        )
        .join("")}
      <button class="chip ${state.filters.onlyAvailable ? "active" : ""}" type="button" data-action="toggle-available">
        Só disponíveis
      </button>
    </div>

    ${
      filtered.length
        ? `<section class="equipment-grid">${filtered.map(renderEquipmentCard).join("")}</section>`
        : renderEmptyState("search", "Nenhum equipamento encontrado", "Ajuste os filtros ou cadastre um item no inventário da locadora.")
    }
  `;
}

function renderEquipmentCard(item) {
  const rental = getRental(item.rentalHouseId);
  const available = getAvailableQuantity(item);
  const availableClass = available > 0 ? "" : "danger";
  return `
    <article class="equipment-card">
      <div class="equipment-thumb">
        <img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.name)}" />
        <span class="status-badge ${availableClass}">${available > 0 ? `${available} disponível` : "Indisponível"}</span>
      </div>
      <div class="equipment-body">
        <div class="equipment-meta">
          <span class="status-badge neutral">${escapeHtml(item.category)}</span>
          <span class="status-badge warning">${escapeHtml(rental.name)}</span>
        </div>
        <div>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </div>
        <ul class="tech-list">${item.tech.map((tech) => `<li>${escapeHtml(tech)}</li>`).join("")}</ul>
        <div class="card-actions">
          <button class="primary-action" type="button" data-action="add-cart" data-id="${escapeAttr(item.id)}" ${available <= 0 ? "disabled" : ""}>
            <svg><use href="#icon-cart"></use></svg>
            <span>Adicionar</span>
          </button>
          <button class="icon-button" type="button" data-action="view-equipment" data-id="${escapeAttr(item.id)}" title="Ver ficha" aria-label="Ver ficha de ${escapeAttr(item.name)}">
            <svg><use href="#icon-eye"></use></svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderRequesterQuotes() {
  if (!state.quotes.length) {
    return renderEmptyState("clipboard", "Nenhuma cotação criada", "Adicione equipamentos ao carrinho e envie para as locadoras.");
  }

  return `
    <section class="quote-list">
      ${state.quotes.map(renderRequesterQuoteCard).join("")}
    </section>
  `;
}

function renderRequesterQuoteCard(quote) {
  const statusClass = quote.status.includes("aprovada") ? "" : quote.status.includes("recebida") ? "warning" : "neutral";
  const items = quote.items.map((item) => getEquipment(item.equipmentId)).filter(Boolean);
  const pendingCount = quote.responses.filter((response) => response.status === "Pendente").length;

  return `
    <article class="quote-card">
      <header>
        <div>
          <p class="eyebrow">${escapeHtml(quote.id)}</p>
          <h3>${escapeHtml(quote.project)}</h3>
        </div>
        <span class="status-badge ${statusClass}">${escapeHtml(quote.status)}</span>
      </header>
      <div class="quote-meta">
        <div class="detail-cell"><span>Retirada</span><strong>${dateLabel(quote.pickupDate)} · ${escapeHtml(quote.pickupTime)}</strong></div>
        <div class="detail-cell"><span>Devolução</span><strong>${dateLabel(quote.returnDate)}</strong></div>
        <div class="detail-cell"><span>Itens</span><strong>${quote.items.reduce((sum, item) => sum + item.quantity, 0)}</strong></div>
      </div>
      <div class="mini-list">
        ${items
          .map((item) => {
            const quoteItem = quote.items.find((entry) => entry.equipmentId === item.id);
            return `<span>${escapeHtml(quoteItem.quantity)}× ${escapeHtml(item.name)}</span>`;
          })
          .join("")}
      </div>
      <div class="response-list">
        ${quote.responses.map((response) => renderRequesterResponse(quote, response)).join("")}
      </div>
      ${
        pendingCount
          ? `<button class="ghost-button" type="button" data-action="simulate-responses" data-id="${escapeAttr(quote.id)}">
              <svg><use href="#icon-check"></use></svg>
              <span>Simular respostas</span>
            </button>`
          : ""
      }
    </article>
  `;
}

function renderRequesterResponse(quote, response) {
  const rental = getRental(response.rentalHouseId);
  const approved = isRentalApproved(quote, response.rentalHouseId) || response.status === "Aprovada";
  const canApprove = response.status === "Enviada" && !approved;

  return `
    <div class="response-row">
      <header>
        <div>
          <strong>${escapeHtml(rental.name)}</strong>
          <small>${escapeHtml(rental.district)} · resposta média ${escapeHtml(rental.responseTime)}</small>
        </div>
        <span class="status-badge ${approved ? "" : response.status === "Pendente" ? "neutral" : "warning"}">${escapeHtml(response.status)}</span>
      </header>
      ${
        response.status === "Pendente"
          ? `<p>Aguardando retorno da locadora.</p>`
          : `
            <div class="detail-grid two">
              <div class="detail-cell"><span>Total autorizado</span><strong>${formatter.format(response.total)}</strong></div>
              <div class="detail-cell"><span>Válida até</span><strong>${dateLabel(response.expiresAt)}</strong></div>
            </div>
            <p>${escapeHtml(response.conditions)}</p>
          `
      }
      <footer>
        ${
          canApprove
            ? `<button class="primary-action" type="button" data-action="approve-quote" data-id="${escapeAttr(quote.id)}" data-rental="${escapeAttr(response.rentalHouseId)}">
                <svg><use href="#icon-check"></use></svg>
                <span>Aprovar e reservar</span>
              </button>`
            : ""
        }
        ${
          approved
            ? `<button class="ghost-button" type="button" data-action="go-schedule">
                <svg><use href="#icon-calendar"></use></svg>
                <span>Ver agenda</span>
              </button>`
            : ""
        }
      </footer>
    </div>
  `;
}

function renderSchedule() {
  const approvedReservations = state.quotes.flatMap((quote) =>
    getApprovedRentalIds(quote).map((rentalId) => ({ quote, rentalId })),
  );

  if (!approvedReservations.length) {
    return renderEmptyState("calendar", "Nenhuma retirada confirmada", "A agenda aparece quando uma cotação é aprovada.");
  }

  return `
    <section class="timeline-section">
      <div class="section-title">
        <div>
          <p class="eyebrow">Linha do tempo</p>
          <h2>Reservas confirmadas</h2>
        </div>
        <button class="ghost-button" type="button" data-action="share-schedule">
          <svg><use href="#icon-calendar"></use></svg>
          <span>Compartilhar agenda</span>
        </button>
      </div>
      <div class="timeline">
        ${approvedReservations.map(renderScheduleQuote).join("")}
      </div>
    </section>
  `;
}

function renderScheduleQuote(reservation) {
  const { quote, rentalId } = reservation;
  const rental = getRental(rentalId);
  return `
    <div class="schedule-row">
      <header>
        <div>
          <strong>${escapeHtml(quote.project)} · ${escapeHtml(quote.id)}</strong>
          <small>${escapeHtml(rental.name)} · ${escapeHtml(rental.district)}</small>
        </div>
        <span class="status-badge">${escapeHtml(quote.checkStatus || "Pendente")}</span>
      </header>
      <div class="timeline-step" data-step="1">
        <div>
          <strong>Retirada agendada</strong>
          <p>${dateLabel(quote.pickupDate)} às ${escapeHtml(quote.pickupTime)} com responsável identificado.</p>
        </div>
        <span class="status-badge neutral">agenda</span>
      </div>
      <div class="timeline-step" data-step="2">
        <div>
          <strong>Checagem de equipamentos</strong>
          <p>Fotos, conferência física e testes eletrônicos vinculados à reserva.</p>
        </div>
        <span class="status-badge warning">${escapeHtml(quote.checkStatus || "Pendente")}</span>
      </div>
      <div class="timeline-step" data-step="3">
        <div>
          <strong>Transporte</strong>
          <p>Motorista e veículo registrados após liberação pela locadora.</p>
        </div>
        <span class="status-badge neutral">logística</span>
      </div>
    </div>
  `;
}

function renderAdmin() {
  const rentalQuotes = quotesForCurrentRental();
  const openQuotes = rentalQuotes.filter((quote) =>
    quote.responses.some((response) => response.rentalHouseId === state.currentRentalId && response.status === "Pendente"),
  );
  const approved = rentalQuotes.filter((quote) => isRentalApproved(quote, state.currentRentalId));
  const inventory = equipmentForCurrentRental();
  const reservedRevenue = approved.reduce((sum, quote) => {
    const response = quote.responses.find((entry) => entry.rentalHouseId === state.currentRentalId);
    return sum + (response?.total || 0);
  }, 0);

  return `
    ${renderRentalSwitcher()}
    <section class="insight-strip">
      ${renderMetric("Cotações abertas", openQuotes.length, "fila comercial")}
      ${renderMetric("Reservas", approved.length, "período de validação")}
      ${renderMetric("Itens cadastrados", inventory.length, "inventário ativo")}
      ${renderMetric("Receita reservada", formatter.format(reservedRevenue), "visível só para a locadora")}
    </section>
    <section class="table-section">
      <div class="section-title">
        <div>
          <p class="eyebrow">Semana</p>
          <h2>Ocupação por dia</h2>
        </div>
        <button class="ghost-button" type="button" data-action="export-report">
          <svg><use href="#icon-chart"></use></svg>
          <span>Exportar</span>
        </button>
      </div>
      ${renderBarChart([44, 68, 54, 82, 76, 48, 32])}
    </section>
    <section class="quote-list">
      ${rentalQuotes.slice(0, 4).map((quote) => renderAdminQuoteCard(quote)).join("") || renderEmptyState("clipboard", "Sem cotações", "A fila da locadora aparece aqui.")}
    </section>
  `;
}

function renderAdminQuotes() {
  const rentalQuotes = quotesForCurrentRental();
  return `
    ${renderRentalSwitcher()}
    ${
      rentalQuotes.length
        ? `<section class="quote-list">${rentalQuotes.map((quote) => renderAdminQuoteCard(quote)).join("")}</section>`
        : renderEmptyState("clipboard", "Nenhuma solicitação para esta locadora", "Quando o AC pedir orçamento, a equipe recebe a fila aqui.")
    }
  `;
}

function renderAdminQuoteCard(quote) {
  const response = quote.responses.find((entry) => entry.rentalHouseId === state.currentRentalId);
  const rentalItems = quote.items
    .map((item) => ({ ...item, equipment: getEquipment(item.equipmentId) }))
    .filter((item) => item.equipment?.rentalHouseId === state.currentRentalId);
  const canSend = response?.status === "Pendente";
  const canConfirmPickup = isRentalApproved(quote, state.currentRentalId) && quote.checkStatus !== "Retirada liberada";

  return `
    <article class="quote-card">
      <header>
        <div>
          <p class="eyebrow">${escapeHtml(quote.id)} · ${escapeHtml(quote.requester.requesterRole)}</p>
          <h3>${escapeHtml(quote.project)}</h3>
        </div>
        <span class="status-badge ${response?.status === "Aprovada" ? "" : canSend ? "neutral" : "warning"}">${escapeHtml(response?.status || "Fora da fila")}</span>
      </header>
      <div class="detail-grid">
        <div class="detail-cell"><span>Responsável</span><strong>${escapeHtml(quote.requester.name)}</strong></div>
        <div class="detail-cell"><span>CPF</span><strong>${escapeHtml(maskCpf(quote.requester.cpf))}</strong></div>
        <div class="detail-cell"><span>Telefone</span><strong>${escapeHtml(maskPhone(quote.requester.phone))}</strong></div>
      </div>
      <div class="mini-list">
        ${rentalItems.map((item) => `<span>${item.quantity}× ${escapeHtml(item.equipment.name)}</span>`).join("")}
      </div>
      <p>${escapeHtml(quote.notes || "Sem observações adicionais.")}</p>
      ${
        response && response.status !== "Pendente"
          ? `<div class="detail-grid two">
              <div class="detail-cell"><span>Total interno</span><strong>${formatter.format(response.total)}</strong></div>
              <div class="detail-cell"><span>Condição</span><strong>${escapeHtml(response.conditions)}</strong></div>
            </div>`
          : ""
      }
      <footer class="button-row">
        ${
          canSend
            ? `<button class="primary-action" type="button" data-action="send-response" data-id="${escapeAttr(quote.id)}">
                <svg><use href="#icon-clipboard"></use></svg>
                <span>Enviar cotação</span>
              </button>`
            : ""
        }
        ${
          canConfirmPickup
            ? `<button class="ghost-button" type="button" data-action="release-pickup" data-id="${escapeAttr(quote.id)}">
                <svg><use href="#icon-truck"></use></svg>
                <span>Liberar retirada</span>
              </button>`
            : ""
        }
      </footer>
    </article>
  `;
}

function renderInventory() {
  const inventory = equipmentForCurrentRental();

  return `
    ${renderRentalSwitcher()}
    <section class="form-section" id="equipmentFormSection">
      <div class="section-title">
        <div>
          <p class="eyebrow">Inventário</p>
          <h2>Novo equipamento</h2>
        </div>
        <span class="status-badge neutral">${escapeHtml(getRental(state.currentRentalId).name)}</span>
      </div>
      <form class="form-grid" id="equipmentForm">
        <label>
          Nome do equipamento
          <input name="name" placeholder="Ex.: Preston MDR-4" required />
        </label>
        <label>
          Categoria
          <select name="category" required>
            ${Object.keys(CATEGORY_IMAGE).map((category) => `<option>${escapeHtml(category)}</option>`).join("")}
          </select>
        </label>
        <label class="field-wide">
          Descrição
          <input name="description" placeholder="Resumo operacional para busca" required />
        </label>
        <label class="field-wide">
          Descrição técnica
          <textarea name="technical" placeholder="Montagem, mount, potência, conexões, acessórios inclusos" required></textarea>
        </label>
        <label>
          Quantidade para locar
          <input name="quantity" type="number" min="1" value="1" required />
        </label>
        <label>
          Valor diário interno
          <input name="dailyValue" type="number" min="0" step="10" value="300" required />
        </label>
        <button class="primary-action field-wide" type="submit">
          <svg><use href="#icon-plus"></use></svg>
          <span>Cadastrar equipamento</span>
        </button>
      </form>
    </section>

    <section class="table-section">
      <div class="section-title">
        <div>
          <p class="eyebrow">Catálogo</p>
          <h2>${escapeHtml(inventory.length)} equipamentos cadastrados</h2>
        </div>
      </div>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Equipamento</th>
              <th>Categoria</th>
              <th>Quantidade</th>
              <th>Disponível</th>
              <th>Valor interno</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${inventory
              .map(
                (item) => `
                  <tr>
                    <td><strong>${escapeHtml(item.name)}</strong><br /><small>${escapeHtml(item.technical)}</small></td>
                    <td>${escapeHtml(item.category)}</td>
                    <td>${escapeHtml(item.quantity)}</td>
                    <td>${escapeHtml(getAvailableQuantity(item))}</td>
                    <td>${formatter.format(item.dailyValue)}</td>
                    <td><span class="status-badge ${item.status === "Disponível" ? "" : "warning"}">${escapeHtml(item.status)}</span></td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderOperations() {
  const approved = state.quotes.filter((quote) => isRentalApproved(quote, state.currentRentalId));

  return `
    ${renderRentalSwitcher()}
    ${
      approved.length
        ? `<section class="operations-grid">${approved.map(renderOperationCard).join("")}</section>`
        : renderEmptyState("truck", "Sem retiradas agendadas", "Reservas aprovadas aparecem na operação para prep e logística.")
    }
  `;
}

function renderOperationCard(quote) {
  const checklist = quote.checklist || {};
  const items = quote.items
    .map((item) => ({ ...item, equipment: getEquipment(item.equipmentId) }))
    .filter((item) => item.equipment?.rentalHouseId === state.currentRentalId);
  const done = CHECK_ITEMS.filter(([key]) => checklist[key]).length;
  const percent = Math.round((done / CHECK_ITEMS.length) * 100);

  return `
    <article class="operation-card" id="checklist-${escapeAttr(quote.id)}">
      <header>
        <div>
          <p class="eyebrow">${escapeHtml(quote.id)} · ${dateLabel(quote.pickupDate)} ${escapeHtml(quote.pickupTime)}</p>
          <h3>${escapeHtml(quote.project)}</h3>
        </div>
        <span class="status-badge ${percent === 100 ? "" : "warning"}">${percent}%</span>
      </header>
      <div class="operation-meta">
        <div class="detail-cell"><span>Responsável</span><strong>${escapeHtml(quote.requester.name)}</strong></div>
        <div class="detail-cell"><span>Telefone</span><strong>${escapeHtml(maskPhone(quote.requester.phone))}</strong></div>
        <div class="detail-cell"><span>Status</span><strong>${escapeHtml(quote.checkStatus || "Pendente")}</strong></div>
      </div>
      <div class="mini-list">
        ${items.map((item) => `<span>${item.quantity}× ${escapeHtml(item.equipment.name)}</span>`).join("")}
      </div>
      <div class="progress-track" aria-label="Progresso da checagem">
        <span style="width:${percent}%"></span>
      </div>
      <div class="checklist">
        ${CHECK_ITEMS
          .map(
            ([key, label]) => `
              <label>
                <input type="checkbox" data-action="toggle-check" data-id="${escapeAttr(quote.id)}" data-check="${escapeAttr(key)}" ${checklist[key] ? "checked" : ""} />
                <span>${escapeHtml(label)}</span>
                <small>${checklist[key] ? "ok" : "pendente"}</small>
              </label>
            `,
          )
          .join("")}
      </div>
      <label>
        Fotos de mesa
        <input type="file" accept="image/*" multiple data-action="preview-photos" data-id="${escapeAttr(quote.id)}" />
      </label>
      <div class="photo-preview" id="photos-${escapeAttr(quote.id)}">
        ${(runtimePhotos.get(quote.id) || []).map((src) => `<img src="${escapeAttr(src)}" alt="Foto de checagem" />`).join("")}
      </div>
      <footer class="button-row">
        <button class="primary-action" type="button" data-action="finalize-checklist" data-id="${escapeAttr(quote.id)}">
          <svg><use href="#icon-check"></use></svg>
          <span>Registrar checagem</span>
        </button>
        <button class="ghost-button" type="button" data-action="release-pickup" data-id="${escapeAttr(quote.id)}">
          <svg><use href="#icon-truck"></use></svg>
          <span>Liberar van</span>
        </button>
      </footer>
    </article>
  `;
}

function renderProfile() {
  const profile = isRequesterRole()
    ? state.profile
    : {
        name: getRental(state.currentRentalId).admin,
        cpf: "",
        phone: getRental(state.currentRentalId).phone,
        email: `${state.currentRentalId}@sethub.example`,
        requesterRole: ROLE_CONFIG[state.currentRole].label,
        consent: true,
      };

  return `
    <section class="profile-grid">
      <form class="profile-card" id="profileForm">
        <div>
          <p class="eyebrow">Conta</p>
          <h2>Dados do responsável</h2>
        </div>
        <div class="form-grid">
          <label>
            Nome
            <input name="name" value="${escapeAttr(profile.name)}" required />
          </label>
          <label>
            CPF
            <input name="cpf" value="${escapeAttr(profile.cpf)}" placeholder="000.000.000-00" ${isRequesterRole() ? "required" : ""} />
          </label>
          <label>
            Telefone
            <input name="phone" value="${escapeAttr(profile.phone)}" placeholder="(11) 99999-9999" required />
          </label>
          <label>
            E-mail
            <input name="email" type="email" value="${escapeAttr(profile.email)}" required />
          </label>
        </div>
        <label class="consent-line">
          <input name="consent" type="checkbox" ${profile.consent ? "checked" : ""} />
          <span>Autorizo tratamento de dados para cotação, reserva, segurança e histórico operacional.</span>
        </label>
        <p class="form-error" id="profileError"></p>
        <footer class="button-row">
          <button class="primary-action" type="submit">
            <svg><use href="#icon-check"></use></svg>
            <span>Salvar dados</span>
          </button>
          ${isRequesterRole() ? `<button class="ghost-button" type="button" data-action="clear-profile">Limpar dados</button>` : ""}
        </footer>
      </form>
      <section class="profile-card">
        <div>
          <p class="eyebrow">Privacidade</p>
          <h2>Preferências registradas</h2>
        </div>
        <div class="detail-grid two">
          <div class="detail-cell"><span>CPF</span><strong>${profile.cpf ? escapeHtml(maskCpf(profile.cpf)) : "não exigido"}</strong></div>
          <div class="detail-cell"><span>Telefone</span><strong>${escapeHtml(maskPhone(profile.phone))}</strong></div>
          <div class="detail-cell"><span>Consentimento</span><strong>${profile.consent ? "ativo" : "pendente"}</strong></div>
          <div class="detail-cell"><span>Retenção</span><strong>${escapeHtml(state.security.retention)}</strong></div>
        </div>
        <p>As telas do MVP já separam perfis, mascaram dados pessoais na operação e mantêm trilha de auditoria de ações críticas.</p>
      </section>
    </section>
  `;
}

function renderSecurity() {
  const rows = [
    ["Buscar catálogo", true, true, true, true],
    ["Pedir cotação", true, true, false, false],
    ["Ver valores internos", false, false, true, true],
    ["Cadastrar equipamentos", false, false, true, true],
    ["Relatórios financeiros", false, false, false, true],
    ["Auditoria LGPD", false, false, false, true],
  ];

  return `
    <section class="security-section">
      <div class="section-title">
        <div>
          <p class="eyebrow">Acesso</p>
          <h2>Matriz de permissões</h2>
        </div>
        <span class="status-badge"><svg><use href="#icon-shield"></use></svg> RBAC</span>
      </div>
      <div class="access-matrix">
        <div class="matrix-row">
          <span>Permissão</span>
          <span>AC</span>
          <span>DF</span>
          <span>Equipe</span>
          <span>Admin</span>
        </div>
        ${rows
          .map(
            (row) => `
              <div class="matrix-row">
                <span>${escapeHtml(row[0])}</span>
                ${row
                  .slice(1)
                  .map(
                    (allowed) => `
                      <div class="matrix-cell ${allowed ? "allowed" : ""}">
                        ${allowed ? `<svg><use href="#icon-check"></use></svg>` : "—"}
                      </div>
                    `,
                  )
                  .join("")}
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
    <section class="security-grid">
      ${renderSecurityToggle("mfa", "MFA obrigatório", "Acesso administrativo com segundo fator.")}
      ${renderSecurityToggle("audit", "Auditoria imutável", "Eventos críticos com data, ator e escopo.")}
      ${renderSecurityToggle("quoteExpiry", "Expiração de cotação", "Valores e condições vencem automaticamente.")}
      ${renderSecurityToggle("dataExport", "Exportação de dados", "Solicitante pode receber histórico e consentimentos.")}
    </section>
    <section class="table-section">
      <div class="section-title">
        <div>
          <p class="eyebrow">Auditoria</p>
          <h2>Eventos recentes</h2>
        </div>
      </div>
      <div class="activity-list">
        ${state.audit.slice(0, 8).map(renderAuditRow).join("")}
      </div>
    </section>
  `;
}

function renderReports() {
  const approved = state.quotes.filter((quote) => isRentalApproved(quote, state.currentRentalId));
  const open = quotesForCurrentRental().filter((quote) =>
    quote.responses.some((response) => response.rentalHouseId === state.currentRentalId && response.status === "Pendente"),
  );
  const totalRevenue = approved.reduce((sum, quote) => {
    const response = quote.responses.find((entry) => entry.rentalHouseId === state.currentRentalId);
    return sum + (response?.total || 0);
  }, 0);

  return `
    ${renderRentalSwitcher()}
    <section class="insight-strip">
      ${renderMetric("Tempo médio", getRental(state.currentRentalId).responseTime, "resposta de cotação")}
      ${renderMetric("Conversão", approved.length ? "42%" : "0%", "cotações aprovadas")}
      ${renderMetric("Receita", formatter.format(totalRevenue), "reservas confirmadas")}
      ${renderMetric("Pendências", open.length, "precisam retorno")}
    </section>
    <section class="table-section">
      <div class="section-title">
        <div>
          <p class="eyebrow">Financeiro operacional</p>
          <h2>Reservas por projeto</h2>
        </div>
        <button class="ghost-button" type="button" data-action="export-report">
          <svg><use href="#icon-chart"></use></svg>
          <span>Exportar CSV</span>
        </button>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Projeto</th>
            <th>Retirada</th>
            <th>Status</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          ${
            approved
              .map((quote) => {
                const response = quote.responses.find((entry) => entry.rentalHouseId === state.currentRentalId);
                return `
                  <tr>
                    <td>${escapeHtml(quote.project)}</td>
                    <td>${dateLabel(quote.pickupDate)} · ${escapeHtml(quote.pickupTime)}</td>
                    <td>${escapeHtml(quote.checkStatus || quote.status)}</td>
                    <td>${formatter.format(response?.total || 0)}</td>
                  </tr>
                `;
              })
              .join("") || `<tr><td colspan="4">Sem reservas aprovadas nesta locadora.</td></tr>`
          }
        </tbody>
      </table>
    </section>
  `;
}

function renderContext() {
  els.contextPanel.innerHTML = isRequesterRole() ? renderCartPanel() : renderActivityPanel();
}

function renderCartPanel() {
  const cartItems = state.cart.map((entry) => ({ ...entry, equipment: getEquipment(entry.equipmentId) })).filter((entry) => entry.equipment);
  const groupedRentals = new Set(cartItems.map((entry) => entry.equipment.rentalHouseId));

  return `
    <div class="context-header">
      <div>
        <p class="eyebrow">Lista da cotação</p>
        <h2>Carrinho</h2>
      </div>
      <span class="status-badge neutral">${cartItems.length} itens</span>
    </div>
    <div class="cart-list">
      ${
        cartItems.length
          ? cartItems.map(renderCartItem).join("")
          : `<div class="empty-state"><svg><use href="#icon-cart"></use></svg><h3>Carrinho vazio</h3><p>Adicione equipamentos para pedir cotação.</p></div>`
      }
    </div>
    <div class="cart-footer">
      <div class="cart-total">
        <span>Locadoras</span>
        <strong>${groupedRentals.size}</strong>
      </div>
      <div class="cart-total">
        <span>Valores</span>
        <strong>Sob cotação</strong>
      </div>
      <button class="primary-action" type="button" data-action="open-quote" ${cartItems.length ? "" : "disabled"}>
        <svg><use href="#icon-clipboard"></use></svg>
        <span>Pedir cotação</span>
      </button>
    </div>
  `;
}

function renderCartItem(entry) {
  const item = entry.equipment;
  const rental = getRental(item.rentalHouseId);
  return `
    <div class="cart-item">
      <header>
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <small>${escapeHtml(rental.name)} · ${escapeHtml(item.category)}</small>
        </div>
        <button class="icon-button mini" type="button" data-action="remove-cart" data-id="${escapeAttr(item.id)}" aria-label="Remover ${escapeAttr(item.name)}">
          <span aria-hidden="true">×</span>
        </button>
      </header>
      <div class="qty-control" aria-label="Quantidade de ${escapeAttr(item.name)}">
        <button type="button" data-action="dec-cart" data-id="${escapeAttr(item.id)}">−</button>
        <span>${entry.quantity}</span>
        <button type="button" data-action="inc-cart" data-id="${escapeAttr(item.id)}">+</button>
      </div>
    </div>
  `;
}

function renderActivityPanel() {
  const rental = getRental(state.currentRentalId);
  const rentalQuotes = quotesForCurrentRental();
  const open = rentalQuotes.filter((quote) =>
    quote.responses.some((response) => response.rentalHouseId === state.currentRentalId && response.status === "Pendente"),
  );
  const pickups = rentalQuotes.filter((quote) => isRentalApproved(quote, state.currentRentalId));

  return `
    <div class="context-header">
      <div>
        <p class="eyebrow">Locadora</p>
        <h2>${escapeHtml(rental.name)}</h2>
      </div>
      <span class="status-badge">${escapeHtml(rental.district)}</span>
    </div>
    <div class="detail-grid two">
      <div class="detail-cell"><span>Cotações</span><strong>${open.length}</strong></div>
      <div class="detail-cell"><span>Retiradas</span><strong>${pickups.length}</strong></div>
    </div>
    <div class="activity-list">
      ${state.audit.slice(0, 5).map(renderAuditRow).join("")}
    </div>
  `;
}

function renderRentalSwitcher() {
  return `
    <section class="rental-switcher">
      <div>
        <p class="eyebrow">Locadora ativa</p>
        <h2>${escapeHtml(getRental(state.currentRentalId).name)}</h2>
      </div>
      <div class="chip-row">
        ${state.rentalHouses
          .map(
            (rental) => `
              <button class="chip ${state.currentRentalId === rental.id ? "active" : ""}" type="button" data-rental-switch="${escapeAttr(rental.id)}">
                ${escapeHtml(rental.name)}
              </button>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderMetric(label, value, hint) {
  return `
    <div class="metric">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(hint)}</small>
    </div>
  `;
}

function renderBarChart(values) {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  return `
    <div class="bar-chart">
      ${values
        .map(
          (value, index) => `
            <div class="bar">
              <span style="height:${value + 22}px"></span>
              <small>${days[index]}</small>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderSecurityToggle(key, title, text) {
  return `
    <label class="profile-card security-toggle">
      <div>
        <p class="eyebrow">${state.security[key] ? "Ativo" : "Inativo"}</p>
        <h2>${escapeHtml(title)}</h2>
      </div>
      <p>${escapeHtml(text)}</p>
      <span class="toggle">
        <input type="checkbox" data-security="${escapeAttr(key)}" ${state.security[key] ? "checked" : ""} />
        <span></span>
      </span>
    </label>
  `;
}

function renderAuditRow(row) {
  return `
    <div class="audit-row">
      <header>
        <strong>${escapeHtml(row.action)}</strong>
        <small>${timeLabel(row.at)}</small>
      </header>
      <small>${escapeHtml(row.actor)}</small>
    </div>
  `;
}

function renderEmptyState(icon, title, text) {
  return `
    <section class="empty-state">
      <svg><use href="#icon-${icon}"></use></svg>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text)}</p>
    </section>
  `;
}

function attachViewSideEffects() {
  const photoInputs = els.view.querySelectorAll('[data-action="preview-photos"]');
  photoInputs.forEach((input) => {
    input.addEventListener("change", handlePhotoPreview);
  });
}

document.addEventListener("click", (event) => {
  const roleButton = event.target.closest("[data-role]");
  if (roleButton) {
    state.currentRole = roleButton.dataset.role;
    state.currentView = ROLE_CONFIG[state.currentRole].defaultView;
    renderApp();
    return;
  }

  const navButton = event.target.closest("[data-view]");
  if (navButton) {
    state.currentView = navButton.dataset.view;
    renderApp();
    return;
  }

  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) {
    state.filters.category = categoryButton.dataset.category;
    renderApp();
    return;
  }

  const rentalSwitch = event.target.closest("[data-rental-switch]");
  if (rentalSwitch) {
    state.currentRentalId = rentalSwitch.dataset.rentalSwitch;
    renderApp();
    return;
  }

  const actionElement = event.target.closest("[data-action]");
  if (actionElement) {
    handleAction(actionElement);
  }
});

document.addEventListener("input", (event) => {
  const filter = event.target.closest("[data-filter]");
  if (filter) {
    const key = filter.dataset.filter;
    let cursor = null;
    try {
      cursor = typeof filter.selectionStart === "number" ? filter.selectionStart : null;
    } catch (error) {
      cursor = null;
    }
    state.filters[key] = filter.value;
    renderApp();
    const restored = document.querySelector(`[data-filter="${CSS.escape(key)}"]`);
    if (restored) {
      restored.focus({ preventScroll: true });
      if (cursor !== null && typeof restored.setSelectionRange === "function") {
        restored.setSelectionRange(cursor, cursor);
      }
    }
    return;
  }

  if (event.target.name === "cpf") {
    event.target.value = formatCpf(event.target.value);
  }

  if (event.target.name === "phone") {
    event.target.value = formatPhone(event.target.value);
  }
});

document.addEventListener("change", (event) => {
  const securityToggle = event.target.closest("[data-security]");
  if (securityToggle) {
    const key = securityToggle.dataset.security;
    state.security[key] = securityToggle.checked;
    addAudit("Admin", `${securityToggle.checked ? "Ativou" : "Desativou"} ${key}`);
    renderApp();
    return;
  }

  const checkToggle = event.target.closest('[data-action="toggle-check"]');
  if (checkToggle) {
    toggleChecklist(checkToggle.dataset.id, checkToggle.dataset.check, checkToggle.checked);
  }
});

document.addEventListener("submit", (event) => {
  const equipmentForm = event.target.closest("#equipmentForm");
  if (equipmentForm) {
    event.preventDefault();
    createEquipment(equipmentForm);
    return;
  }

  const profileForm = event.target.closest("#profileForm");
  if (profileForm) {
    event.preventDefault();
    saveProfile(profileForm);
  }
});

els.quoteForm.addEventListener("submit", (event) => {
  if (event.submitter?.value === "cancel") {
    return;
  }
  event.preventDefault();
  createQuoteFromForm();
});

els.resetDemo.addEventListener("click", () => {
  const confirmed = window.confirm("Restaurar os dados iniciais da demo?");
  if (!confirmed) return;
  state = createSeedState();
  runtimePhotos.clear();
  saveState();
  renderApp();
  showToast("Demo restaurada.");
});

function handleAction(element) {
  const action = element.dataset.action;
  const id = element.dataset.id;

  const handlers = {
    "toggle-available": () => {
      state.filters.onlyAvailable = !state.filters.onlyAvailable;
      renderApp();
    },
    "add-cart": () => addToCart(id),
    "remove-cart": () => removeFromCart(id),
    "inc-cart": () => changeCartQuantity(id, 1),
    "dec-cart": () => changeCartQuantity(id, -1),
    "open-quote": openQuoteDialog,
    "view-equipment": () => openEquipmentDetail(id),
    "simulate-responses": () => simulateResponses(id),
    "approve-quote": () => approveQuote(id, element.dataset.rental),
    "go-schedule": () => {
      state.currentView = "schedule";
      renderApp();
    },
    "send-response": () => sendQuoteResponse(id),
    "release-pickup": () => releasePickup(id),
    "finalize-checklist": () => finalizeChecklist(id),
    "share-schedule": () => showToast("Agenda pronta para enviar para produção e motorista."),
    "focus-equipment-form": () => document.querySelector("#equipmentFormSection")?.scrollIntoView({ behavior: "smooth" }),
    "focus-checklist": () => document.querySelector('[id^="checklist-"]')?.scrollIntoView({ behavior: "smooth" }),
    "export-report": () => showToast("Relatório preparado para exportação no backend do produto."),
    "clear-profile": clearProfile,
  };

  handlers[action]?.();
}

function addToCart(id) {
  const item = getEquipment(id);
  if (!item || getAvailableQuantity(item) <= 0) return;

  const entry = state.cart.find((cartItem) => cartItem.equipmentId === id);
  if (entry) {
    if (entry.quantity >= getAvailableQuantity(item)) {
      showToast("Quantidade máxima disponível adicionada.");
      return;
    }
    entry.quantity += 1;
  } else {
    state.cart.push({ equipmentId: id, quantity: 1 });
  }

  showToast(`${item.name} adicionado à cotação.`);
  renderApp();
}

function removeFromCart(id) {
  state.cart = state.cart.filter((item) => item.equipmentId !== id);
  renderApp();
}

function changeCartQuantity(id, delta) {
  const item = getEquipment(id);
  const entry = state.cart.find((cartItem) => cartItem.equipmentId === id);
  if (!item || !entry) return;

  entry.quantity += delta;
  if (entry.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  if (entry.quantity > getAvailableQuantity(item)) {
    entry.quantity = getAvailableQuantity(item);
    showToast("Quantidade ajustada ao estoque disponível.");
  }

  renderApp();
}

function openQuoteDialog() {
  if (!state.cart.length) {
    state.currentView = "catalog";
    renderApp();
    showToast("Adicione equipamentos ao carrinho para pedir cotação.");
    return;
  }

  const form = els.quoteForm;
  form.reset();
  form.elements.project.value = "";
  form.elements.name.value = state.profile.name || "";
  form.elements.cpf.value = state.profile.cpf || "";
  form.elements.phone.value = state.profile.phone || "";
  form.elements.email.value = state.profile.email || "";
  form.elements.requesterRole.value = state.profile.requesterRole || "1º Assistente de Câmera";
  form.elements.pickupDate.value = state.filters.date || addDaysInput(2);
  form.elements.returnDate.value = addDaysInput(5);
  form.elements.pickupTime.value = "10:00";
  form.elements.consent.checked = Boolean(state.profile.consent);
  els.quoteError.textContent = "";
  els.quoteDialog.showModal();
}

function createQuoteFromForm() {
  const form = els.quoteForm;
  const data = Object.fromEntries(new FormData(form).entries());
  data.consent = form.elements.consent.checked;

  const error = validateRequesterData(data);
  if (error) {
    els.quoteError.textContent = error;
    return;
  }

  if (new Date(`${data.returnDate}T12:00`) < new Date(`${data.pickupDate}T12:00`)) {
    els.quoteError.textContent = "A devolução precisa ser igual ou posterior à retirada.";
    return;
  }

  const items = state.cart.map((entry) => ({
    equipmentId: entry.equipmentId,
    quantity: entry.quantity,
  }));
  const rentalIds = [...new Set(items.map((entry) => getEquipment(entry.equipmentId)?.rentalHouseId).filter(Boolean))];
  const id = `CT-${Math.floor(2000 + Math.random() * 7000)}`;

  const quote = {
    id,
    project: data.project.trim(),
    createdAt: new Date().toISOString(),
    pickupDate: data.pickupDate,
    pickupTime: data.pickupTime,
    returnDate: data.returnDate,
    requester: {
      name: data.name.trim(),
      cpf: formatCpf(data.cpf),
      phone: formatPhone(data.phone),
      email: data.email.trim(),
      requesterRole: data.requesterRole,
    },
    notes: data.notes?.trim() || "",
    items,
    responses: rentalIds.map((rentalHouseId) => ({
      rentalHouseId,
      status: "Pendente",
      total: 0,
      expiresAt: addDaysInput(2),
      conditions: "",
    })),
    status: "Enviada às locadoras",
    approvedRentalHouseId: null,
    approvedRentalHouseIds: [],
    checkStatus: "Pendente",
    checklist: {},
  };

  state.profile = {
    name: quote.requester.name,
    cpf: quote.requester.cpf,
    phone: quote.requester.phone,
    email: quote.requester.email,
    requesterRole: quote.requester.requesterRole,
    consent: data.consent,
  };
  state.quotes.unshift(quote);
  state.cart = [];
  state.currentView = "quotes";
  addAudit(quote.requester.name, `Criou cotação ${quote.id}`);
  els.quoteDialog.close();
  renderApp();
  showToast("Cotação enviada para as locadoras.");
}

function validateRequesterData(data) {
  if (!data.project?.trim()) return "Informe o projeto.";
  if (!data.name?.trim() || data.name.trim().split(/\s+/).length < 2) return "Informe o nome completo.";
  if (!isValidCpf(data.cpf)) return "CPF inválido.";
  if (!isValidPhone(data.phone)) return "Telefone inválido. Use DDD e número brasileiro.";
  if (!data.email?.includes("@")) return "E-mail inválido.";
  if (!data.consent) return "O consentimento é obrigatório para seguir.";
  return "";
}

function openEquipmentDetail(id) {
  const item = getEquipment(id);
  if (!item) return;
  const rental = getRental(item.rentalHouseId);
  els.equipmentDetailTitle.textContent = item.name;
  els.equipmentDetailBody.innerHTML = `
    <div class="detail-hero">
      <img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.name)}" />
    </div>
    <div class="detail-grid two">
      <div class="detail-cell"><span>Locadora</span><strong>${escapeHtml(rental.name)}</strong></div>
      <div class="detail-cell"><span>Disponibilidade</span><strong>${getAvailableQuantity(item)} de ${escapeHtml(item.quantity)}</strong></div>
      <div class="detail-cell"><span>Categoria</span><strong>${escapeHtml(item.category)}</strong></div>
      <div class="detail-cell"><span>Valor</span><strong>Sob cotação</strong></div>
    </div>
    <p>${escapeHtml(item.description)}</p>
    <p><strong>Descrição técnica:</strong> ${escapeHtml(item.technical)}</p>
  `;
  els.equipmentDialog.showModal();
}

function simulateResponses(id) {
  const quote = getQuote(id);
  if (!quote) return;
  quote.responses.forEach((response) => {
    if (response.status === "Pendente") {
      response.status = "Enviada";
      response.total = calculateQuoteTotal(quote, response.rentalHouseId);
      response.expiresAt = addDaysInput(2);
      response.conditions = "Cotação com retirada agendada, conferência em bancada e bloqueio de estoque por 48h.";
    }
  });
  quote.status = "Cotação recebida";
  addAudit("Demo", `Simulou respostas da cotação ${quote.id}`);
  renderApp();
  showToast("Respostas das locadoras simuladas.");
}

function sendQuoteResponse(id) {
  const quote = getQuote(id);
  if (!quote) return;
  const response = quote.responses.find((entry) => entry.rentalHouseId === state.currentRentalId);
  if (!response) return;

  response.status = "Enviada";
  response.total = calculateQuoteTotal(quote, state.currentRentalId);
  response.expiresAt = addDaysInput(2);
  response.conditions = "Inclui reserva de estoque, prep assistido e termo de responsabilidade na retirada.";
  quote.status = "Cotação recebida";
  addAudit(getRental(state.currentRentalId).name, `Enviou cotação ${quote.id}`);
  renderApp();
  showToast("Cotação enviada ao solicitante.");
}

function approveQuote(id, rentalId) {
  const quote = getQuote(id);
  if (!quote || isRentalApproved(quote, rentalId)) return;

  quote.approvedRentalHouseIds = getApprovedRentalIds(quote);
  quote.approvedRentalHouseIds.push(rentalId);
  quote.approvedRentalHouseId = quote.approvedRentalHouseIds[0] || rentalId;
  quote.status = quote.approvedRentalHouseIds.length === quote.responses.length ? "Reserva aprovada" : "Reserva parcial";
  quote.checkStatus = "Pendente";
  quote.responses.forEach((response) => {
    if (response.rentalHouseId === rentalId) {
      response.status = "Aprovada";
    }
  });

  quote.items.forEach((entry) => {
    const item = getEquipment(entry.equipmentId);
    if (item?.rentalHouseId === rentalId) {
      item.available = Math.max(0, item.available - entry.quantity);
      item.status = item.available > 0 ? "Disponível" : "Reservado";
    }
  });

  addAudit(quote.requester.name, `Aprovou reserva ${quote.id}`);
  renderApp();
  showToast("Reserva aprovada e estoque bloqueado.");
}

function createEquipment(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  if (!data.name.trim() || !data.description.trim() || !data.technical.trim()) {
    showToast("Preencha os dados do equipamento.");
    return;
  }

  const quantity = Math.max(1, Number(data.quantity) || 1);
  const dailyValue = Math.max(0, Number(data.dailyValue) || 0);
  const technical = data.technical.trim();

  state.equipment.unshift({
    id: `eq-${slugify(data.name)}-${Date.now().toString(36)}`,
    rentalHouseId: state.currentRentalId,
    name: data.name.trim(),
    category: data.category,
    description: data.description.trim(),
    technical,
    tech: technical
      .split(/[,.;]/)
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 4),
    quantity,
    available: quantity,
    dailyValue,
    image: CATEGORY_IMAGE[data.category] || "assets/camera-body.svg",
    status: "Disponível",
  });

  addAudit(getRental(state.currentRentalId).name, `Cadastrou equipamento ${data.name.trim()}`);
  form.reset();
  renderApp();
  showToast("Equipamento cadastrado.");
}

function saveProfile(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const errorEl = document.querySelector("#profileError");
  const phoneValid = isValidPhone(data.phone);
  const cpfValid = !isRequesterRole() || isValidCpf(data.cpf);

  if (!data.name.trim() || !phoneValid || !cpfValid || !data.email.includes("@")) {
    errorEl.textContent = "Confira nome, CPF, telefone e e-mail.";
    return;
  }

  if (isRequesterRole()) {
    state.profile = {
      name: data.name.trim(),
      cpf: formatCpf(data.cpf),
      phone: formatPhone(data.phone),
      email: data.email.trim(),
      requesterRole: state.profile.requesterRole || "1º Assistente de Câmera",
      consent: form.elements.consent.checked,
    };
  }

  addAudit(data.name.trim(), "Atualizou dados cadastrais");
  renderApp();
  showToast("Dados salvos.");
}

function clearProfile() {
  const confirmed = window.confirm("Limpar dados de solicitante desta demo?");
  if (!confirmed) return;
  state.profile = {
    name: "",
    cpf: "",
    phone: "",
    email: "",
    requesterRole: "1º Assistente de Câmera",
    consent: false,
  };
  addAudit("Solicitante", "Limpou dados locais");
  renderApp();
  showToast("Dados locais limpos.");
}

function toggleChecklist(quoteId, key, checked) {
  const quote = getQuote(quoteId);
  if (!quote) return;
  quote.checklist = quote.checklist || {};
  quote.checklist[key] = checked;
  quote.checkStatus = checklistIsComplete(quote) ? "Checagem concluída" : "Em checagem";
  saveState();
  renderContext();
}

function finalizeChecklist(id) {
  const quote = getQuote(id);
  if (!quote) return;
  quote.checklist = quote.checklist || {};

  if (!checklistIsComplete(quote)) {
    showToast("Ainda existem itens pendentes na checagem.");
    renderApp();
    return;
  }

  quote.checkStatus = "Checagem concluída";
  addAudit(getRental(state.currentRentalId).name, `Registrou checagem ${quote.id}`);
  renderApp();
  showToast("Checagem registrada.");
}

function releasePickup(id) {
  const quote = getQuote(id);
  if (!quote) return;
  quote.checkStatus = "Retirada liberada";
  addAudit(getRental(state.currentRentalId).name, `Liberou retirada ${quote.id}`);
  renderApp();
  showToast("Retirada liberada para transporte.");
}

function handlePhotoPreview(event) {
  const input = event.currentTarget;
  const quoteId = input.dataset.id;
  const files = Array.from(input.files || []).slice(0, 8);
  const urls = files.map((file) => URL.createObjectURL(file));
  runtimePhotos.set(quoteId, urls);
  const preview = document.querySelector(`#photos-${CSS.escape(quoteId)}`);
  if (preview) {
    preview.innerHTML = urls.map((src) => `<img src="${escapeAttr(src)}" alt="Foto de checagem" />`).join("");
  }
}

function getFilteredEquipment() {
  const query = normalizeText(state.filters.query);
  return state.equipment.filter((item) => {
    const rental = getRental(item.rentalHouseId);
    const matchesQuery = !query || normalizeText(`${item.name} ${item.description} ${item.technical} ${rental.name}`).includes(query);
    const matchesCategory = state.filters.category === "Todos" || item.category === state.filters.category;
    const matchesRental = state.filters.rental === "Todas" || item.rentalHouseId === state.filters.rental;
    const matchesAvailable = !state.filters.onlyAvailable || getAvailableQuantity(item) > 0;
    return matchesQuery && matchesCategory && matchesRental && matchesAvailable;
  });
}

function getNavCount(viewId) {
  if (viewId === "quotes") return state.quotes.length;
  if (viewId === "quotesAdmin") return quotesForCurrentRental().length;
  if (viewId === "inventory") return equipmentForCurrentRental().length;
  if (viewId === "operations") return state.quotes.filter((quote) => isRentalApproved(quote, state.currentRentalId)).length;
  if (viewId === "schedule") return state.quotes.reduce((sum, quote) => sum + getApprovedRentalIds(quote).length, 0);
  return "";
}

function isRequesterRole() {
  return state.currentRole === "ac" || state.currentRole === "df";
}

function equipmentForCurrentRental() {
  return state.equipment.filter((item) => item.rentalHouseId === state.currentRentalId);
}

function quotesForCurrentRental() {
  return state.quotes.filter((quote) => quote.responses.some((response) => response.rentalHouseId === state.currentRentalId));
}

function getEquipment(id) {
  return state.equipment.find((item) => item.id === id);
}

function getRental(id) {
  return state.rentalHouses.find((rental) => rental.id === id) || state.rentalHouses[0];
}

function getQuote(id) {
  return state.quotes.find((quote) => quote.id === id);
}

function getApprovedRentalIds(quote) {
  if (Array.isArray(quote.approvedRentalHouseIds)) {
    return [...new Set(quote.approvedRentalHouseIds)];
  }
  return quote.approvedRentalHouseId ? [quote.approvedRentalHouseId] : [];
}

function isRentalApproved(quote, rentalId) {
  return getApprovedRentalIds(quote).includes(rentalId);
}

function getAvailableQuantity(item) {
  return Number(item.available ?? item.quantity ?? 0);
}

function calculateQuoteTotal(quote, rentalId) {
  const days = Math.max(1, Math.ceil((new Date(`${quote.returnDate}T12:00`) - new Date(`${quote.pickupDate}T12:00`)) / 86400000) + 1);
  const subtotal = quote.items.reduce((sum, entry) => {
    const item = getEquipment(entry.equipmentId);
    if (!item || item.rentalHouseId !== rentalId) return sum;
    return sum + item.dailyValue * entry.quantity * days;
  }, 0);
  const prep = subtotal > 0 ? 420 : 0;
  const service = subtotal * 0.08;
  return Math.round(subtotal + prep + service);
}

function checklistIsComplete(quote) {
  return CHECK_ITEMS.every(([key]) => quote.checklist?.[key]);
}

function option(value, selected, label = value) {
  return `<option value="${escapeAttr(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(label)}</option>`;
}

function dateLabel(value) {
  if (!value) return "sem data";
  return dateFormatter.format(new Date(`${value}T12:00:00`));
}

function timeLabel(value) {
  return timeFormatter.format(new Date(value));
}

function addDaysInput(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

function addDaysIso(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function normalizeDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatCpf(value) {
  const digits = normalizeDigits(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function formatPhone(value) {
  const digits = normalizeDigits(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

function isValidCpf(value) {
  const cpf = normalizeDigits(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  const calc = (factor) => {
    let total = 0;
    for (let i = 0; i < factor - 1; i += 1) total += Number(cpf[i]) * (factor - i);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return calc(10) === Number(cpf[9]) && calc(11) === Number(cpf[10]);
}

function isValidPhone(value) {
  const digits = normalizeDigits(value);
  if (![10, 11].includes(digits.length)) return false;
  const ddd = Number(digits.slice(0, 2));
  if (ddd < 11 || ddd > 99) return false;
  if (digits.length === 11 && digits[2] !== "9") return false;
  return true;
}

function maskCpf(value) {
  const digits = normalizeDigits(value);
  if (digits.length !== 11) return "não informado";
  return `${digits.slice(0, 3)}.***.***-${digits.slice(9)}`;
}

function maskPhone(value) {
  const digits = normalizeDigits(value);
  if (digits.length < 10) return "não informado";
  const ddd = digits.slice(0, 2);
  const end = digits.slice(-4);
  return `(${ddd}) ****-${end}`;
}

function slugify(value) {
  return normalizeText(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function addAudit(actor, action) {
  state.audit.unshift({
    at: new Date().toISOString(),
    actor,
    action,
  });
  state.audit = state.audit.slice(0, 30);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

let toastTimer;
function showToast(message) {
  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = window.setTimeout(() => els.toast.classList.remove("show"), 3000);
}

renderApp();
