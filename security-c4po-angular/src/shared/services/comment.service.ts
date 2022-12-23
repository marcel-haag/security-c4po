import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {Comment} from '@shared/models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiBaseURL = `${environment.apiEndpoint}/pentests`;

  constructor(
    private http: HttpClient,
    private readonly store: Store) {
  }


  /**
   * Get Comments for Pentest Id
   * @param pentestId the id of the project
   */
  public getCommentsByPentestId(pentestId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiBaseURL}/${pentestId}/comments`);
  }

  /**
   * Save Comment
   * @param pentestId the id of the pentest
   * @param comment the information of the comment
   */
  public saveComment(pentestId: string, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiBaseURL}/${pentestId}/comment`, comment);
  }

  /**
   * Delete Comment
   * @param pentestId the id of the pentest
   * @param commentId the id of the comment
   */
  public deleteCommentByPentestAndCommentId(pentestId: string, commentId: string): Observable<string> {
    return this.http.delete<string>(`${this.apiBaseURL}/${pentestId}/comment/${commentId}`);
  }
}
