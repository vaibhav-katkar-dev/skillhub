import mongoose from 'mongoose';
import dotenv from 'dotenv';
import EventCertificate from '../models/EventCertificate.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillvalix';
const TARGET_TEMPLATE_VERSION = Number(process.env.EVENT_CERT_TEMPLATE_VERSION || 3);
const API_BASE = (process.env.INTERNAL_API_BASE || 'http://localhost:5000/api/events').replace(/\/$/, '');
const CONCURRENCY = Number(process.env.CERT_WARM_CONCURRENCY || 2);

function chunk(array, size) {
  const out = [];
  for (let i = 0; i < array.length; i += size) out.push(array.slice(i, i + size));
  return out;
}

async function warmOne(certificateId) {
  const url = `${API_BASE}/certificates/download/${certificateId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Cache-Control': 'no-cache' },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  if (!contentType.includes('application/pdf')) {
    throw new Error(`Unexpected content-type: ${contentType || 'unknown'}`);
  }

  // Consume stream to complete full generation path.
  await response.arrayBuffer();
}

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('[WarmEventCerts] Connected to MongoDB');

  const staleCerts = await EventCertificate.find({
    $or: [
      { pdfTemplateVersion: { $exists: false } },
      { pdfTemplateVersion: { $lt: TARGET_TEMPLATE_VERSION } },
      { pdfStatus: { $ne: 'ready' } },
    ],
  })
    .select('certificateId pdfTemplateVersion pdfStatus')
    .lean();

  if (staleCerts.length === 0) {
    console.log(`[WarmEventCerts] No stale certificates found for template version ${TARGET_TEMPLATE_VERSION}.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log(`[WarmEventCerts] Found ${staleCerts.length} stale certificates. Warming via ${API_BASE} with concurrency=${CONCURRENCY}.`);

  let success = 0;
  let failed = 0;

  const groups = chunk(staleCerts, Math.max(1, CONCURRENCY));
  for (const group of groups) {
    await Promise.all(
      group.map(async (cert) => {
        try {
          await warmOne(cert.certificateId);
          success += 1;
          console.log(`[WarmEventCerts] OK ${cert.certificateId}`);
        } catch (err) {
          failed += 1;
          console.error(`[WarmEventCerts] FAIL ${cert.certificateId}: ${err.message}`);
        }
      })
    );
  }

  console.log(`[WarmEventCerts] Done. success=${success}, failed=${failed}, total=${staleCerts.length}`);

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(async (err) => {
  console.error('[WarmEventCerts] Fatal error:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
