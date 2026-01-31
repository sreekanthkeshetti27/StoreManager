// client/src/api.js
import axios from 'axios';

// This looks at your Vercel/Local settings. 
// If VITE_API_URL exists, it uses it. Otherwise, it uses localhost.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL
});

export default api;