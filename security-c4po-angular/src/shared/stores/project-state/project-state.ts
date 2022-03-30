import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {Project} from '@shared/models/project.model';
import {ChangeCategory, ChangePentest, ChangeProject, InitProjectState} from '@shared/stores/project-state/project-state.actions';
import {Category} from '@shared/models/category.model';

export const PROJECT_STATE_NAME = 'project';

export interface ProjectStateModel {
  selectedProject: Project;
  // Manages Categories
  disabledCategories: Array<string>;
  selectedCategory: Category;
  // Manages Pentests of Category
  disabledPentests: Array<string>;
  selectedPentestId: string;
}

@State<ProjectStateModel>({
  name: PROJECT_STATE_NAME,
  defaults: {
    selectedProject: null,
    disabledCategories: [],
    selectedCategory: Category.INFORMATION_GATHERING,
    disabledPentests: [],
    selectedPentestId: null
  }
})
@Injectable()
export class ProjectState {
  @Selector()
  static project(state: ProjectStateModel): Project {
    return state.selectedProject;
  }

  @Selector()
  static selectedCategory(state: ProjectStateModel): Category {
    return state.selectedCategory;
  }

  @Selector()
  static selectedPentestId(state: ProjectStateModel): string {
    return state.selectedPentestId;
  }

  @Action(InitProjectState)
  initProjectState(ctx: StateContext<ProjectStateModel>, action: InitProjectState): void {
    ctx.setState({
      selectedProject: action.project,
      disabledCategories: action.disabledCategories,
      selectedCategory: Category.INFORMATION_GATHERING,
      disabledPentests: action.disabledPentests,
      selectedPentestId: null
    });
  }

  @Action(ChangeProject)
  changeProject(ctx: StateContext<ProjectStateModel>, {project}: ChangeProject): void {
    const state = ctx.getState();
    // ToDo: Add logic to change selectedCategory if disabled
    ctx.patchState({
      selectedProject: project
    });
  }

  @Action(ChangeCategory)
  changeCategory(ctx: StateContext<ProjectStateModel>, {category}: ChangeCategory): void {
    const state = ctx.getState();
    // ToDo: Add logic to change selectedCategory if disabled
    ctx.patchState({
      selectedCategory: category
    });
  }

  @Action(ChangePentest)
  changePentest(ctx: StateContext<ProjectStateModel>, {pentestId}: ChangePentest): void {
    const state = ctx.getState();
    ctx.patchState({
      selectedPentestId: pentestId
    });
  }
}
