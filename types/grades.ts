// Subject object interface
export interface SubjectObject {
  Id?: number | string;
  Key?: string;
  Name?: string;
  Kod?: string;
  Position?: number | string;
  [key: string]: any; // For other possible properties
}

// Grade interface
export interface Grade {
  Value?: string | number;
  Content?: string;
  ContentRaw?: string;
  Comment?: string;
  Topic?: string | any;
  Column?: {
    Subject?: string | SubjectObject;
    Name?: string;
    Code?: string;
    Weight?: number;
    Category?: {
      Id?: number;
      Name?: string;
      Code?: string;
    };
  };
  Subject?: string | SubjectObject;
  [key: string]: any; // For other possible properties
}

// Subject with grades interface
export interface SubjectWithGrades {
  name: string;
  grades: Grade[];
  average: number;
}

// Interface for grade update notification
export interface GradeUpdate {
  newGrades: Grade[];
  timestamp: string | null;
} 