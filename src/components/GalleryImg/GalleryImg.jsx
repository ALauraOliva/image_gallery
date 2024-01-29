import { useState, useEffect } from "react";
import { Blurhash } from "react-blurhash";

export default function GalleryImg({ src }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.src = src;
    return () => {
      // Limpiar el listener de eventos cuando el componente se desmonta
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <>
      {!imageLoaded && (
        <Blurhash
          hash="LQQ,ROfl~ot6-:ayIoaz_1oLRjWC" // Aquí deberías pasar el hash generado dinámicamente
          width="100%"
          height="200px"
          resolutionX={20}
          resolutionY={20}
          punch={1}
        />
      )}
      {imageLoaded && <img src={src} alt="" loading="lazy" />}
    </>
  );
}
