export interface Review {
  id: string;
  name: string;
  city: string;
  product: string;
  comment: string;
  rating: number;
  date: string;
  avatarBg: string;
  initials: string;
  isApproved: boolean;
  isUserCreated?: boolean;
}
