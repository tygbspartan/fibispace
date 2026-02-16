export interface Project {
  id: number;
  title: string;
  description: string;
  category: string[];
  mainImage: string;
  thumbnailImages: string[];
  keyFindings?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  projects: Project[];
  count: number;
}

export interface Service {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon?: string;
}

export interface Expertise {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface ContactInfo {
  location: string[];
  phone: string;
  email: string;
  socials: {
    instagram: string;
    facebook: string;
    linkedin: string;
  };
}

export interface TeamMember {
  id: number;
  name: string;
  designation: string;
  aboutMe: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMembersResponse {
  members: TeamMember[];
  count: number;
}