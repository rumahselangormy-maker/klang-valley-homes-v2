const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwe2A2tkjeqpwt6pqYRzdKfR2B6jdebprKqN0oSe_XQ8PaoWRc9XCqSEAucx-im1vGEoQ/exec';

export const onRequestGet = async () => {
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

    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Subsale API error:', error);

    return Response.json(
      {
        success: false,
        error: 'Failed to fetch subsale listings',
      },
      { status: 500 }
    );
  }
};