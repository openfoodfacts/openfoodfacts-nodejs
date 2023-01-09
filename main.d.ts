declare namespace APIResponse {
  export interface Brands {
    count: number;
    tags?: TagsBrands[] | null;
  }
  export interface TagsBrands {
    id: string;
    known: number;
    name: string;
    products: number;
    url: string;
  }
  export interface Brands {
    count: number;
    tags?: TagsBrands[] | null;
  }
  export interface TagsBrands {
    id: string;
    known: number;
    name: string;
    products: number;
    url: string;
  }

  export interface Products {
    code: string;
    product: Product;
    status: number;
    status_verbose: string;
  }
  export interface Product {
    _id: string;
    _keywords?: string[] | null;
    added_countries_tags?: null[] | null;
    additives_debug_tags?: null[] | null;
    additives_n: number;
    additives_old_n: number;
    additives_old_tags?: null[] | null;
    additives_original_tags?: null[] | null;
    additives_prev_original_tags?: null[] | null;
    additives_tags?: null[] | null;
    allergens: string;
    allergens_debug_tags?: null[] | null;
    allergens_from_ingredients: string;
    allergens_from_user: string;
    allergens_hierarchy?: null[] | null;
    allergens_lc: string;
    allergens_tags?: null[] | null;
    amino_acids_prev_tags?: null[] | null;
    amino_acids_tags?: null[] | null;
    brands: string;
    brands_debug_tags?: null[] | null;
    brands_tags?: string[] | null;
    categories: string;
    categories_hierarchy?: string[] | null;
    categories_lc: string;
    categories_old: string;
    categories_properties: CategoriesProperties;
    categories_properties_tags?: string[] | null;
    categories_tags?: string[] | null;
    category_properties: ThreatenedSpeciesOrCategoryProperties;
    checkers_tags?: null[] | null;
    ciqual_food_name_tags?: string[] | null;
    cities_tags?: null[] | null;
    code: string;
    codes_tags?: string[] | null;
    compared_to_category: string;
    complete: number;
    completeness: number;
    correctors_tags?: string[] | null;
    countries: string;
    countries_debug_tags?: null[] | null;
    countries_hierarchy?: string[] | null;
    countries_lc: string;
    countries_tags?: string[] | null;
    created_t: number;
    creator: string;
    data_quality_bugs_tags?: null[] | null;
    data_quality_errors_tags?: null[] | null;
    data_quality_info_tags?: string[] | null;
    data_quality_tags?: string[] | null;
    data_quality_warnings_tags?: string[] | null;
    data_sources: string;
    data_sources_tags?: string[] | null;
    debug_param_sorted_langs?: string[] | null;
    ecoscore_data: EcoscoreData;
    ecoscore_grade: string;
    ecoscore_score: number;
    ecoscore_tags?: string[] | null;
    editors?: string[] | null;
    editors_tags?: string[] | null;
    emb_codes: string;
    emb_codes_20141016: string;
    emb_codes_debug_tags?: null[] | null;
    emb_codes_orig: string;
    emb_codes_tags?: null[] | null;
    entry_dates_tags?: string[] | null;
    expiration_date: string;
    expiration_date_debug_tags?: null[] | null;
    "fruits-vegetables-nuts_100g_estimate": number;
    generic_name: string;
    generic_name_fr: string;
    generic_name_fr_debug_tags?: null[] | null;
    id: string;
    image_front_small_url: string;
    image_front_thumb_url: string;
    image_front_url: string;
    image_ingredients_small_url: string;
    image_ingredients_thumb_url: string;
    image_ingredients_url: string;
    image_nutrition_small_url: string;
    image_nutrition_thumb_url: string;
    image_nutrition_url: string;
    image_small_url: string;
    image_thumb_url: string;
    image_url: string;
    images: Images;
    informers_tags?: string[] | null;
    ingredients?: IngredientsEntity[] | null;
    ingredients_analysis_tags?: string[] | null;
    ingredients_debug?: (string | null)[] | null;
    ingredients_from_or_that_may_be_from_palm_oil_n: number;
    ingredients_from_palm_oil_n: number;
    ingredients_from_palm_oil_tags?: null[] | null;
    ingredients_hierarchy?: string[] | null;
    ingredients_ids_debug?: string[] | null;
    ingredients_n: number;
    ingredients_n_tags?: string[] | null;
    ingredients_original_tags?: string[] | null;
    ingredients_percent_analysis: number;
    ingredients_tags?: string[] | null;
    ingredients_text: string;
    ingredients_text_debug: string;
    ingredients_text_fr: string;
    ingredients_text_fr_debug_tags?: null[] | null;
    ingredients_text_with_allergens: string;
    ingredients_text_with_allergens_fr: string;
    ingredients_that_may_be_from_palm_oil_n: number;
    ingredients_that_may_be_from_palm_oil_tags?: null[] | null;
    ingredients_with_specified_percent_n: number;
    ingredients_with_specified_percent_sum: number;
    ingredients_with_unspecified_percent_n: number;
    ingredients_with_unspecified_percent_sum: number;
    interface_version_created: string;
    interface_version_modified: string;
    known_ingredients_n: number;
    labels: string;
    labels_hierarchy?: string[] | null;
    labels_lc: string;
    labels_old: string;
    labels_tags?: string[] | null;
    lang: string;
    lang_debug_tags?: null[] | null;
    languages: Languages;
    languages_codes: LanguagesCodes;
    languages_hierarchy?: string[] | null;
    languages_tags?: string[] | null;
    last_edit_dates_tags?: string[] | null;
    last_editor: string;
    last_image_dates_tags?: string[] | null;
    last_image_t: number;
    last_modified_by: string;
    last_modified_t: number;
    lc: string;
    link: string;
    link_debug_tags?: null[] | null;
    main_countries_tags?: null[] | null;
    manufacturing_places: string;
    manufacturing_places_debug_tags?: null[] | null;
    manufacturing_places_tags?: string[] | null;
    max_imgid: string;
    minerals_prev_tags?: null[] | null;
    minerals_tags?: null[] | null;
    misc_tags?: string[] | null;
    new_additives_n: number;
    no_nutrition_data: string;
    nova_group: number;
    nova_group_debug: string;
    nova_groups: string;
    nova_groups_tags?: string[] | null;
    nucleotides_prev_tags?: null[] | null;
    nucleotides_tags?: null[] | null;
    nutrient_levels: NutrientLevels;
    nutrient_levels_tags?: string[] | null;
    nutriments: Nutriments;
    nutrition_data: string;
    nutrition_data_per: string;
    nutrition_data_prepared: string;
    nutrition_data_prepared_per: string;
    nutrition_data_prepared_per_debug_tags?: null[] | null;
    nutrition_grades_tags?: string[] | null;
    nutrition_score_beverage: number;
    nutrition_score_debug: string;
    origins: string;
    origins_hierarchy?: null[] | null;
    origins_lc: string;
    origins_old: string;
    origins_tags?: null[] | null;
    other_nutritional_substances_tags?: null[] | null;
    packaging: string;
    packaging_debug_tags?: null[] | null;
    packaging_tags?: string[] | null;
    packagings?: PackagingsEntity[] | null;
    photographers_tags?: string[] | null;
    pnns_groups_1: string;
    pnns_groups_1_tags?: string[] | null;
    pnns_groups_2: string;
    pnns_groups_2_tags?: string[] | null;
    popularity_key: number;
    popularity_tags?: string[] | null;
    product_name: string;
    product_name_fr: string;
    product_name_fr_debug_tags?: null[] | null;
    product_quantity: string;
    purchase_places: string;
    purchase_places_debug_tags?: null[] | null;
    purchase_places_tags?: string[] | null;
    quantity: string;
    quantity_debug_tags?: null[] | null;
    removed_countries_tags?: null[] | null;
    rev: number;
    scans_n: number;
    selected_images: SelectedImages;
    serving_size_debug_tags?: null[] | null;
    sortkey: number;
    states: string;
    states_hierarchy?: string[] | null;
    states_tags?: string[] | null;
    stores: string;
    stores_debug_tags?: null[] | null;
    stores_tags?: null[] | null;
    traces: string;
    traces_debug_tags?: null[] | null;
    traces_from_ingredients: string;
    traces_from_user: string;
    traces_hierarchy?: null[] | null;
    traces_lc: string;
    traces_tags?: null[] | null;
    unique_scans_n: number;
    unknown_ingredients_n: number;
    unknown_nutrients_tags?: null[] | null;
    update_key: string;
    vitamins_prev_tags?: null[] | null;
    vitamins_tags?: null[] | null;
  }
  export interface CategoriesProperties {
    "agribalyse_food_code:en": string;
    "agribalyse_proxy_food_code:en": string;
  }
  export interface ThreatenedSpeciesOrCategoryProperties {}
  export interface EcoscoreData {
    adjustments: Adjustments;
    agribalyse: Agribalyse;
    grade: string;
    grades: Grades;
    missing: Missing;
    missing_data_warning: number;
    score: number;
    scores: TransportationScoresOrTransportationValuesOrValuesOrScores;
    status: string;
  }
  export interface Adjustments {
    origins_of_ingredients: OriginsOfIngredients;
    packaging: Packaging;
    production_system: ProductionSystem;
    threatened_species: ThreatenedSpeciesOrCategoryProperties;
  }
  export interface OriginsOfIngredients {
    aggregated_origins?: AggregatedOriginsEntity[] | null;
    epi_score: number;
    epi_value: number;
    origins_from_origins_field?: string[] | null;
    transportation_scores: TransportationScoresOrTransportationValuesOrValuesOrScores;
    transportation_values: TransportationScoresOrTransportationValuesOrValuesOrScores;
    values: TransportationScoresOrTransportationValuesOrValuesOrScores;
    warning: string;
  }
  export interface AggregatedOriginsEntity {
    origin: string;
    percent: number;
  }
  export interface TransportationScoresOrTransportationValuesOrValuesOrScores {
    ad: number;
    al: number;
    at: number;
    ax: number;
    ba: number;
    be: number;
    bg: number;
    ch: number;
    cy: number;
    cz: number;
    de: number;
    dk: number;
    dz: number;
    ee: number;
    eg: number;
    es: number;
    fi: number;
    fo: number;
    fr: number;
    gg: number;
    gi: number;
    gr: number;
    hr: number;
    hu: number;
    ie: number;
    il: number;
    im: number;
    is: number;
    it: number;
    je: number;
    lb: number;
    li: number;
    lt: number;
    lu: number;
    lv: number;
    ly: number;
    ma: number;
    mc: number;
    md: number;
    me: number;
    mk: number;
    mt: number;
    nl: number;
    no: number;
    pl: number;
    ps: number;
    pt: number;
    ro: number;
    rs: number;
    se: number;
    si: number;
    sj: number;
    sk: number;
    sm: number;
    sy: number;
    tn: number;
    tr: number;
    ua: number;
    uk: number;
    us: number;
    va: number;
    xk: number;
  }
  export interface Packaging {
    non_recyclable_and_non_biodegradable_materials: number;
    packagings?: PackagingsEntity1[] | null;
    score: number;
    value: number;
  }
  export interface PackagingsEntity1 {
    ecoscore_material_score: string;
    ecoscore_shape_ratio: string;
    material: string;
    non_recyclable_and_non_biodegradable: string;
    shape: string;
  }
  export interface ProductionSystem {
    labels?: null[] | null;
    value: number;
    warning: string;
  }
  export interface Agribalyse {
    agribalyse_food_code: string;
    co2_agriculture: string;
    co2_consumption: string;
    co2_distribution: string;
    co2_packaging: string;
    co2_processing: string;
    co2_total: string;
    co2_transportation: string;
    code: string;
    dqr: string;
    ef_agriculture: string;
    ef_consumption: string;
    ef_distribution: string;
    ef_packaging: string;
    ef_processing: string;
    ef_total: string;
    ef_transportation: string;
    is_beverage: number;
    name_en: string;
    name_fr: string;
    score: number;
  }
  export interface Grades {
    ad: string;
    al: string;
    at: string;
    ax: string;
    ba: string;
    be: string;
    bg: string;
    ch: string;
    cy: string;
    cz: string;
    de: string;
    dk: string;
    dz: string;
    ee: string;
    eg: string;
    es: string;
    fi: string;
    fo: string;
    fr: string;
    gg: string;
    gi: string;
    gr: string;
    hr: string;
    hu: string;
    ie: string;
    il: string;
    im: string;
    is: string;
    it: string;
    je: string;
    lb: string;
    li: string;
    lt: string;
    lu: string;
    lv: string;
    ly: string;
    ma: string;
    mc: string;
    md: string;
    me: string;
    mk: string;
    mt: string;
    nl: string;
    no: string;
    pl: string;
    ps: string;
    pt: string;
    ro: string;
    rs: string;
    se: string;
    si: string;
    sj: string;
    sk: string;
    sm: string;
    sy: string;
    tn: string;
    tr: string;
    ua: string;
    uk: string;
    us: string;
    va: string;
    xk: string;
  }
  export interface Missing {
    labels: number;
    origins: number;
  }
  export interface Images {
    1: ImageDetail;
    2: ImageDetail;
    3: ImageDetail;
    4: ImageDetail;
    5: ImageDetail;
    6: ImageDetail;
    7: ImageDetail;
    8: ImageDetail;
    9: ImageDetail;
    10: ImageDetail;
    11: ImageDetail;
    12: ImageDetail;
    13: ImageDetail;
    14: ImageDetail;
    15: ImageDetail;
    16: ImageDetail;
    17: ImageDetail;
    18: ImageDetail;
    19: ImageDetail;
    20: ImageDetail;
    21: ImageDetail;
    22: ImageDetail;
    23: ImageDetail;
    24: ImageDetail;
    35: ImageDetail;
    36: ImageDetail;
    37: ImageDetail;
    38: ImageDetail;
    39: ImageDetail;
    40: ImageDetail;
    41: ImageDetail;
    42: ImageDetail;
    front: FrontOrIngredientsOrNutrition;
    front_fr: FrontFrOrNutritionFr;
    ingredients: FrontOrIngredientsOrNutrition;
    ingredients_fr: IngredientsFr;
    nutrition: FrontOrIngredientsOrNutrition;
    nutrition_fr: FrontFrOrNutritionFr;
  }
  export interface ImageDetail {
    sizes: Sizes;
    uploaded_t: number;
    uploader: string;
  }
  export interface Sizes {
    100: Dimenctions;
    400: Dimenctions;
    full: Dimenctions;
  }
  export interface Dimenctions {
    h: number;
    w: number;
  }
  export interface FrontOrIngredientsOrNutrition {
    geometry: string;
    imgid: string;
    normalize?: null;
    rev: string;
    sizes: Sizes1;
    white_magic?: null;
  }
  export interface Sizes1 {
    100: Dimenctions;
    200: Dimenctions;
    400: Dimenctions;
    full: Dimenctions;
  }
  export interface FrontFrOrNutritionFr {
    angle: number;
    coordinates_image_size: string;
    geometry: string;
    imgid: string;
    normalize?: null;
    rev: string;
    sizes: Sizes1;
    white_magic?: null;
    x1: string;
    x2: string;
    y1: string;
    y2: string;
  }
  export interface IngredientsFr {
    angle?: null;
    geometry: string;
    imgid: string;
    normalize?: null;
    ocr: number;
    orientation: string;
    rev: string;
    sizes: Sizes1;
    white_magic?: null;
    x1?: null;
    x2?: null;
    y1?: null;
    y2?: null;
  }
  export interface IngredientsEntity {
    id: string;
    percent_estimate: number;
    percent_max: number | string;
    percent_min: number | string;
    rank?: number | null;
    text: string;
    vegan: string;
    vegetarian: string;
    has_sub_ingredients?: string | null;
    percent?: string | null;
  }
  export interface Languages {
    "en:french": number;
  }
  export interface LanguagesCodes {
    fr: number;
  }
  export interface NutrientLevels {
    fat: string;
    salt: string;
    "saturated-fat": string;
    sugars: string;
  }
  export interface Nutriments {
    carbohydrates: number;
    carbohydrates_100g: number;
    carbohydrates_unit: string;
    carbohydrates_value: number;
    cocoa: number;
    cocoa_100g: number;
    cocoa_label: string;
    cocoa_serving: number;
    cocoa_unit: string;
    cocoa_value: number;
    energy: number;
    "energy-kcal": number;
    "energy-kcal_100g": number;
    "energy-kcal_unit": string;
    "energy-kcal_value": number;
    energy_100g: number;
    energy_unit: string;
    energy_value: number;
    fat: number;
    fat_100g: number;
    fat_unit: string;
    fat_value: number;
    fiber: number;
    fiber_100g: number;
    fiber_unit: string;
    fiber_value: number;
    "fruits-vegetables-nuts-estimate-from-ingredients_100g": number;
    magnesium: number;
    magnesium_100g: number;
    magnesium_label: string;
    magnesium_unit: string;
    magnesium_value: number;
    "nova-group": number;
    "nova-group_100g": number;
    "nova-group_serving": number;
    phosphorus: number;
    phosphorus_100g: number;
    phosphorus_label: string;
    phosphorus_unit: string;
    phosphorus_value: number;
    proteins: number;
    proteins_100g: number;
    proteins_unit: string;
    proteins_value: number;
    salt: number;
    salt_100g: number;
    salt_unit: string;
    salt_value: number;
    "saturated-fat": number;
    "saturated-fat_100g": number;
    "saturated-fat_unit": string;
    "saturated-fat_value": number;
    sodium: number;
    sodium_100g: number;
    sodium_unit: string;
    sodium_value: number;
    sugars: number;
    sugars_100g: number;
    sugars_unit: string;
    sugars_value: number;
  }
  export interface PackagingsEntity {
    material: string;
    shape: string;
  }
  export interface SelectedImages {
    front: FrontOrIngredientsOrNutrition1;
    ingredients: FrontOrIngredientsOrNutrition1;
    nutrition: FrontOrIngredientsOrNutrition1;
  }
  export interface FrontOrIngredientsOrNutrition1 {
    display: DisplayOrSmallOrThumb;
    small: DisplayOrSmallOrThumb;
    thumb: DisplayOrSmallOrThumb;
  }
  export interface DisplayOrSmallOrThumb {
    fr: string;
  }

  export interface Brands {
    count: number;
    tags?: TagsBrands[] | null;
  }
  export interface TagsBrands {
    id: string;
    known: number;
    name: string;
    products: number;
    url: string;
  }

  export interface Products {
    code: string;
    product: Product;
    status: number;
    status_verbose: string;
  }
  export interface Product {
    _id: string;
    _keywords?: string[] | null;
    added_countries_tags?: null[] | null;
    additives_debug_tags?: null[] | null;
    additives_n: number;
    additives_old_n: number;
    additives_old_tags?: null[] | null;
    additives_original_tags?: null[] | null;
    additives_prev_original_tags?: null[] | null;
    additives_tags?: null[] | null;
    allergens: string;
    allergens_debug_tags?: null[] | null;
    allergens_from_ingredients: string;
    allergens_from_user: string;
    allergens_hierarchy?: null[] | null;
    allergens_lc: string;
    allergens_tags?: null[] | null;
    amino_acids_prev_tags?: null[] | null;
    amino_acids_tags?: null[] | null;
    brands: string;
    brands_debug_tags?: null[] | null;
    brands_tags?: string[] | null;
    categories: string;
    categories_hierarchy?: string[] | null;
    categories_lc: string;
    categories_old: string;
    categories_properties: CategoriesProperties;
    categories_properties_tags?: string[] | null;
    categories_tags?: string[] | null;
    category_properties: ThreatenedSpeciesOrCategoryProperties;
    checkers_tags?: null[] | null;
    ciqual_food_name_tags?: string[] | null;
    cities_tags?: null[] | null;
    code: string;
    codes_tags?: string[] | null;
    compared_to_category: string;
    complete: number;
    completeness: number;
    correctors_tags?: string[] | null;
    countries: string;
    countries_debug_tags?: null[] | null;
    countries_hierarchy?: string[] | null;
    countries_lc: string;
    countries_tags?: string[] | null;
    created_t: number;
    creator: string;
    data_quality_bugs_tags?: null[] | null;
    data_quality_errors_tags?: null[] | null;
    data_quality_info_tags?: string[] | null;
    data_quality_tags?: string[] | null;
    data_quality_warnings_tags?: string[] | null;
    data_sources: string;
    data_sources_tags?: string[] | null;
    debug_param_sorted_langs?: string[] | null;
    ecoscore_data: EcoscoreData;
    ecoscore_grade: string;
    ecoscore_score: number;
    ecoscore_tags?: string[] | null;
    editors?: string[] | null;
    editors_tags?: string[] | null;
    emb_codes: string;
    emb_codes_20141016: string;
    emb_codes_debug_tags?: null[] | null;
    emb_codes_orig: string;
    emb_codes_tags?: null[] | null;
    entry_dates_tags?: string[] | null;
    expiration_date: string;
    expiration_date_debug_tags?: null[] | null;
    "fruits-vegetables-nuts_100g_estimate": number;
    generic_name: string;
    generic_name_fr: string;
    generic_name_fr_debug_tags?: null[] | null;
    id: string;
    image_front_small_url: string;
    image_front_thumb_url: string;
    image_front_url: string;
    image_ingredients_small_url: string;
    image_ingredients_thumb_url: string;
    image_ingredients_url: string;
    image_nutrition_small_url: string;
    image_nutrition_thumb_url: string;
    image_nutrition_url: string;
    image_small_url: string;
    image_thumb_url: string;
    image_url: string;
    images: Images;
    informers_tags?: string[] | null;
    ingredients?: IngredientsEntity[] | null;
    ingredients_analysis_tags?: string[] | null;
    ingredients_debug?: (string | null)[] | null;
    ingredients_from_or_that_may_be_from_palm_oil_n: number;
    ingredients_from_palm_oil_n: number;
    ingredients_from_palm_oil_tags?: null[] | null;
    ingredients_hierarchy?: string[] | null;
    ingredients_ids_debug?: string[] | null;
    ingredients_n: number;
    ingredients_n_tags?: string[] | null;
    ingredients_original_tags?: string[] | null;
    ingredients_percent_analysis: number;
    ingredients_tags?: string[] | null;
    ingredients_text: string;
    ingredients_text_debug: string;
    ingredients_text_fr: string;
    ingredients_text_fr_debug_tags?: null[] | null;
    ingredients_text_with_allergens: string;
    ingredients_text_with_allergens_fr: string;
    ingredients_that_may_be_from_palm_oil_n: number;
    ingredients_that_may_be_from_palm_oil_tags?: null[] | null;
    ingredients_with_specified_percent_n: number;
    ingredients_with_specified_percent_sum: number;
    ingredients_with_unspecified_percent_n: number;
    ingredients_with_unspecified_percent_sum: number;
    interface_version_created: string;
    interface_version_modified: string;
    known_ingredients_n: number;
    labels: string;
    labels_hierarchy?: string[] | null;
    labels_lc: string;
    labels_old: string;
    labels_tags?: string[] | null;
    lang: string;
    lang_debug_tags?: null[] | null;
    languages: Languages;
    languages_codes: LanguagesCodes;
    languages_hierarchy?: string[] | null;
    languages_tags?: string[] | null;
    last_edit_dates_tags?: string[] | null;
    last_editor: string;
    last_image_dates_tags?: string[] | null;
    last_image_t: number;
    last_modified_by: string;
    last_modified_t: number;
    lc: string;
    link: string;
    link_debug_tags?: null[] | null;
    main_countries_tags?: null[] | null;
    manufacturing_places: string;
    manufacturing_places_debug_tags?: null[] | null;
    manufacturing_places_tags?: string[] | null;
    max_imgid: string;
    minerals_prev_tags?: null[] | null;
    minerals_tags?: null[] | null;
    misc_tags?: string[] | null;
    new_additives_n: number;
    no_nutrition_data: string;
    nova_group: number;
    nova_group_debug: string;
    nova_groups: string;
    nova_groups_tags?: string[] | null;
    nucleotides_prev_tags?: null[] | null;
    nucleotides_tags?: null[] | null;
    nutrient_levels: NutrientLevels;
    nutrient_levels_tags?: string[] | null;
    nutriments: Nutriments;
    nutrition_data: string;
    nutrition_data_per: string;
    nutrition_data_prepared: string;
    nutrition_data_prepared_per: string;
    nutrition_data_prepared_per_debug_tags?: null[] | null;
    nutrition_grades_tags?: string[] | null;
    nutrition_score_beverage: number;
    nutrition_score_debug: string;
    origins: string;
    origins_hierarchy?: null[] | null;
    origins_lc: string;
    origins_old: string;
    origins_tags?: null[] | null;
    other_nutritional_substances_tags?: null[] | null;
    packaging: string;
    packaging_debug_tags?: null[] | null;
    packaging_tags?: string[] | null;
    packagings?: PackagingsEntity[] | null;
    photographers_tags?: string[] | null;
    pnns_groups_1: string;
    pnns_groups_1_tags?: string[] | null;
    pnns_groups_2: string;
    pnns_groups_2_tags?: string[] | null;
    popularity_key: number;
    popularity_tags?: string[] | null;
    product_name: string;
    product_name_fr: string;
    product_name_fr_debug_tags?: null[] | null;
    product_quantity: string;
    purchase_places: string;
    purchase_places_debug_tags?: null[] | null;
    purchase_places_tags?: string[] | null;
    quantity: string;
    quantity_debug_tags?: null[] | null;
    removed_countries_tags?: null[] | null;
    rev: number;
    scans_n: number;
    selected_images: SelectedImages;
    serving_size_debug_tags?: null[] | null;
    sortkey: number;
    states: string;
    states_hierarchy?: string[] | null;
    states_tags?: string[] | null;
    stores: string;
    stores_debug_tags?: null[] | null;
    stores_tags?: null[] | null;
    traces: string;
    traces_debug_tags?: null[] | null;
    traces_from_ingredients: string;
    traces_from_user: string;
    traces_hierarchy?: null[] | null;
    traces_lc: string;
    traces_tags?: null[] | null;
    unique_scans_n: number;
    unknown_ingredients_n: number;
    unknown_nutrients_tags?: null[] | null;
    update_key: string;
    vitamins_prev_tags?: null[] | null;
    vitamins_tags?: null[] | null;
  }
  export interface CategoriesProperties {
    "agribalyse_food_code:en": string;
    "agribalyse_proxy_food_code:en": string;
  }
  export interface ThreatenedSpeciesOrCategoryProperties {}
  export interface EcoscoreData {
    adjustments: Adjustments;
    agribalyse: Agribalyse;
    grade: string;
    grades: Grades;
    missing: Missing;
    missing_data_warning: number;
    score: number;
    scores: TransportationScoresOrTransportationValuesOrValuesOrScores;
    status: string;
  }
  export interface Adjustments {
    origins_of_ingredients: OriginsOfIngredients;
    packaging: Packaging;
    production_system: ProductionSystem;
    threatened_species: ThreatenedSpeciesOrCategoryProperties;
  }
  export interface OriginsOfIngredients {
    aggregated_origins?: AggregatedOriginsEntity[] | null;
    epi_score: number;
    epi_value: number;
    origins_from_origins_field?: string[] | null;
    transportation_scores: TransportationScoresOrTransportationValuesOrValuesOrScores;
    transportation_values: TransportationScoresOrTransportationValuesOrValuesOrScores;
    values: TransportationScoresOrTransportationValuesOrValuesOrScores;
    warning: string;
  }
  export interface AggregatedOriginsEntity {
    origin: string;
    percent: number;
  }
  export interface TransportationScoresOrTransportationValuesOrValuesOrScores {
    ad: number;
    al: number;
    at: number;
    ax: number;
    ba: number;
    be: number;
    bg: number;
    ch: number;
    cy: number;
    cz: number;
    de: number;
    dk: number;
    dz: number;
    ee: number;
    eg: number;
    es: number;
    fi: number;
    fo: number;
    fr: number;
    gg: number;
    gi: number;
    gr: number;
    hr: number;
    hu: number;
    ie: number;
    il: number;
    im: number;
    is: number;
    it: number;
    je: number;
    lb: number;
    li: number;
    lt: number;
    lu: number;
    lv: number;
    ly: number;
    ma: number;
    mc: number;
    md: number;
    me: number;
    mk: number;
    mt: number;
    nl: number;
    no: number;
    pl: number;
    ps: number;
    pt: number;
    ro: number;
    rs: number;
    se: number;
    si: number;
    sj: number;
    sk: number;
    sm: number;
    sy: number;
    tn: number;
    tr: number;
    ua: number;
    uk: number;
    us: number;
    va: number;
    xk: number;
  }
  export interface Packaging {
    non_recyclable_and_non_biodegradable_materials: number;
    packagings?: PackagingsEntity1[] | null;
    score: number;
    value: number;
  }
  export interface PackagingsEntity1 {
    ecoscore_material_score: string;
    ecoscore_shape_ratio: string;
    material: string;
    non_recyclable_and_non_biodegradable: string;
    shape: string;
  }
  export interface ProductionSystem {
    labels?: null[] | null;
    value: number;
    warning: string;
  }
  export interface Agribalyse {
    agribalyse_food_code: string;
    co2_agriculture: string;
    co2_consumption: string;
    co2_distribution: string;
    co2_packaging: string;
    co2_processing: string;
    co2_total: string;
    co2_transportation: string;
    code: string;
    dqr: string;
    ef_agriculture: string;
    ef_consumption: string;
    ef_distribution: string;
    ef_packaging: string;
    ef_processing: string;
    ef_total: string;
    ef_transportation: string;
    is_beverage: number;
    name_en: string;
    name_fr: string;
    score: number;
  }
  export interface Grades {
    ad: string;
    al: string;
    at: string;
    ax: string;
    ba: string;
    be: string;
    bg: string;
    ch: string;
    cy: string;
    cz: string;
    de: string;
    dk: string;
    dz: string;
    ee: string;
    eg: string;
    es: string;
    fi: string;
    fo: string;
    fr: string;
    gg: string;
    gi: string;
    gr: string;
    hr: string;
    hu: string;
    ie: string;
    il: string;
    im: string;
    is: string;
    it: string;
    je: string;
    lb: string;
    li: string;
    lt: string;
    lu: string;
    lv: string;
    ly: string;
    ma: string;
    mc: string;
    md: string;
    me: string;
    mk: string;
    mt: string;
    nl: string;
    no: string;
    pl: string;
    ps: string;
    pt: string;
    ro: string;
    rs: string;
    se: string;
    si: string;
    sj: string;
    sk: string;
    sm: string;
    sy: string;
    tn: string;
    tr: string;
    ua: string;
    uk: string;
    us: string;
    va: string;
    xk: string;
  }
  export interface Missing {
    labels: number;
    origins: number;
  }
  export interface Images {
    1: ImageDetail;
    2: ImageDetail;
    3: ImageDetail;
    4: ImageDetail;
    5: ImageDetail;
    6: ImageDetail;
    7: ImageDetail;
    8: ImageDetail;
    9: ImageDetail;
    10: ImageDetail;
    11: ImageDetail;
    12: ImageDetail;
    13: ImageDetail;
    14: ImageDetail;
    15: ImageDetail;
    16: ImageDetail;
    17: ImageDetail;
    18: ImageDetail;
    19: ImageDetail;
    20: ImageDetail;
    21: ImageDetail;
    22: ImageDetail;
    23: ImageDetail;
    24: ImageDetail;
    35: ImageDetail;
    36: ImageDetail;
    37: ImageDetail;
    38: ImageDetail;
    39: ImageDetail;
    40: ImageDetail;
    41: ImageDetail;
    42: ImageDetail;
    front: FrontOrIngredientsOrNutrition;
    front_fr: FrontFrOrNutritionFr;
    ingredients: FrontOrIngredientsOrNutrition;
    ingredients_fr: IngredientsFr;
    nutrition: FrontOrIngredientsOrNutrition;
    nutrition_fr: FrontFrOrNutritionFr;
  }
  export interface ImageDetail {
    sizes: Sizes;
    uploaded_t: number;
    uploader: string;
  }
  export interface Sizes {
    100: Dimenctions;
    400: Dimenctions;
    full: Dimenctions;
  }
  export interface Dimenctions {
    h: number;
    w: number;
  }
  export interface FrontOrIngredientsOrNutrition {
    geometry: string;
    imgid: string;
    normalize?: null;
    rev: string;
    sizes: Sizes1;
    white_magic?: null;
  }
  export interface Sizes1 {
    100: Dimenctions;
    200: Dimenctions;
    400: Dimenctions;
    full: Dimenctions;
  }
  export interface FrontFrOrNutritionFr {
    angle: number;
    coordinates_image_size: string;
    geometry: string;
    imgid: string;
    normalize?: null;
    rev: string;
    sizes: Sizes1;
    white_magic?: null;
    x1: string;
    x2: string;
    y1: string;
    y2: string;
  }
  export interface IngredientsFr {
    angle?: null;
    geometry: string;
    imgid: string;
    normalize?: null;
    ocr: number;
    orientation: string;
    rev: string;
    sizes: Sizes1;
    white_magic?: null;
    x1?: null;
    x2?: null;
    y1?: null;
    y2?: null;
  }
  export interface IngredientsEntity {
    id: string;
    percent_estimate: number;
    percent_max: number | string;
    percent_min: number | string;
    rank?: number | null;
    text: string;
    vegan: string;
    vegetarian: string;
    has_sub_ingredients?: string | null;
    percent?: string | null;
  }
  export interface Languages {
    "en:french": number;
  }
  export interface LanguagesCodes {
    fr: number;
  }
  export interface NutrientLevels {
    fat: string;
    salt: string;
    "saturated-fat": string;
    sugars: string;
  }
  export interface Nutriments {
    carbohydrates: number;
    carbohydrates_100g: number;
    carbohydrates_unit: string;
    carbohydrates_value: number;
    cocoa: number;
    cocoa_100g: number;
    cocoa_label: string;
    cocoa_serving: number;
    cocoa_unit: string;
    cocoa_value: number;
    energy: number;
    "energy-kcal": number;
    "energy-kcal_100g": number;
    "energy-kcal_unit": string;
    "energy-kcal_value": number;
    energy_100g: number;
    energy_unit: string;
    energy_value: number;
    fat: number;
    fat_100g: number;
    fat_unit: string;
    fat_value: number;
    fiber: number;
    fiber_100g: number;
    fiber_unit: string;
    fiber_value: number;
    "fruits-vegetables-nuts-estimate-from-ingredients_100g": number;
    magnesium: number;
    magnesium_100g: number;
    magnesium_label: string;
    magnesium_unit: string;
    magnesium_value: number;
    "nova-group": number;
    "nova-group_100g": number;
    "nova-group_serving": number;
    phosphorus: number;
    phosphorus_100g: number;
    phosphorus_label: string;
    phosphorus_unit: string;
    phosphorus_value: number;
    proteins: number;
    proteins_100g: number;
    proteins_unit: string;
    proteins_value: number;
    salt: number;
    salt_100g: number;
    salt_unit: string;
    salt_value: number;
    "saturated-fat": number;
    "saturated-fat_100g": number;
    "saturated-fat_unit": string;
    "saturated-fat_value": number;
    sodium: number;
    sodium_100g: number;
    sodium_unit: string;
    sodium_value: number;
    sugars: number;
    sugars_100g: number;
    sugars_unit: string;
    sugars_value: number;
  }
  export interface PackagingsEntity {
    material: string;
    shape: string;
  }
  export interface SelectedImages {
    front: FrontOrIngredientsOrNutrition1;
    ingredients: FrontOrIngredientsOrNutrition1;
    nutrition: FrontOrIngredientsOrNutrition1;
  }
  export interface FrontOrIngredientsOrNutrition1 {
    display: DisplayOrSmallOrThumb;
    small: DisplayOrSmallOrThumb;
    thumb: DisplayOrSmallOrThumb;
  }
  export interface DisplayOrSmallOrThumb {
    fr: string;
  }

  export interface Brand {
    count: number;
    page: number;
    page_count: number;
    page_size: number;
    products?: ProductsEntity[] | null;
    skip: number;
  }
  export interface ProductsEntity {
    _id: string;
    _keywords?: string[] | null;
    added_countries_tags?: null[] | null;
    additives_debug_tags?: null[] | null;
    additives_n: number;
    additives_old_n: number;
    additives_old_tags?: string[] | null;
    additives_original_tags?: string[] | null;
    additives_prev_original_tags?: string[] | null;
    additives_tags?: string[] | null;
    allergens: string;
    allergens_from_ingredients: string;
    allergens_from_user: string;
    allergens_hierarchy?: string[] | null;
    allergens_lc: string;
    allergens_tags?: string[] | null;
    amino_acids_prev_tags?: null[] | null;
    amino_acids_tags?: null[] | null;
    brands: string;
    brands_tags?: string[] | null;
    carbon_footprint_from_known_ingredients_debug: string;
    carbon_footprint_percent_of_known_ingredients: number;
    categories: string;
    categories_hierarchy?: string[] | null;
    categories_lc: string;
    categories_old: string;
    categories_properties: CategoriesProperties;
    categories_properties_tags?: string[] | null;
    categories_tags?: string[] | null;
    category_properties: CategoryProperties;
    checkers_tags?: null[] | null;
    ciqual_food_name_tags?: string[] | null;
    cities_tags?: null[] | null;
    code: string;
    codes_tags?: string[] | null;
    compared_to_category: string;
    complete: number;
    completed_t: number;
    completeness: number;
    correctors_tags?: string[] | null;
    countries: string;
    countries_hierarchy?: string[] | null;
    countries_lc: string;
    countries_tags?: string[] | null;
    created_t: number;
    creator: string;
    data_quality_bugs_tags?: null[] | null;
    data_quality_errors_tags?: null[] | null;
    data_quality_info_tags?: string[] | null;
    data_quality_tags?: string[] | null;
    data_quality_warnings_tags?: string[] | null;
    data_sources: string;
    data_sources_tags?: string[] | null;
    debug_param_sorted_langs?: string[] | null;
    ecoscore_data: EcoscoreData;
    ecoscore_grade: string;
    ecoscore_score: number;
    ecoscore_tags?: string[] | null;
    editors_tags?: string[] | null;
    emb_codes: string;
    emb_codes_orig: string;
    emb_codes_tags?: string[] | null;
    entry_dates_tags?: string[] | null;
    expiration_date: string;
    "fruits-vegetables-nuts_100g_estimate": number;
    generic_name: string;
    generic_name_fr: string;
    id: string;
    image_front_small_url: string;
    image_front_thumb_url: string;
    image_front_url: string;
    image_ingredients_small_url: string;
    image_ingredients_thumb_url: string;
    image_ingredients_url: string;
    image_nutrition_small_url: string;
    image_nutrition_thumb_url: string;
    image_nutrition_url: string;
    image_small_url: string;
    image_thumb_url: string;
    image_url: string;
    images: Images;
    informers_tags?: string[] | null;
    ingredients?: IngredientsEntity[] | null;
    ingredients_analysis_tags?: string[] | null;
    ingredients_debug?: (string | null)[] | null;
    ingredients_from_or_that_may_be_from_palm_oil_n: number;
    ingredients_from_palm_oil_n: number;
    ingredients_from_palm_oil_tags?: null[] | null;
    ingredients_hierarchy?: string[] | null;
    ingredients_ids_debug?: string[] | null;
    ingredients_n: number;
    ingredients_n_tags?: string[] | null;
    ingredients_original_tags?: string[] | null;
    ingredients_percent_analysis: number;
    ingredients_tags?: string[] | null;
    ingredients_text: string;
    ingredients_text_debug: string;
    ingredients_text_fr: string;
    ingredients_text_fr_ocr_1544056589: string;
    ingredients_text_fr_ocr_1544056589_result: string;
    ingredients_text_fr_ocr_1544527335: string;
    ingredients_text_fr_ocr_1544527335_result: string;
    ingredients_text_with_allergens: string;
    ingredients_text_with_allergens_fr: string;
    ingredients_that_may_be_from_palm_oil_n: number;
    ingredients_that_may_be_from_palm_oil_tags?: null[] | null;
    ingredients_with_specified_percent_n: number;
    ingredients_with_specified_percent_sum: number;
    ingredients_with_unspecified_percent_n: number;
    ingredients_with_unspecified_percent_sum: number;
    interface_version_created: string;
    interface_version_modified: string;
    known_ingredients_n: number;
    labels: string;
    labels_hierarchy?: null[] | null;
    labels_lc: string;
    labels_old: string;
    labels_tags?: null[] | null;
    lang: string;
    languages: Languages;
    languages_codes: LanguagesCodes;
    languages_hierarchy?: string[] | null;
    languages_tags?: string[] | null;
    last_edit_dates_tags?: string[] | null;
    last_editor: string;
    last_image_dates_tags?: string[] | null;
    last_image_t: number;
    last_modified_by: string;
    last_modified_t: number;
    lc: string;
    link: string;
    main_countries_tags?: null[] | null;
    manufacturing_places: string;
    manufacturing_places_tags?: null[] | null;
    max_imgid: string;
    minerals_prev_tags?: null[] | null;
    minerals_tags?: null[] | null;
    misc_tags?: string[] | null;
    no_nutrition_data: string;
    nova_group: number;
    nova_group_debug: string;
    nova_group_tags?: string[] | null;
    nova_groups: string;
    nova_groups_tags?: string[] | null;
    nucleotides_prev_tags?: null[] | null;
    nucleotides_tags?: null[] | null;
    nutrient_levels: NutrientLevels;
    nutrient_levels_tags?: string[] | null;
    nutriments: Nutriments;
    nutriscore_data: NutriscoreData;
    nutriscore_grade: string;
    nutriscore_score: number;
    nutriscore_score_opposite: number;
    nutrition_data: string;
    nutrition_data_per: string;
    nutrition_data_prepared: string;
    nutrition_data_prepared_per: string;
    nutrition_grade_fr: string;
    nutrition_grades: string;
    nutrition_grades_tags?: string[] | null;
    nutrition_score_beverage: number;
    nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients: number;
    nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients_value: number;
    obsolete: string;
    obsolete_since_date: string;
    origins: string;
    origins_hierarchy?: null[] | null;
    origins_lc: string;
    origins_old: string;
    origins_tags?: null[] | null;
    other_nutritional_substances_tags?: null[] | null;
    packaging: string;
    packaging_tags?: string[] | null;
    packagings?: PackagingsEntity[] | null;
    photographers_tags?: string[] | null;
    pnns_groups_1: string;
    pnns_groups_1_tags?: string[] | null;
    pnns_groups_2: string;
    pnns_groups_2_tags?: string[] | null;
    popularity_key: number;
    popularity_tags?: string[] | null;
    product_name: string;
    product_name_fr: string;
    product_quantity: string;
    purchase_places: string;
    purchase_places_tags?: string[] | null;
    quantity: string;
    removed_countries_tags?: null[] | null;
    rev: number;
    scans_n: number;
    selected_images: SelectedImages;
    serving_quantity: string;
    serving_size: string;
    sortkey: number;
    states: string;
    states_hierarchy?: string[] | null;
    states_tags?: string[] | null;
    stores: string;
    stores_tags?: string[] | null;
    traces: string;
    traces_from_ingredients: string;
    traces_from_user: string;
    traces_hierarchy?: null[] | null;
    traces_lc: string;
    traces_tags?: null[] | null;
    unique_scans_n: number;
    unknown_ingredients_n: number;
    unknown_nutrients_tags?: null[] | null;
    update_key: string;
    url: string;
    vitamins_prev_tags?: null[] | null;
    vitamins_tags?: null[] | null;
  }
  export interface CategoriesProperties {
    "agribalyse_food_code:en": string;
    "agribalyse_proxy_food_code:en": string;
    "ciqual_food_code:en": string;
  }
  export interface CategoryProperties {
    "ciqual_food_name:en": string;
    "ciqual_food_name:fr": string;
  }
  export interface EcoscoreData {
    adjustments: Adjustments;
    agribalyse: Agribalyse;
    grade: string;
    grades: Grades;
    missing: Missing;
    missing_data_warning: number;
    score: number;
    scores: TransportationScoresOrTransportationValuesOrValuesOrScores;
    status: string;
  }
  export interface Adjustments {
    origins_of_ingredients: OriginsOfIngredients;
    packaging: Packaging;
    production_system: ProductionSystem;
    threatened_species: ThreatenedSpecies;
  }
  export interface OriginsOfIngredients {
    aggregated_origins?: AggregatedOriginsEntity[] | null;
    epi_score: number;
    epi_value: number;
    origins_from_origins_field?: string[] | null;
    transportation_scores: TransportationScoresOrTransportationValuesOrValuesOrScores;
    transportation_values: TransportationScoresOrTransportationValuesOrValuesOrScores;
    values: TransportationScoresOrTransportationValuesOrValuesOrScores;
    warning: string;
  }
  export interface AggregatedOriginsEntity {
    origin: string;
    percent: number;
  }
  export interface TransportationScoresOrTransportationValuesOrValuesOrScores {
    ad: number;
    al: number;
    at: number;
    ax: number;
    ba: number;
    be: number;
    bg: number;
    ch: number;
    cy: number;
    cz: number;
    de: number;
    dk: number;
    dz: number;
    ee: number;
    eg: number;
    es: number;
    fi: number;
    fo: number;
    fr: number;
    gg: number;
    gi: number;
    gr: number;
    hr: number;
    hu: number;
    ie: number;
    il: number;
    im: number;
    is: number;
    it: number;
    je: number;
    lb: number;
    li: number;
    lt: number;
    lu: number;
    lv: number;
    ly: number;
    ma: number;
    mc: number;
    md: number;
    me: number;
    mk: number;
    mt: number;
    nl: number;
    no: number;
    pl: number;
    ps: number;
    pt: number;
    ro: number;
    rs: number;
    se: number;
    si: number;
    sj: number;
    sk: number;
    sm: number;
    sy: number;
    tn: number;
    tr: number;
    ua: number;
    uk: number;
    us: number;
    va: number;
    xk: number;
  }
  export interface Packaging {
    non_recyclable_and_non_biodegradable_materials: number;
    packagings?: PackagingsEntity1[] | null;
    score: number;
    value: number;
    warning: string;
  }
  export interface ProductionSystem {
    labels?: null[] | null;
    value: number;
    warning: string;
  }
  export interface ThreatenedSpecies {}

  export interface Grades {
    ad: string;
    al: string;
    at: string;
    ax: string;
    ba: string;
    be: string;
    bg: string;
    ch: string;
    cy: string;
    cz: string;
    de: string;
    dk: string;
    dz: string;
    ee: string;
    eg: string;
    es: string;
    fi: string;
    fo: string;
    fr: string;
    gg: string;
    gi: string;
    gr: string;
    hr: string;
    hu: string;
    ie: string;
    il: string;
    im: string;
    is: string;
    it: string;
    je: string;
    lb: string;
    li: string;
    lt: string;
    lu: string;
    lv: string;
    ly: string;
    ma: string;
    mc: string;
    md: string;
    me: string;
    mk: string;
    mt: string;
    nl: string;
    no: string;
    pl: string;
    ps: string;
    pt: string;
    ro: string;
    rs: string;
    se: string;
    si: string;
    sj: string;
    sk: string;
    sm: string;
    sy: string;
    tn: string;
    tr: string;
    ua: string;
    uk: string;
    us: string;
    va: string;
    xk: string;
  }
  export interface Missing {
    labels: number;
    origins: number;
    packagings: number;
  }

  export interface FrontFr {
    angle: string;
    geometry: string;
    imgid: string;
    normalize: string;
    rev: string;
    sizes: Sizes1;
    white_magic: string;
    x1: string;
    x2: string;
    y1: string;
    y2: string;
  }
  export interface Sizes1 {
    100: Dimenctions;
    200: Dimenctions;
    400: Dimenctions;
    full: Dimenctions;
  }

  export interface NutritionFr {
    angle: number;
    geometry: string;
    imgid: string;
    normalize?: null;
    ocr: number;
    orientation: string;
    rev: string;
    sizes: Sizes1;
    white_magic?: null;
    x1: string;
    x2: string;
    y1: string;
    y2: string;
  }

  export interface IngredientsEntity1 {
    id: string;
    percent_estimate: number;
    percent_max: number;
    percent_min: number;
    text: string;
    vegan: string;
    vegetarian: string;
  }
  export interface Languages {
    "en:french": number;
  }
  export interface LanguagesCodes {
    fr: number;
  }
  export interface NutrientLevels {
    fat: string;
    salt: string;
    "saturated-fat": string;
    sugars: string;
  }
  export interface NutriscoreData {
    energy: number;
    energy_points: number;
    energy_value: number;
    fiber: number;
    fiber_points: number;
    fiber_value: number;
    fruits_vegetables_nuts_colza_walnut_olive_oils: number;
    fruits_vegetables_nuts_colza_walnut_olive_oils_points: number;
    fruits_vegetables_nuts_colza_walnut_olive_oils_value: number;
    grade: string;
    is_beverage: number;
    is_cheese: number;
    is_fat: number;
    is_water: number;
    negative_points: number;
    positive_points: number;
    proteins: number;
    proteins_points: number;
    proteins_value: number;
    saturated_fat: number;
    saturated_fat_points: number;
    saturated_fat_ratio: number;
    saturated_fat_ratio_points: number;
    saturated_fat_ratio_value: number;
    saturated_fat_value: number;
    score: number;
    sodium: number;
    sodium_points: number;
    sodium_value: number;
    sugars: number;
    sugars_points: number;
    sugars_value: number;
  }
  export interface PackagingsEntity {
    shape: string;
  }

  export interface FrontOrIngredientsOrNutrition {
    display: DisplayOrSmallOrThumb;
    small: DisplayOrSmallOrThumb;
    thumb: DisplayOrSmallOrThumb;
  }
  export interface DisplayOrSmallOrThumb {
    fr: string;
  }
  export interface Entity {
    count: number;
    tags?: TagsEntity[] | null;
  }
  export interface TagsEntity {
    id: string;
    known: number;
    name: string;
    products: number;
    sameAs?: string[] | null;
    url: string;
    image?: string | null;
  }
  export interface Code {
    count: number;
    page: number;
    page_count: number;
    page_size: number;
    products?: Product[] | null;
    skip: number;
  }
}

