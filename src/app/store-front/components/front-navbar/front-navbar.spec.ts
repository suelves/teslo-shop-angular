import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrontNavbar } from './front-navbar';

describe('FrontNavbar', () => {
  let component: FrontNavbar;
  let fixture: ComponentFixture<FrontNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontNavbar],
    }).compileComponents();

    fixture = TestBed.createComponent(FrontNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
