import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {Project} from '@shared/models/project.model';
import {
  ChangeCategory,
  ChangePentest,
  ChangeProject,
  InitProjectState, SetAvailableProjects,
  UpdatePentestComments,
  UpdatePentestFindings, UpdatePentestStatus,
  UpdatePentestTime
} from '@shared/stores/project-state/project-state.actions';
import {Category} from '@shared/models/category.model';
import {Pentest} from '@shared/models/pentest.model';
import {PentestStatus} from '@shared/models/pentest-status.model';

export const PROJECT_STATE_NAME = 'project';

export interface ProjectStateModel {
  allProjects: Project[];
  selectedProject: Project;
  // Manages Categories
  disabledCategories: Array<string>;
  selectedCategory: Category;
  // Manages objectives of Category
  disabledPentests: Array<string>;
  selectedPentest: Pentest;
}

export interface FindingMap {
  [key: string]: string;
}

@State<ProjectStateModel>({
  name: PROJECT_STATE_NAME,
  defaults: {
    allProjects: [],
    selectedProject: null,
    disabledCategories: [],
    selectedCategory: Category.INFORMATION_GATHERING,
    disabledPentests: [],
    selectedPentest: null
  }
})
@Injectable()
export class ProjectState {
  @Selector()
  static allProjects(state: ProjectStateModel): Project[] {
    return state.allProjects;
  }

  @Selector()
  static project(state: ProjectStateModel): Project {
    return state.selectedProject;
  }

  @Selector()
  static selectedCategory(state: ProjectStateModel): Category {
    return state.selectedCategory;
  }

  @Selector()
  static pentest(state: ProjectStateModel): Pentest {
    return state.selectedPentest;
  }

  @Action(InitProjectState)
  initProjectState(ctx: StateContext<ProjectStateModel>, action: InitProjectState): void {
    ctx.setState({
      allProjects: ctx.getState().allProjects,
      selectedProject: action.project,
      disabledCategories: action.disabledCategories,
      selectedCategory: Category.INFORMATION_GATHERING,
      disabledPentests: action.disabledPentests,
      selectedPentest: null
    });
  }

  @Action(SetAvailableProjects)
  setAllAvailableProjects(ctx: StateContext<ProjectStateModel>, {projects}: SetAvailableProjects): void {
    const state = ctx.getState();
    // ToDo: Add logic to change selectedCategory if disabled
    ctx.patchState({
      allProjects: projects
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
  changePentest(ctx: StateContext<ProjectStateModel>, {pentest}: ChangePentest): void {
    const state = ctx.getState();
    ctx.patchState({
      selectedPentest: {...pentest, projectId: state.selectedProject.id}
    });
  }

  @Action(UpdatePentestStatus)
  updatePentestStatus(ctx: StateContext<ProjectStateModel>, {newPentestStatus}: UpdatePentestStatus): void {
    const state = ctx.getState();
    let stateSelectedPentest: Pentest = state.selectedPentest;
    // State object
    const statePentestStatus: PentestStatus = stateSelectedPentest.status || PentestStatus.NOT_STARTED;
    // overwrites only timeSpent
    stateSelectedPentest = {
      ...stateSelectedPentest,
      status: newPentestStatus
    };
    // patch project state
    ctx.patchState({
      selectedPentest: stateSelectedPentest
    });
  }

  @Action(UpdatePentestTime)
  updatePentestTime(ctx: StateContext<ProjectStateModel>, {time}: UpdatePentestTime): void {
    const state = ctx.getState();
    let stateSelectedPentest: Pentest = state.selectedPentest;
    // State object
    const statePentestTimeSpent: number = stateSelectedPentest.timeSpent || 0;
    // overwrites only timeSpent
    stateSelectedPentest = {
      ...stateSelectedPentest,
      timeSpent: time
    };
    // patch project state
    ctx.patchState({
      selectedPentest: stateSelectedPentest
    });
  }

  @Action(UpdatePentestFindings)
  updatePentestFindings(ctx: StateContext<ProjectStateModel>, {findingId}: UpdatePentestFindings): void {
    const state = ctx.getState();
    let stateSelectedPentest: Pentest = state.selectedPentest;
    // State objects
    const stateFindingIds: Array<string> = stateSelectedPentest.findingIds || [];
    let updatedFindingIds: Array<string> = [];
    if (!stateFindingIds.includes(findingId)) {
      updatedFindingIds = [...stateFindingIds, findingId];
    } else {
      const findingIndex = stateFindingIds.indexOf(findingId);
      updatedFindingIds = [...stateFindingIds.slice(0, findingIndex)];
    }
    // overwrites only findingIds
    stateSelectedPentest = {
      ...stateSelectedPentest,
      findingIds: updatedFindingIds
    };
    // patch project state
    ctx.patchState({
      selectedPentest: stateSelectedPentest
    });
  }

  @Action(UpdatePentestComments)
  updatePentestComments(ctx: StateContext<ProjectStateModel>, {commentId}: UpdatePentestComments): void {
    const state = ctx.getState();
    let stateSelectedPentest: Pentest = state.selectedPentest;
    // State objects
    const stateCommentIds: Array<string> = stateSelectedPentest.commentIds || [];
    let updatedCommentIds: Array<string> = [];
    if (!stateCommentIds.includes(commentId)) {
      updatedCommentIds = [...stateCommentIds, commentId];
    } else {
      const commentIndex = stateCommentIds.indexOf(commentId);
      updatedCommentIds = [...stateCommentIds.slice(0, commentIndex)];
    }
    // overwrites only findingIds
    stateSelectedPentest = {
      ...stateSelectedPentest,
      commentIds: updatedCommentIds
    };
    // patch project state
    ctx.patchState({
      selectedPentest: stateSelectedPentest
    });
  }
}
