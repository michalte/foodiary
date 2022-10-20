import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordreminderComponent } from './passwordreminder.component';

describe('PasswordreminderComponent', () => {
  let component: PasswordreminderComponent;
  let fixture: ComponentFixture<PasswordreminderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordreminderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordreminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
