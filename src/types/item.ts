export interface Item {
  id: string;
  name: string;
  image?: string;
  category: string;
  spaceId: string;
  locationId: string;
  // 庫存管理
  quantity: number;
  unit?: string;
  minQuantity?: number; // 最低庫存警示值
  status: 'available' | 'lent' | 'missing' | 'consumed';
  note?: string;
  favorite: boolean;
  tags: string[];
  // 到期日管理
  price?: number;
  stockLevel?: 'adequate' | 'low' | 'out';

  expiryDate?: string; // ISO 日期字串
  reminderEnabled?: boolean; // 是否開啟提醒
  // 借出資訊
  loanInfo?: {
    borrower: string;
    borrowDate: string;
    dueDate?: string;
    returned?: boolean;
  };
  lastAuditedAt?: string; // 盤點時間

  createdAt: string;
  updatedAt: string;
}

