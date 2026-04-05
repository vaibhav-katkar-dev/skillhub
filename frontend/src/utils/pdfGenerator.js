import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Generate a landscape A4 PDF from a React ref element.
 *
 * Uses `html-to-image` (toPng/toJpeg) instead of html2canvas because:
 *  - It handles modern CSS natively.
 *  - Computes web fonts and transforms.
 *
 * @param {React.RefObject} elementRef  - ref to the root certificate div
 * @param {string}          fileName    - desired filename without .pdf extension
 * @returns {Promise<boolean>}          - true on success, false on failure
 */
export const generatePDFFromDOM = async (elementRef, fileName) => {
  if (!elementRef.current) return false;

  const el = elementRef.current;

  try {
    // 1. Wait for all fonts (Inter, etc.) to be fully loaded by the browser, 
    // but with a 1.5s timeout so Android browsers don't hang indefinitely.
    await Promise.race([
      document.fonts.ready,
      new Promise(resolve => setTimeout(resolve, 1500))
    ]);

    // 2. Give React time to ensure layout and image DOM nodes are settled on mobile.
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 3. Render the element → high-resolution JPEG via html-to-image.
    // toJpeg resolves mobile memory crashes.
    // 1.56 ratio applied to A4 (1123x794) = exactly 150 DPI. We use 1.6 to be safe and crisp.
    const pRatio = 1.6;
    const useQuality = 0.90;

    const dataUrl = await toJpeg(el, {
      pixelRatio: pRatio,
      quality: useQuality,
      width: 1123,
      height: 794,
      skipFonts: true, // Prevents Android normalizeFontFamily undefined trim() crash
      style: {
        // Force the element to be fully opaque for drawing, since we made it 0.01 in the DOM
        opacity: '1',
        visibility: 'visible',
        backgroundColor: '#F8FAFC',
      },
      // Skip any elements that shouldn't appear in the PDF
      filter: (node) => {
        // Remove elements flagged with data-pdf-skip (none currently)
        if (node.dataset?.pdfSkip) return false;
        return true;
      },
    });

    // 5. Build an A4 landscape PDF and embed the JPEG at full bleed.
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true, // Compress PDF output
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();   // 297 mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 210 mm

    pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}.pdf`);

    return true;
  } catch (error) {
    console.error('PDF Client Generation Error:', error);
    throw new Error(error.message || 'Unknown generation error');
  }
};
