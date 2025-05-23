export default async function handler(req, res) {
  const { query } = req;
  const OMDB_API_KEY = process.env.OMDB_API_KEY;

  if (!OMDB_API_KEY) {
    return res.status(500).json({ error: "Missing OMDB API key" });
  }

  const searchParams = new URLSearchParams({
    apikey: OMDB_API_KEY,
    ...query,
  });

  try {
    const response = await fetch(`https://www.omdbapi.com/?${searchParams}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from OMDB." });
  }
}