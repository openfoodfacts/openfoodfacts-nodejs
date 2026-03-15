/**
 * A dictionary of knowledge panels indexed by their identifier.
 */
export type KnowledgePanels = Record<string, KnowledgePanel>;

/**
 * Title section displayed at the top of a knowledge panel.
 */
export type KnowledgePanelTitle = {
  /** Main title of the panel */
  title: string;

  /** Optional subtitle */
  subtitle?: string;

  /** Nutrition grade evaluation */
  grade: "a" | "b" | "c" | "d" | "e" | "unknown";

  /** URL of the panel icon */
  icon_url: string;

  /** Icon color depending on evaluation */
  icon_color_from_evaluation: string;

  /** Icon size description */
  icon_size: string;

  /** Panel type */
  type: string;
};

/**
 * Available panel size options.
 */
export type KnowledgePanelSize = "small";

/**
 * Represents a single knowledge panel displayed on a product page.
 */
export type KnowledgePanel = {
  type: "card" | "inline";
  expanded: boolean;
  expand_for: string;

  /** Panel title section */
  title_element: KnowledgePanelTitle;

  /** Elements composing the panel */
  elements: KnowledgeElement[];

  /** Topics associated with the panel */
  topics: string[];

  /** Panel hierarchy level */
  level: string;

  /** Optional panel size */
  size?: KnowledgePanelSize;
};

/**
 * Union type representing all possible knowledge panel elements.
 */
export type KnowledgeElement =
  | KnowledgeTextElement
  | KnowledgeImageElement
  | KnowledgePanelGroupElement
  | KnowledgePanelElement
  | KnowledgeTableElement
  | KnowledgeActionElement
  | KnowledgeMapElement;

/**
 * Base structure shared by all knowledge elements.
 */
export interface KnowledgeElementBase {
  element_type: string;
}

/**
 * Text element inside a knowledge panel.
 */
export type KnowledgeTextElement = KnowledgeElementBase & {
  element_type: "text";
  text_element: {
    type: "summary" | "warning" | "notes";
    html: string;

    language: string;
    lc: string;

    edit_field_id: string;
    edit_field_type: string;
    edit_field_value: string;

    source_url: string;
    source_text: string;
    source_lc: string;
    source_language: string;
  };
};

/**
 * Image element used in knowledge panels.
 */
export type KnowledgeImageElement = KnowledgeElementBase & {
  element_type: "image";
  image_element: {
    url: string;
    width: number;
    height: number;
    alt_text: string;
  };
};

/**
 * Group of multiple panels displayed together.
 */
export type KnowledgePanelGroupElement = KnowledgeElementBase & {
  element_type: "panel_group";
  panel_group_element: {
    title: string;
    image?: KnowledgePanelImage;
    panel_ids: string[];
  };
};

/**
 * Image size definition.
 */
export type KnowledgePanelImageSize = {
  height: number;
  width: number;
  url: string;
};

/**
 * Image used in a panel group.
 */
export type KnowledgePanelImage = {
  alt: string;
  id: string;
  lc: string;

  /** Available image sizes */
  sizes: Record<string, KnowledgePanelImageSize>;
};

/**
 * Element referencing another knowledge panel.
 */
export type KnowledgePanelElement = KnowledgeElementBase & {
  element_type: "panel";
  panel_element: {
    panel_id: string;
  };
};

/**
 * Row inside a knowledge table.
 */
export type KnowledgePanelTableRow = {
  values: { text: string; evaluation?: string }[];
};

/**
 * Table column definition.
 */
export type KnowledgeTableColumn = {
  type: string;
  text: string;
  text_for_small_screen: string;
  style: string;
  column_group_id: string;
  shown_by_default: boolean;
};

/**
 * Table element displaying structured data.
 */
export type KnowledgeTableElement = KnowledgeElementBase & {
  element_type: "table";
  table_element: {
    id: string;
    title: string;
    rows: KnowledgePanelTableRow[];
    columns: KnowledgeTableColumn[];
  };
};

/**
 * Action element allowing user interactions.
 */
export type KnowledgeActionElement = KnowledgeElementBase & {
  element_type: "action";
  action_element: {
    actions: string[];
    html: string;
  };
};

/**
 * Pointer displayed on a knowledge map element.
 */
export type KnowledgeMapElementPointer = {
  geo: { lat: number; lng: number };
};

/**
 * Map element displaying geographic pointers.
 */
export type KnowledgeMapElement = KnowledgeElementBase & {
  element_type: "map";
  map_element: {
    pointers: KnowledgeMapElementPointer[];
  };
};