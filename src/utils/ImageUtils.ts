export class ImageUtils {

  /*
    // Použití:
    const imageUrl = 'https://example.com/your-image.jpg';
    getImageDimensions(imageUrl)
      .then(dimensions => {
        console.log(`Šířka: ${dimensions.width}px, Výška: ${dimensions.height}px`);
      })
      .catch(error => {
        console.log(error);
      });
   */
  static getImageDimensions(imageUrl: string): Promise<{ width: number, height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };

      img.onerror = () => {
        reject('Chyba při načítání obrázku.');
      };

      img.src = imageUrl;
    });
  }
}