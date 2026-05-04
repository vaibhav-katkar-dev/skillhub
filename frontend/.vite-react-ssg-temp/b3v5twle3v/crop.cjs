const Jimp = require('jimp');

async function cropImage() {
  try {
    const image = await Jimp.read('logo.png');
    // Crop transparent borders automatically
    image.autocrop();
    // Save to favicon
    await image.writeAsync('favicon.png');
    console.log('Successfully cropped and saved favicon.png');
  } catch (err) {
    console.error('Error cropping image:', err);
  }
}

cropImage();
