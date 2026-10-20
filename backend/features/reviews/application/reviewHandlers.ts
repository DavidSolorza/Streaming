import type { IReviewRepository, ReviewDTO, CreateReviewInput } from '../domain/reviewContracts.ts';
import { busService } from '../../../core/bus/busService.ts';

export class ReviewHandlers {
  private repo: IReviewRepository;

  constructor(repo: IReviewRepository) {
    this.repo = repo;
    this.registerBusHandlers();
  }

  private registerBusHandlers(): void {
    busService.registerCommandHandler('GET_ALL_REVIEWS', async (payload?: { onlyApproved?: boolean }) => {
      return this.repo.getAllReviews(payload?.onlyApproved);
    });

    busService.registerCommandHandler('CREATE_REVIEW', async (input: CreateReviewInput) => {
      return this.repo.createReview(input);
    });

    busService.registerCommandHandler('TOGGLE_REVIEW_VISIBILITY', async (payload: { id: number; isApproved: boolean }) => {
      return this.repo.toggleVisibility(payload.id, payload.isApproved);
    });

    busService.registerCommandHandler('DELETE_REVIEW', async (payload: { id: number }) => {
      return this.repo.deleteReview(payload.id);
    });
  }

  async getAllReviews(onlyApproved?: boolean): Promise<ReviewDTO[]> {
    return await busService.executeCommand('GET_ALL_REVIEWS', { onlyApproved });
  }

  async createReview(input: CreateReviewInput): Promise<ReviewDTO> {
    return await busService.executeCommand('CREATE_REVIEW', input);
  }

  async toggleVisibility(id: number, isApproved: boolean): Promise<boolean> {
    return await busService.executeCommand('TOGGLE_REVIEW_VISIBILITY', { id, isApproved });
  }

  async deleteReview(id: number): Promise<boolean> {
    return await busService.executeCommand('DELETE_REVIEW', { id });
  }
}
