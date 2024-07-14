// curl -X POST 'https://supa_domain/auth/v1/token?grant_type=refresh_token' \
//   -H 'Content-Type: application/json' \
//   -H 'apikey: anon_key' \
//   -H 'Authorization: Bearer your_refresh_token' \
//   -d '{"refresh_token": "your_refresh_token"}'
export default async function refreshAccessToken(refreshToken: string) {
  const url = 'https://bfhwdodoayetjtbuqydp.supabase.co/auth/v1/token?grant_type=refresh_token';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'YOUR_API_KEY',
        'Authorization': `Bearer ${refreshToken}`
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (response.ok) {
      const data = await response.json();
      return data.access_token;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
}
