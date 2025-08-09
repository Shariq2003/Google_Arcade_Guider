import { Component } from '@angular/core';
import { FileHelper } from '../services/file/file-helper';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.html',
  styleUrls: ['./upload.scss'],
  imports: [CommonModule],
})
export class UploadComponent {
  selectedFile: File | null = null;
  progress = 0;
  error = '';
  resultRows: any[] = [];
  columns: string[] = [];
  private lastBlob: Blob | null = null;

  constructor(private fileHelper: FileHelper) {}

  selectedFileName: string = 'No file chosen';
  onFileChange(event?: Event) {
    const input = event?.target as HTMLInputElement | undefined;
    if (input?.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      this.selectedFile = input.files[0];
    } else {
      this.selectedFileName = 'No file chosen';
      this.selectedFile = null;
    }
  }

  onSubmit() {
    if (!this.selectedFile) return;
    this.progress = 0;
    this.error = '';

    this.fileHelper.uploadFile(this.selectedFile).subscribe({
      next: (evt: any) => {
        if (evt.progress) this.progress = evt.progress;
        if (evt.blob) {
          this.progress = 100;
          this.lastBlob = evt.blob;
          this.parseExcelBlob(evt.blob);
        }
      },
      error: (err) => {
        console.error(err);
        this.error = err?.message || 'Upload failed';
      },
    });
  }

  parseExcelBlob(blob: Blob) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        const sheetName = wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' });

        const filtered = json.filter((r: any) => {
          const v =
            r['Duration in Minutes'] ??
            r['duration in minutes'] ??
            r['Duration Minutes'] ??
            null;
          return v !== null && v !== '';
        });
        this.resultRows = filtered;
        if (filtered.length) {
          this.columns = Object.keys(filtered[0] as Record<string, unknown>);
        } else {
          this.columns = [];
        }
      } catch (ex) {
        console.error('parse error', ex);
        this.error = 'Failed to parse returned sheet';
      }
    };
    reader.onerror = (err) => {
      console.error(err);
      this.error = 'Failed to read downloaded file';
    };
    reader.readAsArrayBuffer(blob);
  }
  isUrl(value: string): boolean {
    if (!value) return false;
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    );
    return !!pattern.test(value);
  }
  get visibleColumns() {
    return this.columns.filter((c) => c !== 'Link');
  }

  getLink(row: any): string | null {
    return row['Link'] || null;
  }

  downloadSheet() {
    if (!this.lastBlob) return;
    const url = URL.createObjectURL(this.lastBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sorted_courses.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}
