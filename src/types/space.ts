export interface Space {
  id: string;
  name: string;
  icon?: string;
  createdAt: string;
}

export interface Location {
  id: string;
  spaceId: string;
  name: string;
  icon?: string;
}
