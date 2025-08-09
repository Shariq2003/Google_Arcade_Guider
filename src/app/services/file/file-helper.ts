import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FileHelper {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadFile(
    file: File
  ): Observable<{ progress: number; filename?: string; blob?: Blob }> {
    const fd = new FormData();
    fd.append('file', file, file.name);

    return this.http
      .post(`${this.apiUrl}/api/sort-courses`, fd, {
        reportProgress: true,
        observe: 'events',
        responseType: 'blob',
      })
      .pipe(
        map((event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            const percent = Math.round(
              100 * (event.loaded / (event.total || event.loaded))
            );
            return { progress: percent };
          } else if (event.type === HttpEventType.Response) {
            const headers = event.headers;
            const cd = headers.get('content-disposition') || '';
            let filename = 'sorted_courses.xlsx';
            const m = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(cd);
            if (m && m[1]) filename = m[1].replace(/['"]/g, '');
            return { progress: 100, filename, blob: event.body };
          } else {
            return { progress: 0 };
          }
        })
      );
  }
}
