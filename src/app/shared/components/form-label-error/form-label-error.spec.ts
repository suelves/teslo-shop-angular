import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormLabelError } from './form-label-error';

describe('FormLabelError', () => {
  let component: FormLabelError;
  let fixture: ComponentFixture<FormLabelError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLabelError],
    }).compileComponents();

    fixture = TestBed.createComponent(FormLabelError);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
