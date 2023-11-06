import { useState, useRef } from "react";
import style from "./Gallery.module.css";
import images from "./../../utils/images";
import SortableList, { SortableItem } from "react-easy-sort";
import arrayMove from "array-move";
import { Toaster, toast } from "sonner";

//TODO Declaration of URLs as constants
const successSoundURL =
  "https://drive.google.com/uc?id=1JymfvJRIwYFly7YosYR5jYXuudoYkHQ9";
const errorSoundURL =
  "https://drive.google.com/uc?id=1ocUIYOcq4BuGz1o7jlMUKgv5FmmD8b7w";

export default function Gallery() {
  const initialImages = images(); // Array of images
  const fileInputRef = useRef(null);
  const [selectedImageIndexes, setSelectedImageIndexes] = useState([]);
  const [imagesGallery, setImagesGallery] = useState(
    initialImages.map((imgUrl, index) => ({
      url: imgUrl,
      selected: false,
      id: index,
    }))
  );

  //? Logic for selecting or deselecting images
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

  //? Plays a success or error notification sound
  const playNotificationSound = (success) => {
    const audio = new Audio(success ? successSoundURL : errorSoundURL);
    audio.play();
  };

  //? Handles the delete of images in the gallery
  const handleDeleteImages = () => {
    if (selectedImageIndexes.length > 0) {
      const remainingImages = imagesGallery.filter(
        (_, index) => !selectedImageIndexes.includes(index)
      );
      setImagesGallery(
        remainingImages.map((img, index) => ({ ...img, id: index }))
      );
      const filesDeleted = selectedImageIndexes.length;
      const message =
        filesDeleted > 1
          ? `${filesDeleted} images have been successfully deleted!`
          : `${filesDeleted} image has been successfully deleted!`;
      playNotificationSound(true);
      toast.success(message);
      setSelectedImageIndexes([]);
    } else {
      playNotificationSound(false);
      toast.error("Select at least one image to delete");
    }
  };

  //? Handles the sorting of images in the gallery
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

  //? Handles the upload of new images to the gallery
  const handleImageUpload = (event) => {
    const files = event.target.files;
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    const updatedImages = [
      ...imagesGallery,
      ...newImages.map((url, index) => ({
        url: url,
        selected: false,
        id: imagesGallery.length + index,
      })),
    ];

    setImagesGallery(updatedImages);
  };

  //? Opens the file uploader for image selection
  const openFileUploader = () => {
    fileInputRef.current.click();
  };

  return (
    <main>
      <div className={style.bar}>
        <h1 className={style.title}>Gallery</h1>
        <button className={style.delete} onClick={handleDeleteImages}>
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
              <img src={image.url} alt="" loading="lazy" />
            </div>
          </SortableItem>
        ))}
        <div className={style.addImgContainer} onClick={openFileUploader}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
            multiple
          />
          <img
            className={style.addImg}
            src="/static/svg/addImages.svg"
            alt=""
          />
          Add Images
        </div>
      </SortableList>
      <Toaster richColors />
    </main>
  );
}
