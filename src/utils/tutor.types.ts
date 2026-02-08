export type CreateTutorProfileInput = {
  bio?: string | null;
  price?: number | null;
  categoryId: string;
  isFeatured?: boolean;
  subject: string[];
};
