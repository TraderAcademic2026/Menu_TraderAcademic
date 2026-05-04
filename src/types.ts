export interface LinkItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  icon: string;
  color: string;
}

export interface AppConfig {
  name: string;
  description: string;
  profileImage: string;
  coverImage: string;
  hours: string;
  links: LinkItem[];
}
