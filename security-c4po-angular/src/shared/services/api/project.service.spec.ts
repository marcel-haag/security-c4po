import {TestBed} from '@angular/core/testing';

import {ProjectService} from './project.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {KeycloakService} from 'keycloak-angular';
import {Project, ProjectDialogBody} from '@shared/models/project.model';
import {environment} from '../../../environments/environment';
import {throwError} from 'rxjs';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;

  const apiBaseURL = `${environment.apiEndpoint}/projects`;
  const dummyDate = new Date('2019-01-10T09:00:00');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        KeycloakService
      ]
    });
    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProjects', () => {
    // arrange
    const mockProject: Project = {
      id: '56c47c56-3bcd-45f1-a05b-c197dbd33111',
      client: 'E Corp',
      title: 'Some Mock API (v1.0) Scanning',
      createdAt: dummyDate,
      tester: 'Novatester',
      summary: '',
      testingProgress: 0,
      createdBy: '11c47c56-3bcd-45f1-a05b-c197dbd33110'
    };

    const httpResponse = [{
      id: '56c47c56-3bcd-45f1-a05b-c197dbd33111',
      client: 'E Corp',
      title: 'Some Mock API (v1.0) Scanning',
      createdAt: dummyDate,
      tester: 'Novatester',
      createdBy: '11c47c56-3bcd-45f1-a05b-c197dbd33110'
    }];

    it('should get Projects', (done) => {
      // act
      service.getProjects().subscribe((projects) => {
        expect(projects[0].id).toEqual(mockProject.id);
        expect(projects[0].client).toEqual(mockProject.client);
        expect(projects[0].title).toEqual(mockProject.title);
        expect(projects[0].createdAt).toBe(mockProject.createdAt);
        expect(projects[0].tester).toEqual(mockProject.tester);
        expect(projects[0].createdBy).toEqual(mockProject.createdBy);
        done();
      });

      // assert
      const mockReq = httpMock.expectOne(`${apiBaseURL}`);
      expect(mockReq.cancelled).toBe(false);
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(httpResponse);

      httpMock.verify();
    });
  });

  describe('saveProject', () => {
    // arrange
    const mockSaveProjectDialogBody: ProjectDialogBody = {
      client: 'E Corp',
      title: 'Some Mock API (v1.0) Scanning',
      tester: 'Novatester',
      summary: ''
    };

    const mockProject: Project = {
      id: '56c47c56-3bcd-45f1-a05b-c197dbd33111',
      client: 'E Corp',
      title: 'Some Mock API (v1.0) Scanning',
      createdAt: dummyDate,
      tester: 'Novatester',
      summary: '',
      testingProgress: 0,
      createdBy: '11c47c56-3bcd-45f1-a05b-c197dbd33110'
    };

    const httpResponse = {
      id: '56c47c56-3bcd-45f1-a05b-c197dbd33111',
      client: 'E Corp',
      title: 'Some Mock API (v1.0) Scanning',
      createdAt: dummyDate,
      tester: 'Novatester',
      createdBy: '11c47c56-3bcd-45f1-a05b-c197dbd33110'
    };

    it('should save project', (done) => {
      // act
      service.saveProject(mockSaveProjectDialogBody).subscribe(
        value => {
          expect(value).toEqual(mockProject);
          done();
        },
        throwError);
      // assert
      const req = httpMock.expectOne(`${apiBaseURL}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockProject);
    });
  });

  describe('deleteProject', () => {
    // arrange
    const mockProjectId = '56c47c56-3bcd-45f1-a05b-c197dbd33111';

    const httpResponse = {
      id: '56c47c56-3bcd-45f1-a05b-c197dbd33111'
    };

    it('should delete project', (done) => {
      // act
      service.deleteProjectById(mockProjectId).subscribe(
        value => {
          expect(value).toEqual(httpResponse.id);
          done();
        },
        throwError);
      // assert
      const req = httpMock.expectOne(`${apiBaseURL}/${mockProjectId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(httpResponse.id);
    });
  });
});
