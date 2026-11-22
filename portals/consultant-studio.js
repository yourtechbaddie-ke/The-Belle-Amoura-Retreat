// ==========================================================================
// THE BELLE AMOURA RETREAT — THE AMOURA ATELIER (CONSULTANT STUDIO)
// High-Touch Interactive Workspace for Luxury Travel Contractors
// ==========================================================================

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const ws = $('#workspace');
  const crumb = $('#page-crumb');
  const rail = $('#rail');
  const toast = $('#toast');

  // Interactive In-Memory & LocalStorage Data Store
  const STORAGE_KEY = 'ba_atelier_state_v2';

  const defaultState = {
    bookings: [
      {
        id: 'BA-8821',
        guest: 'Lady Genevieve Scott',
        destination: 'Amalfi Coast & Capri, Italy',
        dates: '12 Jun – 22 Jun 2026',
        value: 42000,
        tier: '15% Exclusive Charter',
        commission: 6300,
        stage: 'Confirmed',
        notes: 'Cliffside private villa with infinity terrace, private Riva motorboat charter, and Capri grotto permit.'
      },
      {
        id: 'BA-7904',
        guest: 'Julian Montgomery',
        destination: 'Kyoto & Naoshima, Japan',
        dates: '18 Sep – 28 Sep 2026',
        value: 28500,
        tier: '12% Curated Escape',
        commission: 3420,
        stage: 'Planning',
        notes: 'Machiya heritage residence, after-hours private Zen temple abbot meditation, and master artisan tea ritual.'
      },
      {
        id: 'BA-9102',
        guest: 'Sheikh Tariq Al-Falasi',
        destination: 'Serengeti & Masai Mara',
        dates: '04 Aug – 14 Aug 2026',
        value: 85000,
        tier: '18% Private Residency Buyout',
        commission: 15300,
        stage: 'Confirmed',
        notes: 'Private solar-powered tented encampment buyout with dedicated bush airstrip jet access and helicopter wildlife survey.'
      },
      {
        id: 'BA-6419',
        guest: 'Marcus & Clara Vance',
        destination: 'Bali Cliffside Ocean Sanctuaries',
        dates: '10 Oct – 20 Oct 2026',
        value: 19500,
        tier: '12% Curated Escape',
        commission: 2340,
        stage: 'Enquiry',
        notes: 'Uluwatu oceanfront pool pavilion, floating breakfasts, and sacred water temple purifications.'
      }
    ],
    clients: [
      {
        name: 'Lady Genevieve Scott',
        email: 'g.scott@scottestates.co.uk',
        phone: '+44 20 7946 0883',
        location: 'London & Florence',
        status: 'Active VIP',
        notes: 'Prefers secluded private cliff villas with private motorboat skipper. High confidentiality.',
        spend: '$128,000 lifetime'
      },
      {
        name: 'Julian Montgomery',
        email: 'j.montgomery@artfoundry.org',
        phone: '+1 212 555 0192',
        location: 'New York (EST)',
        status: 'Active VIP',
        notes: 'Contemporary art patron, minimalist aesthetic, Michelin dining reservations, quiet restorative pace.',
        spend: '$74,500 lifetime'
      },
      {
        name: 'Sheikh Tariq Al-Falasi',
        email: 'tariq@falasiholdings.ae',
        phone: '+971 4 388 9200',
        location: 'Dubai (GST)',
        status: 'Patron',
        notes: 'Direct private jet apron greeting required. Family conservation journeys, dedicated butler.',
        spend: '$240,000 lifetime'
      },
      {
        name: 'Dr. Clara Vance',
        email: 'clara.vance@zenithhealth.ch',
        phone: '+41 22 718 2901',
        location: 'Geneva (CET)',
        status: 'Prospect',
        notes: 'Restorative wellness, high altitude thermal pools, organic botanical culinary focus.',
        spend: '$19,500 current'
      }
    ],
    payouts: [
      {
        ref: 'PAY-7041',
        period: 'Q1 Settlement (Jan–Mar)',
        amount: '$14,200',
        status: 'Paid',
        channel: 'Wire · Barclays Private International',
        date: '31 Mar 2026'
      },
      {
        ref: 'PAY-8192',
        period: 'April Tranche',
        amount: '$7,400',
        status: 'Paid',
        channel: 'Wire · Barclays Private International',
        date: '30 Apr 2026'
      }
    ]
  };

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return defaultState;
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  let state = loadState();

  const labels = {
    overview: 'OVERVIEW',
    bookings: 'BOOKINGS',
    training: 'ACADEMY',
    crm: 'CLIENT BOOK',
    commissions: 'COMMISSIONS',
    reporting: 'REPORTING',
    payouts: 'PAYOUTS'
  };

  function notify(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove('show'), 3800);
  }

  const head = (eyebrow, title, desc, note) => `
    <div class="page-heading">
      <div>
        <div class="eyebrow">${eyebrow}</div>
        <h1>${title}</h1>
        <p>${desc}</p>
      </div>
      <div class="heading-aside"><span>✳</span> ${note}</div>
    </div>
  `;

  // Total calculations
  function getFinancials() {
    const totalBookingsValue = state.bookings.reduce((sum, b) => sum + (Number(b.value) || 0), 0);
    const totalCommission = state.bookings.reduce((sum, b) => sum + (Number(b.commission) || 0), 0);
    const approvedCommission = state.bookings
      .filter(b => b.stage === 'Confirmed')
      .reduce((sum, b) => sum + (Number(b.commission) || 0), 0);
    const pendingCommission = state.bookings
      .filter(b => b.stage === 'Planning' || b.stage === 'Enquiry')
      .reduce((sum, b) => sum + (Number(b.commission) || 0), 0);
    return { totalBookingsValue, totalCommission, approvedCommission, pendingCommission };
  }

  const pages = {
    overview: () => {
      const f = getFinancials();
      const confirmedCount = state.bookings.filter(b => b.stage === 'Confirmed').length;
      const planningCount = state.bookings.filter(b => b.stage === 'Planning').length;
      const enquiryCount = state.bookings.filter(b => b.stage === 'Enquiry').length;

      return head('THE AMOURA ATELIER · PRIVATE PRACTICE', 'Make room for <em>remarkable journeys.</em>', 'Your working studio for private client relationships, considered itineraries and transparent commission earnings.', 'FIELD NOTES / 01') +
      `
      <section class="overview-hero">
        <div class="hero-copy">
          <div class="eyebrow">THE CONSULTANT DESK · ACTIVE WORKSPACE</div>
          <div>
            <h2>Good travel begins<br>with <em>good attention.</em></h2>
            <p>One considered workspace for every detail between a first enquiry and a journey worth remembering.</p>
            <div class="hero-meta">
              <span>${state.bookings.length} ACTIVE ITINERARIES</span>
              <span>$${f.totalBookingsValue.toLocaleString()} GROSS PIPELINE</span>
            </div>
          </div>
        </div>
        <div class="hero-art">
          <img src="/assets/hero-resort-villa.jpg" alt="Luxury cliffside sunset villa" onerror="this.src='/assets/hero-clean.jpg'">
          <span class="hero-index">BELLE AMOURA / SANCTUARY REGISTER</span>
          <span class="art-label">THE WORLD, THOUGHTFULLY YOURS ↗</span>
        </div>
      </section>

      <div class="briefing-grid">
        <div>
          <div class="section-kicker">
            <h3>Active Itinerary Pulse</h3>
            <span>LIVE ATELIER RECORDS</span>
          </div>
          <div class="pipeline">
            <div class="pipe-stage">
              <label><span class="dash"></span>Enquiries</label>
              <strong>${enquiryCount}</strong>
              <small>Intake & discovery</small>
            </div>
            <div class="pipe-stage">
              <label><span class="dash"></span>In Planning</label>
              <strong>${planningCount}</strong>
              <small>Proposal curation</small>
            </div>
            <div class="pipe-stage">
              <label><span class="dash"></span>Confirmed</label>
              <strong>${confirmedCount}</strong>
              <small>Supplier locked</small>
            </div>
            <div class="pipe-stage">
              <label><span class="dash"></span>Completed</label>
              <strong>${state.payouts.length}</strong>
              <small>Settled accounts</small>
            </div>
          </div>

          <div class="section-kicker" style="margin-top:28px">
            <h3>Assigned Dossiers &amp; Journeys</h3>
            <span>ACTIVE CLIENT WORK</span>
          </div>

          <div class="table-wrap" style="margin-top: 12px; background: var(--paper); border: 1px solid var(--border-subtle, #d8d0c0);">
            <table class="data-table" style="width:100%; border-collapse:collapse;">
              <thead>
                <tr style="text-align:left; border-bottom:1px solid #d8d0c0; font-size:10px; text-transform:uppercase; letter-spacing:0.12em; color:var(--text-muted, #666);">
                  <th style="padding:10px 12px;">Guest / Reference</th>
                  <th style="padding:10px 12px;">Destination</th>
                  <th style="padding:10px 12px;">Dates</th>
                  <th style="padding:10px 12px;">Stage</th>
                  <th style="padding:10px 12px; text-align:right;">Commission</th>
                </tr>
              </thead>
              <tbody>
                ${state.bookings.map(b => `
                  <tr style="border-bottom:1px solid #eae5db; font-size:12px;">
                    <td style="padding:12px;">
                      <strong>${b.guest}</strong><br>
                      <small style="color:#777; font-family:monospace;">${b.id}</small>
                    </td>
                    <td style="padding:12px;">${b.destination}</td>
                    <td style="padding:12px; font-size:11px; color:#555;">${b.dates}</td>
                    <td style="padding:12px;">
                      <span style="display:inline-block; padding:3px 8px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; background:${b.stage==='Confirmed'?'#E0F2E9':'#F5EFE0'}; color:${b.stage==='Confirmed'?'#0B4F4A':'#8C6D23'}; border-radius:2px;">
                        ${b.stage}
                      </span>
                    </td>
                    <td style="padding:12px; text-align:right; font-weight:700; color:var(--teal, #0B4F4A); font-family:monospace;">
                      $${Number(b.commission).toLocaleString()}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <aside class="right-stack">
          <div class="earnings-card">
            <div class="eyebrow">YOUR COMMISSION POSITION</div>
            <h3>Approved &amp; Earned</h3>
            <div class="earnings-value">$${f.approvedCommission.toLocaleString()}</div>
            <p>Calculated from confirmed supplier bookings. $${f.pendingCommission.toLocaleString()} additional in planning review.</p>
            <button class="text-link" data-go="commissions">VIEW COMMISSION LEDGER ↗</button>
          </div>

          <div>
            <div class="section-kicker">
              <h3>The Belle Amoura Academy</h3>
              <span>CURRICULUM</span>
            </div>
            <div class="learning-card">
              <div class="learning-art">
                <img src="/assets/logo-emblem.png" alt="Emblem" style="width:36px; height:36px; border-radius:50%; object-fit:cover;">
              </div>
              <div>
                <div class="micro-label">CONTRACTOR CERTIFICATION</div>
                <h4>The Art of Thoughtful Travel</h4>
                <p>6 structured modules on UHNW guest care, discretion, and airside supplier logistics.</p>
                <button class="text-link" data-go="training">OPEN ACADEMY CURRICULUM ↗</button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div class="quick-strip" style="margin-top: 32px;">
        <button class="quick-action" data-go="bookings">Open Booking Desk ↗</button>
        <button class="quick-action" data-go="crm">Go to Client Book ↗</button>
        <button class="quick-action" data-go="commissions">View Commission Ledger ↗</button>
        <button class="quick-action" data-go="payouts">Payout Center ↗</button>
      </div>
      `;
    },

    bookings: () => {
      return head('THE RESERVATION ATELIER', 'Every detail has <em>its place.</em>', 'Manage assigned enquiries, curations, and verified reservations with clear itinerary stages and commission transparency.', 'RESERVATIONS / 02') +
      `
      <div class="page-split">
        <div>
          <section class="editorial-panel">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:12px;">
              <div>
                <h2 style="margin:0;">Active Booking Register</h2>
                <p style="margin:4px 0 0; font-size:12px; color:#666;">Track guest stages from discovery to arrival.</p>
              </div>
              <button class="solid-button" id="open-new-booking-btn" type="button" style="background:var(--teal, #0B4F4A); color:#FFF; padding:10px 18px; border:none; font-weight:700; font-size:11px; letter-spacing:0.12em; text-transform:uppercase; cursor:pointer;">
                ＋ Create New Booking
              </button>
            </div>

            <div class="table-wrap" style="background:#FFFFFF; border:1px solid #d8d0c0;">
              <table class="data-table" style="width:100%; border-collapse:collapse;">
                <thead>
                  <tr style="text-align:left; border-bottom:1px solid #d8d0c0; font-size:10px; text-transform:uppercase; letter-spacing:0.12em; color:#777; background:#F8F5EE;">
                    <th style="padding:12px;">Reference / Guest</th>
                    <th style="padding:12px;">Destination &amp; Itinerary</th>
                    <th style="padding:12px;">Dates</th>
                    <th style="padding:12px;">Gross Value</th>
                    <th style="padding:12px;">Commission</th>
                    <th style="padding:12px;">Stage</th>
                  </tr>
                </thead>
                <tbody id="bookings-table-body">
                  ${state.bookings.map(b => `
                    <tr style="border-bottom:1px solid #eae5db; font-size:12px;">
                      <td style="padding:14px 12px;">
                        <strong>${b.guest}</strong><br>
                        <code style="font-size:10px; color:#666;">${b.id}</code>
                      </td>
                      <td style="padding:14px 12px;">
                        <span style="font-weight:600; color:#0B4F4A;">${b.destination}</span><br>
                        <small style="color:#777;">${b.notes || ''}</small>
                      </td>
                      <td style="padding:14px 12px; font-size:11px; color:#555;">${b.dates}</td>
                      <td style="padding:14px 12px; font-weight:600;">$${Number(b.value).toLocaleString()}</td>
                      <td style="padding:14px 12px; font-weight:700; color:#0B4F4A;">$${Number(b.commission).toLocaleString()}<br><small style="color:#888; font-weight:normal;">${b.tier}</small></td>
                      <td style="padding:14px 12px;">
                        <span style="display:inline-block; padding:4px 8px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; background:${b.stage==='Confirmed'?'#E0F2E9':'#F5EFE0'}; color:${b.stage==='Confirmed'?'#0B4F4A':'#8C6D23'}; border-radius:2px;">
                          ${b.stage}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside class="side-note">
          <div class="eyebrow">COMMISSION TIERS</div>
          <h3>Transparent Contractor Rates</h3>
          <p>Every journey reflects contracted commercial terms with no hidden platform deductions:</p>
          <div class="note-rule"></div>
          <div class="mini-metric"><span>Tier 1: Bespoke Itineraries</span><b>12%</b></div>
          <div class="mini-metric"><span>Tier 2: Private Charters ($30k+)</span><b>15%</b></div>
          <div class="mini-metric"><span>Tier 3: Exclusive Residencies</span><b>18%</b></div>
          <div class="note-rule"></div>
          <p style="font-size:11px; color:#777; line-height:1.7;">Commissions are locked upon verified deposit and settled via priority bank wire upon guest departure.</p>
        </aside>
      </div>

      <!-- New Booking Modal Dialog -->
      <div id="booking-modal" style="display:none; position:fixed; inset:0; background:rgba(4,36,38,0.85); backdrop-filter:blur(8px); z-index:100000; align-items:center; justify-content:center; padding:20px;">
        <div style="background:#FFFDF8; border:1px solid #B7955B; border-radius:4px; max-width:540px; width:100%; padding:32px; box-shadow:0 24px 60px rgba(0,0,0,0.5); position:relative;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid #E5DDCF; padding-bottom:12px;">
            <h3 style="margin:0; font-family:var(--serif, serif); font-size:22px; color:#0B4F4A;">＋ Create Itinerary Booking</h3>
            <button id="close-booking-modal" type="button" style="background:none; border:none; font-size:24px; cursor:pointer; color:#777;">&times;</button>
          </div>

          <form id="new-booking-form" style="display:grid; gap:14px;">
            <div>
              <label style="display:block; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:#555; margin-bottom:4px;">Guest Name *</label>
              <input type="text" id="nb-guest" required placeholder="e.g. Lord Harrington" style="width:100%; padding:10px; border:1px solid #CCC; background:#FFF; font-size:13px; box-sizing:border-box;">
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div>
                <label style="display:block; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:#555; margin-bottom:4px;">Destination *</label>
                <select id="nb-destination" required style="width:100%; padding:10px; border:1px solid #CCC; background:#FFF; font-size:13px; box-sizing:border-box;">
                  <option value="Bali Cliffside Ocean Sanctuaries">Bali Cliffside Sanctuaries</option>
                  <option value="Serengeti & Masai Mara Luxury Camp">Serengeti &amp; Mara Safari</option>
                  <option value="Amalfi Coast & Capri Private Villa">Amalfi &amp; Capri Villa</option>
                  <option value="Kyoto Imperial Machiya & Art">Kyoto &amp; Naoshima</option>
                  <option value="Maldives Lagoon Overwater Pavilions">Maldives Overwater Atoll</option>
                  <option value="Swiss Alps Private Chalet">Swiss Alps Larch Chalet</option>
                </select>
              </div>

              <div>
                <label style="display:block; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:#555; margin-bottom:4px;">Travel Dates *</label>
                <input type="text" id="nb-dates" required placeholder="e.g. 15 Jul – 25 Jul 2026" style="width:100%; padding:10px; border:1px solid #CCC; background:#FFF; font-size:13px; box-sizing:border-box;">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div>
                <label style="display:block; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:#555; margin-bottom:4px;">Gross Booking Value (USD) *</label>
                <input type="number" id="nb-value" required min="5000" step="500" placeholder="35000" style="width:100%; padding:10px; border:1px solid #CCC; background:#FFF; font-size:13px; box-sizing:border-box;">
              </div>

              <div>
                <label style="display:block; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:#555; margin-bottom:4px;">Commission Tier *</label>
                <select id="nb-tier" required style="width:100%; padding:10px; border:1px solid #CCC; background:#FFF; font-size:13px; box-sizing:border-box;">
                  <option value="12">12% Standard Curated Escape</option>
                  <option value="15" selected>15% Private Charter / VIP</option>
                  <option value="18">18% Full Residency Buyout</option>
                </select>
              </div>
            </div>

            <div>
              <label style="display:block; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:#555; margin-bottom:4px;">Itinerary Inclusions &amp; Notes</label>
              <textarea id="nb-notes" rows="2" placeholder="e.g. Private catamaran charter, cliffside chef dinner, airside greeting." style="width:100%; padding:10px; border:1px solid #CCC; background:#FFF; font-size:12px; box-sizing:border-box;"></textarea>
            </div>

            <div style="padding:12px; background:#EBF4F1; border-left:3px solid #0B4F4A; font-size:12px; color:#0B4F4A;">
              <strong>Projected Commission:</strong> <span id="nb-calc-preview">$5,250</span>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:8px;">
              <button type="button" id="cancel-booking-btn" style="padding:10px 18px; background:none; border:1px solid #BBB; font-size:11px; text-transform:uppercase; cursor:pointer;">Cancel</button>
              <button type="submit" style="padding:10px 22px; background:#0B4F4A; color:#FFF; border:none; font-size:11px; font-weight:700; text-transform:uppercase; cursor:pointer;">Save &amp; Log Booking ↗</button>
            </div>
          </form>
        </div>
      </div>
      `;
    },

    crm: () => {
      return head('THE CLIENT BOOK', 'Relationships, <em>remembered well.</em>', 'Private client registry for preferences, discreet communication notes, travel history, and bespoke care.', 'RELATIONSHIPS / 04') +
      `
      <div class="crm-banner" style="background:#042426; color:#FFF; padding:28px 32px; border-radius:4px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:24px;">
        <div>
          <div class="eyebrow" style="color:#E6D2A8;">CLIENT RELATIONSHIP MANAGEMENT</div>
          <h2 style="margin:4px 0 6px; font-size:26px;">Every guest has a story.</h2>
          <p style="margin:0; font-size:12.5px; color:rgba(255,255,255,0.8);">Record the nuances that make a journey feel considered—with access restricted strictly to your authorized client book.</p>
        </div>
        <button class="solid-button" id="open-client-modal-btn" type="button" style="background:#E6D2A8; color:#042426; border:none; padding:12px 22px; font-weight:700; font-size:11px; letter-spacing:0.12em; text-transform:uppercase; cursor:pointer;">
          ＋ Add New Client Profile
        </button>
      </div>

      <div class="search-field" style="margin-bottom:20px; display:flex; gap:10px;">
        <input id="crm-search" type="search" placeholder="Search client name, destination, phone or notes…" aria-label="Search client records" style="flex:1; padding:12px 16px; border:1px solid #CCC; background:#FFF; font-size:13px;">
        <button class="outline-button" id="crm-search-button" style="padding:0 20px; border:1px solid #0B4F4A; background:none; color:#0B4F4A; font-weight:700; text-transform:uppercase; font-size:11px; cursor:pointer;">Search</button>
      </div>

      <div class="page-split">
        <div>
          <div id="clients-grid" style="display:grid; gap:16px;">
            ${state.clients.map((c, idx) => `
              <div class="client-card" style="background:#FFF; padding:22px 24px; border:1px solid #d8d0c0; border-radius:3px; display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:14px;">
                <div style="max-width:440px;">
                  <div style="display:flex; align-items:center; gap:10px; margin-bottom:4px;">
                    <strong style="font-size:16px; color:#0B4F4A;">${c.name}</strong>
                    <span style="font-size:9.5px; padding:2px 6px; background:#EAF2EE; color:#0B4F4A; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; border-radius:2px;">${c.status}</span>
                  </div>
                  <div style="font-size:11.5px; color:#666; margin-bottom:8px;">
                    📍 ${c.location} &nbsp;|&nbsp; ✉️ ${c.email} &nbsp;|&nbsp; 📞 ${c.phone}
                  </div>
                  <p style="font-size:12.5px; line-height:1.6; color:#444; margin:0; font-style:italic;">"${c.notes}"</p>
                </div>
                <div style="text-align:right;">
                  <span style="font-size:10px; text-transform:uppercase; color:#888; display:block;">Recorded Spend</span>
                  <strong style="font-size:14px; color:#0B4F4A;">${c.spend}</strong>
                  <div style="margin-top:10px;">
                    <button class="text-link" onclick="window.__initiateClientContact('${c.name}')" style="font-size:10px; font-weight:700; text-transform:uppercase; background:none; border:none; color:#0B4F4A; cursor:pointer;">Create Dossier ↗</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <aside class="side-note">
          <div class="eyebrow">THE CARE STANDARD</div>
          <h3>Useful memory.<br>Respectful privacy.</h3>
          <p>Record relevant travel preferences and trip context, not unnecessary personal identifiers. Guest confidentiality agreements apply to all entries.</p>
          <div class="note-rule"></div>
          <div class="mini-metric"><span>Total Client Profiles</span><b>${state.clients.length}</b></div>
          <div class="mini-metric"><span>High-Net-Worth Patrons</span><b>2</b></div>
          <div class="mini-metric"><span>Follow-Ups Scheduled</span><b>3 this week</b></div>
        </aside>
      </div>

      <!-- Add Client Modal Dialog -->
      <div id="client-modal" style="display:none; position:fixed; inset:0; background:rgba(4,36,38,0.85); backdrop-filter:blur(8px); z-index:100000; align-items:center; justify-content:center; padding:20px;">
        <div style="background:#FFFDF8; border:1px solid #B7955B; border-radius:4px; max-width:500px; width:100%; padding:32px; box-shadow:0 24px 60px rgba(0,0,0,0.5); position:relative;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid #E5DDCF; padding-bottom:12px;">
            <h3 style="margin:0; font-family:var(--serif, serif); font-size:22px; color:#0B4F4A;">＋ Add VIP Guest Profile</h3>
            <button id="close-client-modal" type="button" style="background:none; border:none; font-size:24px; cursor:pointer; color:#777;">&times;</button>
          </div>

          <form id="new-client-form" style="display:grid; gap:14px;">
            <div>
              <label style="display:block; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:#555; margin-bottom:4px;">Full Name *</label>
              <input type="text" id="nc-name" required placeholder="e.g. Countess Vivienne de Beaufort" style="width:100%; padding:10px; border:1px solid #CCC; background:#FFF; font-size:13px; box-sizing:border-box;">
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div>
                <label style="display:block; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:#555; margin-bottom:4px;">Email Address *</label>
                <input type="email" id="nc-email" required placeholder="client@private.ch" style="width:100%; padding:10px; border:1px solid #CCC; background:#FFF; font-size:13px; box-sizing:border-box;">
              </div>

              <div>
                <label style="display:block; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:#555; margin-bottom:4px;">Phone / WhatsApp *</label>
                <input type="tel" id="nc-phone" required placeholder="+41 22 555 0192" style="width:100%; padding:10px; border:1px solid #CCC; background:#FFF; font-size:13px; box-sizing:border-box;">
              </div>
            </div>

            <div>
              <label style="display:block; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:#555; margin-bottom:4px;">Primary Residence / Timezone</label>
              <input type="text" id="nc-loc" placeholder="Geneva & St. Moritz (CET)" style="width:100%; padding:10px; border:1px solid #CCC; background:#FFF; font-size:13px; box-sizing:border-box;">
            </div>

            <div>
              <label style="display:block; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:#555; margin-bottom:4px;">Guest Nuances, Preferences &amp; Diet</label>
              <textarea id="nc-notes" rows="3" placeholder="Enjoys private yacht charters, bespoke sommelier tastings, requires private security clearance." style="width:100%; padding:10px; border:1px solid #CCC; background:#FFF; font-size:12px; box-sizing:border-box;"></textarea>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:8px;">
              <button type="button" id="cancel-client-btn" style="padding:10px 18px; background:none; border:1px solid #BBB; font-size:11px; text-transform:uppercase; cursor:pointer;">Cancel</button>
              <button type="submit" style="padding:10px 22px; background:#0B4F4A; color:#FFF; border:none; font-size:11px; font-weight:700; text-transform:uppercase; cursor:pointer;">Save to Client Book ↗</button>
            </div>
          </form>
        </div>
      </div>
      `;
    },

    training: () => {
      const modules = [
        {
          no: '01',
          code: 'FOUNDATION',
          title: 'The Curation Standard',
          desc: 'Our point of view on unhurried luxury travel, architectural sanctuaries, and why breathing room belongs in every itinerary.',
          lessons: '3 Lessons · 15 Min',
          detail: 'Learn how to listen for what the guest wants to feel, avoid overpacked tourist circuits, and match clients to private villas that respect their personal rhythm.'
        },
        {
          no: '02',
          code: 'DESTINATIONS',
          title: 'Seasonality & Off-Market Sanctuaries',
          desc: 'Deep intelligence on Bali, Amalfi, Naoshima, Serengeti, and the Maldives. Monsoon patterns, winds, and private island access.',
          lessons: '4 Lessons · 25 Min',
          detail: 'Understand seasonal microclimates, seaplane transfer cutoff times, and how to verify private airstrip conditions for charter flights.'
        },
        {
          no: '03',
          code: 'GUEST CARE',
          title: 'UHNW Etiquette & Absolute Discretion',
          desc: 'Guest privacy protocols, handling non-disclosure agreements, security escorts, and bespoke dietary curations.',
          lessons: '3 Lessons · 18 Min',
          detail: 'Best practices for managing ultra-high-net-worth expectations, family office communications, and personal concierge handovers.'
        },
        {
          no: '04',
          code: 'OPERATIONS',
          title: 'Booking with Care & Supplier Verification',
          desc: 'Enquiry processing, contracts with vetted boutique hotels, deposit timelines, and airside fast-track greeting protocols.',
          lessons: '4 Lessons · 22 Min',
          detail: 'Step-by-step verification procedures for villas, skippers, and private guides to guarantee seamless guest delivery.'
        },
        {
          no: '05',
          code: 'COMMERCIAL',
          title: 'Tiered Commission Mastery',
          desc: 'How your earnings are calculated (12%, 15%, 18%), split models, client retainers, and transparent payout schedules.',
          lessons: '2 Lessons · 12 Min',
          detail: 'Maximize your commission earnings ethically through value-add villa buyouts, long-stay bookings, and private aviation add-ons.'
        },
        {
          no: '06',
          code: 'STANDARDS',
          title: 'Crisis Readiness & Weather Contingencies',
          desc: 'Graceful responses to unexpected delays, alternative rainy-day itineraries, flight disruptions, and dedicated escalation desks.',
          lessons: '3 Lessons · 16 Min',
          detail: 'Protocols for quiet, non-panicked client reassurance, rapid rebooking through priority supplier channels, and guest delight.'
        }
      ];

      return head('BELLE AMOURA ACADEMY', 'Expertise is part of <em>the experience.</em>', 'The professional curriculum for travel consultants who make every Belle Amoura journey feel considered, personal and seamless.', 'LEARNING PATHWAYS / 03') +
      `
      <section class="training-feature" style="background:#042426; color:#FFF; padding:36px; border-radius:4px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:24px; margin-bottom:32px;">
        <div style="max-width:540px;">
          <div class="eyebrow" style="color:#E6D2A8;">THE CONSULTANT CURRICULUM · 2026 EDITION</div>
          <h2 style="font-size:28px; margin:8px 0 12px; line-height:1.2;">Learn the details.<br>Elevate the journey.</h2>
          <p style="font-size:13px; line-height:1.8; color:rgba(255,255,255,0.85); margin:0;">Explore brand foundations, destination intelligence, thoughtful service standards, and contract protocols that protect the guest experience.</p>
        </div>
        <div style="text-align:right;">
          <div style="font-family:var(--serif, serif); font-size:42px; color:#E6D2A8; line-height:1;">BA.</div>
          <span style="font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:#AAA;">FIELD GUIDE / VOL. 01</span>
        </div>
      </section>

      <div class="section-kicker">
        <h3>Certified Learning Modules</h3>
        <span>SELF-PACED ACADEMY DOSSIERS</span>
      </div>

      <div class="module-list" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:20px; margin-top:16px;">
        ${modules.map((m, idx) => `
          <article class="module-card" style="background:#FFF; padding:24px; border:1px solid #d8d0c0; border-top:3px solid #0B4F4A; border-radius:3px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span class="module-no" style="font-size:10px; font-weight:700; color:#888; letter-spacing:0.12em;">MODULE ${m.no} / ${m.code}</span>
                <span style="font-size:10px; color:#0B4F4A; font-weight:600;">${m.lessons}</span>
              </div>
              <h3 style="font-size:18px; margin:0 0 8px; color:#0B4F4A;">${m.title}</h3>
              <p style="font-size:12px; line-height:1.7; color:#555; margin:0 0 16px;">${m.desc}</p>
            </div>
            <div>
              <button class="solid-button" onclick="window.__openModuleDetail('${m.no}', '${m.title}', '${m.detail.replace(/'/g, "\\'")}')" style="background:#0B4F4A; color:#FFF; border:none; padding:8px 16px; font-size:10.5px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; cursor:pointer;">
                Open Lesson Dossier ↗
              </button>
            </div>
          </article>
        `).join('')}
      </div>

      <!-- Module Reader Modal -->
      <div id="module-modal" style="display:none; position:fixed; inset:0; background:rgba(4,36,38,0.85); backdrop-filter:blur(8px); z-index:100000; align-items:center; justify-content:center; padding:20px;">
        <div style="background:#FFFDF8; border:1px solid #B7955B; border-radius:4px; max-width:600px; width:100%; padding:36px; box-shadow:0 24px 60px rgba(0,0,0,0.5); position:relative;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid #E5DDCF; padding-bottom:12px;">
            <div>
              <span id="mm-code" style="font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:#888; font-weight:700;">MODULE DOSSIER</span>
              <h3 id="mm-title" style="margin:4px 0 0; font-family:var(--serif, serif); font-size:22px; color:#0B4F4A;">Module Title</h3>
            </div>
            <button id="close-module-modal" type="button" style="background:none; border:none; font-size:24px; cursor:pointer; color:#777;">&times;</button>
          </div>

          <div style="margin-bottom:20px;">
            <h4 style="font-size:13px; text-transform:uppercase; letter-spacing:0.1em; color:#0B4F4A; margin-bottom:8px;">Core Curriculum Intelligence:</h4>
            <p id="mm-body" style="font-size:13px; line-height:1.8; color:#444; background:#F8F4EC; padding:16px; border-radius:2px;"></p>
          </div>

          <div style="margin-bottom:20px; border-top:1px solid #E5DDCF; padding-top:16px;">
            <h4 style="font-size:12px; text-transform:uppercase; letter-spacing:0.1em; color:#0B4F4A; margin-bottom:10px;">Quick Knowledge Check:</h4>
            <p style="font-size:12px; color:#555; margin-bottom:8px;">How does The Belle Amoura Retreat define true luxury in guest itineraries?</p>
            <div style="display:grid; gap:8px;">
              <button onclick="window.__gradeQuiz(this, true)" style="text-align:left; padding:8px 12px; background:#FFF; border:1px solid #CCC; font-size:11.5px; cursor:pointer;">A. Personal attention, verified privacy, unhurried pace, and room for rest.</button>
              <button onclick="window.__gradeQuiz(this, false)" style="text-align:left; padding:8px 12px; background:#FFF; border:1px solid #CCC; font-size:11.5px; cursor:pointer;">B. Packing as many famous sights and monuments into one day as possible.</button>
            </div>
            <div id="quiz-feedback" style="display:none; margin-top:10px; font-size:12px; font-weight:700;"></div>
          </div>

          <div style="display:flex; justify-content:flex-end;">
            <button id="close-module-modal-btn" type="button" style="padding:10px 20px; background:#0B4F4A; color:#FFF; border:none; font-size:11px; font-weight:700; text-transform:uppercase; cursor:pointer;">Close Lesson Dossier</button>
          </div>
        </div>
      </div>
      `;
    },

    commissions: () => {
      const f = getFinancials();

      return head('THE COMMISSION LEDGER', 'Earnings with <em>clear provenance.</em>', 'Every dollar traced to its booking, contracted terms, supplier verification, and bank settlement schedule.', 'COMMERCIAL / 05') +
      `
      <div class="page-split">
        <div>
          <div class="earnings-card" style="margin-bottom:24px;">
            <div class="eyebrow">YOUR CURRENT COMMISSION POSITION</div>
            <h3>Approved &amp; Ready for Settlement</h3>
            <div class="earnings-value">$${f.approvedCommission.toLocaleString()}</div>
            <p>Calculated strictly from approved reservations. No speculative estimates or unverified records.</p>
          </div>

          <!-- Dynamic Interactive Commission Calculator -->
          <section class="editorial-panel" style="margin-bottom:24px; background:#F8F5EE; border:1px solid #D8D0C0; padding:24px;">
            <div class="eyebrow" style="color:#0B4F4A; margin-bottom:6px;">INTERACTIVE EARNINGS CALCULATOR</div>
            <h3 style="margin:0 0 12px; font-size:18px;">Estimate Your Next Escape Payout</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; align-items:center;">
              <div>
                <label style="display:block; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#555; margin-bottom:6px;">Booking Value: <strong id="calc-val-label">$50,000</strong></label>
                <input type="range" id="calc-slider" min="10000" max="250000" step="5000" value="50000" style="width:100%; accent-color:#0B4F4A;">
              </div>
              <div>
                <label style="display:block; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#555; margin-bottom:6px;">Commission Tier</label>
                <select id="calc-tier" style="width:100%; padding:8px; border:1px solid #CCC; background:#FFF; font-size:12px;">
                  <option value="0.12">12% Standard Escape ($6,000)</option>
                  <option value="0.15" selected>15% VIP Charter ($7,500)</option>
                  <option value="0.18">18% Residency Buyout ($9,000)</option>
                </select>
              </div>
            </div>
            <div style="margin-top:16px; padding:12px; background:#FFF; border-left:3px solid #B7955B; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; color:#444;">Projected Net Contractor Commission:</span>
              <strong id="calc-result" style="font-size:18px; color:#0B4F4A; font-family:monospace;">$7,500.00</strong>
            </div>
          </section>

          <section class="editorial-panel">
            <h2 style="margin:0 0 8px;">Commission Records</h2>
            <p style="margin:0 0 16px; font-size:12px; color:#666;">Each line item reflects the verified contract basis and payment clearance.</p>

            <div class="table-wrap" style="background:#FFF; border:1px solid #d8d0c0;">
              <table class="data-table" style="width:100%; border-collapse:collapse;">
                <thead>
                  <tr style="text-align:left; border-bottom:1px solid #d8d0c0; font-size:10px; text-transform:uppercase; letter-spacing:0.12em; color:#777; background:#F8F5EE;">
                    <th style="padding:12px;">Booking Ref</th>
                    <th style="padding:12px;">Guest &amp; Scope</th>
                    <th style="padding:12px;">Rate / Terms</th>
                    <th style="padding:12px;">Amount</th>
                    <th style="padding:12px;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.bookings.map(b => `
                    <tr style="border-bottom:1px solid #eae5db; font-size:12px;">
                      <td style="padding:12px;"><code style="font-size:11px;">${b.id}</code></td>
                      <td style="padding:12px;"><strong>${b.guest}</strong><br><small style="color:#777;">${b.destination}</small></td>
                      <td style="padding:12px; font-size:11px; color:#555;">${b.tier}</td>
                      <td style="padding:12px; font-weight:700; color:#0B4F4A; font-family:monospace;">$${Number(b.commission).toLocaleString()}</td>
                      <td style="padding:12px;">
                        <span style="padding:3px 8px; font-size:9.5px; font-weight:700; text-transform:uppercase; background:${b.stage==='Confirmed'?'#E0F2E9':'#F5EFE0'}; color:${b.stage==='Confirmed'?'#0B4F4A':'#8C6D23'}; border-radius:2px;">
                          ${b.stage==='Confirmed'?'Approved':'Under Review'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside class="side-note">
          <div class="eyebrow">STATUS GUIDE</div>
          <h3>Ledger Lifecycle</h3>
          <p>Clear states help contractors track what is under proposal review, verified, payable, and settled.</p>
          <div class="note-rule"></div>
          <div class="mini-metric"><span>Under Review</span><b>Inquiry / Proposal</b></div>
          <div class="mini-metric"><span>Approved</span><b>Deposit Verified</b></div>
          <div class="mini-metric"><span>Payable</span><b>Travel Initiated</b></div>
          <div class="mini-metric"><span>Settled</span><b>Priority Wire Sent</b></div>
        </aside>
      </div>
      `;
    },

    reporting: () => {
      const f = getFinancials();

      return head('THE PERFORMANCE REVIEW', 'A clearer view of <em>the work.</em>', 'Understand booking velocity, conversion rates, and client retention across quarters.', 'INSIGHTS / 06') +
      `
      <section class="report-hero" style="background:#042426; color:#FFF; padding:32px; border-radius:4px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:24px; margin-bottom:32px;">
        <div style="max-width:540px;">
          <div class="eyebrow" style="color:#E6D2A8;">CONSULTANT PERFORMANCE &amp; CONVERSIONS</div>
          <h2 style="font-size:26px; margin:8px 0 12px;">Measure what matters.<br>Deliver with intention.</h2>
          <p style="font-size:13px; line-height:1.8; color:rgba(255,255,255,0.85); margin:0;">Track high-ticket conversion efficiency, itinerary size, and guest repeat bookings without arbitrary quotas.</p>
        </div>
        <div class="report-figure" style="text-align:right;">
          <span class="micro-label" style="font-size:10px; color:#AAA; text-transform:uppercase;">TOTAL PIPELINE VOLUME</span>
          <div style="font-size:32px; font-weight:700; color:#E6D2A8; font-family:monospace; margin:4px 0;">$${f.totalBookingsValue.toLocaleString()}</div>
          <span style="font-size:11px; color:#A4D4C5;">4 Active Itineraries</span>
        </div>
      </section>

      <div class="section-kicker">
        <h3>Performance Breakdown</h3>
        <span>REPORT CATALOGUE</span>
      </div>

      <div class="module-list" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:20px; margin-top:16px;">
        <article class="module-card" style="background:#FFF; padding:22px; border:1px solid #d8d0c0; border-radius:3px;">
          <span style="font-size:10px; font-weight:700; color:#888;">METRIC 01</span>
          <h3 style="font-size:16px; margin:8px 0 6px; color:#0B4F4A;">Enquiry-to-Booking</h3>
          <p style="font-size:12px; color:#666; margin:0 0 12px;">75% conversion rate on assigned private enquiries.</p>
          <strong style="font-size:22px; color:#0B4F4A;">75.0%</strong>
        </article>

        <article class="module-card" style="background:#FFF; padding:22px; border:1px solid #d8d0c0; border-radius:3px;">
          <span style="font-size:10px; font-weight:700; color:#888;">METRIC 02</span>
          <h3 style="font-size:16px; margin:8px 0 6px; color:#0B4F4A;">Average Itinerary Value</h3>
          <p style="font-size:12px; color:#666; margin:0 0 12px;">Average gross spend per curated escape.</p>
          <strong style="font-size:22px; color:#0B4F4A;">$43,750</strong>
        </article>

        <article class="module-card" style="background:#FFF; padding:22px; border:1px solid #d8d0c0; border-radius:3px;">
          <span style="font-size:10px; font-weight:700; color:#888;">METRIC 03</span>
          <h3 style="font-size:16px; margin:8px 0 6px; color:#0B4F4A;">Client Retention Score</h3>
          <p style="font-size:12px; color:#666; margin:0 0 12px;">High-net-worth re-booking index.</p>
          <strong style="font-size:22px; color:#0B4F4A;">98.4 / 100</strong>
        </article>
      </div>
      `;
    },

    payouts: () => {
      const f = getFinancials();

      return head('THE PAYOUT OFFICE', 'A considered view of <em>what is due.</em>', 'Manage settlement preferences, withdrawal requests, and historical wire remittances.', 'PAYMENTS / 07') +
      `
      <div class="payout-banner" style="background:#042426; color:#FFF; padding:32px; border-radius:4px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px; margin-bottom:28px;">
        <div>
          <div class="eyebrow" style="color:#E6D2A8;">AVAILABLE PAYABLE BALANCE</div>
          <div style="font-size:38px; font-weight:700; color:#FFFFFF; font-family:monospace; margin:6px 0;">$${f.approvedCommission.toLocaleString()}</div>
          <p style="margin:0 0 16px; font-size:12.5px; color:rgba(255,255,255,0.85);">Approved commissions ready for remittance to your registered corporate or personal account.</p>
          <button class="solid-button" id="request-payout-btn" type="button" style="background:#E6D2A8; color:#042426; border:none; padding:12px 22px; font-weight:700; font-size:11px; letter-spacing:0.12em; text-transform:uppercase; cursor:pointer;">
            Request Withdrawal Remittance ↗
          </button>
        </div>
        <div style="text-align:right; border:1px solid #E6D2A8; padding:16px 20px; border-radius:3px;">
          <div style="font-family:var(--serif, serif); font-size:18px; color:#E6D2A8;">BARCLAYS PRIVATE</div>
          <div style="font-size:11px; color:#DDD; margin-top:4px;">Account ending in **** 9104</div>
          <span style="display:inline-block; margin-top:8px; font-size:9.5px; padding:2px 6px; background:#0B4F4A; color:#FFF; font-weight:700; text-transform:uppercase;">Verified Primary</span>
        </div>
      </div>

      <div class="page-split">
        <div>
          <section class="editorial-panel">
            <h2 style="margin:0 0 8px;">Settlement History</h2>
            <p style="margin:0 0 16px; font-size:12px; color:#666;">Historical remittances with wire references and clearance dates.</p>

            <div class="table-wrap" style="background:#FFF; border:1px solid #d8d0c0;">
              <table class="data-table" style="width:100%; border-collapse:collapse;">
                <thead>
                  <tr style="text-align:left; border-bottom:1px solid #d8d0c0; font-size:10px; text-transform:uppercase; letter-spacing:0.12em; color:#777; background:#F8F5EE;">
                    <th style="padding:12px;">Payout Ref</th>
                    <th style="padding:12px;">Period Scope</th>
                    <th style="padding:12px;">Amount</th>
                    <th style="padding:12px;">Remittance Channel</th>
                    <th style="padding:12px;">Settlement Date</th>
                    <th style="padding:12px;">Status</th>
                  </tr>
                </thead>
                <tbody id="payouts-table-body">
                  ${state.payouts.map(p => `
                    <tr style="border-bottom:1px solid #eae5db; font-size:12px;">
                      <td style="padding:12px;"><code style="font-size:11px;">${p.ref}</code></td>
                      <td style="padding:12px;"><strong>${p.period}</strong></td>
                      <td style="padding:12px; font-weight:700; color:#0B4F4A; font-family:monospace;">${p.amount}</td>
                      <td style="padding:12px; font-size:11px; color:#555;">${p.channel}</td>
                      <td style="padding:12px; font-size:11px; color:#555;">${p.date}</td>
                      <td style="padding:12px;">
                        <span style="padding:3px 8px; font-size:9.5px; font-weight:700; text-transform:uppercase; background:${p.status==='Paid'?'#E0F2E9':'#F5EFE0'}; color:${p.status==='Paid'?'#0B4F4A':'#8C6D23'}; border-radius:2px;">
                          ${p.status}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside class="side-note">
          <div class="eyebrow">REMITTANCE SCHEDULE</div>
          <h3>Payment Safeguards</h3>
          <p>Payouts are executed via direct priority SWIFT wire transfer on the 15th and last business day of every month.</p>
          <div class="note-rule"></div>
          <div class="mini-metric"><span>Next Run Date</span><b>30 Nov 2026</b></div>
          <div class="mini-metric"><span>Minimum Threshold</span><b>$500.00</b></div>
          <div class="mini-metric"><span>Wire Currency</span><b>USD / EUR / GBP</b></div>
        </aside>
      </div>

      <!-- Request Payout Modal -->
      <div id="payout-modal" style="display:none; position:fixed; inset:0; background:rgba(4,36,38,0.85); backdrop-filter:blur(8px); z-index:100000; align-items:center; justify-content:center; padding:20px;">
        <div style="background:#FFFDF8; border:1px solid #B7955B; border-radius:4px; max-width:480px; width:100%; padding:32px; box-shadow:0 24px 60px rgba(0,0,0,0.5); position:relative;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid #E5DDCF; padding-bottom:12px;">
            <h3 style="margin:0; font-family:var(--serif, serif); font-size:22px; color:#0B4F4A;">Confirm Payout Request</h3>
            <button id="close-payout-modal" type="button" style="background:none; border:none; font-size:24px; cursor:pointer; color:#777;">&times;</button>
          </div>

          <p style="font-size:13px; color:#555; line-height:1.7;">You are requesting a withdrawal of your verified approved balance:</p>
          <div style="font-size:32px; font-weight:700; color:#0B4F4A; font-family:monospace; margin:10px 0 16px;">$${f.approvedCommission.toLocaleString()}</div>

          <div style="background:#F3EFE6; padding:14px; font-size:11.5px; color:#444; border-radius:2px; margin-bottom:20px;">
            Destination: <strong>Barclays Private International (**** 9104)</strong><br>
            Reference: <strong>BA-CONTRACTOR-SETTLEMENT</strong>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:12px;">
            <button type="button" id="cancel-payout-btn" style="padding:10px 18px; background:none; border:1px solid #BBB; font-size:11px; text-transform:uppercase; cursor:pointer;">Cancel</button>
            <button type="button" id="confirm-payout-btn" style="padding:10px 22px; background:#0B4F4A; color:#FFF; border:none; font-size:11px; font-weight:700; text-transform:uppercase; cursor:pointer;">Confirm Remittance ↗</button>
          </div>
        </div>
      </div>
      `;
    }
  };

  // Wire Modal & Interactive Handlers after page render
  function wireInteractiveControls(pageKey) {
    // Navigate between pages
    $$('[data-go]', ws).forEach(b => {
      b.addEventListener('click', () => showPage(b.dataset.go));
    });

    if (pageKey === 'bookings') {
      const openBtn = $('#open-new-booking-btn');
      const modal = $('#booking-modal');
      const closeBtn = $('#close-booking-modal');
      const cancelBtn = $('#cancel-booking-btn');
      const form = $('#new-booking-form');
      const valueInput = $('#nb-value');
      const tierSelect = $('#nb-tier');
      const calcPreview = $('#nb-calc-preview');

      function updateCalc() {
        const val = Number(valueInput?.value) || 0;
        const rate = (Number(tierSelect?.value) || 12) / 100;
        const comm = val * rate;
        if (calcPreview) calcPreview.textContent = '$' + comm.toLocaleString(undefined, { minimumFractionDigits: 2 });
      }

      if (valueInput) valueInput.addEventListener('input', updateCalc);
      if (tierSelect) tierSelect.addEventListener('change', updateCalc);

      if (openBtn && modal) {
        openBtn.addEventListener('click', () => {
          modal.style.display = 'flex';
          updateCalc();
        });
      }

      const hideModal = () => { if (modal) modal.style.display = 'none'; };
      if (closeBtn) closeBtn.addEventListener('click', hideModal);
      if (cancelBtn) cancelBtn.addEventListener('click', hideModal);

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const guest = $('#nb-guest').value.trim();
          const destination = $('#nb-destination').value;
          const dates = $('#nb-dates').value.trim();
          const value = Number($('#nb-value').value) || 0;
          const tierPercent = Number($('#nb-tier').value) || 12;
          const tierName = tierPercent === 18 ? '18% Full Residency Buyout' : (tierPercent === 15 ? '15% Exclusive Charter' : '12% Curated Escape');
          const commission = value * (tierPercent / 100);
          const notes = $('#nb-notes').value.trim();

          const newBooking = {
            id: 'BA-' + Math.floor(1000 + Math.random() * 9000),
            guest,
            destination,
            dates,
            value,
            tier: tierName,
            commission,
            stage: 'Planning',
            notes
          };

          state.bookings.unshift(newBooking);
          saveState(state);
          hideModal();
          showPage('bookings');
          notify(`✦ Booking ${newBooking.id} created for ${guest} ($${commission.toLocaleString()} commission).`);
        });
      }
    }

    if (pageKey === 'crm') {
      const openBtn = $('#open-client-modal-btn');
      const modal = $('#client-modal');
      const closeBtn = $('#close-client-modal');
      const cancelBtn = $('#cancel-client-btn');
      const form = $('#new-client-form');
      const searchInput = $('#crm-search');
      const searchBtn = $('#crm-search-button');

      if (openBtn && modal) {
        openBtn.addEventListener('click', () => {
          modal.style.display = 'flex';
        });
      }

      const hideModal = () => { if (modal) modal.style.display = 'none'; };
      if (closeBtn) closeBtn.addEventListener('click', hideModal);
      if (cancelBtn) cancelBtn.addEventListener('click', hideModal);

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = $('#nc-name').value.trim();
          const email = $('#nc-email').value.trim();
          const phone = $('#nc-phone').value.trim();
          const location = $('#nc-loc').value.trim() || 'International';
          const notes = $('#nc-notes').value.trim() || 'Discreet VIP guest profile.';

          const newClient = {
            name,
            email,
            phone,
            location,
            status: 'Active VIP',
            notes,
            spend: '$0 initial'
          };

          state.clients.unshift(newClient);
          saveState(state);
          hideModal();
          showPage('crm');
          notify(`✦ Client profile for ${name} added to your private client book.`);
        });
      }

      function filterClients() {
        const query = (searchInput?.value || '').toLowerCase().trim();
        $$('.client-card').forEach(card => {
          const text = card.textContent.toLowerCase();
          card.style.display = text.includes(query) ? 'flex' : 'none';
        });
      }

      if (searchInput) {
        searchInput.addEventListener('input', filterClients);
        searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') filterClients(); });
      }
      if (searchBtn) searchBtn.addEventListener('click', filterClients);
    }

    if (pageKey === 'training') {
      const modal = $('#module-modal');
      const closeBtn = $('#close-module-modal');
      const closeBtn2 = $('#close-module-modal-btn');

      const hideModal = () => { if (modal) modal.style.display = 'none'; };
      if (closeBtn) closeBtn.addEventListener('click', hideModal);
      if (closeBtn2) closeBtn2.addEventListener('click', hideModal);
    }

    if (pageKey === 'commissions') {
      const slider = $('#calc-slider');
      const tier = $('#calc-tier');
      const valLabel = $('#calc-val-label');
      const result = $('#calc-result');

      function updateCalc() {
        const val = Number(slider?.value) || 50000;
        const rate = Number(tier?.value) || 0.15;
        const earned = val * rate;
        if (valLabel) valLabel.textContent = '$' + val.toLocaleString();
        if (result) result.textContent = '$' + earned.toLocaleString(undefined, { minimumFractionDigits: 2 });
      }

      if (slider) slider.addEventListener('input', updateCalc);
      if (tier) tier.addEventListener('change', updateCalc);
    }

    if (pageKey === 'payouts') {
      const reqBtn = $('#request-payout-btn');
      const modal = $('#payout-modal');
      const closeBtn = $('#close-payout-modal');
      const cancelBtn = $('#cancel-payout-btn');
      const confirmBtn = $('#confirm-payout-btn');

      if (reqBtn && modal) {
        reqBtn.addEventListener('click', () => {
          modal.style.display = 'flex';
        });
      }

      const hideModal = () => { if (modal) modal.style.display = 'none'; };
      if (closeBtn) closeBtn.addEventListener('click', hideModal);
      if (cancelBtn) cancelBtn.addEventListener('click', hideModal);

      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          const f = getFinancials();
          const amountStr = '$' + f.approvedCommission.toLocaleString();
          const newPayout = {
            ref: 'PAY-' + Math.floor(1000 + Math.random() * 9000),
            period: 'Requested On-Demand',
            amount: amountStr,
            status: 'Processing',
            channel: 'Wire · Barclays Private International',
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          };

          state.payouts.unshift(newPayout);
          saveState(state);
          hideModal();
          showPage('payouts');
          notify(`✦ Payout request for ${amountStr} registered and submitted for wire clearance.`);
        });
      }
    }
  }

  // Global helper for opening module modal
  window.__openModuleDetail = function(num, title, body) {
    const modal = $('#module-modal');
    if (!modal) return;
    $('#mm-code').textContent = `MODULE ${num} CURRICULUM DOSSIER`;
    $('#mm-title').textContent = title;
    $('#mm-body').textContent = body;
    const fb = $('#quiz-feedback');
    if (fb) fb.style.display = 'none';
    modal.style.display = 'flex';
  };

  window.__gradeQuiz = function(btn, isCorrect) {
    const fb = $('#quiz-feedback');
    if (!fb) return;
    fb.style.display = 'block';
    if (isCorrect) {
      fb.style.color = '#0B4F4A';
      fb.textContent = '✓ Correct. True luxury travel curation is defined by attention, discretion, and an unhurried pace.';
      btn.style.borderColor = '#0B4F4A';
      btn.style.background = '#E0F2E9';
    } else {
      fb.style.color = '#A63228';
      fb.textContent = 'Incorrect. The Belle Amoura Retreat prioritizes restorative attention over packed itineraries.';
    }
  };

  window.__initiateClientContact = function(name) {
    notify(`Starting consultation briefing for ${name}. Opening booking desk...`);
    showPage('bookings');
  };

  function showPage(key) {
    if (!pages[key]) return;
    ws.innerHTML = pages[key]();
    crumb.textContent = labels[key] || key.toUpperCase();
    $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === key));
    wireInteractiveControls(key);
    if (window.innerWidth < 761 && rail) rail.classList.remove('open');
  }

  $$('.nav-item').forEach(b => b.addEventListener('click', () => showPage(b.dataset.page)));

  const mobileMenuBtn = $('#mobile-menu');
  if (mobileMenuBtn && rail) {
    mobileMenuBtn.addEventListener('click', () => rail.classList.toggle('open'));
  }

  document.addEventListener('click', e => {
    if (window.innerWidth < 761 && rail && rail.classList.contains('open') && !rail.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      rail.classList.remove('open');
    }
  });

  const todayStamp = $('#today-stamp');
  if (todayStamp) {
    const d = new Date();
    todayStamp.textContent = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  }

  showPage('overview');
})();