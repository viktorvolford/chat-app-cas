import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectedDialogComponent } from './protected-dialog.component';

describe('ProtectedDialogComponent', () => {
  let component: ProtectedDialogComponent;
  let fixture: ComponentFixture<ProtectedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtectedDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProtectedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
