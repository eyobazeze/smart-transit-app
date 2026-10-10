// Addis Ababa places used for suggestions. Coordinates will drive the real map later.
export const CURRENT_LOCATION = {
  id: 'current', name: 'Your current location', area: 'Using GPS', lat: 9.0108, lng: 38.7613, kind: 'current',
};

export const PLACES = [
  { id: 'bole-airport', name: 'Bole International Airport', area: 'Bole', lat: 8.9779, lng: 38.7993, kind: 'airport' },
  { id: 'bole', name: 'Bole', area: 'Bole Sub-city', lat: 9.0036, lng: 38.7899, kind: 'area' },
  { id: 'bole-medhanialem', name: 'Bole Medhanialem', area: 'Bole', lat: 8.9953, lng: 38.7857, kind: 'area' },
  { id: 'meskel-square', name: 'Meskel Square', area: 'Kirkos', lat: 9.0107, lng: 38.7612, kind: 'landmark' },
  { id: 'piassa', name: 'Piassa', area: 'Arada', lat: 9.0356, lng: 38.7506, kind: 'area' },
  { id: 'arat-kilo', name: 'Arat Kilo', area: 'Arada', lat: 9.0346, lng: 38.7627, kind: 'area' },
  { id: 'sidist-kilo', name: 'Sidist Kilo', area: 'Arada', lat: 9.0415, lng: 38.7625, kind: 'area' },
  { id: 'shola', name: 'Shola Market', area: 'Yeka', lat: 9.0432, lng: 38.7926, kind: 'market' },
  { id: '6-kilo', name: '6 Kilo', area: 'Arada', lat: 9.0453, lng: 38.7627, kind: 'area' },
  { id: 'megenagna', name: 'Megenagna', area: 'Yeka', lat: 9.0206, lng: 38.8004, kind: 'area' },
  { id: 'cmc', name: 'CMC', area: 'Bole', lat: 9.0189, lng: 38.8335, kind: 'area' },
  { id: 'kazanchis', name: 'Kazanchis', area: 'Kirkos', lat: 9.0145, lng: 38.7708, kind: 'area' },
  { id: 'mexico', name: 'Mexico Square', area: 'Kirkos', lat: 9.0128, lng: 38.7456, kind: 'landmark' },
  { id: 'lideta', name: 'Lideta', area: 'Lideta', lat: 9.0102, lng: 38.7310, kind: 'area' },
  { id: 'merkato', name: 'Merkato', area: 'Addis Ketema', lat: 9.0306, lng: 38.7391, kind: 'market' },
  { id: 'autobus-tera', name: 'Autobus Tera', area: 'Addis Ketema', lat: 9.0343, lng: 38.7358, kind: 'station' },
  { id: 'stadium', name: 'Addis Ababa Stadium', area: 'Kirkos', lat: 9.0078, lng: 38.7550, kind: 'landmark' },
  { id: 'lebu', name: 'Lebu', area: 'Nifas Silk-Lafto', lat: 8.9577, lng: 38.7194, kind: 'area' },
  { id: 'saris', name: 'Saris', area: 'Kirkos', lat: 8.9806, lng: 38.7573, kind: 'area' },
  { id: 'gerji', name: 'Gerji', area: 'Bole', lat: 9.0092, lng: 38.8217, kind: 'area' },
  { id: 'ayat', name: 'Ayat', area: 'Bole', lat: 9.0296, lng: 38.8751, kind: 'area' },
  { id: 'kality', name: 'Kality', area: 'Kaliti', lat: 8.9047, lng: 38.7655, kind: 'area' },
  { id: 'gotera', name: 'Gotera', area: 'Kirkos', lat: 8.9946, lng: 38.7652, kind: 'area' },
  { id: 'ethiopia-sq', name: 'Africa Avenue', area: 'Bole', lat: 9.0023, lng: 38.7740, kind: 'street' },
  { id: 'unity-park', name: 'Unity Park', area: 'Arada', lat: 9.0310, lng: 38.7580, kind: 'landmark' },
  { id: 'sar-bet', name: 'Sar Bet', area: 'Nifas Silk-Lafto', lat: 8.9889, lng: 38.7353, kind: 'area' },
  { id: 'kebena', name: 'Kebena', area: 'Kolfe Keranio', lat: 9.0453, lng: 38.7470, kind: 'area' },
];

export const RECENT_PLACE_IDS = ['piassa', 'meskel-square', 'bole-airport', 'megenagna'];

const norm = (s) => (s || '').toLowerCase().trim();

export function searchPlaces(query, exclude = []) {
  const q = norm(query);
  const pool = PLACES.filter((p) => !exclude.includes(p.id));
  if (!q) return RECENT_PLACE_IDS.map((id) => pool.find((p) => p.id === id)).filter(Boolean);
  const tokens = q.split(/\s+/).filter(Boolean);
  const scored = [];
  pool.forEach((p) => {
    const name = norm(p.name);
    const words = name.split(/[\s-]+/);
    const hay = name + ' ' + norm(p.area);
    // every typed word must start a word in the name/area (or appear inside it)
    const ok = tokens.every((t) => words.some((w) => w.startsWith(t)) || hay.includes(t));
    if (!ok) return;
    let score = 0;
    if (name.startsWith(q)) score += 100;
    else if (name.includes(q)) score += 60;
    score += tokens.filter((t) => words.some((w) => w.startsWith(t))).length * 10;
    score -= name.length / 100;
    scored.push({ p, score });
  });
  return scored.sort((x, y) => y.score - x.score).slice(0, 6).map((x) => x.p);
}

export function findExact(text) {
  const q = norm(text);
  if (!q) return null;
  if (q === norm(CURRENT_LOCATION.name)) return CURRENT_LOCATION;
  return PLACES.find((p) => norm(p.name) === q) || null;
}

export const getPlace = (id) => PLACES.find((p) => p.id === id) || null;
