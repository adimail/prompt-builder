import { createRoot } from 'react-dom/client';
import { GalleryPage } from './components/gallery/GalleryPage';
import './styles/input.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<GalleryPage />);
}