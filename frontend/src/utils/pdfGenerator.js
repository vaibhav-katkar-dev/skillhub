import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Generate a landscape A4 PDF from a React ref element.
 *
 * Uses `html-to-image` (toPng) instead of html2canvas because:
 *  - It handles modern CSS including oklch() color functions natively.
 *  - It correctly inlines loaded web-fonts (Inter, etc.) as base64.
 *  - It supports CSS transforms, blur filters, and box-shadows faithfully.
 *  - The output is pixel-perfect matching the on-screen rendering.
 *
 * The CertificateTemplate is positioned off-screen at opacity:1, so
 * html-to-image can read its fully computed styles without any hacks.
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
    //    Without this, text may render in a fallback system font.
    await document.fonts.ready;

    // 2. Give React one additional animation frame to ensure layout is settled.
    await new Promise((resolve) => requestAnimationFrame(resolve));

    // 3. Render the element → high-resolution PNG via html-to-image.
    //    pixelRatio:2 provides 2× resolution for crisp print quality.
    const dataUrl = await toPng(el, {
      cacheBust: true,      // avoid stale cached sub-resources
      pixelRatio: 2,        // 2× for print-quality sharpness
      width: 1123,
      height: 794,
      style: {
        // In case any ancestor has opacity/visibility set, force them visible
        opacity: '1',
        visibility: 'visible',
      },
      // Skip any elements that shouldn't appear in the PDF
      filter: (node) => {
        // Remove elements flagged with data-pdf-skip (none currently)
        if (node.dataset?.pdfSkip) return false;
        return true;
      },
    });

    // 4. Build an A4 landscape PDF and embed the PNG at full bleed.
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();   // 297 mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 210 mm

    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}.pdf`);

    return true;
  } catch (error) {
    console.error('PDF Client Generation Error:', error);
    return false;
  }
};