declare namespace OFF {
  export interface Options {
    country: string;
  }
}

export class OFF {
  constructor(option?: OFF.Options);
  setOption(optionName: string, optionValue: string): OFF;
  country(country?: string): OFF;
  getBrands(): Promise<APIResponse.Brands>;
  getProduct(barcode: string): Promise<APIResponse.Products>;
  getBrand(brandName: string): Promise<APIResponse.Brand>;
  getLanguages(): Promise<APIResponse.Entity>;
  getLabels(): Promise<APIResponse.Entity>;
  getAdditives(): Promise<APIResponse.Entity>;
  getAllergens(): Promise<APIResponse.Entity>;
  getCategories(): Promise<APIResponse.Entity>;
  getCountries(): Promise<APIResponse.Entity>;
  getEntryDates(): Promise<APIResponse.Entity>;
  getIngredients(): Promise<APIResponse.Entity>;
  getPackagings(): Promise<APIResponse.Entity>;
  getPacakgingCodes(): Promise<APIResponse.Entity>;
  getPurchasePlaces(): Promise<APIResponse.Entity>;
  getStates(): Promise<APIResponse.Entity>;
  getStores(): Promise<APIResponse.Entity>;
  getTraces(): Promise<APIResponse.Entity>;
  getProductsByBarcodeBeginning(beginning: string): Promise<APIResponse.Code>;
}
