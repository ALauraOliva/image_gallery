import style from "./Gallery.module.css";
import images from "./../../utils/images";

export default function Gallery() {
  const imagesGallery = images();
  return (
    <div className={style.gridContainer}>
      {imagesGallery.map((imgUrl, index) => (
        <div
          key={index}
          className={`${style.gridItem} ${
            index === 0 && `${style.wide} ${style.tall}`
          }`}
        >
          <img src={imgUrl} alt="" />
        </div>
      ))}
    </div>
  );
}
