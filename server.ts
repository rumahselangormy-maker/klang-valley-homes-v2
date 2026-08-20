import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwe2A2tkjeqpwt6pqYRzdKfR2B6jdebprKqN0oSe_XQ8PaoWRc9XCqSEAucx-im1vGEoQ/exec';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ============================================================
  // API Proxy - GET Projects
  // ============================================================

  app.get('/api/projects', async (req, res) => {
    try {
      const response = await fetch(
        `${APPS_SCRIPT_URL}?action=projects`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          error: `Google Apps Script API status: ${response.status}`,
        });
      }

      const data = await response.json();

      return res.json(data);
    } catch (err: any) {
      console.error(
        'Error fetching projects from Apps Script:',
        err
      );

      return res.status(500).json({
        success: false,
        error:
          err.message ||
          'Internal server error fetching projects',
      });
    }
  });

  // ============================================================
  // API Proxy - GET Subsale Listings
  // ============================================================

  app.get('/api/subsale', async (req, res) => {
    try {
      const response = await fetch(
        `${APPS_SCRIPT_URL}?action=subsale`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          error: `Google Apps Script API status: ${response.status}`,
        });
      }

      const data = await response.json();

      return res.json(data);
    } catch (err: any) {
      console.error(
        'Error fetching subsale from Apps Script:',
        err
      );

      return res.status(500).json({
        success: false,
        error:
          err.message ||
          'Internal server error fetching subsale',
      });
    }
  });

  // ============================================================
  // IMAGE PROXY
  //
  // Browser:
  // /api/image?url=GOOGLE_DRIVE_URL
  //
  // Server fetches the image and sends it back to browser.
  // This avoids Google Drive browser embedding issues.
  // ============================================================

  app.get('/api/image', async (req, res) => {
    try {
      const rawUrl = req.query.url;

      if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
        return res.status(400).send('Missing image URL');
      }

      let imageUrl: URL;

      try {
        imageUrl = new URL(rawUrl);
      } catch {
        return res.status(400).send('Invalid image URL');
      }

      // Only allow trusted Google image hosts.
      const allowedHosts = [
        'drive.google.com',
        'drive.usercontent.google.com',
        'lh3.googleusercontent.com',
        'lh4.googleusercontent.com',
        'lh5.googleusercontent.com',
        'lh6.googleusercontent.com',
      ];

      if (!allowedHosts.includes(imageUrl.hostname)) {
        return res.status(403).send('Image host not allowed');
      }

      console.log(
        `[IMAGE PROXY] Fetching: ${imageUrl.toString()}`
      );

      const response = await fetch(imageUrl.toString(), {
        method: 'GET',
        headers: {
          Accept:
            'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151.0.0.0 Safari/537.36',
        },
        redirect: 'follow',
      });

      if (!response.ok) {
        console.error(
          `[IMAGE PROXY] Google returned ${response.status} for ${imageUrl.toString()}`
        );

        return res
          .status(response.status)
          .send('Unable to fetch image');
      }

      const contentType =
        response.headers.get('content-type') ||
        'image/jpeg';

      // Make sure we're actually receiving an image.
      if (!contentType.startsWith('image/')) {
        console.error(
          `[IMAGE PROXY] Not an image. Content-Type: ${contentType}`
        );

        return res
          .status(502)
          .send('Remote resource is not an image');
      }

      const buffer =
        Buffer.from(await response.arrayBuffer());

      res.setHeader(
        'Content-Type',
        contentType
      );

      res.setHeader(
        'Cache-Control',
        'public, max-age=86400'
      );

      res.setHeader(
        'Access-Control-Allow-Origin',
        '*'
      );

      return res.send(buffer);
    } catch (err: any) {
      console.error(
        '[IMAGE PROXY] Error:',
        err
      );

      return res.status(500).send(
        'Image proxy error'
      );
    }
  });

  // ============================================================
  // API Proxy - POST Lead
  // ============================================================

  app.post('/api/lead', async (req, res) => {
    try {
      const payload = req.body;

      // Validate required fields
      if (
        !payload.name ||
        !payload.phone ||
        !payload.email ||
        payload.consent === undefined
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Sila lengkapkan maklumat wajib (Nama, Telefon, Emel & Pengesahan).',
        });
      }

      const response = await fetch(
        APPS_SCRIPT_URL,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload),
        }
      );

      const responseText =
        await response.text();

      let result;

      try {
        result = JSON.parse(responseText);
      } catch {
        result = {
          success: true,
          raw: responseText,
        };
      }

      return res.json(result);
    } catch (err: any) {
      console.error(
        'Error submitting lead to Apps Script:',
        err
      );

      return res.status(500).json({
        success: false,
        message:
          'Maaf, permohonan tidak dapat dihantar sekarang. Sila cuba lagi.',
      });
    }
  });

  // ============================================================
  // Vite middleware in development
  // ============================================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(
      process.cwd(),
      'dist'
    );

    app.use(
      express.static(distPath)
    );

    app.get('*', (req, res) => {
      res.sendFile(
        path.join(
          distPath,
          'index.html'
        )
      );
    });
  }

  // ============================================================
  // START SERVER
  // ============================================================

  app.listen(
    PORT,
    '0.0.0.0',
    () => {
      console.log(
        `Klang Valley Homes server running on http://0.0.0.0:${PORT}`
      );
    }
  );
}

startServer();