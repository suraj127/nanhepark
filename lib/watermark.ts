/**
 * Overlays location, coordinates, timestamp (IST), and official watermark badge on image canvas.
 * Optimized for mobile memory & speed by scaling down high-res mobile camera photos to max 1280px.
 */
export async function applyWatermarkToImage(
  imageDataUrl: string,
  locationText: string,
  coordinatesText: string,
  dateTimeIstText: string
): Promise<string> {
  return new Promise((resolve) => {
    let resolved = false;

    const safeResolve = (res: string) => {
      if (!resolved) {
        resolved = true;
        resolve(res);
      }
    };

    // Fallback timeout after 2500ms
    const timer = setTimeout(() => {
      safeResolve(imageDataUrl);
    }, 2500);

    try {
      const img = new Image();
      if (imageDataUrl.startsWith('http://') || imageDataUrl.startsWith('https://')) {
        img.crossOrigin = 'anonymous';
      }

      img.onload = () => {
        clearTimeout(timer);
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            safeResolve(imageDataUrl);
            return;
          }

          // Scale down high-resolution mobile camera photos (e.g. 12MP 4000x3000) to max 1280px for instant mobile performance
          const MAX_DIM = 1280;
          let scale = 1;
          const origW = img.width || 800;
          const origH = img.height || 600;

          if (origW > MAX_DIM || origH > MAX_DIM) {
            scale = Math.min(MAX_DIM / origW, MAX_DIM / origH);
          }

          canvas.width = Math.round(origW * scale);
          canvas.height = Math.round(origH * scale);

          // Draw original scaled image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Watermark Bar dimensions
          const barHeight = Math.max(80, Math.round(canvas.height * 0.14));
          const padding = Math.max(12, Math.round(canvas.width * 0.025));

          // Draw translucent gradient overlay at bottom
          const gradient = ctx.createLinearGradient(0, canvas.height - barHeight - 20, 0, canvas.height);
          gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
          gradient.addColorStop(0.3, 'rgba(15, 23, 42, 0.85)');
          gradient.addColorStop(1, 'rgba(15, 23, 42, 0.98)');

          ctx.fillStyle = gradient;
          ctx.fillRect(0, canvas.height - barHeight - 20, canvas.width, barHeight + 20);

          // Accent top line on watermark bar
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(0, canvas.height - barHeight - 20, canvas.width, 3);

          // Watermark Text Configuration
          const primaryFontSize = Math.max(13, Math.round(canvas.width * 0.022));
          const secondaryFontSize = Math.max(11, Math.round(canvas.width * 0.018));
          const badgeFontSize = Math.max(10, Math.round(canvas.width * 0.015));

          const fontFamily = 'system-ui, -apple-system, sans-serif';

          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';

          // Line 1: Location Address
          ctx.font = `600 ${primaryFontSize}px ${fontFamily}`;
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`📍 ${locationText}`, padding, canvas.height - barHeight + 5);

          // Line 2: GPS Coordinates & Timestamp
          ctx.font = `400 ${secondaryFontSize}px ${fontFamily}`;
          ctx.fillStyle = '#e2e8f0';
          ctx.fillText(`🌐 GPS: ${coordinatesText} | 🕒 ${dateTimeIstText}`, padding, canvas.height - barHeight + primaryFontSize + 12);

          // Line 3: Department Evidence Stamp
          ctx.font = `500 ${secondaryFontSize - 1}px ${fontFamily}`;
          ctx.fillStyle = '#fbbf24';
          ctx.fillText(`🛡️ VERIFIED CIVIC REPORTING SYSTEM — SINGLE DRAFT PROOF`, padding, canvas.height - barHeight + primaryFontSize + secondaryFontSize + 20);

          // Right Side: Official Civic Watch Badge
          ctx.textAlign = 'right';
          ctx.font = `bold ${badgeFontSize}px ${fontFamily}`;
          ctx.fillStyle = '#38bdf8';
          ctx.fillText('NANHEY PARK CIVIC WATCH', canvas.width - padding, canvas.height - barHeight + 8);

          ctx.font = `400 ${badgeFontSize - 1}px ${fontFamily}`;
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('AUTOMATIC GEO-STAMPED EVIDENCE', canvas.width - padding, canvas.height - barHeight + badgeFontSize + 14);

          safeResolve(canvas.toDataURL('image/jpeg', 0.85));
        } catch (e) {
          console.warn('Canvas watermark error fallback:', e);
          safeResolve(imageDataUrl);
        }
      };

      img.onerror = (err) => {
        clearTimeout(timer);
        console.warn('Watermark image load error fallback:', err);
        safeResolve(imageDataUrl);
      };

      img.src = imageDataUrl;
    } catch (err) {
      clearTimeout(timer);
      console.warn('Watermark outer error fallback:', err);
      safeResolve(imageDataUrl);
    }
  });
}
