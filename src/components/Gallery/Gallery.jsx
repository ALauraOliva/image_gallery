import { useState } from "react";
import style from "./Gallery.module.css";
import images from "./../../utils/images";
import SortableList, { SortableItem } from "react-easy-sort";
import arrayMove from "array-move";

export default function Gallery() {
  const initialImages = images(); // Array of images
  const [selectedImageIndexes, setSelectedImageIndexes] = useState([]);
  const [imagesGallery, setImagesGallery] = useState(
    initialImages.map((imgUrl, index) => ({
      url: imgUrl,
      selected: false,
      id: index,
    }))
  );

  const selectImages = (event) => {
    const { value, checked } = event.target;
    const index = parseInt(value, 10);

    const updatedImages = imagesGallery.map((image, idx) => {
      if (idx === index) {
        return { ...image, selected: checked };
      }
      return image;
    });

    setSelectedImageIndexes(
      updatedImages.filter((image) => image.selected).map((image) => image.id)
    );
    setImagesGallery(updatedImages);
  };

  const deleteFiles = () => {
    if (selectedImageIndexes.length > 0) {
      const remainingImages = imagesGallery.filter(
        (_, index) => !selectedImageIndexes.includes(index)
      );
      setImagesGallery(
        remainingImages.map((img, index) => ({ ...img, id: index }))
      );
      setSelectedImageIndexes([]);
    } else {
      console.log("You must select images to delete them");
    }
  };

  const onSortEnd = (oldIndex, newIndex) => {
    const updatedImages = arrayMove(imagesGallery, oldIndex, newIndex);

    const updatedImagesWithNewIndexes = updatedImages.map((image, index) => ({
      ...image,
      id: index,
      selected: image.selected,
    }));

    setImagesGallery(updatedImagesWithNewIndexes);

    const updatedIndexes = updatedImagesWithNewIndexes
      .filter((image) => image.selected)
      .map((image) => image.id);

    setSelectedImageIndexes(updatedIndexes);
  };

  return (
    <main>
      <div className={style.bar}>
        <h1 className={style.title}>Gallery</h1>
        <button className={style.delete} onClick={deleteFiles}>
          <img src="/static/svg/trash.svg" alt="" />
          <span>{selectedImageIndexes.length}</span>
          Del. Selected
        </button>
      </div>
      <SortableList
        onSortEnd={onSortEnd}
        className={style.gridContainer}
        draggedItemClassName="dragged"
      >
        {imagesGallery.map((image, index) => (
          <SortableItem key={image.id}>
            <div
              className={`${style.gridItem} ${
                index === 0 && `${style.wide} ${style.tall}`
              }`}
            >
              <input
                type="checkbox"
                value={image.id}
                onChange={selectImages}
                checked={image.selected}
              />
              <img src={image.url} alt="" />
            </div>
          </SortableItem>
        ))}
        <div className={style.addImgContainer}>
          <img
            className={style.addImg}
            src="/static/svg/addImages.svg"
            alt=""
          />
          Add Images
        </div>
      </SortableList>
    </main>
  );
}
