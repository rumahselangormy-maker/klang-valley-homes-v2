import { createPublicListingResponse } from '../../src/services/publicListingVisibility';

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

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          count: 0,
          subsale: [],
          error: 'Failed to fetch subsale listings',
        },
        {
          status: response.status,
          headers: { 'Cache-Control': 'no-store' },
        },
      );
    }

    const payload = await response.json();
    const publicPayload = createPublicListingResponse(payload, 'subsale');

    return Response.json(publicPayload, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=120',
      },
    });
  } catch (error) {
    console.error('Subsale API error:', error);

    return Response.json(
      {
        success: false,
        error: 'Failed to fetch subsale listings',
      },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  }
};
