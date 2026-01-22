import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  private gridViewSubject = new BehaviorSubject<boolean>(true);
  public gridView$: Observable<boolean> = this.gridViewSubject.asObservable();

  constructor() {}

  toggleGridView(): void {
    this.gridViewSubject.next(!this.gridViewSubject.value);
  }

  setGridView(isGridView: boolean): void {
    this.gridViewSubject.next(isGridView);
  }

  isGridView(): boolean {
    return this.gridViewSubject.value;
  }
}
