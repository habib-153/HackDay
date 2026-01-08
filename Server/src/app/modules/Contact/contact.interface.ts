export interface TContact {
  userId: string;
  contactUserId: string;
  nickname?: string;
  relationshipType: 'friend' | 'family' | 'partner' | 'colleague' | 'other';
  notes?: string;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TContactPopulated extends Omit<TContact, 'contactUserId'> {
  contactUserId: {
    _id: string;
    name: string;
    email: string;
  };
}
