import { useState } from "react";
import style from "./Gallery.module.css";
import images from "./../../utils/images";

export default function Gallery() {
  const initialImages = images(); // Array of images
  const [imagesGallery, setImagesGallery] = useState(initialImages);
  const [selectedImageIndexes, setSelectedImageIndexes] = useState([]);

  const selectImages = (event) => {
    const { value, checked } = event.target;
    const index = parseInt(value, 10);

    if (checked) {
      setSelectedImageIndexes([...selectedImageIndexes, index]);
    } else {
      const updatedIndexes = selectedImageIndexes.filter(
        (selectedIndex) => selectedIndex !== index
      );
      setSelectedImageIndexes(updatedIndexes);
    }
  };

  const deleteFiles = () => {
    if (selectedImageIndexes.length > 0) {
      const remainingImages = imagesGallery.filter(
        (_, index) => !selectedImageIndexes.includes(index)
      );
      setImagesGallery(remainingImages);
      setSelectedImageIndexes([]); // Clear selected image indexes after deletion
    } else {
      console.log("You must select images to delete them");
    }
  };

  return (
    <main>
      <div className={style.bar}>
        <h1 className={style.title}>Gallery</h1>
        <button className={style.delete} onClick={deleteFiles}>
          <img src="/static/svg/trash.svg" alt="" />
          <span>{selectedImageIndexes.length}</span>
          Delete Files
        </button>
      </div>
      <div className={style.gridContainer}>
        {imagesGallery.map((imgUrl, index) => (
          <div
            key={index}
            className={`${style.gridItem} ${
              index === 0 && `${style.wide} ${style.tall}`
            }`}
          >
            <input
              type="checkbox"
              value={index}
              onChange={selectImages}
              checked={selectedImageIndexes.includes(index)}
            />
            <img src={imgUrl} alt="" />
          </div>
        ))}
        <div className={style.addImgContainer}>
          <img
            className={style.addImg}
            src="/static/svg/addImages.svg"
            alt=""
          />
          Add Images
        </div>
      </div>
    </main>
  );
}
