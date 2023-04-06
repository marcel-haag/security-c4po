import {PentestStatus} from '@shared/models/pentest-status.model';
import {ReportState} from '@shared/models/state.enum';

export class Project {
  id: string;
  client: string;
  title: string;
  createdAt: Date;
  tester: string;
  summary: string;
  state: ReportState;
  version: string;
  projectPentests?: Array<ProjectPentests>;
  testingProgress?: number;
  createdBy: string;

  constructor(id: string,
              client: string,
              title: string,
              createdAt: Date,
              tester: string,
              state: ReportState,
              version: string,
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
    this.state = state;
    this.version = version;
    this.createdBy = createdBy;
  }
}

export function transformProjectToRequestBody(project: ProjectDialogBody | Project): ProjectDialogBody {
  const transformedProject = {
    ...project,
    title: project.title,
    client: project.client,
    tester: project.tester,
    state: typeof project.state === 'number' ? ReportState[project.state] : project.state,
    summary: project.summary,
  } as unknown as ProjectDialogBody;
  return transformedProject;
}

export interface ProjectDialogBody {
  title: string;
  client: string;
  tester: string;
  state: ReportState;
  summary: string;
}

export class ProjectPentests {
  pentestId: string;
  status: PentestStatus;
}
