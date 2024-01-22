/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/": {
    /** Main Page */
    get: operations["main_page__get"];
  };
  "/api/v1/auth": {
    /**
     * Authentication
     * @description Authentication: provide username/password and get a bearer token in return.
     *
     * - **username**: Open Food Facts user_id (not email)
     * - **password**: user password (clear text, but HTTPS encrypted)
     *
     * A **token** is returned. If the **set_cookie** parameter is set to 1,
     * the token is also set as a cookie named "session" in the response.
     *
     * To authenticate, you can either:
     * - use the **Authorization** header with the **Bearer** scheme,
     *   e.g.: "Authorization: bearer token"
     * - use the **session** cookie, e.g.: "Cookie: session=token"
     */
    post: operations["authentication_api_v1_auth_post"];
  };
  "/api/v1/prices": {
    /** Get Price */
    get: operations["get_price_api_v1_prices_get"];
    /**
     * Create Price
     * @description Create a new price.
     *
     * This endpoint requires authentication.
     */
    post: operations["create_price_api_v1_prices_post"];
  };
  "/api/v1/proofs/upload": {
    /**
     * Upload Proof
     * @description Upload a proof file.
     *
     * The POST request must be a multipart/form-data request with a file field
     * named "file".
     *
     * This endpoint requires authentication.
     */
    post: operations["upload_proof_api_v1_proofs_upload_post"];
  };
  "/api/v1/proofs": {
    /**
     * Get User Proofs
     * @description Get all the proofs uploaded by the current user.
     *
     * This endpoint requires authentication.
     */
    get: operations["get_user_proofs_api_v1_proofs_get"];
  };
  "/api/v1/products/{product_id}": {
    /** Get Product */
    get: operations["get_product_api_v1_products__product_id__get"];
  };
  "/api/v1/locations/{location_id}": {
    /** Get Location */
    get: operations["get_location_api_v1_locations__location_id__get"];
  };
  "/api/v1/status": {
    /** Status Endpoint */
    get: operations["status_endpoint_api_v1_status_get"];
  };
  "/robots.txt": {
    /** Robots Txt */
    get: operations["robots_txt_robots_txt_get"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    /** Body_authentication_api_v1_auth_post */
    Body_authentication_api_v1_auth_post: {
      /** Grant Type */
      grant_type?: string | null;
      /** Username */
      username: string;
      /** Password */
      password: string;
      /**
       * Scope
       * @default
       */
      scope?: string;
      /** Client Id */
      client_id?: string | null;
      /** Client Secret */
      client_secret?: string | null;
    };
    /** Body_upload_proof_api_v1_proofs_upload_post */
    Body_upload_proof_api_v1_proofs_upload_post: {
      /**
       * File
       * Format: binary
       */
      file: string;
    };
    /**
     * CurrencyEnum
     * @enum {string}
     */
    CurrencyEnum: "KHR" | "BOL" | "COU" | "MRU" | "TMM" | "COP" | "BEF" | "HNL" | "PEI" | "BHD" | "ZRZ" | "TRL" | "MLF" | "MDL" | "ADP" | "BRN" | "XPT" | "CNH" | "BIF" | "AOA" | "LUC" | "NIO" | "LKR" | "ARP" | "DZD" | "SOS" | "ALK" | "XBC" | "LYD" | "VED" | "MVR" | "IQD" | "MRO" | "ZMW" | "PLN" | "MKD" | "NZD" | "ECV" | "GNF" | "LUL" | "SHP" | "BOV" | "VES" | "BOB" | "GYD" | "TPE" | "SRG" | "AMD" | "BYB" | "YUN" | "XFO" | "MZN" | "CNX" | "AFA" | "XPF" | "GWP" | "ARL" | "BYR" | "BEL" | "KRW" | "FIM" | "GTQ" | "BWP" | "CVE" | "KYD" | "MVP" | "PTE" | "MZM" | "AED" | "ESA" | "WST" | "BRC" | "JOD" | "FKP" | "LTL" | "SLE" | "KWD" | "MWK" | "XFU" | "ILP" | "SGD" | "BMD" | "ISK" | "SBD" | "XAF" | "BAD" | "TWD" | "GBP" | "GWE" | "VND" | "IEP" | "CLP" | "LBP" | "MXP" | "BZD" | "CHW" | "LUF" | "HUF" | "CLF" | "MTL" | "XBA" | "XDR" | "ANG" | "BRB" | "KRO" | "CZK" | "ITL" | "BGM" | "AZM" | "XRE" | "GQE" | "YUR" | "MOP" | "MYR" | "THB" | "MZE" | "EUR" | "MGF" | "YUD" | "VUV" | "USN" | "INR" | "LTT" | "BDT" | "ZAL" | "JPY" | "MNT" | "XUA" | "IRR" | "GMD" | "CSD" | "XXX" | "MAD" | "MCF" | "HTG" | "UYW" | "ARA" | "CRC" | "CSK" | "CUP" | "GHS" | "NAD" | "NLG" | "MXV" | "HRD" | "MMK" | "SRD" | "ESB" | "BYN" | "ZWD" | "SSP" | "NGN" | "ILS" | "UYU" | "AUD" | "EGP" | "ESP" | "TZS" | "MKN" | "XBB" | "MUR" | "XBD" | "CHE" | "AWG" | "CNY" | "LAK" | "LRD" | "AOK" | "SUR" | "UAK" | "BBD" | "YER" | "BAN" | "PGK" | "SCR" | "TND" | "BSD" | "USD" | "ALL" | "SYP" | "UZS" | "BAM" | "LSL" | "DJF" | "LVR" | "SVC" | "FRF" | "UYI" | "SZL" | "YDD" | "PHP" | "USS" | "ZWL" | "BGO" | "STD" | "DDM" | "ZMK" | "AFN" | "BRE" | "SEK" | "BND" | "SAR" | "XEU" | "NOK" | "BTN" | "KRH" | "STN" | "TJR" | "GEK" | "ISJ" | "VEF" | "GHC" | "HKD" | "UGX" | "EEK" | "AOR" | "ILR" | "CYP" | "BGN" | "KPW" | "UYP" | "XTS" | "BGL" | "DKK" | "VEB" | "YUM" | "KZT" | "BRZ" | "MDC" | "TMT" | "QAR" | "MTP" | "XOF" | "CHF" | "CAD" | "BRR" | "PKR" | "RSD" | "RUB" | "RUR" | "SDP" | "BOP" | "PES" | "TOP" | "ROL" | "HRK" | "GIP" | "PAB" | "XAU" | "VNN" | "MXN" | "XSU" | "KES" | "GNS" | "IDR" | "ZAR" | "KGS" | "ECS" | "XCD" | "SIT" | "SKK" | "BRL" | "KMF" | "MGA" | "PEN" | "RWF" | "SDG" | "CLE" | "PYG" | "TRY" | "ARM" | "XPD" | "PLZ" | "TJS" | "BUK" | "BEC" | "SDD" | "ATS" | "NIC" | "SLL" | "CUC" | "ARS" | "ETB" | "TTD" | "DOP" | "XAG" | "GRD" | "RHD" | "OMR" | "GEL" | "JMD" | "AON" | "UGS" | "CDF" | "AZN" | "LVL" | "ZRN" | "FJD" | "ZWR" | "RON" | "NPR" | "DEM" | "ERN" | "MAF" | "UAH";
    /**
     * Flavor
     * @description Flavor is used to refer to a specific Open*Facts project:
     *
     * - Open Food Facts
     * - Open Beauty Facts
     * - Open Pet Food Facts
     * - Open Product Facts
     * - Open Food Facts (Pro plateform)
     * @enum {string}
     */
    Flavor: "off" | "obf" | "opff" | "opf" | "off-pro";
    /** HTTPValidationError */
    HTTPValidationError: {
      /** Detail */
      detail?: components["schemas"]["ValidationError"][];
    };
    /** LocationBase */
    LocationBase: {
      /** Osm Id */
      osm_id: number;
      osm_type: components["schemas"]["LocationOSMEnum"];
      /** Id */
      id: number;
      /** Osm Name */
      osm_name: string | null;
      /** Osm Display Name */
      osm_display_name: string | null;
      /** Osm Address Postcode */
      osm_address_postcode: string | null;
      /** Osm Address City */
      osm_address_city: string | null;
      /** Osm Address Country */
      osm_address_country: string | null;
      /** Osm Lat */
      osm_lat: number | null;
      /** Osm Lon */
      osm_lon: number | null;
      /**
       * Created
       * Format: date-time
       */
      created: string;
      /** Updated */
      updated: string | null;
    };
    /**
     * LocationOSMEnum
     * @enum {string}
     */
    LocationOSMEnum: "NODE" | "WAY" | "RELATION";
    /** Page[PriceBase] */
    Page_PriceBase_: {
      /** Items */
      items: components["schemas"]["PriceBase"][];
      /** Total */
      total: number | null;
      /** Page */
      page: number | null;
      /** Size */
      size: number | null;
      /** Pages */
      pages?: number | null;
    };
    /** PriceBase */
    PriceBase: {
      /**
       * Product Code
       * @description barcode (EAN) of the product, as a string.
       */
      product_code?: string | null;
      /**
       * Category Tag
       * @description ID of the Open Food Facts category of the product for
       *         products without barcode.
       *
       *         This is mostly for raw products such as vegetables or fruits. This
       *         field is exclusive with `product_code`: if this field is set, it means
       *         that the product does not have a barcode.
       *
       *         This ID must be a canonical category ID in the Open Food Facts taxonomy.
       *         If the ID is not valid, the price will be rejected.
       */
      category_tag?: string | null;
      /**
       * Labels Tags
       * @description labels of the product, only for products without barcode.
       *
       *         The labels must be valid labels in the Open Food Facts taxonomy.
       *         If one of the labels is not valid, the price will be rejected.
       *
       *         The most common labels are:
       *         - `en:organic`: the product is organic
       *         - `en:fair-trade`: the product is fair-trade
       *
       *         Other labels can be provided if relevant.
       */
      labels_tags?: string[] | null;
      /**
       * Price
       * @description price of the product, without its currency, taxes included. If the price is about a barcode-less product, it must be the price per kilogram or per liter.
       */
      price: number;
      /** @description currency of the price, as a string. The currency must be a valid currency code. See https://en.wikipedia.org/wiki/ISO_4217 for a list of valid currency codes. */
      currency: components["schemas"]["CurrencyEnum"];
      /**
       * Location Osm Id
       * @description ID of the location in OpenStreetMap: the store where the product was bought.
       */
      location_osm_id: number;
      /** @description type of the OpenStreetMap location object. Stores can be represented as nodes, ways or relations in OpenStreetMap. It is necessary to be able to fetch the correct information about the store using the ID. */
      location_osm_type: components["schemas"]["LocationOSMEnum"];
      /**
       * Date
       * Format: date
       * @description date when the product was bought.
       */
      date: string;
      /**
       * Proof Id
       * @description ID of the proof, if any. The proof is a file (receipt or price tag image) uploaded by the user to prove the price of the product. The proof must be uploaded before the price, and the authenticated user must be the owner of the proof.
       */
      proof_id?: number | null;
      /** Product Id */
      product_id: number | null;
      /** Location Id */
      location_id: number | null;
      /**
       * Created
       * Format: date-time
       */
      created: string;
    };
    /** PriceCreate */
    PriceCreate: {
      /**
       * Product Code
       * @description barcode (EAN) of the product, as a string.
       */
      product_code?: string | null;
      /**
       * Category Tag
       * @description ID of the Open Food Facts category of the product for
       *         products without barcode.
       *
       *         This is mostly for raw products such as vegetables or fruits. This
       *         field is exclusive with `product_code`: if this field is set, it means
       *         that the product does not have a barcode.
       *
       *         This ID must be a canonical category ID in the Open Food Facts taxonomy.
       *         If the ID is not valid, the price will be rejected.
       */
      category_tag?: string | null;
      /**
       * Labels Tags
       * @description labels of the product, only for products without barcode.
       *
       *         The labels must be valid labels in the Open Food Facts taxonomy.
       *         If one of the labels is not valid, the price will be rejected.
       *
       *         The most common labels are:
       *         - `en:organic`: the product is organic
       *         - `en:fair-trade`: the product is fair-trade
       *
       *         Other labels can be provided if relevant.
       */
      labels_tags?: string[] | null;
      /**
       * Price
       * @description price of the product, without its currency, taxes included. If the price is about a barcode-less product, it must be the price per kilogram or per liter.
       */
      price: number;
      /** @description currency of the price, as a string. The currency must be a valid currency code. See https://en.wikipedia.org/wiki/ISO_4217 for a list of valid currency codes. */
      currency: components["schemas"]["CurrencyEnum"];
      /**
       * Location Osm Id
       * @description ID of the location in OpenStreetMap: the store where the product was bought.
       */
      location_osm_id: number;
      /** @description type of the OpenStreetMap location object. Stores can be represented as nodes, ways or relations in OpenStreetMap. It is necessary to be able to fetch the correct information about the store using the ID. */
      location_osm_type: components["schemas"]["LocationOSMEnum"];
      /**
       * Date
       * Format: date
       * @description date when the product was bought.
       */
      date: string;
      /**
       * Proof Id
       * @description ID of the proof, if any. The proof is a file (receipt or price tag image) uploaded by the user to prove the price of the product. The proof must be uploaded before the price, and the authenticated user must be the owner of the proof.
       */
      proof_id?: number | null;
    };
    /** ProductBase */
    ProductBase: {
      /**
       * Code
       * @description barcode (EAN) of the product, as a string.
       */
      code: string;
      /** Id */
      id: number;
      /** @description source of data, either `off` (Open Food Facts), `obf` (Open Beauty Facts), `opff` (Open Pet Food Facts) or `obf` (Open Beauty Facts) */
      source: components["schemas"]["Flavor"] | null;
      /**
       * Product Name
       * @description name of the product.
       */
      product_name: string | null;
      /**
       * Product Quantity
       * @description quantity of the product, normalized in g or mL (depending on the product).
       */
      product_quantity: number | null;
      /**
       * Image Url
       * @description URL of the product image.
       */
      image_url: string | null;
      /**
       * Created
       * Format: date-time
       * @description datetime of the creation.
       */
      created: string;
      /**
       * Updated
       * @description datetime of the last update.
       */
      updated: string | null;
    };
    /** ProofBase */
    ProofBase: {
      /** File Path */
      file_path: string;
      /** Mimetype */
      mimetype: string;
      type: components["schemas"]["ProofTypeEnum"];
      /** Id */
      id: number;
      /** Owner */
      owner: string;
      /**
       * Created
       * Format: date-time
       */
      created: string;
    };
    /**
     * ProofTypeEnum
     * @enum {string}
     */
    ProofTypeEnum: "PRICE_TAG" | "RECEIPT" | "GDPR_REQUEST";
    /** ValidationError */
    ValidationError: {
      /** Location */
      loc: (string | number)[];
      /** Message */
      msg: string;
      /** Error Type */
      type: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  /** Main Page */
  main_page__get: {
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "text/html": string;
        };
      };
    };
  };
  /**
   * Authentication
   * @description Authentication: provide username/password and get a bearer token in return.
   *
   * - **username**: Open Food Facts user_id (not email)
   * - **password**: user password (clear text, but HTTPS encrypted)
   *
   * A **token** is returned. If the **set_cookie** parameter is set to 1,
   * the token is also set as a cookie named "session" in the response.
   *
   * To authenticate, you can either:
   * - use the **Authorization** header with the **Bearer** scheme,
   *   e.g.: "Authorization: bearer token"
   * - use the **session** cookie, e.g.: "Cookie: session=token"
   */
  authentication_api_v1_auth_post: {
    parameters: {
      query?: {
        /** @description if set to 1, the token is also set as a cookie named 'session' in the response. This parameter must be passed as a query parameter, e.g.: /auth?set_cookie=1 */
        set_cookie?: boolean;
      };
    };
    requestBody: {
      content: {
        "application/x-www-form-urlencoded": components["schemas"]["Body_authentication_api_v1_auth_post"];
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Get Price */
  get_price_api_v1_prices_get: {
    parameters: {
      query?: {
        product_code?: string | null;
        location_osm_id?: number | null;
        location_osm_type?: components["schemas"]["LocationOSMEnum"] | null;
        price?: number | null;
        currency?: string | null;
        price__gt?: number | null;
        price__gte?: number | null;
        price__lt?: number | null;
        price__lte?: number | null;
        date?: string | null;
        date__gt?: string | null;
        date__gte?: string | null;
        date__lt?: string | null;
        date__lte?: string | null;
        /** @description Page number */
        page?: number;
        /** @description Page size */
        size?: number;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["Page_PriceBase_"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /**
   * Create Price
   * @description Create a new price.
   *
   * This endpoint requires authentication.
   */
  create_price_api_v1_prices_post: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["PriceCreate"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        content: {
          "application/json": components["schemas"]["PriceBase"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /**
   * Upload Proof
   * @description Upload a proof file.
   *
   * The POST request must be a multipart/form-data request with a file field
   * named "file".
   *
   * This endpoint requires authentication.
   */
  upload_proof_api_v1_proofs_upload_post: {
    requestBody: {
      content: {
        "multipart/form-data": components["schemas"]["Body_upload_proof_api_v1_proofs_upload_post"];
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        content: {
          "application/json": components["schemas"]["ProofBase"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /**
   * Get User Proofs
   * @description Get all the proofs uploaded by the current user.
   *
   * This endpoint requires authentication.
   */
  get_user_proofs_api_v1_proofs_get: {
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["ProofBase"][];
        };
      };
    };
  };
  /** Get Product */
  get_product_api_v1_products__product_id__get: {
    parameters: {
      path: {
        product_id: number;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["ProductBase"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Get Location */
  get_location_api_v1_locations__location_id__get: {
    parameters: {
      path: {
        location_id: number;
      };
    };
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["LocationBase"];
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Status Endpoint */
  status_endpoint_api_v1_status_get: {
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
    };
  };
  /** Robots Txt */
  robots_txt_robots_txt_get: {
    responses: {
      /** @description Successful Response */
      200: {
        content: {
          "text/plain": string;
        };
      };
    };
  };
}
