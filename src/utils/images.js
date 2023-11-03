const importImages = () => {
  const images = [];
  const context = require.context(
    "./../../public/static/assets/",
    false,
    /\.(webp|jpg|jpeg|png|gif|svg)$/
  );

  context.keys().forEach((key) => {
    images.push(context(key));
  });

  return images;
};

export default importImages;
