import {Project} from '@shared/models/project.model';
import {Category} from '@shared/models/category.model';
import {Pentest} from '@shared/models/pentest.model';
import {PentestStatus} from '@shared/models/pentest-status.model';


export class InitProjectState {
  static readonly type = '[ProjectState] InitProjectState';

  constructor(
    public project: Project,
    public disabledCategories: Array<string>,
    public disabledPentests: Array<string>) {
  }
}

export class ChangeProject {
  static readonly type = '[ProjectState] ChangeProject';

  constructor(public project: Project) {
  }
}

export class ChangeCategory {
  static readonly type = '[ProjectState] ChangeCategory';

  constructor(public category: Category) {
  }
}

export class ChangePentest {
  static readonly type = '[ProjectState] ChangePentest';

  constructor(public pentest: Pentest) {
  }
}

export class UpdatePentestStatus {
  static readonly type = '[ProjectState] UpdatePentestStatus';

  constructor(public newPentestStatus: PentestStatus) {
  }
}

export class UpdatePentestTime {
  static readonly type = '[ProjectState] UpdatePentestTime';

  constructor(public time: number) {
  }
}

export class UpdatePentestFindings {
  static readonly type = '[ProjectState] UpdatePentestFindings';

  constructor(public findingId: string) {
  }
}

export class UpdatePentestComments {
  static readonly type = '[ProjectState] UpdatePentestComments';

  constructor(public commentId: string) {
  }
}
