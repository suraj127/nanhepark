/**
 * Overlays location, coordinates, timestamp (IST), and official watermark badge on image canvas.
 */
export async function applyWatermarkToImage(
  imageDataUrl: string,
  locationText: string,
  coordinatesText: string,
  dateTimeIstText: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageDataUrl);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Watermark Bar dimensions
      const barHeight = Math.max(90, Math.round(canvas.height * 0.14));
      const padding = Math.max(16, Math.round(canvas.width * 0.025));

      // Draw translucent gradient overlay at bottom
      const gradient = ctx.createLinearGradient(0, canvas.height - barHeight - 20, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(0.3, 'rgba(15, 23, 42, 0.85)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.98)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.height - barHeight - 20, canvas.width, barHeight + 20);

      // Accent top line on watermark bar
      ctx.fillStyle = '#f59e0b'; // Amber alert accent
      ctx.fillRect(0, canvas.height - barHeight - 20, canvas.width, 3);

      // Watermark Text Configuration
      const primaryFontSize = Math.max(14, Math.round(canvas.width * 0.022));
      const secondaryFontSize = Math.max(12, Math.round(canvas.width * 0.018));
      const badgeFontSize = Math.max(11, Math.round(canvas.width * 0.015));

      const fontFamily = 'system-ui, -apple-system, sans-serif';

      // Left Column: Location & Coordinates
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      // Line 1: Location Address
      ctx.font = `600 ${primaryFontSize}px ${fontFamily}`;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`📍 ${locationText}`, padding, canvas.height - barHeight + 5);

      // Line 2: GPS Coordinates & Timestamp
      ctx.font = `400 ${secondaryFontSize}px ${fontFamily}`;
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`🌐 GPS: ${coordinatesText} | 🕒 ${dateTimeIstText}`, padding, canvas.height - barHeight + primaryFontSize + 14);

      // Line 3: Department Evidence Stamp
      ctx.font = `500 ${secondaryFontSize - 1}px ${fontFamily}`;
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`🛡️ VERIFIED CIVIC REPORTING SYSTEM — SINGLE DRAFT PROOF`, padding, canvas.height - barHeight + primaryFontSize + secondaryFontSize + 22);

      // Right Side: Official Civic Watch Badge
      ctx.textAlign = 'right';
      ctx.font = `bold ${badgeFontSize}px ${fontFamily}`;
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('NANHEY PARK CIVIC WATCH', canvas.width - padding, canvas.height - barHeight + 8);

      ctx.font = `400 ${badgeFontSize - 1}px ${fontFamily}`;
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('AUTOMATIC GEO-STAMPED EVIDENCE', canvas.width - padding, canvas.height - barHeight + badgeFontSize + 14);

      // Convert back to base64 JPEG
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };

    img.onerror = (err) => {
      console.error('Watermark image load error', err);
      resolve(imageDataUrl);
    };

    img.src = imageDataUrl;
  });
}
