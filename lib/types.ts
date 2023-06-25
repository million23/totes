export interface User {
  firstName: string;
  lastName: string;
  email: string;
  totes: Tote[];
}

export interface Tote {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
}