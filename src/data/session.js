// Tiny in-memory session: who is signed in (demo only, no backend yet).
let user = { name: 'Eyob Azeze', email: 'eyob@example.com' };

const titleCase = (s) => s.replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).trim();

export function signIn({ name, email }) {
  const e = (email || '').trim();
  const n = (name || '').trim() || titleCase(e.split('@')[0] || 'Traveler');
  user = { name: n, email: e };
}
export const getUser = () => user;
