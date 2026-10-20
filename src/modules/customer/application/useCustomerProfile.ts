import { create } from 'zustand';
import { CustomerProfile } from '../domain/entities/CustomerProfile';
import { CustomerProfileStorage } from '../infrastructure/customerProfileStorage';

interface CustomerProfileState {
  profile: CustomerProfile;
  isModalOpen: boolean;
  modalTitle: string;
  modalSubtitle?: string;
  pendingAction: ((name: string) => void) | null;
  updateProfile: (updates: Partial<CustomerProfile>) => void;
  requireName: (onSuccess: (name: string) => void, title?: string, subtitle?: string) => void;
  confirmName: (name: string, rememberMe: boolean) => void;
  closeModal: () => void;
}

export const useCustomerProfile = create<CustomerProfileState>((set, get) => ({
  profile: CustomerProfileStorage.getProfile(),
  isModalOpen: false,
  modalTitle: '¿Cómo te llamas?',
  modalSubtitle: 'Queremos saludarte por tu nombre y brindarte una atención personalizada en WhatsApp.',
  pendingAction: null,

  updateProfile: (updates) => {
    const current = get().profile;
    const newProfile: CustomerProfile = { ...current, ...updates };
    CustomerProfileStorage.saveProfile(newProfile);
    set({ profile: newProfile });
  },

  requireName: (onSuccess, title, subtitle) => {
    const { profile } = get();
    if (profile.name && profile.name.trim().length > 0) {
      onSuccess(profile.name.trim());
      return;
    }
    set({
      isModalOpen: true,
      modalTitle: title || '¿Cómo te llamas?',
      modalSubtitle: subtitle || 'Queremos saludarte por tu nombre y brindarte una atención personalizada en WhatsApp.',
      pendingAction: onSuccess,
    });
  },

  confirmName: (name, rememberMe) => {
    const cleanName = name.trim();
    const current = get().profile;
    const newProfile: CustomerProfile = {
      ...current,
      name: cleanName,
      rememberMe,
    };
    CustomerProfileStorage.saveProfile(newProfile);

    const pending = get().pendingAction;
    set({ profile: newProfile, isModalOpen: false, pendingAction: null });

    if (pending) {
      pending(cleanName);
    }
  },

  closeModal: () => {
    set({ isModalOpen: false, pendingAction: null });
  },
}));
