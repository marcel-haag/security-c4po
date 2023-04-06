import {NgxsModule, Store} from '@ngxs/store';
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app/common-app.module';
import {HttpClient} from '@angular/common/http';
import {PROJECT_STATE_NAME, ProjectState, ProjectStateModel} from '@shared/stores/project-state/project-state';
import {Category} from '@shared/models/category.model';

const INITIAL_PROJECT_STATE_SESSION: ProjectStateModel = {
  allProjects: [],
  selectedProject: null,
  disabledCategories: [],
  selectedCategory: Category.INFORMATION_GATHERING,
  disabledPentests: [],
  selectedPentest: null
};

const DESIRED_PROJECT_STATE_SESSION: ProjectStateModel = {
  allProjects: [],
  selectedProject: null,
  disabledCategories: [],
  selectedCategory: Category.INFORMATION_GATHERING,
  disabledPentests: [],
  selectedPentest: null
};

describe('SessionState', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        NgxsModule.forRoot([ProjectState]),
      ]
    });
    store = TestBed.inject(Store);
    store.reset({
      ...store.snapshot(),
      [PROJECT_STATE_NAME]: INITIAL_PROJECT_STATE_SESSION
    });
  });

  it('should contain store for PROJECT_STATE_NAME', (done) => {
    store.selectSnapshot(state => {
      expect(state[PROJECT_STATE_NAME]).toBeTruthy();
      done();
    });
  });
});
