export type MovingItemStatus = 'to_pack' | 'packed' | 'moved' | 'missing' | 'dont_bring';

export interface MovingBox {
  id: string;
  movingTaskId: string;
  name: string; // 例如：第 1 箱 - 書籍、衣物箱
  note?: string;
}

export interface MovingTaskItem {
  itemId: string;
  boxId?: string; // 所屬箱子 ID
  status: MovingItemStatus;
  targetLocationId?: string; // 目標位置 ID
}

export interface MovingTask {
  id: string;
  name: string; // 例如：2026 宿舍 → 租屋處
  fromSpaceId?: string; // 來源空間 ID ('all' 或特定 spaceId)
  toSpaceId?: string; // 目標空間 ID
  status: 'active' | 'completed';
  items: Record<string, MovingTaskItem>; // key: itemId
  boxes: MovingBox[];
  createdAt: string;
  updatedAt: string;
}
