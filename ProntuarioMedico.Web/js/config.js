// Configuration settings - Auto-detect environment
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_BASE_URL = isLocalhost 
    ? 'http://localhost:5135/api'
    : 'https://eprontuario-e6ftdrftcdaqbycy.b02.azurefd.net/api';

console.log('Environment:', isLocalhost ? 'Development (Local)' : 'Production (Azure)');
console.log('Using API URL:', API_BASE_URL);