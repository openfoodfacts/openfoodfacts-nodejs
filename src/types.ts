/**
 * Language-specific ingredient field key.
 * 
 * Example:
 * ingredients_text_en
 * ingredients_text_fr
 */
export type LangIngredient = `ingredients_text_${string}`;

/**
 * Language-specific product name key.
 * 
 * Example:
 * product_name_en
 * product_name_es
 */
export type LangProduct = `product_name_${string}`;

/**
 * Language-specific packaging description key.
 * 
 * Example:
 * packaging_text_en
 * packaging_text_de
 */
export type LangPackagingText = `packaging_text_${string}`;

/**
 * Represents image dimensions.
 */
export type ImageSize = {
  /** Height of the image */
  readonly h: number;

  /** Width of the image */
  readonly w: number;
};

/**
 * Represents a processed/selected image returned by the API.
 */
export type SelectedImage = {
  /** Image rotation angle */
  readonly angle: number;

  /** Size used for coordinate reference */
  readonly coordinates_image_size: string;

  /** Image geometry description */
  readonly geometry: string;

  /** Image identifier */
  readonly imgid: string;

  /**
   * Indicates whether normalization was applied.
   * Can be string, boolean or null depending on API response.
   */
  readonly normalize: string | boolean | null;

  /** Revision identifier */
  readonly rev: string;

  /**
   * Available resized versions of the image.
   */
  readonly sizes: {
    readonly 100: ImageSize;
    readonly 200: ImageSize;
    readonly 400: ImageSize;
    readonly full: ImageSize;
  };

  /**
   * Indicates if white background correction was applied.
   */
  readonly white_magic: string | boolean | null;

  /** Bounding box coordinates */
  readonly x1: string;
  readonly x2: string;
  readonly y1: string;
  readonly y2: string;
};

/**
 * Represents a raw uploaded image before processing.
 */
export type RawImage = {
  /** Image URL */
  readonly url: string;

  /**
   * Available image sizes.
   */
  readonly sizes: {
    readonly full: ImageSize;
    readonly 100: ImageSize;
    readonly 400: ImageSize;
  };

  /** Upload timestamp */
  readonly uploaded_t: string;

  /** Username of the uploader */
  readonly uploader: string;
};