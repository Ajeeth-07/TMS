export interface Task {
  id: number;
  title: string;
  content: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate? : Date;
  authorId : number;
}
