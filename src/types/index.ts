export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  tags: string[];
  attachments: Attachment[];
  readTime: number;
  likes: number;
  isPublished: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  file: File;
}

export interface ShareOption {
  name: string;
  icon: string;
  action: (post: BlogPost) => void;
  color: string;
}