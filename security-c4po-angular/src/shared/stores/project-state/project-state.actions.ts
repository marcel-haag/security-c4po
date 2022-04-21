import {Project} from '@shared/models/project.model';
import {Category} from '@shared/models/category.model';


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

  constructor(public pentestId: string) {
  }
}
