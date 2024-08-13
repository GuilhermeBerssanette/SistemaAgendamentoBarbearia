import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterBarbeariaComponent } from './register-barbearia.component';

describe('RegisterBarbeariaComponent', () => {
  let component: RegisterBarbeariaComponent;
  let fixture: ComponentFixture<RegisterBarbeariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterBarbeariaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterBarbeariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
