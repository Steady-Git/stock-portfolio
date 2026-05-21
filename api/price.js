export default async function handler(req, res) {
  const { code, type } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (!code) {
    return res.status(400).json({ error: 'code 파라미터가 필요합니다' });
  }

  try {
    let url;
    if (type === 'USD') {
      url = `https://query1.finance.yahoo.com/v8/finance/chart/${code}?interval=1d&range=1d`;
    } else {
      url = `https://m.stock.naver.com/api/stock/${code}/basic`;
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://m.stock.naver.com/',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `upstream ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
