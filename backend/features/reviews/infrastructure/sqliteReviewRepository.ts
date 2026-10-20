import { DatabaseSync } from 'node:sqlite';
import type { IReviewRepository, ReviewDTO, CreateReviewInput } from '../domain/reviewContracts.ts';
import { SQLiteClient } from '../../../core/db/sqliteClient.ts';

export class SQLiteReviewRepository implements IReviewRepository {
  private get db(): DatabaseSync {
    return SQLiteClient.getInstance();
  }

  getAllReviews(onlyApproved: boolean = false): ReviewDTO[] {
    const query = onlyApproved
      ? 'SELECT * FROM reviews WHERE is_approved = 1 ORDER BY id DESC'
      : 'SELECT * FROM reviews ORDER BY id DESC';
    const stmt = this.db.prepare(query);
    return stmt.all() as unknown as ReviewDTO[];
  }

  createReview(input: CreateReviewInput): ReviewDTO {
    const stmt = this.db.prepare(`
      INSERT INTO reviews (author_name, city, comment, rating, verified, is_approved)
      VALUES (?, ?, ?, ?, 1, 1)
    `);
    stmt.run(input.authorName, input.city || 'Colombia', input.comment, Math.min(5, Math.max(1, input.rating)));

    const getStmt = this.db.prepare('SELECT * FROM reviews ORDER BY id DESC LIMIT 1');
    return getStmt.get() as unknown as ReviewDTO;
  }

  toggleVisibility(id: number, isApproved: boolean): boolean {
    const stmt = this.db.prepare('UPDATE reviews SET is_approved = ? WHERE id = ?');
    const res = stmt.run(isApproved ? 1 : 0, id);
    return Number(res.changes) > 0;
  }

  deleteReview(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM reviews WHERE id = ?');
    const res = stmt.run(id);
    return Number(res.changes) > 0;
  }
}
