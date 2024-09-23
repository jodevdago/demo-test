import { TestBed } from '@angular/core/testing';
import { UnauthorizedComponent } from './unauthorized.component';
import { Router } from '@angular/router';

describe('UnauthorizedComponent', () => {
  let component: UnauthorizedComponent;
  let mockRouter: Router;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn().mockReturnValue(Promise.resolve(true)),
    } as unknown as Router;

    TestBed.configureTestingModule({
      providers: [
        UnauthorizedComponent,
        { provide: Router, useValue: mockRouter },
      ],
    });

    component = TestBed.inject(UnauthorizedComponent);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login when toLogin is called', async () => {
    await component.toLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['./login']);
  });
});

