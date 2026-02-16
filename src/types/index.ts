export interface Project {
  id: string;
  title: string;
  description?: string;
  location: string;
  lod: number;
  sow: string;
  projectType: string;
  area: number;
  imageUrl?: string;
  images?: string[]; // Array of image URLs
  fbxUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  softwareUsed?: string[];
}

export interface ProjectFormData {
  title: string;
  description?: string;
  location: string;
  lod: number;
  sow: string;
  projectType: string;
  area: number;
}

export interface FilterOptions {
  location: string;
  lod: string;
  sow: string;
  projectType: string;
  area: string;
}

export const FILTER_OPTIONS = {
  locations: ['All', 'France', 'Italy', 'US', 'Germany', 'Spain'],
  lods: ['All', '300', '350', '400', '450', '500'],
  sows: ['All', 'Architecture 3D modeling', 'MEP modeling', 'Scan to BIM', 'Structural modeling'],
  projectTypes: ['All', 'Office building', 'Residential complex', 'Shopping mall', 'Hospital', 'Hotel'],
  areas: ['All', '0-10000', '10000-20000', '20000-30000', '30000+']
};