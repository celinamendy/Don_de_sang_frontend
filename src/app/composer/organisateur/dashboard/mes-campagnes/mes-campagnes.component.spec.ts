import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesCampagnesComponent } from './mes-campagnes.component';

describe('MesCampagnesComponent', () => {
  let component: MesCampagnesComponent;
  let fixture: ComponentFixture<MesCampagnesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesCampagnesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MesCampagnesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
