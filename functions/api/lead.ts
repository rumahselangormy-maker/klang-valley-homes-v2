const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwe2A2tkjeqpwt6pqYRzdKfR2B6jdebprKqN0oSe_XQ8PaoWRc9XCqSEAucx-im1vGEoQ/exec';

export const onRequestPost = async (
  context
) => {
  try {
    const payload = await context.request.json();

    if (
      !payload.name ||
      !payload.phone ||
      !payload.email ||
      payload.consent === undefined
    ) {
      return Response.json(
        {
          success: false,
          message:
            'Sila lengkapkan maklumat wajib (Nama, Telefon, Emel & Pengesahan).',
        },
        { status: 400 }
      );
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

    const text = await response.text();

    try {
      const json = JSON.parse(text);

      return Response.json(json, {
        status: response.status,
      });
    } catch {
      return Response.json(
        {
          success: true,
          raw: text,
        },
        {
          status: response.status,
        }
      );
    }
  } catch (error) {
    console.error('Lead API error:', error);

    return Response.json(
      {
        success: false,
        message:
          'Maaf, permohonan tidak dapat dihantar sekarang. Sila cuba lagi.',
      },
      { status: 500 }
    );
  }
};