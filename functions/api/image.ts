export const onRequestGet = async (context: any) => {
  try {
    const url = context.request.url;
    const parsedUrl = new URL(url);
    const imageUrl = parsedUrl.searchParams.get('url');

    if (!imageUrl) {
      return new Response('Missing image URL', {
        status: 400,
      });
    }

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return new Response('Image fetch failed', {
        status: response.status,
      });
    }

    const contentType =
      response.headers.get('content-type') || 'image/jpeg';

    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);

    return new Response('Image proxy error', {
      status: 500,
    });
  }
};