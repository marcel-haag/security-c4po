export class Project {
  id: string;
  client: string;
  title: string;
  createdAt: Date;
  tester: string;
  summary: string;
  testingProgress: number;
  createdBy: string;

  constructor(id: string,
              client: string,
              title: string,
              createdAt: Date,
              tester: string,
              testingProgress: number,
              summary?: string,
              createdBy?: string) {
    this.id = id;
    this.client = client;
    this.title = title;
    this.createdAt = createdAt;
    this.tester = tester;
    this.testingProgress = testingProgress;
    this.summary = summary;
    this.createdBy = createdBy;
  }
}

export interface ProjectDialogBody {
  title: string;
  client: string;
  tester: string;
  // ToDo: summary: string;
}
