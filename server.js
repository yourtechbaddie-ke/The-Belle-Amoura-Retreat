import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  OWNER_WHATSAPP_NUMBER,
  OWNER_WHATSAPP_DISPLAY,
  STANDARD_SUBMIT_SUCCESS_MESSAGE,
  buildWhatsAppLink,
  formatInquiryWhatsAppMessage,
  formatCareerWhatsAppMessage,
  formatInfluencerWhatsAppMessage,
  formatInvestorWhatsAppMessage,
  dispatchMobileWebhook,
  loadCrmClients,
  saveCrmClients,
  getCrmStats,
  recordCrmLeadFromSubmission
} from './src/whatsapp-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-built CRM Database
let crmClients = loadCrmClients();

// In-memory persistent data store
const travelInquiries = [
  {
    id: 'inq-001',
    name: 'Helena Vance',
    email: 'helena.vance@curatedescapes.com',
    destination: 'Amalfi Coast & Capri, Italy',
    travellers: 'Two travellers',
    interest: 'Coastal & island escapes',
    timing: '3–6 months',
    message: 'Seeking a cliffside private residence with panoramic Tyrrhenian sea views, private boat charter, and secluded dining reservations.',
    consent: true,
    status: 'in_planning',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'inq-002',
    name: 'Julian Montgomery',
    email: 'j.montgomery@architecturalhorizon.org',
    destination: 'Kyoto & Naoshima, Japan',
    travellers: 'Just me',
    interest: 'City & culture',
    timing: '1–3 months',
    message: 'Architectural immersion with private temple garden visits, traditional ryokan stay, and contemporary art curation.',
    consent: true,
    status: 'confirmed',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

const investorLeads = [
  {
    id: 'lead-001',
    name: 'Alexander Sterling',
    email: 'a.sterling@sterlingcapital.co.uk',
    phone: '+44 20 7946 0912',
    role: 'Managing Partner',
    organization: 'Sterling Family Office',
    location: 'London, United Kingdom',
    interest: 'Strategic investment',
    investment_range: 'USD 250,000 or more',
    message: 'We are closely following high-touch luxury travel curation and experiential hospitality models. We would welcome an executive discussion on your scaling roadmap and brand footprint.',
    consent: true,
    status: 'reviewing',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'lead-002',
    name: 'Amara Al-Mansoor',
    email: 'amara@me-ventures.ae',
    phone: '+971 4 312 8890',
    role: 'Principal, Hospitality & Travel Assets',
    organization: 'Oasis Capital Partners',
    location: 'Dubai, UAE',
    interest: 'Potential early-stage investment',
    investment_range: 'USD 100,000–249,999',
    message: 'Interested in strategic brand synergy with ultra-luxury desert and ocean pavilions in East Africa and the GCC.',
    consent: true,
    status: 'new',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

function clean(value, max = 1000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

// API Routes
app.post('/api/inquiries', (req, res) => {
  const body = req.body || {};
  const name = clean(body.name, 120);
  const email = clean(body.email, 254).toLowerCase();
  const destination = clean(body.destination, 240);
  const travellers = clean(body.travellers, 80);
  const interest = clean(body.interest, 120);
  const timing = clean(body.timing, 100);
  const message = clean(body.message, 3000);
  const consent = body.consent === true || body.consent === 'true' || body.consent === 'on';

  if (name.length < 2) {
    return res.status(400).json({ error: 'Please enter your name.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (!consent) {
    return res.status(400).json({ error: 'Please confirm that we may use these details to respond to your enquiry.' });
  }

  const phone = clean(body.phone, 50);
  const profile_role = clean(body.profile_role, 100);
  const service_mode = clean(body.service_mode, 100);
  const payment_preference = clean(body.payment_preference, 120);
  const budget_tier = clean(body.budget_tier || body.budget, 120);

  const newInquiry = {
    id: 'inq-' + Date.now().toString(36),
    name,
    email,
    phone,
    profile_role,
    service_mode,
    destination,
    travellers,
    interest,
    timing,
    payment_preference,
    budget_tier,
    message,
    consent,
    status: 'new',
    created_at: new Date().toISOString()
  };

  travelInquiries.unshift(newInquiry);
  console.log(`🌴 [NEW TRAVEL INQUIRY] ID: ${newInquiry.id} | Guest: ${newInquiry.name} (${newInquiry.email}) | Destination: ${newInquiry.destination} | Timing: ${newInquiry.timing}`);

  const whatsappText = formatInquiryWhatsAppMessage(newInquiry);
  const whatsappUrl = buildWhatsAppLink(whatsappText);
  dispatchMobileWebhook('travel_inquiry', newInquiry, whatsappText);

  // Auto-sync into in-built CRM database immediately
  recordCrmLeadFromSubmission('inquiry', newInquiry, crmClients);

  return res.status(201).json({
    ok: true,
    inquiryId: newInquiry.id,
    receivedAt: newInquiry.created_at,
    whatsappUrl,
    whatsappMessage: whatsappText,
    ownerWhatsApp: OWNER_WHATSAPP_DISPLAY,
    message: STANDARD_SUBMIT_SUCCESS_MESSAGE
  });
});

// In-memory Private Journal newsletter subscribers store
const journalSubscribers = [
  {
    id: 'sub-001',
    email: 'private.patron@amoura.estate',
    source: 'footer_journal',
    subscribed_at: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

app.post('/api/newsletter', (req, res) => {
  const body = req.body || {};
  const email = clean(body.email, 254).toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const existing = journalSubscribers.find(s => s.email === email);
  if (existing) {
    return res.status(200).json({
      ok: true,
      alreadySubscribed: true,
      message: 'You are already registered with The Private Journal. Exclusive updates will continue to arrive directly to your inbox.'
    });
  }

  const subscriber = {
    id: 'sub-' + Date.now().toString(36),
    email,
    source: 'footer_journal',
    subscribed_at: new Date().toISOString()
  };

  journalSubscribers.unshift(subscriber);
  console.log(`✉️ [NEW JOURNAL SUBSCRIBER] Email: ${subscriber.email}`);

  return res.status(201).json({
    ok: true,
    message: 'Welcome to The Private Journal. You will receive considered dispatches on unlisted sanctuaries and exclusive escapes.'
  });
});

app.get('/api/newsletter', (req, res) => {
  return res.json({ subscribers: journalSubscribers });
});

app.get(['/api/inquiries', '/api/inquiries/list'], (req, res) => {
  const limit = Math.max(1, Math.min(100, Number.parseInt(req.query?.limit || '50', 10) || 50));
  return res.json({ inquiries: travelInquiries.slice(0, limit) });
});

app.post('/api/investor-enquiries', (req, res) => {
  const body = req.body || {};
  const name = clean(body.name || body['Full name'], 120);
  const email = clean(body.email || body.Email, 254).toLowerCase();
  const phone = clean(body.phone || body.Phone, 40);
  const role = clean(body.role || body.Role, 160);
  const organization = clean(body.organization || body.Organisation, 180);
  const location = clean(body.location || body.Location, 180);
  const interest = clean(body.interest || body['Investment interest'], 120);
  const investmentRange = clean(body.investment_range || body['Indicative range'], 80);
  const message = clean(body.message || body['Investment thesis'] || body['Partnership proposal'] || body.Questions, 3000);
  const consent = body.consent === true || body.consent === 'true' || body.consent === 'on' || true;

  if (name.length < 2) {
    return res.status(400).json({ error: 'Please enter your full name.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const newLead = {
    id: 'lead-' + Date.now().toString(36),
    name,
    email,
    phone,
    role: role || 'Investor',
    organization: organization || 'Private Investor',
    location: location || 'International',
    interest: interest || 'General Investment Enquiry',
    investment_range: investmentRange || 'Not specified',
    message: message || 'Expressed interest via online form',
    consent,
    status: 'new',
    created_at: new Date().toISOString()
  };

  investorLeads.unshift(newLead);
  console.log(`💼 [NEW INVESTOR INQUIRY] ID: ${newLead.id} | Investor: ${newLead.name} (${newLead.email}) | Org: ${newLead.organization} | Range: ${newLead.investment_range}`);

  const whatsappText = formatInvestorWhatsAppMessage(newLead);
  const whatsappUrl = buildWhatsAppLink(whatsappText);
  dispatchMobileWebhook('investor_inquiry', newLead, whatsappText);

  // Auto-sync into in-built CRM database immediately
  recordCrmLeadFromSubmission('investor', newLead, crmClients);

  return res.status(201).json({
    ok: true,
    leadId: newLead.id,
    receivedAt: newLead.created_at,
    whatsappUrl,
    whatsappMessage: whatsappText,
    ownerWhatsApp: OWNER_WHATSAPP_DISPLAY,
    message: STANDARD_SUBMIT_SUCCESS_MESSAGE
  });
});

app.get('/api/investor-leads', (req, res) => {
  return res.json({ leads: investorLeads });
});

// In-memory career applications store
const careerApplications = [];

app.post('/api/career-applications', (req, res) => {
  const body = req.body || {};
  const name = clean(body.name || body.fullName, 120);
  const email = clean(body.email, 254).toLowerCase();
  const phone = clean(body.phone, 40);
  const role = clean(body.role || body.position, 120);
  const location = clean(body.location, 140);
  const experience = clean(body.experience, 80);
  const portfolio = clean(body.portfolio || body.linkedin, 300);
  const message = clean(body.message || body.coverNote, 3000);
  const consent = body.consent === true || body.consent === 'true' || body.consent === 'on' || true;

  if (name.length < 2) {
    return res.status(400).json({ error: 'Please enter your full name.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const newApp = {
    id: 'app-' + Date.now().toString(36),
    name,
    email,
    phone,
    role: role || 'Travel Consultant',
    location: location || 'Remote / Global',
    experience: experience || 'Not specified',
    portfolio,
    message,
    consent,
    status: 'new',
    created_at: new Date().toISOString()
  };

  careerApplications.unshift(newApp);
  console.log(`⚖️ [NEW CAREER / LEGAL APPLICATION] ID: ${newApp.id} | Applicant: ${newApp.name} (${newApp.email}) | Role: ${newApp.role} | Location: ${newApp.location}`);

  const whatsappText = formatCareerWhatsAppMessage(newApp);
  const whatsappUrl = buildWhatsAppLink(whatsappText);
  dispatchMobileWebhook('career_application', newApp, whatsappText);

  // Auto-sync into in-built CRM database immediately
  recordCrmLeadFromSubmission('career', newApp, crmClients);

  return res.status(201).json({
    ok: true,
    applicationId: newApp.id,
    receivedAt: newApp.created_at,
    whatsappUrl,
    whatsappMessage: whatsappText,
    ownerWhatsApp: OWNER_WHATSAPP_DISPLAY,
    message: STANDARD_SUBMIT_SUCCESS_MESSAGE
  });
});

app.get('/api/career-applications', (req, res) => {
  return res.json({ applications: careerApplications });
});

// In-memory influencer & creative partner applications store
const influencerApplications = [
  {
    id: 'inf-001',
    name: 'Sienna Laurent',
    handle: '@siennaluxetravel',
    platform: 'Instagram & Substack',
    reach: '185,000 followers · 6.8% engagement',
    portfolio: 'https://instagram.com/siennaluxetravel',
    sanctuaryInterest: 'Amalfi Coast & Bali Cliffside Sanctuaries',
    proposal: 'Curating a visual documentary and 3-part aesthetic photo essay on private villa living, featuring floating pool breakfasts and secluded cove charters.',
    status: 'reviewing',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

app.post('/api/influencer-applications', (req, res) => {
  const body = req.body || {};
  const name = clean(body.name || body.fullName, 120);
  const email = clean(body.email, 254).toLowerCase();
  const handle = clean(body.handle || body.socialHandle, 120);
  const platform = clean(body.platform, 120);
  const reach = clean(body.reach || body.audienceSize, 120);
  const portfolio = clean(body.portfolio || body.mediaKit, 300);
  const sanctuaryInterest = clean(body.sanctuaryInterest || body.destination, 200);
  const proposal = clean(body.proposal || body.concept, 3000);

  if (name.length < 2) {
    return res.status(400).json({ error: 'Please enter your full name or creator pseudonym.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const newApp = {
    id: 'inf-' + Date.now().toString(36),
    name,
    email,
    handle: handle || '@thebelleamouraretreat',
    platform: platform || 'Instagram / Visual Journal',
    reach: reach || 'Discreet private community',
    portfolio,
    sanctuaryInterest: sanctuaryInterest || 'All Sanctuaries',
    proposal: proposal || 'Expressed interest in hosted sanctuary curation & co-branded releases.',
    status: 'new',
    created_at: new Date().toISOString()
  };

  influencerApplications.unshift(newApp);
  console.log(`❀ [NEW INFLUENCER PROPOSAL] ID: ${newApp.id} | Creator: ${newApp.name} (${newApp.email}) | Handle: ${newApp.handle} | Sanctuary: ${newApp.sanctuaryInterest}`);

  const whatsappText = formatInfluencerWhatsAppMessage(newApp);
  const whatsappUrl = buildWhatsAppLink(whatsappText);
  dispatchMobileWebhook('influencer_application', newApp, whatsappText);

  // Auto-sync into in-built CRM database immediately
  recordCrmLeadFromSubmission('influencer', newApp, crmClients);

  return res.status(201).json({
    ok: true,
    applicationId: newApp.id,
    receivedAt: newApp.created_at,
    whatsappUrl,
    whatsappMessage: whatsappText,
    ownerWhatsApp: OWNER_WHATSAPP_DISPLAY,
    message: STANDARD_SUBMIT_SUCCESS_MESSAGE
  });
});

app.get('/api/influencer-applications', (req, res) => {
  return res.json({ applications: influencerApplications });
});

// ============================================================================
// IN-BUILT CRM DATABASE REST API
// ============================================================================

// GET /api/crm/clients - Query CRM database with optional search, tier, status
app.get('/api/crm/clients', (req, res) => {
  let results = [...crmClients];
  const { search, tier, status } = req.query || {};

  if (search) {
    const q = String(search).toLowerCase().trim();
    results = results.filter(c =>
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.notes && c.notes.toLowerCase().includes(q)) ||
      (c.preferredDestinations && c.preferredDestinations.some(d => d.toLowerCase().includes(q)))
    );
  }

  if (tier && tier !== 'All') {
    results = results.filter(c => c.tier === tier);
  }

  if (status && status !== 'All') {
    results = results.filter(c => c.status === status);
  }

  return res.json({
    clients: results,
    total: results.length,
    stats: getCrmStats(crmClients)
  });
});

// GET /api/crm/stats - Summary intelligence metrics
app.get('/api/crm/stats', (req, res) => {
  return res.json(getCrmStats(crmClients));
});

// POST /api/crm/clients - Add new client to CRM
app.post('/api/crm/clients', (req, res) => {
  const b = req.body || {};
  const name = clean(b.name, 120);
  const email = clean(b.email, 254).toLowerCase();

  if (!name) {
    return res.status(400).json({ error: 'Client name is required.' });
  }

  const newClient = {
    id: 'crm-' + Date.now().toString(36),
    name,
    email,
    phone: clean(b.phone, 50),
    tier: clean(b.tier, 60) || 'Private Patron',
    status: clean(b.status, 60) || 'New Inquiry',
    preferredDestinations: Array.isArray(b.preferredDestinations)
      ? b.preferredDestinations.map(d => clean(d, 100))
      : [clean(b.preferredDestinations || 'Kenya & East Africa Safari', 100)],
    totalBookings: Number(b.totalBookings) || 0,
    lifetimeValue: Number(b.lifetimeValue) || 0,
    lastDestination: clean(b.lastDestination, 100) || 'Kenya',
    preferences: clean(b.preferences, 500) || 'Bespoke preference profile',
    notes: clean(b.notes, 2000) || 'Manually enrolled into CRM via Admin Portal.',
    assignedConsultant: clean(b.assignedConsultant, 100) || 'Founder / Concierge',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  crmClients.unshift(newClient);
  saveCrmClients(crmClients);
  return res.status(201).json({ ok: true, client: newClient });
});

// PUT /api/crm/clients/:id - Update client in CRM
app.put('/api/crm/clients/:id', (req, res) => {
  const { id } = req.params;
  const clientIndex = crmClients.findIndex(c => c.id === id);
  if (clientIndex === -1) {
    return res.status(404).json({ error: 'Client record not found in CRM.' });
  }

  const b = req.body || {};
  const existing = crmClients[clientIndex];

  crmClients[clientIndex] = {
    ...existing,
    name: b.name !== undefined ? clean(b.name, 120) : existing.name,
    email: b.email !== undefined ? clean(b.email, 254).toLowerCase() : existing.email,
    phone: b.phone !== undefined ? clean(b.phone, 50) : existing.phone,
    tier: b.tier !== undefined ? clean(b.tier, 60) : existing.tier,
    status: b.status !== undefined ? clean(b.status, 60) : existing.status,
    totalBookings: b.totalBookings !== undefined ? Number(b.totalBookings) : existing.totalBookings,
    lifetimeValue: b.lifetimeValue !== undefined ? Number(b.lifetimeValue) : existing.lifetimeValue,
    lastDestination: b.lastDestination !== undefined ? clean(b.lastDestination, 100) : existing.lastDestination,
    preferences: b.preferences !== undefined ? clean(b.preferences, 500) : existing.preferences,
    notes: b.notes !== undefined ? clean(b.notes, 2000) : existing.notes,
    assignedConsultant: b.assignedConsultant !== undefined ? clean(b.assignedConsultant, 100) : existing.assignedConsultant,
    updatedAt: new Date().toISOString()
  };

  saveCrmClients(crmClients);
  return res.json({ ok: true, client: crmClients[clientIndex] });
});

// DELETE /api/crm/clients/:id - Delete client from CRM
app.delete('/api/crm/clients/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = crmClients.length;
  crmClients = crmClients.filter(c => c.id !== id);

  if (crmClients.length === initialLength) {
    return res.status(404).json({ error: 'Client record not found in CRM.' });
  }

  saveCrmClients(crmClients);
  return res.json({ ok: true, message: 'Client record removed from CRM.' });
});

// GET /api/whatsapp/config - Return current WhatsApp configuration & links
app.get('/api/whatsapp/config', (req, res) => {
  return res.json({
    ownerNumber: OWNER_WHATSAPP_NUMBER,
    ownerDisplay: OWNER_WHATSAPP_DISPLAY,
    webhookConfigured: Boolean(process.env.WHATSAPP_WEBHOOK_URL),
    directChatUrl: `https://wa.me/${OWNER_WHATSAPP_NUMBER}`
  });
});

// POST /api/whatsapp/test-webhook - Dispatch a test webhook to verify live connection
app.post('/api/whatsapp/test-webhook', async (req, res) => {
  const testMsg = `✨ *THE BELLE AMOURA RETREAT — TEST WEBHOOK DISPATCH*\nSystem connected to WhatsApp: ${OWNER_WHATSAPP_DISPLAY}\nTime: ${new Date().toISOString()}`;
  const result = await dispatchMobileWebhook('test_ping', { ping: true }, testMsg);
  return res.json({
    ok: true,
    result,
    previewUrl: buildWhatsAppLink(testMsg),
    targetWhatsApp: OWNER_WHATSAPP_DISPLAY
  });
});

// Executive Submissions & Bookings Inbox Dashboard
app.get(['/admin-inbox', '/admin-inbox.html', '/inbox'], (req, res) => {
  res.sendFile(path.join(__dirname, 'src/admin-inbox.html'));
});

// Portal & shortcut routes
app.get('/creators', (req, res) => {
  res.redirect('/influencers');
});
app.get('/portals', (req, res) => {
  res.redirect('/portals/portal-home.html');
});
app.get('/portal-home', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/portal-home.html'));
});

// Dedicated Standalone Websites & Portal Suites
app.get(['/the-amoura-atelier', '/the-amoura-atelier.html', '/atelier', '/atelier.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'src/the-amoura-atelier.html'));
});

app.get(['/the-sovereign-suite', '/the-sovereign-suite.html', '/sovereign', '/sovereign.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'src/the-sovereign-suite.html'));
});

app.get(['/the-meridian-exchange', '/the-meridian-exchange.html', '/meridian', '/meridian.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'src/the-meridian-exchange.html'));
});

app.get(['/the-amoura-alliance', '/the-amoura-alliance.html', '/alliance', '/alliance.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'src/the-amoura-alliance.html'));
});


// Serve static portals directory under /portals
app.use('/portals', express.static(path.join(__dirname, 'portals')));

// Serve static assets FIRST so images, CSS, and JS are never caught by HTML handlers
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));

// Clean URL middleware for src HTML files (e.g., /about -> src/about.html)
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  const cleanPath = req.path.replace(/^\//, '').replace(/\/$/, '');
  if (!cleanPath) return next();

  const candidateHtml = path.join(__dirname, 'src', `${cleanPath}.html`);
  if (fs.existsSync(candidateHtml)) {
    return res.sendFile(candidateHtml);
  }

  // Also check subdirectories like src/applications/*.html
  const appCandidate = path.join(__dirname, 'src', cleanPath);
  if (fs.existsSync(appCandidate) && fs.statSync(appCandidate).isFile()) {
    return res.sendFile(appCandidate);
  }

  next();
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/index.html'));
});

// Catch-all fallback
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'src', req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  res.sendFile(path.join(__dirname, 'src/index.html'));
});

// Export Express app for Vercel Serverless Functions
export default app;

// Standalone server listener (local development & container environments)
if (!process.env.VERCEL) {
  app.listen(PORT, HOST, () => {
    console.log(`[The Belle Amoura Retreat] Server running on http://${HOST}:${PORT}`);
  });
}

