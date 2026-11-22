import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BUNDLED_CRM_FILE = path.join(__dirname, '../data/crm-database.json');
const TMP_CRM_FILE = '/tmp/crm-database.json';
const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

// Canonical Owner WhatsApp Number: +254 706 168 307
export const OWNER_WHATSAPP_NUMBER = '254706168307';
export const OWNER_WHATSAPP_DISPLAY = '+254 706 168 307';

// Standard User-Facing Confirmation Response
export const STANDARD_SUBMIT_SUCCESS_MESSAGE = 'Form submitted successfully. The B.A.R will get back to you as soon as we can';

/**
 * Builds a direct 1-click WhatsApp transmission URL
 */
export function buildWhatsAppLink(text, phone = OWNER_WHATSAPP_NUMBER) {
  const cleanPhone = String(phone).replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Formats a Travel Booking Inquiry for WhatsApp transmission
 */
export function formatInquiryWhatsAppMessage(data) {
  return [
    `✨ *THE BELLE AMOURA RETREAT — NEW BOOKING INQUIRY*`,
    `──────────────────────────`,
    `👤 *Guest:* ${data.name || 'Anonymous Guest'}`,
    `📧 *Email:* ${data.email || 'N/A'}`,
    `📞 *Phone / WhatsApp:* ${data.phone || 'Not specified'}`,
    `💼 *Client Profile:* ${data.profile_role || 'Private Patron'}`,
    `🌐 *Service Mode:* ${data.service_mode || 'Curated Escape'}`,
    `📍 *Target Destination:* ${data.destination || 'Open / Unspecified'}`,
    `🗓️ *Timing / Dates:* ${data.timing || 'Flexible'}`,
    `👥 *Travel Party:* ${data.travellers || '2 travellers'}`,
    `💳 *Payment Plan:* ${data.payment_preference || 'Flexible / Installments'}`,
    `💰 *Budget Range:* ${data.budget_tier || data.budget || 'Flexible'}`,
    `💎 *Escape Interest:* ${data.interest || 'Curated Escape'}`,
    `📝 *Guest Vision / Notes:*`,
    `${data.message || 'No additional notes provided.'}`,
    `──────────────────────────`,
    `🆔 *Ref:* ${data.id || 'INQ-' + Date.now().toString(36).toUpperCase()}`,
    `⏰ *Received:* ${new Date().toLocaleString('en-GB')}`
  ].join('\n');
}

/**
 * Formats a Career or Legal Retainer Application for WhatsApp
 */
export function formatCareerWhatsAppMessage(data) {
  return [
    `⚖️ *THE BELLE AMOURA RETREAT — TALENT & LEGAL APPLICATION*`,
    `──────────────────────────`,
    `👤 *Candidate:* ${data.name || 'Anonymous'}`,
    `💼 *Role / Mandate:* ${data.role || 'Independent Contractor'}`,
    `📧 *Email:* ${data.email || 'N/A'}`,
    `📞 *Phone / WhatsApp:* ${data.phone || 'Not provided'}`,
    `📍 *Location:* ${data.location || 'Remote / Global'}`,
    `⏳ *Experience:* ${data.experience || 'Not specified'}`,
    `📂 *Portfolio / LinkedIn:* ${data.portfolio || 'N/A'}`,
    `📝 *Cover Note:*`,
    `${data.message || 'None provided.'}`,
    `──────────────────────────`,
    `🆔 *Ref:* ${data.id || 'APP-' + Date.now().toString(36).toUpperCase()}`,
    `⏰ *Received:* ${new Date().toLocaleString('en-GB')}`
  ].join('\n');
}

/**
 * Formats an Influencer & Creator Proposal for WhatsApp
 */
export function formatInfluencerWhatsAppMessage(data) {
  return [
    `❀ *THE BELLE AMOURA RETREAT — INFLUENCER PROPOSAL*`,
    `──────────────────────────`,
    `👤 *Creator:* ${data.name || 'Anonymous'}`,
    `📱 *Social Handle:* ${data.handle || '@creator'}`,
    `🌐 *Platform:* ${data.platform || 'Instagram / TikTok'}`,
    `👥 *Audience Reach:* ${data.reach || 'Private community'}`,
    `🏝️ *Sanctuary Focus:* ${data.sanctuaryInterest || 'All Sanctuaries'}`,
    `📂 *Media Kit:* ${data.portfolio || 'N/A'}`,
    `📝 *Creative Concept:*`,
    `${data.proposal || 'Hosted sanctuary release interest.'}`,
    `──────────────────────────`,
    `🆔 *Ref:* ${data.id || 'INF-' + Date.now().toString(36).toUpperCase()}`,
    `⏰ *Received:* ${new Date().toLocaleString('en-GB')}`
  ].join('\n');
}

/**
 * Formats an Investor Expression of Interest for WhatsApp
 */
export function formatInvestorWhatsAppMessage(data) {
  return [
    `💼 *THE BELLE AMOURA RETREAT — INVESTOR INQUIRY*`,
    `──────────────────────────`,
    `👤 *Investor:* ${data.name || 'Private Investor'}`,
    `🏢 *Organization:* ${data.organization || 'Private Family Office'}`,
    `💼 *Role:* ${data.role || 'Principal'}`,
    `💰 *Indicative Range:* ${data.investment_range || 'Not specified'}`,
    `📧 *Email:* ${data.email || 'N/A'}`,
    `📞 *Phone:* ${data.phone || 'N/A'}`,
    `📍 *Location:* ${data.location || 'International'}`,
    `📝 *Investment Thesis / Notes:*`,
    `${data.message || 'Expressed interest via online form'}`,
    `──────────────────────────`,
    `🆔 *Ref:* ${data.id || 'LEAD-' + Date.now().toString(36).toUpperCase()}`,
    `⏰ *Received:* ${new Date().toLocaleString('en-GB')}`
  ].join('\n');
}

/**
 * Dispatches an Instant Mobile Webhook notification
 * Supports any webhook provider (Zapier, Make, Twilio, CallMeBot, Green-API, custom gateway)
 */
export async function dispatchMobileWebhook(type, data, formattedText) {
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log(`[WhatsApp Mobile Notification] -> Ready for ${OWNER_WHATSAPP_DISPLAY}: \n${formattedText.split('\n')[0]}`);
    return { dispatched: false, reason: 'WHATSAPP_WEBHOOK_URL not configured' };
  }

  try {
    const payload = {
      recipient: OWNER_WHATSAPP_NUMBER,
      recipientDisplay: OWNER_WHATSAPP_DISPLAY,
      eventType: type,
      timestamp: new Date().toISOString(),
      messageText: formattedText,
      data
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TheBelleAmouraRetreat-WhatsAppWebhook/1.0'
      },
      body: JSON.stringify(payload)
    });

    const isOk = res.ok;
    console.log(`[WhatsApp Webhook Dispatched] Status: ${res.status} to ${webhookUrl}`);
    return { dispatched: isOk, status: res.status };
  } catch (err) {
    console.error('[WhatsApp Webhook Error]:', err.message);
    return { dispatched: false, error: err.message };
  }
}

