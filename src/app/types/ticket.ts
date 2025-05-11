export interface Ticket {
  desc: string;
  priority: number;
  title: string;
  createdOn: Date | any;
  assigned: {
    level: number;
    email: string;
    fullname: string;
  };
  id?: string;
  status: 'INPROGRESS' | 'PENDING' | 'FINISHED' | 'CLOSED';
}
