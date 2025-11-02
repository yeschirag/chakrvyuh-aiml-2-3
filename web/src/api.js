// In production, API is served from same origin. In dev, proxy handles it.
const API_BASE = import.meta.env.VITE_API_BASE || '';

// Save and get token
export const saveToken = (t) => localStorage.setItem('token', t);
export const getToken = () => localStorage.getItem('token');
export const clearToken = () => localStorage.removeItem('token');

// ✅ Login request
export const login = async (teamCode) => {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamCode }),
  });
  const data = await res.json();
  
  // Save token on successful login
  if (data.ok && data.token) {
    saveToken(data.token);
  }
  
  return data;
};

// ✅ Ping backend for status
export const ping = async () => {
  const token = getToken();
  if (!token) return { ok: false };
  
  try {
    const res = await fetch(`${API_BASE}/api/level4/ping`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const data = await res.json();
    
    // If unauthorized, clear the invalid token
    if (!data.ok && res.status === 401) {
      clearToken();
    }
    
    return data;
  } catch (error) {
    console.error('Ping error:', error);
    return { ok: false };
  }
};

// ✅ Download dataset function
export const downloadDataset = async () => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/level4/dataset`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    clearToken();
    throw new Error('Session expired. Please login again.');
  }

  if (!res.ok) throw new Error('Download failed');

  // Trigger browser download
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dataset.csv';
  a.click();
};

// ✅ Submit answer
export const submitAnswer = async (answer) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/level4/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answer }),
  });
  
  const data = await res.json();
  
  // If unauthorized, clear the invalid token
  if (!data.ok && res.status === 401) {
    clearToken();
  }
  
  return data;
};