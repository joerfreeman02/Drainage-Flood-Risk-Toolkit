const STORAGE_KEY = 'dft.project.v1';

export function loadProject() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}

export function saveProject(project) {
  const clean = {
    name: String(project.name || '').trim(),
    address: String(project.address || '').trim(),
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  return clean;
}

export function clearProject() {
  localStorage.removeItem(STORAGE_KEY);
}
