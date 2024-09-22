export interface Ticket {
  desc: string;
  priority: number;
  title: string;
  createdAt: Date;
  assigned: {
    level: number;
    email: string;
    fullname: string;
  };
  id?: string;
}
