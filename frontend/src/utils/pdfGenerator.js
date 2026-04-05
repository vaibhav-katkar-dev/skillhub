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
    // 1. Wait for all fonts (Inter, etc.) to be fully loaded by the browser.
    await document.fonts.ready;

    // 2. Give React one additional animation frame to ensure layout is settled.
    await new Promise((resolve) => requestAnimationFrame(resolve));

    // 3. Detect mobile devices for memory optimization
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const pRatio = isMobile ? 1.5 : 2; // Reduce pixel ratio on mobile to prevent memory errors/crashes
    const useQuality = isMobile ? 0.85 : 0.95; // Use JPEG compression

    // 4. Render the element → high-resolution JPEG via html-to-image.
    // toJpeg is significantly faster and creates much smaller data URIs than toPng,
    // which prevents Android browsers from silently crashing during base64 creation.
    const dataUrl = await toJpeg(el, {
      cacheBust: true,      // avoid stale cached sub-resources
      pixelRatio: pRatio,   // dynamic for print-quality vs memory balance
      quality: useQuality,
      width: 1123,
      height: 794,
      style: {
        // In case any ancestor has opacity/visibility set, force them visible
        opacity: '1',
        visibility: 'visible',
        backgroundColor: '#F8FAFC', // Ensure JPEG background doesn't default to black
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
    return false;
  }
};
