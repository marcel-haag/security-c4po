import {TestBed} from '@angular/core/testing';

import {ProjectService} from './project.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {KeycloakService} from 'keycloak-angular';
import {Project, SaveProjectDialogBody} from '@shared/models/project.model';
import {environment} from '../../environments/environment';

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
    const mockProject: Project = {
      id: '56c47c56-3bcd-45f1-a05b-c197dbd33111',
      client: 'E Corp',
      title: 'Some Mock API (v1.0) Scanning',
      createdAt: dummyDate,
      tester: 'Novatester',
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
      service.getProjects().subscribe((projects) => {
        expect(projects[0].id).toEqual(mockProject.id);
        expect(projects[0].client).toEqual(mockProject.client);
        expect(projects[0].title).toEqual(mockProject.title);
        expect(projects[0].createdAt).toBe(mockProject.createdAt);
        expect(projects[0].tester).toEqual(mockProject.tester);
        expect(projects[0].createdBy).toEqual(mockProject.createdBy);
        done();
      });

      const mockReq = httpMock.expectOne(`${apiBaseURL}`);
      expect(mockReq.cancelled).toBe(false);
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(httpResponse);

      httpMock.verify();
    });
  });

  describe('saveProject', () => {
    const mockSaveProjectDialogBody: SaveProjectDialogBody = {
      client: 'E Corp',
      title: 'Some Mock API (v1.0) Scanning',
      tester: 'Novatester',
    };

    const mockProject: Project = {
      id: '56c47c56-3bcd-45f1-a05b-c197dbd33111',
      client: 'E Corp',
      title: 'Some Mock API (v1.0) Scanning',
      createdAt: dummyDate,
      tester: 'Novatester',
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

      service.saveProject(mockSaveProjectDialogBody).subscribe(
        value => {
          expect(value).toEqual(mockProject);
          done();
        },
        fail);

      const req = httpMock.expectOne(`${apiBaseURL}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockProject);
    });
  });
});
