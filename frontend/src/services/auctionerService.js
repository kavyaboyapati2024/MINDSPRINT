const CACHE = new Map();
const BASE = 'http://localhost:9000/api/auctioners';

export async function getAuctionerName(auctionerId) {
  if (!auctionerId) return null;
  if (CACHE.has(auctionerId)) return CACHE.get(auctionerId);

  try {
    const res = await fetch(`${BASE}/${auctionerId}/name`);
    if (!res.ok) {
      const text = await res.text();
      console.warn('Failed to fetch auctioner name', auctionerId, text);
      CACHE.set(auctionerId, null);
      return null;
    }

    const json = await res.json();
    const name = json?.name || null;
    CACHE.set(auctionerId, name);
    return name;
  } catch (err) {
    console.error('Error fetching auctioner name', auctionerId, err);
    CACHE.set(auctionerId, null);
    return null;
  }
}
