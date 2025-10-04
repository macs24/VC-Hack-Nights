export enum AssignmentStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export interface Assignment {
  id: number;
  name: string;
  status: AssignmentStatus;
  deadline: string; // YYYY-MM-DD
  points: number;
}

export interface Goal {
    id: number;
    name: string;
    completed: boolean;
    points: number;
}

export interface TamagotchiStage {
  name: string;
  minExperience: number;
  image: string; // Changed from React.ReactNode to string
}

export enum ItemCategory {
    Skin = 'Skin',
    Decoration = 'Decoration',
}

export interface ShopItem {
    id: number;
    name: string;
    price: number;
    category: ItemCategory;
    asset: string; // Changed from React.ReactNode | string to string
}