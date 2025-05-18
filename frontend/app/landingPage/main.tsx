
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Create root element dynamically
const rootElement = document.createElement('div');
rootElement.id = 'root';
document.body.appendChild(rootElement);

createRoot(rootElement).render(<App />);
