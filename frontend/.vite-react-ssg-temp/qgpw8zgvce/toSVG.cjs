const fs = require('fs');

try {
  const pngPath = 'logo.png';
  const imgBuffer = fs.readFileSync(pngPath);
  const base64 = imgBuffer.toString('base64');
  
  // Create an SVG wrapping the base64 image.
  // The original image might be 500x500 padded. We can use a cropped viewBox to make it larger.
  // E.g., viewBox="150 150 200 200" will crop 150px from all sides out of 500.
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="80 80 340 340" width="500" height="500">
    <image href="data:image/png;base64,${base64}" x="0" y="0" width="500" height="500" />
  </svg>`;
  
  fs.writeFileSync('logo.svg', svgContent);
  fs.writeFileSync('favicon.svg', svgContent);
  
  console.log('Successfully created logo.svg and favicon.svg');
} catch (e) {
  console.error(e);
}
