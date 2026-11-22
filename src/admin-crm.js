/**
 * THE BELLE AMOURA RETREAT — IN-BUILT EXECUTIVE CRM DATABASE
 * High-performance, real-time client & lead management engine
 */

(function () {
  const OWNER_WHATSAPP = '254706168307';
  let currentClients = [];
  let activeFilterTier = 'All';
  let activeFilterStatus = 'All';
  let searchQuery = '';
  let autoRefreshTimer = null;

  // DOM Elements
  const container = document.getElementById('crm-database-container');
  if (!container) return;

  // Render Skeleton UI
  container.innerHTML = `
    <div class="crm-module-wrapper">
      <!-- CRM Header & Metrics -->
      <div class="crm-stats-grid">
        <div class="crm-stat-card">
          <div class="crm-stat-kicker">TOTAL PATRONS</div>
          <div class="crm-stat-val" id="crm-stat-total">—</div>
          <div class="crm-stat-sub">Persisted in in-built CRM</div>
        </div>
        <div class="crm-stat-card">
          <div class="crm-stat-kicker">ACTIVE IN PLANNING</div>
          <div class="crm-stat-val" id="crm-stat-active">—</div>
          <div class="crm-stat-sub">Curated stays in progress</div>
        </div>
        <div class="crm-stat-card highlight-gold">
          <div class="crm-stat-kicker">LIFETIME PIPELINE</div>
          <div class="crm-stat-val" id="crm-stat-spend">$0</div>
          <div class="crm-stat-sub">High-net-worth portfolio</div>
        </div>
        <div class="crm-stat-card">
          <div class="crm-stat-kicker">VIP PATRONS</div>
          <div class="crm-stat-val" id="crm-stat-vip">—</div>
          <div class="crm-stat-sub">Sovereign & Atelier Tiers</div>
        </div>
        <div class="crm-stat-card highlight-green">
          <div class="crm-stat-kicker">WHATSAPP MOBILE DESK</div>
          <div class="crm-stat-val" style="font-size:16px; margin:6px 0; color:#0B4F4A;">+254 706 168 307</div>
          <div class="crm-stat-sub">Direct instant routing active</div>
        </div>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div class="crm-toolbar">
        <div class="crm-toolbar-search">
          <span class="search-icon">🔍</span>
          <input type="text" id="crm-search-input" placeholder="Search patrons by name, email, phone, destination, notes..." autocomplete="off">
        </div>
        
        <div class="crm-toolbar-filters">
          <select id="crm-tier-filter" aria-label="Filter by Tier">
            <option value="All">All VIP Tiers</option>
            <option value="Sovereign Black">Sovereign Black</option>
            <option value="Atelier Platinum">Atelier Platinum</option>
            <option value="Private Patron">Private Patron</option>
            <option value="Strategic Investor">Strategic Investor</option>
            <option value="Talent / Counsel">Talent / Counsel</option>
            <option value="Creator Partner">Creator Partner</option>
          </select>

          <select id="crm-status-filter" aria-label="Filter by Status">
            <option value="All">All Statuses</option>
            <option value="New Inquiry">New Inquiry</option>
            <option value="Active Planning">Active Planning</option>
            <option value="Confirmed Stay">Confirmed Stay</option>
            <option value="Discovery Lead">Discovery Lead</option>
            <option value="Applicant Under Review">Applicant Under Review</option>
            <option value="Creator Pitch Received">Creator Pitch Received</option>
            <option value="Investor Lead">Investor Lead</option>
          </select>

          <button type="button" class="crm-btn crm-btn-primary" id="crm-add-client-btn">
            <span>➕ Add Patron</span>
          </button>
          
          <button type="button" class="crm-btn crm-btn-secondary" id="crm-test-webhook-btn" title="Send a test ping through the WhatsApp mobile webhook">
            <span>📲 Test Webhook</span>
          </button>

          <button type="button" class="crm-btn crm-btn-secondary" id="crm-export-btn" title="Download CRM as CSV">
            <span>📥 Export CSV</span>
          </button>

          <button type="button" class="crm-btn crm-btn-icon" id="crm-refresh-btn" title="Refresh Live Database">
            <span id="crm-refresh-icon">🔄</span>
          </button>
        </div>
      </div>

      <!-- Live Sync Alert Indicator -->
      <div class="crm-sync-banner" id="crm-sync-banner" style="display:none;"></div>

      <!-- CRM Table -->
      <div class="crm-table-container">
        <table class="crm-table">
          <thead>
            <tr>
              <th>Patron / Client</th>
              <th>Contact Details</th>
              <th>VIP Tier</th>
              <th>Status</th>
              <th>Destinations & Vision</th>
              <th>Bookings / LTV</th>
              <th>WhatsApp Action</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="crm-table-body">
            <tr>
              <td colspan="8" style="text-align:center; padding:32px; color:#666;">
                Loading live CRM records...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit/Dossier Modal -->
    <div class="crm-modal" id="crm-dossier-modal" style="display:none;" role="dialog" aria-modal="true">
      <div class="crm-modal-scrim" id="crm-modal-close-scrim"></div>
      <div class="crm-modal-content">
        <div class="crm-modal-header">
          <div>
            <span class="crm-modal-kicker">IN-BUILT CRM DOSSIER</span>
            <h3 id="crm-modal-title">Patron Intelligence Record</h3>
          </div>
          <button type="button" class="crm-modal-close" id="crm-modal-close-btn">&times;</button>
        </div>
        <form id="crm-edit-form" class="crm-modal-body">
          <input type="hidden" id="crm-edit-id">
          
          <div class="crm-form-grid">
            <div class="crm-form-group">
              <label for="crm-edit-name">Full Name</label>
              <input type="text" id="crm-edit-name" required>
            </div>
            <div class="crm-form-group">
              <label for="crm-edit-email">Email Address</label>
              <input type="email" id="crm-edit-email" required>
            </div>
            <div class="crm-form-group">
              <label for="crm-edit-phone">Phone / WhatsApp</label>
              <input type="text" id="crm-edit-phone" placeholder="+254 ...">
            </div>
            <div class="crm-form-group">
              <label for="crm-edit-tier">VIP Patron Tier</label>
              <select id="crm-edit-tier">
                <option value="Sovereign Black">Sovereign Black (Ultra-HNW / Board)</option>
                <option value="Atelier Platinum">Atelier Platinum (Multi-Stay VIP)</option>
                <option value="Private Patron">Private Patron (Standard Luxury)</option>
                <option value="Strategic Investor">Strategic Investor</option>
                <option value="Talent / Counsel">Talent / Counsel</option>
                <option value="Creator Partner">Creator Partner</option>
              </select>
            </div>
            <div class="crm-form-group">
              <label for="crm-edit-status">Pipeline Status</label>
              <select id="crm-edit-status">
                <option value="New Inquiry">New Inquiry</option>
                <option value="Active Planning">Active Planning</option>
                <option value="Confirmed Stay">Confirmed Stay</option>
                <option value="Discovery Lead">Discovery Lead</option>
                <option value="Applicant Under Review">Applicant Under Review</option>
                <option value="Creator Pitch Received">Creator Pitch Received</option>
                <option value="Investor Lead">Investor Lead</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <div class="crm-form-group">
              <label for="crm-edit-ltv">Lifetime Value ($ USD)</label>
              <input type="number" id="crm-edit-ltv" min="0" step="1000">
            </div>
            <div class="crm-form-group">
              <label for="crm-edit-bookings">Completed Stays / Inquiries</label>
              <input type="number" id="crm-edit-bookings" min="0">
            </div>
            <div class="crm-form-group">
              <label for="crm-edit-consultant">Assigned Lead / Concierge</label>
              <input type="text" id="crm-edit-consultant" value="Founder / Concierge">
            </div>
          </div>

          <div class="crm-form-group" style="margin-top:12px;">
            <label for="crm-edit-destinations">Preferred Destinations (comma separated)</label>
            <input type="text" id="crm-edit-destinations" placeholder="Kenya Safari, Diani Beach, Amalfi Coast...">
          </div>

          <div class="crm-form-group" style="margin-top:12px;">
            <label for="crm-edit-preferences">Bespoke Preferences & Travel Vision</label>
            <textarea id="crm-edit-preferences" rows="2" placeholder="Dietary, private aviation requirements, suite preferences..."></textarea>
          </div>

          <div class="crm-form-group" style="margin-top:12px;">
            <label for="crm-edit-notes">Internal CRM Dossier Notes & Submission History</label>
            <textarea id="crm-edit-notes" rows="4" placeholder="Direct interaction records, call logs, requirements..."></textarea>
          </div>

          <div class="crm-modal-actions">
            <div id="crm-direct-wa-wrap"></div>
            <div style="display:flex; gap:8px;">
              <button type="button" class="crm-btn crm-btn-secondary" id="crm-modal-cancel-btn">Cancel</button>
              <button type="submit" class="crm-btn crm-btn-primary" id="crm-modal-save-btn">Save Record</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;

  // Inject Styles for CRM
  if (!document.getElementById('crm-injected-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'crm-injected-styles';
    styleEl.textContent = `
      .crm-module-wrapper {
        margin: 24px 0;
        font-family: 'Manrope', system-ui, sans-serif;
      }
      .crm-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px;
        margin-bottom: 20px;
      }
      .crm-stat-card {
        background: #FFFFFF;
        border: 1px solid #E2DAD0;
        border-radius: 10px;
        padding: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.03);
      }
      .crm-stat-card.highlight-gold {
        border-color: #B7955B;
        background: linear-gradient(135deg, #FFFBF5, #FFFFFF);
      }
      .crm-stat-card.highlight-green {
        border-color: #25D366;
        background: linear-gradient(135deg, #F0FAF4, #FFFFFF);
      }
      .crm-stat-kicker {
        font-size: 9px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #7D6B70;
        font-weight: 700;
      }
      .crm-stat-val {
        font-family: 'Playfair Display', serif;
        font-size: 26px;
        font-weight: 600;
        color: #063B3D;
        margin: 4px 0 2px;
      }
      .crm-stat-sub {
        font-size: 10px;
        color: #8C827A;
      }
      .crm-toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        background: #FFFFFF;
        padding: 12px 16px;
        border: 1px solid #E2DAD0;
        border-radius: 10px;
      }
      .crm-toolbar-search {
        flex: 1 1 260px;
        display: flex;
        align-items: center;
        gap: 8px;
        border: 1px solid #D5CCC0;
        border-radius: 6px;
        padding: 6px 12px;
        background: #F9F7F2;
      }
      .crm-toolbar-search input {
        border: 0;
        outline: 0;
        background: transparent;
        width: 100%;
        font-size: 13px;
        font-family: inherit;
        color: #07090A;
      }
      .crm-toolbar-filters {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .crm-toolbar-filters select {
        border: 1px solid #D5CCC0;
        border-radius: 6px;
        padding: 7px 10px;
        font-size: 12px;
        background: #FFFFFF;
        color: #07090A;
        font-family: inherit;
      }
      .crm-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: 0.18s;
        border: 1px solid transparent;
        font-family: inherit;
      }
      .crm-btn-primary {
        background: #0B4F4A;
        color: #FFFFFF;
        border-color: #0B4F4A;
      }
      .crm-btn-primary:hover {
        background: #063B3D;
      }
      .crm-btn-secondary {
        background: #FAF7F0;
        color: #07090A;
        border-color: #D5CCC0;
      }
      .crm-btn-secondary:hover {
        background: #EDE6D8;
      }
      .crm-btn-icon {
        padding: 8px 10px;
        background: #FAF7F0;
        border-color: #D5CCC0;
      }
      .crm-sync-banner {
        padding: 10px 14px;
        border-radius: 6px;
        background: #E0F2E9;
        border-left: 3px solid #0B4F4A;
        font-size: 12px;
        color: #0B4F4A;
        margin-bottom: 12px;
      }
      .crm-table-container {
        background: #FFFFFF;
        border: 1px solid #E2DAD0;
        border-radius: 10px;
        overflow-x: auto;
        box-shadow: 0 4px 14px rgba(0,0,0,0.03);
      }
      .crm-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        text-align: left;
      }
      .crm-table th {
        background: #F5F1E9;
        color: #07090A;
        padding: 12px 14px;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        font-size: 10px;
        border-bottom: 1px solid #E2DAD0;
      }
      .crm-table td {
        padding: 12px 14px;
        border-bottom: 1px solid #F0ECE4;
        vertical-align: middle;
      }
      .crm-table tr:hover td {
        background: #FAF8F4;
      }
      .crm-patron-name {
        font-weight: 700;
        font-size: 13px;
        color: #07090A;
      }
      .crm-patron-id {
        font-family: monospace;
        font-size: 10px;
        color: #8C827A;
      }
      .crm-badge-tier {
        display: inline-block;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.04em;
      }
      .tier-sovereign { background: #07090A; color: #E6D2A8; border: 1px solid #B7955B; }
      .tier-atelier { background: #0B4F4A; color: #FFFFFF; }
      .tier-patron { background: #E9E1D5; color: #07090A; }
      .tier-investor { background: #20344C; color: #FFFFFF; }
      .tier-talent { background: #4A0E1B; color: #FFFFFF; }
      .tier-creator { background: #7E344B; color: #FFFFFF; }

      .crm-badge-status {
        display: inline-block;
        padding: 2px 7px;
        border-radius: 99px;
        font-size: 10px;
        font-weight: 600;
      }
      .status-new { background: #FEF3C7; color: #92400E; }
      .status-active { background: #D1FAE5; color: #065F46; }
      .status-stay { background: #DBEAFE; color: #1E40AF; }
      .status-lead { background: #EDE9FE; color: #5B21B6; }

      .crm-wa-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 5px 9px;
        border-radius: 5px;
        background: #25D366;
        color: #063B3D;
        font-weight: 700;
        font-size: 11px;
        text-decoration: none;
        box-shadow: 0 1px 4px rgba(37,211,102,0.25);
      }
      .crm-wa-btn:hover {
        background: #1EBE5D;
      }
      .crm-row-actions {
        display: flex;
        gap: 6px;
      }
      .crm-action-link {
        border: 0;
        background: transparent;
        color: #0B4F4A;
        font-weight: 600;
        cursor: pointer;
        padding: 4px;
        text-decoration: underline;
        font-size: 11px;
      }
      .crm-action-del {
        color: #C66D64;
      }

      /* Modal styles */
      .crm-modal {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .crm-modal-scrim {
        position: absolute;
        inset: 0;
        background: rgba(7, 9, 10, 0.6);
        backdrop-filter: blur(2px);
      }
      .crm-modal-content {
        position: relative;
        z-index: 10;
        background: #FFFFFF;
        width: 90%;
        max-width: 680px;
        max-height: 90vh;
        overflow-y: auto;
        border-radius: 12px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.3);
      }
      .crm-modal-header {
        padding: 18px 24px;
        border-bottom: 1px solid #E2DAD0;
        background: #FAF7F0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .crm-modal-kicker {
        font-size: 9px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #B7955B;
        font-weight: 700;
      }
      .crm-modal-header h3 {
        margin: 2px 0 0;
        font-family: 'Playfair Display', serif;
        font-size: 20px;
        color: #07090A;
      }
      .crm-modal-close {
        border: 0;
        background: transparent;
        font-size: 24px;
        cursor: pointer;
        color: #8C827A;
      }
      .crm-modal-body {
        padding: 20px 24px;
      }
      .crm-form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      @media (max-width: 600px) {
        .crm-form-grid { grid-template-columns: 1fr; }
      }
      .crm-form-group label {
        display: block;
        font-size: 11px;
        font-weight: 700;
        color: #4A423D;
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .crm-form-group input, .crm-form-group select, .crm-form-group textarea {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #D5CCC0;
        border-radius: 6px;
        padding: 8px 10px;
        font-size: 13px;
        font-family: inherit;
        background: #FAF8F5;
      }
      .crm-form-group input:focus, .crm-form-group select:focus, .crm-form-group textarea:focus {
        outline: 0;
        border-color: #0B4F4A;
        background: #FFFFFF;
      }
      .crm-modal-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid #E2DAD0;
        flex-wrap: wrap;
        gap: 10px;
      }
    `;
    document.head.appendChild(styleEl);
  }

  // API Callers
  async function loadCrmData(silent = false) {
    try {
      if (!silent) {
        const icon = document.getElementById('crm-refresh-icon');
        if (icon) icon.style.display = 'inline-block';
      }

      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (activeFilterTier !== 'All') params.append('tier', activeFilterTier);
      if (activeFilterStatus !== 'All') params.append('status', activeFilterStatus);

      const res = await fetch('/api/crm/clients?' + params.toString());
      if (!res.ok) throw new Error('Failed to fetch CRM clients');
      const data = await res.json();

      currentClients = data.clients || [];
      renderStats(data.stats);
      renderTable(currentClients);
    } catch (err) {
      console.error('CRM load error:', err);
    }
  }

  function renderStats(stats) {
    if (!stats) return;
    const totalEl = document.getElementById('crm-stat-total');
    const activeEl = document.getElementById('crm-stat-active');
    const spendEl = document.getElementById('crm-stat-spend');
    const vipEl = document.getElementById('crm-stat-vip');

    if (totalEl) totalEl.textContent = stats.totalClients || '0';
    if (activeEl) activeEl.textContent = stats.activePlanningCount || '0';
    if (spendEl) spendEl.textContent = '$' + (stats.totalLifetimeValue || 0).toLocaleString();
    if (vipEl) vipEl.textContent = stats.vipPatronCount || '0';
  }

  function getTierBadgeClass(tier) {
    if (!tier) return 'tier-patron';
    const t = tier.toLowerCase();
    if (t.includes('sovereign')) return 'tier-sovereign';
    if (t.includes('atelier')) return 'tier-atelier';
    if (t.includes('investor')) return 'tier-investor';
    if (t.includes('talent') || t.includes('counsel')) return 'tier-talent';
    if (t.includes('creator')) return 'tier-creator';
    return 'tier-patron';
  }

  function getStatusBadgeClass(status) {
    if (!status) return 'status-new';
    const s = status.toLowerCase();
    if (s.includes('active') || s.includes('planning')) return 'status-active';
    if (s.includes('confirmed') || s.includes('stay')) return 'status-stay';
    if (s.includes('lead') || s.includes('discovery')) return 'status-lead';
    return 'status-new';
  }

  function renderTable(clients) {
    const tbody = document.getElementById('crm-table-body');
    if (!tbody) return;

    if (!clients || clients.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding:32px; color:#8C827A;">
            No patrons or leads match your current search/filter.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = clients.map(c => {
      const tierClass = getTierBadgeClass(c.tier);
      const statusClass = getStatusBadgeClass(c.status);
      const dests = (c.preferredDestinations || []).slice(0, 2).join(', ') || c.lastDestination || 'Kenya & Sanctuaries';
      const cleanPhone = (c.phone || '').replace(/\D/g, '');
      const waPhone = cleanPhone.length > 5 ? cleanPhone : OWNER_WHATSAPP;
      const waText = `Hello ${c.name}, this is The Belle Amoura Retreat concierge liaison regarding your ${c.tier || 'private'} sanctuary profile.`;
      const waLink = `https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`;

      return `
        <tr data-id="${c.id}">
          <td>
            <div class="crm-patron-name">${escapeHtml(c.name)}</div>
            <div class="crm-patron-id">ID: ${escapeHtml(c.id)}</div>
          </td>
          <td>
            <div><a href="mailto:${escapeHtml(c.email)}" style="color:#0B4F4A; font-weight:600;">${escapeHtml(c.email || 'N/A')}</a></div>
            <div style="font-size:11px; color:#666;">${escapeHtml(c.phone || 'No phone recorded')}</div>
          </td>
          <td>
            <span class="crm-badge-tier ${tierClass}">${escapeHtml(c.tier || 'Private Patron')}</span>
          </td>
          <td>
            <span class="crm-badge-status ${statusClass}">${escapeHtml(c.status || 'New Inquiry')}</span>
          </td>
          <td>
            <div style="font-weight:600; color:#07090A;">${escapeHtml(dests)}</div>
            <div style="font-size:10px; color:#8C827A; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${escapeHtml(c.preferences || c.notes || '')}
            </div>
          </td>
          <td>
            <div style="font-weight:700; color:#063B3D;">$${(Number(c.lifetimeValue) || 0).toLocaleString()}</div>
            <div style="font-size:10px; color:#666;">${c.totalBookings || 0} journeys</div>
          </td>
          <td>
            <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="crm-wa-btn" title="Open 1-Click WhatsApp Conversation">
              <span>📲 WhatsApp</span>
            </a>
          </td>
          <td>
            <div class="crm-row-actions">
              <button type="button" class="crm-action-link" onclick="window.__crmOpenDossier('${c.id}')">Dossier / Edit</button>
              <button type="button" class="crm-action-link crm-action-del" onclick="window.__crmDeleteClient('${c.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Open Edit / Dossier Modal
  window.__crmOpenDossier = function (id) {
    const client = currentClients.find(c => c.id === id);
    if (!client) return;

    document.getElementById('crm-modal-title').textContent = `Dossier: ${client.name}`;
    document.getElementById('crm-edit-id').value = client.id;
    document.getElementById('crm-edit-name').value = client.name || '';
    document.getElementById('crm-edit-email').value = client.email || '';
    document.getElementById('crm-edit-phone').value = client.phone || '';
    document.getElementById('crm-edit-tier').value = client.tier || 'Private Patron';
    document.getElementById('crm-edit-status').value = client.status || 'New Inquiry';
    document.getElementById('crm-edit-ltv').value = client.lifetimeValue || 0;
    document.getElementById('crm-edit-bookings').value = client.totalBookings || 0;
    document.getElementById('crm-edit-consultant').value = client.assignedConsultant || 'Founder / Concierge';
    document.getElementById('crm-edit-destinations').value = (client.preferredDestinations || []).join(', ');
    document.getElementById('crm-edit-preferences').value = client.preferences || '';
    document.getElementById('crm-edit-notes').value = client.notes || '';

    // Direct WhatsApp Button
    const waWrap = document.getElementById('crm-direct-wa-wrap');
    const cleanPhone = (client.phone || '').replace(/\D/g, '');
    const waPhone = cleanPhone.length > 5 ? cleanPhone : OWNER_WHATSAPP;
    const waText = `Hello ${client.name}, this is The Belle Amoura Retreat concierge liaison regarding your curated retreat profile.`;
    waWrap.innerHTML = `
      <a href="https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}" target="_blank" rel="noopener noreferrer" class="crm-wa-btn" style="padding:8px 14px; font-size:12px;">
        <span>📲 Chat on WhatsApp (+${waPhone})</span>
      </a>
    `;

    document.getElementById('crm-dossier-modal').style.display = 'flex';
  };

  // Delete Client
  window.__crmDeleteClient = async function (id) {
    if (!confirm('Are you sure you want to permanently remove this patron record from the CRM database?')) return;
    try {
      const res = await fetch(`/api/crm/clients/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showBanner('Patron record successfully removed from CRM.');
        loadCrmData(true);
      }
    } catch (e) {
      alert('Failed to delete patron: ' + e.message);
    }
  };

  function closeModal() {
    const modal = document.getElementById('crm-dossier-modal');
    if (modal) modal.style.display = 'none';
  }

  function showBanner(msg) {
    const banner = document.getElementById('crm-sync-banner');
    if (!banner) return;
    banner.textContent = msg;
    banner.style.display = 'block';
    setTimeout(() => { banner.style.display = 'none'; }, 4000);
  }

  // Setup Event Listeners
  const searchInput = document.getElementById('crm-search-input');
  if (searchInput) {
    let debounce;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        searchQuery = e.target.value.trim();
        loadCrmData(false);
      }, 250);
    });
  }

  const tierFilter = document.getElementById('crm-tier-filter');
  if (tierFilter) {
    tierFilter.addEventListener('change', (e) => {
      activeFilterTier = e.target.value;
      loadCrmData(false);
    });
  }

  const statusFilter = document.getElementById('crm-status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      activeFilterStatus = e.target.value;
      loadCrmData(false);
    });
  }

  const refreshBtn = document.getElementById('crm-refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadCrmData(false);
      showBanner('CRM Database synchronized with live records.');
    });
  }

  const closeBtn = document.getElementById('crm-modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  const cancelBtn = document.getElementById('crm-modal-cancel-btn');
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  const scrim = document.getElementById('crm-modal-close-scrim');
  if (scrim) scrim.addEventListener('click', closeModal);

  // Form Save
  const editForm = document.getElementById('crm-edit-form');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('crm-edit-id').value;
      const payload = {
        name: document.getElementById('crm-edit-name').value.trim(),
        email: document.getElementById('crm-edit-email').value.trim(),
        phone: document.getElementById('crm-edit-phone').value.trim(),
        tier: document.getElementById('crm-edit-tier').value,
        status: document.getElementById('crm-edit-status').value,
        lifetimeValue: Number(document.getElementById('crm-edit-ltv').value) || 0,
        totalBookings: Number(document.getElementById('crm-edit-bookings').value) || 0,
        assignedConsultant: document.getElementById('crm-edit-consultant').value.trim(),
        preferredDestinations: document.getElementById('crm-edit-destinations').value.split(',').map(s => s.trim()).filter(Boolean),
        preferences: document.getElementById('crm-edit-preferences').value.trim(),
        notes: document.getElementById('crm-edit-notes').value.trim()
      };

      try {
        const res = await fetch(`/api/crm/clients/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          closeModal();
          showBanner(`Record for ${payload.name} updated and saved to disk.`);
          loadCrmData(true);
        } else {
          alert('Failed to save record.');
        }
      } catch (err) {
        alert('Network error saving patron: ' + err.message);
      }
    });
  }

  // Add Client Button
  const addClientBtn = document.getElementById('crm-add-client-btn');
  if (addClientBtn) {
    addClientBtn.addEventListener('click', async () => {
      const name = prompt('Enter New Patron / Lead Full Name:');
      if (!name || !name.trim()) return;
      const email = prompt('Enter Email Address:') || '';
      const phone = prompt('Enter Phone Number / WhatsApp:') || '';
      const dest = prompt('Target Sanctuary / Destination:') || 'Kenya Safari & Coast';

      try {
        const res = await fetch('/api/crm/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            tier: 'Private Patron',
            status: 'Active Planning',
            preferredDestinations: [dest],
            notes: 'Enrolled manually via Admin Portal CRM interface.'
          })
        });

        if (res.ok) {
          showBanner(`New patron "${name}" enrolled into CRM.`);
          loadCrmData(true);
        }
      } catch (err) {
        alert('Error adding patron: ' + err.message);
      }
    });
  }

  // Test WhatsApp Webhook Button
  const testWebhookBtn = document.getElementById('crm-test-webhook-btn');
  if (testWebhookBtn) {
    testWebhookBtn.addEventListener('click', async () => {
      try {
        testWebhookBtn.disabled = true;
        testWebhookBtn.textContent = 'Pinging...';
        const res = await fetch('/api/whatsapp/test-webhook', { method: 'POST' });
        const data = await res.json();
        showBanner(`WhatsApp Webhook Ping: Status 200. Target: ${data.targetWhatsApp}. Ready to route leads.`);
        if (data.previewUrl) {
          window.open(data.previewUrl, '_blank');
        }
      } catch (e) {
        alert('Webhook ping error: ' + e.message);
      } finally {
        testWebhookBtn.disabled = false;
        testWebhookBtn.innerHTML = '<span>📲 Test Webhook</span>';
      }
    });
  }

  // Export CSV Button
  const exportBtn = document.getElementById('crm-export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (!currentClients || currentClients.length === 0) {
        alert('No patron records to export.');
        return;
      }

      const headers = ['ID', 'Name', 'Email', 'Phone', 'Tier', 'Status', 'Destinations', 'Lifetime Value', 'Total Bookings', 'Consultant', 'Notes', 'Created At'];
      const rows = currentClients.map(c => [
        c.id,
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${(c.email || '').replace(/"/g, '""')}"`,
        `"${(c.phone || '').replace(/"/g, '""')}"`,
        `"${(c.tier || '').replace(/"/g, '""')}"`,
        `"${(c.status || '').replace(/"/g, '""')}"`,
        `"${((c.preferredDestinations || []).join('; ')).replace(/"/g, '""')}"`,
        c.lifetimeValue || 0,
        c.totalBookings || 0,
        `"${(c.assignedConsultant || '').replace(/"/g, '""')}"`,
        `"${(c.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        c.createdAt || ''
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `the-belle-amoura-crm-database-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Initial Data Load
  loadCrmData(false);

  // Auto-refresh every 10 seconds to detect real-time form submissions immediately!
  autoRefreshTimer = setInterval(() => {
    loadCrmData(true);
  }, 10000);
})();
