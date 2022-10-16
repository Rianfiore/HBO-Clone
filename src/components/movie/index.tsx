import { useState } from 'react';
import { MovieProps } from './types';

export function Movie({
  title, subtitle, poster, backdrop, description,
} : MovieProps) {
  const posterUrl = `https://image.tmdb.org/t/p/original${poster}`;
  const backdropUrl = `https://image.tmdb.org/t/p/original${backdrop}`;
  const [posterData, setPosterData] = useState<string>('');
  const [, setBackdropData] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);

  setTimeout(() => {
    setPosterData(posterUrl);
    setBackdropData(backdropUrl);
  }, 1);

  return (
    <div>
      <img
        src={posterData}
        alt=""
        style={{ maxWidth: '200px' }}
        onError={() => {
          setTimeout(() => {
            setPosterData(posterUrl);
          }, 10);
        }}
      />
      <h3>{title}</h3>
      {subtitle && <h4>{subtitle}</h4>}

      {showDetails && <h5>{description}</h5>}
      <button type="button" onClick={() => setShowDetails(!showDetails)}>Detalhes</button>
      <button type="button">Favoritar</button>
    </div>
  );
}
