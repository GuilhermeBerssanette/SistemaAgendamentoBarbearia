import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRecoveryPasswordComponent } from './modal-recovery-password.component';

describe('ModalRecoveryPasswordComponent', () => {
  let component: ModalRecoveryPasswordComponent;
  let fixture: ComponentFixture<ModalRecoveryPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRecoveryPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalRecoveryPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
