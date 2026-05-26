import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import {
  CossButtonDirective,
  CossCheckboxComponent,
  CossProgressComponent,
} from './coss-design-system';

@Component({
  standalone: true,
  imports: [CossButtonDirective, CossCheckboxComponent, CossProgressComponent],
  template: `
    <button cossButton variant="outline" type="button">Action</button>
    <coss-checkbox />
    <coss-progress [value]="25" />
  `,
})
class HostComponent {}

describe('COSS UI Angular', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('renders standalone components and directives', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.querySelector('button[cossButton]')?.textContent).toContain('Action');
    expect(nativeElement.querySelector('[role="checkbox"]')).not.toBeNull();
    expect(nativeElement.querySelector('[role="progressbar"]')).not.toBeNull();
  });
});
