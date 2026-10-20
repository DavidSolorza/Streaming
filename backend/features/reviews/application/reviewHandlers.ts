import type { IReviewRepository, ReviewDTO, CreateReviewInput } from '../domain/reviewContracts.ts';
import { busService } from '../../../core/bus/busService.ts';

export class ReviewHandlers {
  private repo: IReviewRepository;

  constructor(repo: IReviewRepository) {
    this.repo = repo;
    this.registerBusHandlers();
  }

  private registerBusHandlers(): void {
    busService.registerCommandHandler('GET_ALL_REVIEWS', async () => {
      return this.repo.getAllReviews();
    });

    busService.registerCommandHandler('CREATE_REVIEW', async (input: CreateReviewInput) => {
      return this.repo.createReview(input);
    });

    busService.registerCommandHandler('DELETE_REVIEW', async (payload: { id: number }) => {
      return this.repo.deleteReview(payload.id);
    });
  }

  async getAllReviews(): Promise<ReviewDTO[]> {
    return await busService.executeCommand('GET_ALL_REVIEWS', null);
  }

  async createReview(input: CreateReviewInput): Promise<ReviewDTO> {
    return await busService.executeCommand('CREATE_REVIEW', input);
  }

  async deleteReview(id: number): Promise<boolean> {
    return await busService.executeCommand('DELETE_REVIEW', { id });
  }
}
