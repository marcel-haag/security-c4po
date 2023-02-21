import {PentestStatus} from '@shared/models/pentest-status.model';

export class Project {
  id: string;
  client: string;
  title: string;
  createdAt: Date;
  tester: string;
  summary: string;
  projectPentests?: Array<ProjectPentests>;
  testingProgress?: number;
  createdBy: string;

  constructor(id: string,
              client: string,
              title: string,
              createdAt: Date,
              tester: string,
              projectPentests?: Array<ProjectPentests>,
              testingProgress?: number,
              summary?: string,
              createdBy?: string) {
    this.id = id;
    this.client = client;
    this.title = title;
    this.createdAt = createdAt;
    this.tester = tester;
    this.projectPentests = projectPentests;
    this.testingProgress = testingProgress;
    this.summary = summary;
    this.createdBy = createdBy;
  }
}

export interface ProjectDialogBody {
  title: string;
  client: string;
  tester: string;
  summary: string;
}

export class ProjectPentests {
  pentestId: string;
  status: PentestStatus;
}
