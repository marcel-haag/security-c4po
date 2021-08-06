import { v4 as UUID } from 'uuid';

export class Project {
  id: string;
  client: string;
  title: string;
  createdAt: Date;
  tester: string;
  createdBy: string;

  constructor(id: string,
              client: string,
              title: string,
              createdAt: Date,
              tester?: string,
              createdBy?: string) {
    this.id = id;
    this.client = client;
    this.title = title;
    this.createdAt = createdAt;
    this.tester = tester;
    this.createdBy = createdBy;
  }
}
