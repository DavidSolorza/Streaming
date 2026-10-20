export interface ReviewDTO {
  id: number;
  author_name: string;
  city: string;
  comment: string;
  rating: number;
  verified: number;
  is_approved: number;
  created_at: string;
}

export interface CreateReviewInput {
  authorName: string;
  city?: string;
  comment: string;
  rating: number;
}

export interface IReviewRepository {
  getAllReviews(onlyApproved?: boolean): ReviewDTO[];
  createReview(input: CreateReviewInput): ReviewDTO;
  toggleVisibility(id: number, isApproved: boolean): boolean;
  deleteReview(id: number): boolean;
}
