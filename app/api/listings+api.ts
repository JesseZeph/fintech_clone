const API_KEY = process.env.CRYPTO_API_KEY;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = url.searchParams.get('limit') ||  5;

  const response = await fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=${limit}&convert=EUR`,
    {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY!,
      },
    }
  );

  const res = await response.json();
  return Response.json(res.data);
}

