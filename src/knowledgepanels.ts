export type KnowledgePanels = { [key: string]: KnowledgePanel };

export type KnowledgePanelTitleBase  = {
  title: string;
  subtitle?: string;
  icon_url: string;
  icon_color_from_evaluation: boolean;
  icon_size: string;
  type?: never;
};

type KnowledgePanelTitleGrade = KnowledgePanelTitleBase & {
  type: 'grade';
  grade: 'a' | 'b' | 'c' | 'd' | 'e' | 'unknown';
};

type KnowledgePanelTitlePercentage = KnowledgePanelTitleBase & {
  type: 'percentage';
  value: number;
};

export type KnowledgePanelTitle =
  | KnowledgePanelTitleGrade
  | KnowledgePanelTitlePercentage
  | KnowledgePanelTitleBase;

export type KnowledgePanelSize = "small";

export type KnowledgePanel = {
  type: "card" | "inline";
  expanded: boolean;
  expand_for: string;
  evaluation?: string;
  half_width_on_mobile?: boolean;
  title_element: KnowledgePanelTitle;
  elements: KnowledgeElement[];
  topics: string[];
  level: string;
  size?: KnowledgePanelSize;
};

export type KnowledgeElement =
  | KnowledgeTextElement
  | KnowledgeImageElement
  | KnowledgePanelGroupElement
  | KnowledgePanelElement
  | KnowledgeTableElement
  | KnowledgeActionElement
  | KnowledgeMapElement;

export interface KnowledgeElementBase {
  element_type: string;
}

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

export type KnowledgeImageElement = KnowledgeElementBase & {
  element_type: "image";
  image_element: {
    url: string;
    width: number;
    height: number;
    alt_text: string;
  };
};

export type KnowledgePanelGroupElement = KnowledgeElementBase & {
  element_type: "panel_group";
  panel_group_element: {
    title: string;
    image?: KnowledgePanelImage;
    panel_ids: string[];
  };
};

export type KnowledgePanelImageSize = {
  height: number;
  width: number;
  url: string;
};

export type KnowledgePanelImage = {
  alt: string;
  id: string;
  lc: string;
  sizes: Record<string, KnowledgePanelImageSize>;
};

export type KnowledgePanelElement = KnowledgeElementBase & {
  element_type: "panel";
  panel_element: {
    panel_id: string;
  };
};

export type KnowledgePanelTableRow = {
  values: { text: string; evaluation?: string }[];
};

export type KnowledgeTableColumn = {
  type: string;
  text: string;
  text_for_small_screen: string;
  style: string;
  column_group_id: string;
  shown_by_default: boolean;
};

export type KnowledgeTableElement = KnowledgeElementBase & {
  element_type: "table";
  table_element: {
    id: string;
    title: string;
    rows: KnowledgePanelTableRow[];
    columns: KnowledgeTableColumn[];
  };
};

export type KnowledgeActionElement = KnowledgeElementBase & {
  element_type: "action";
  action_element: {
    actions: string[];
    html: string;
  };
};

export type KnowledgeMapElementPointer = {
  geo: { lat: number; lng: number };
};

export type KnowledgeMapElement = KnowledgeElementBase & {
  element_type: "map";
  map_element: { pointers: KnowledgeMapElementPointer[] };
};