// ============================================================================
// IN-BUILT CRM DATABASE PERSISTENCE ENGINE
// ============================================================================

export function loadCrmClients() {
  try {
    if (IS_SERVERLESS && fs.existsSync(TMP_CRM_FILE)) {
      return JSON.parse(fs.readFileSync(TMP_CRM_FILE, 'utf8'));
    }
    if (fs.existsSync(BUNDLED_CRM_FILE)) {
      const data = fs.readFileSync(BUNDLED_CRM_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (IS_SERVERLESS) {
        try {
          fs.writeFileSync(TMP_CRM_FILE, data, 'utf8');
        } catch {
          // Ignore /tmp seed failures
        }
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error loading CRM file:', e.message);
  }
  return [];
}

export function saveCrmClients(clients) {
  const payload = JSON.stringify(clients, null, 2);
  if (IS_SERVERLESS) {
    try {
      fs.writeFileSync(TMP_CRM_FILE, payload, 'utf8');
      return true;
    } catch (e) {
      console.error('Error saving CRM file to /tmp:', e.message);
      return false;
    }
  }

  try {
    const dir = path.dirname(BUNDLED_CRM_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(BUNDLED_CRM_FILE, payload, 'utf8');
    return true;
  } catch (e) {
    if (e.code === 'EROFS' || e.code === 'EACCES') {
      try {
        fs.writeFileSync(TMP_CRM_FILE, payload, 'utf8');
        return true;
      } catch (tmpErr) {
        console.error('Error saving CRM file to /tmp fallback:', tmpErr.message);
      }
    }
    console.error('Error saving CRM file:', e.message);
    return false;
  }
}

export function getCrmStats(clients) {
  const total = clients.length;
  const totalSpend = clients.reduce((acc, c) => acc + (Number(c.lifetimeValue) || 0), 0);
  const activePlanning = clients.filter(c => c.status === 'Active Planning' || c.status === 'In Planning' || c.status === 'Confirmed Stay').length;
  const newInquiries = clients.filter(c => c.status === 'New Inquiry' || c.status === 'Discovery Lead').length;
  const vipCount = clients.filter(c => c.tier === 'Sovereign Black' || c.tier === 'Atelier Platinum').length;

  return {
    totalClients: total,
    totalLifetimeValue: totalSpend,
    activePlanningCount: activePlanning,
    newInquiriesCount: newInquiries,
    vipPatronCount: vipCount
  };
}

/**
 * Immediate CRM record updater on any form submission
 */
export function recordCrmLeadFromSubmission(type, data, clients) {
  const email = (data.email || '').toLowerCase().trim();
  const name = data.name || data.fullName || 'Anonymous';
  const phone = data.phone || '';

  let client = clients.find(c => c.email && c.email.toLowerCase() === email);

  if (client) {
    // Update existing client record immediately
    client.updatedAt = new Date().toISOString();
    client.phone = client.phone || phone;
    if (type === 'inquiry') {
      client.totalBookings = (Number(client.totalBookings) || 0) + 1;
      client.status = 'New Inquiry';
      if (data.destination && !client.preferredDestinations.includes(data.destination)) {
        client.preferredDestinations.push(data.destination);
      }
      client.notes = `[${new Date().toLocaleDateString('en-GB')}] Inquired for ${data.destination || 'Sanctuary'}: ${data.message || ''}\n` + (client.notes || '');
    } else if (type === 'career') {
      client.notes = `[${new Date().toLocaleDateString('en-GB')}] Applied for ${data.role}: ${data.message || ''}\n` + (client.notes || '');
    } else if (type === 'influencer') {
      client.notes = `[${new Date().toLocaleDateString('en-GB')}] Creator pitch (${data.handle || '@'}): ${data.proposal || ''}\n` + (client.notes || '');
    } else if (type === 'investor') {
      client.notes = `[${new Date().toLocaleDateString('en-GB')}] Investor inquiry (${data.organization || 'Private'}): ${data.message || ''}\n` + (client.notes || '');
    }
  } else {
    // Create new CRM entry immediately
    let tier = 'Private Patron';
    let status = 'New Inquiry';
    let preferredDestinations = [];
    let lifetimeValue = 0;
    let preferences = '';
    let notes = '';

    if (type === 'inquiry') {
      status = 'New Inquiry';
      preferredDestinations = [data.destination || 'Curated Sanctuaries'];
      const role = (data.profile_role || '').toLowerCase();
      if (role.includes('executive') || role.includes('government') || role.includes('diplomat') || role.includes('c-suite')) {
        tier = 'Sovereign Black';
      } else if (role.includes('surgeon') || role.includes('health') || role.includes('counsel') || role.includes('law') || role.includes('celebrity') || role.includes('creator')) {
        tier = 'Atelier Platinum';
      } else if (role.includes('investor') || role.includes('syndicate') || role.includes('partner')) {
        tier = 'Strategic Investor';
      }
      preferences = `Sector: ${data.profile_role || 'Private Patron'}. Format: ${data.service_mode || 'Curated Escape'}. Plan: ${data.payment_preference || 'Flexible'}. Budget: ${data.budget_tier || data.budget || 'Flexible'}. Party: ${data.travellers || '2 travellers'}. Timing: ${data.timing || 'Flexible'}. Focus: ${data.interest || 'Curated Escape'}.`;
      notes = data.message || 'Direct booking inquiry submitted via online planning form.';
    } else if (type === 'career') {
      tier = 'Talent / Counsel';
      status = 'Applicant Under Review';
      preferredDestinations = ['Global Operations'];
      preferences = `Role: ${data.role}. Location: ${data.location || 'Remote'}. Experience: ${data.experience || 'Not specified'}. Portfolio: ${data.portfolio || 'N/A'}`;
      notes = data.message || 'Submitted contractor / counsel application.';
    } else if (type === 'influencer') {
      tier = 'Creator Partner';
      status = 'Creator Pitch Received';
      preferredDestinations = [data.sanctuaryInterest || 'All Sanctuaries'];
      preferences = `Platform: ${data.platform || 'Instagram/TikTok'}. Reach: ${data.reach || 'Private'}. Handle: ${data.handle || '@'}`;
      notes = data.proposal || 'Influencer residency pitch submitted.';
    } else if (type === 'investor') {
      tier = 'Strategic Investor';
      status = 'Investor Lead';
      preferredDestinations = ['Corporate Sanctuary Portfolio'];
      preferences = `Org: ${data.organization || 'Private'}. Role: ${data.role || 'Principal'}. Indicative Range: ${data.investment_range || 'Not specified'}.`;
      notes = data.message || 'Investor inquiry submitted.';
    }

    client = {
      id: 'crm-' + Date.now().toString(36),
      name,
      email,
      phone,
      tier,
      status,
      preferredDestinations,
      totalBookings: type === 'inquiry' ? 1 : 0,
      lifetimeValue,
      lastDestination: preferredDestinations[0] || 'Sanctuary',
      preferences,
      notes,
      assignedConsultant: 'Founder / Concierge',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    clients.unshift(client);
  }

  saveCrmClients(clients);
  console.log(`📊 [CRM DATABASE UPDATED IMMEDIATELY] Record for ${client.name} (${client.email}) saved.`);
  return client;
}
