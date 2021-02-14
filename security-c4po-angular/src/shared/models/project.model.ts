import { v4 as UUID } from 'uuid';

export class Project {
  id: string;
  client: string;
  title: string;
  /* Change to Date after database integration */
  createdAt: string;
  tester: string;
  logo: string;

  constructor(id: string,
              client: string,
              title: string,
              createdAt: string,
              tester?: string,
              logo?: string) {
    this.id = id;
    this.client = client;
    this.title = title;
    this.createdAt = createdAt;
    this.tester = tester;
    this.logo = logo;
  }
}
