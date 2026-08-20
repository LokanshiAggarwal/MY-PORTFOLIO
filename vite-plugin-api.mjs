import nodemailer from 'nodemailer';
import fs from 'node:fs';

/**
 * Local-dev replacement for the serverless `/api/send-enquiry` endpoint.
 * The real endpoint only exists once deployed (Netlify function / Vercel API),
 * so this middleware wires the same route into the Vite dev server.
 *
 * Credentials are read directly from `.env` (or process.env) so the route
 * works regardless of how Vite loads environment variables.
 */
function loadEnv() {
  const env = { ...process.env };
  try {
    const content = fs.readFileSync('.env', 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!env[key]) env[key] = value;
    }
  } catch {
    /* .env missing — fall back to process.env */
  }
  return env;
}

export default function apiPlugin() {
  return {
    name: 'api-send-enquiry',
    configureServer(server) {
      server.middlewares.use('/api/send-enquiry', async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        // Read the JSON request body.
        let body = '';
        try {
          for await (const chunk of req) body += chunk;
        } catch {
          body = '';
        }

        let data;
        try {
          data = JSON.parse(body || '{}');
        } catch {
          data = {};
        }

        const { name, email, subject, message } = data;

        if (!name || !email || !subject || !message) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'All fields are required.' }));
          return;
        }

        const env = loadEnv();
        const user = env.GMAIL_USER;
        const pass = env.GMAIL_APP_PASSWORD;

        if (!user || !pass) {
          console.error(
            'GMAIL_USER / GMAIL_APP_PASSWORD are not set in .env — email cannot be sent.'
          );
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Email server not configured.' }));
          return;
        }

// Recipient: fall back to the authenticated Gmail user if no override.
        // Guard against a literal "undefined" string leaking through.
        const rawTo = env.CONTACT_EMAIL;
        const to =
          rawTo && rawTo !== 'undefined' && rawTo !== 'null' ? rawTo : user;

        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: { user, pass },
        });

        try {
          await transporter.sendMail({
            from: `"Portfolio Contact" <${user}>`,
            to,
            replyTo: email,
            subject: `New enquiry: ${subject}`,
            text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
            `,
            html: `
              <h2>New portfolio enquiry</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject}</p>
              <hr />
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br/>')}</p>
            `,
          });

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true }));
        } catch (err) {
          console.error('send-enquiry error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              error: 'Failed to send enquiry.',
              detail: err instanceof Error ? err.message : String(err),
            })
          );
        }
      });
    },
  };
}
