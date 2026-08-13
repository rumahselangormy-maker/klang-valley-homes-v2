import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwe2A2tkjeqpwt6pqYRzdKfR2B6jdebprKqN0oSe_XQ8PaoWRc9XCqSEAucx-im1vGEoQ/exec';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Proxy - GET Projects
  app.get('/api/projects', async (req, res) => {
    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?action=projects`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          error: `Google Apps Script API status: ${response.status}`,
        });
      }

      const data = await response.json();
      return res.json(data);
    } catch (err: any) {
      console.error('Error fetching projects from Apps Script:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Internal server error fetching projects',
      });
    }
  });

  // API Proxy - POST Lead
  app.post('/api/lead', async (req, res) => {
    try {
      const payload = req.body;

      // Validate required fields
      if (!payload.name || !payload.phone || !payload.email || payload.consent === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Sila lengkapkan maklumat wajib (Nama, Telefon, Emel & Pengesahan).',
        });
      }

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        result = { success: true, raw: responseText };
      }

      return res.json(result);
    } catch (err: any) {
      console.error('Error submitting lead to Apps Script:', err);
      return res.status(500).json({
        success: false,
        message: 'Maaf, permohonan tidak dapat dihantar sekarang. Sila cuba lagi.',
      });
    }
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Klang Valley Homes server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
