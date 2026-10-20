import React, { useState, useEffect } from 'react';
import { TestimonialsHeader } from './TestimonialsHeader';
import { TestimonialCard } from './TestimonialCard';
import { TestimonialsCTA } from './TestimonialsCTA';
import { TestimonialsFilterBar } from './TestimonialsFilterBar';
import { NewCommentModal } from './NewCommentModal';
import { Review } from '../domain/entities/Review';
import { ReviewRepository } from '../infrastructure/reviewRepository';

export const TestimonialsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'user' | '5stars'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');

  const loadData = async () => {
    const data = await ReviewRepository.getReviews();
    setReviews(data.filter(r => r.isApproved !== false));
  };

  useEffect(() => { loadData(); }, []);

  const handleAddComment = async (comment: any) => {
    await ReviewRepository.addReview({
      name: comment.name,
      city: comment.city,
      product: comment.product,
      comment: comment.comment,
      rating: comment.rating,
      avatarBg: comment.avatarBg || 'bg-teal-500/20 text-teal-700 border-teal-300',
      initials: comment.initials || 'JP',
      isApproved: true,
      isUserCreated: true,
    });
    await loadData();
    setActiveFilter('all');
    setSortBy('recent');
  };

  const filtered = reviews.filter(t => {
    if (activeFilter === 'user') return t.isUserCreated;
    if (activeFilter === '5stars') return t.rating === 5;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const userCommentsCount = reviews.filter(t => t.isUserCreated).length;

  return (
    <section id="testimonios" className="py-14 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <TestimonialsHeader onOpenNewCommentModal={() => setIsModalOpen(true)} totalCommentsCount={reviews.length} />

        <TestimonialsFilterBar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalCount={reviews.length}
          userCommentsCount={userCommentsCount}
          onOpenModal={() => setIsModalOpen(true)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map(t => (
            <TestimonialCard key={t.id} testimonial={t as any} />
          ))}
        </div>

        <TestimonialsCTA />
      </div>

      <NewCommentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddComment={handleAddComment} />
    </section>
  );
};
