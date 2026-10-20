export interface ReviewDTO {
  id: number;
  author_name: string;
  city: string;
  comment: string;
  rating: number;
  verified: number;
  created_at: string;
}

export interface CreateReviewInput {
  authorName: string;
  city?: string;
  comment: string;
  rating: number;
}

export interface IReviewRepository {
  getAllReviews(): ReviewDTO[];
  createReview(input: CreateReviewInput): ReviewDTO;
  deleteReview(id: number): boolean;
}
