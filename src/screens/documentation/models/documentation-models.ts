export interface DocumentationItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  route?: string;
}

export interface DocumentationSection {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  color: string;
  items: DocumentationItem[];
}
