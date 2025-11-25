import { useState } from 'react';
import { motion } from 'framer-motion';

import image1 from '../../../public/images/1.jpeg';
import image2 from '../../../public/images/2.jpeg';
import image3 from '../../../public/images/3.jpeg';
import image4 from '../../../public/images/4.jpeg';

const imageUrls = [image1, image2, image3, image4];

export const ImageGrid = () => {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null);

  const gridTemplateRows = hovered
    ? [0, 1].map((i) => (i === hovered.row ? '2fr' : '0.75fr')).join(' ')
    : '1fr 1fr';

  const gridTemplateColumns = hovered
    ? [0, 1].map((i) => (i === hovered.col ? '2fr' : '0.75fr')).join(' ')
    : '1fr 1fr';

  return (
    <motion.div
      className="grid h-full w-full gap-2"
      style={{
        gridTemplateRows,
        gridTemplateColumns,
        transition: 'grid-template-rows 0.4s ease, grid-template-columns 0.4s ease',
      }}
      onMouseLeave={() => setHovered(null)}
    >
      {imageUrls.map((url, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        return (
          <motion.div
            key={index}
            className="relative h-full w-full overflow-hidden rounded-md bg-neutral-800"
            onMouseEnter={() => setHovered({ row, col })}
          >
            <img
              src={url}
              alt={`Grid Image ${index + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};
