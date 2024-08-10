import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFilterComponent } from './modal-filter.component';

describe('ModalFilterComponent', () => {
  let component: ModalFilterComponent;
  let fixture: ComponentFixture<ModalFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
