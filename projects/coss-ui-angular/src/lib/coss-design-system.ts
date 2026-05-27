import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  Component,
  Directive,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input as NgInput,
  numberAttribute,
  Output,
  signal,
} from '@angular/core';
import { type ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'destructive'
  | 'destructive-outline';
type ButtonSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl' | 'icon' | 'icon-sm' | 'icon-lg';
type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'destructive'
  | 'success'
  | 'warning'
  | 'info';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const controlBase =
  'border border-border bg-background text-foreground shadow-sm transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50';

function joinClasses(...classes: Array<string | null | undefined | false>): string {
  return classes.filter(Boolean).join(' ');
}

function buttonClasses(variant: ButtonVariant, size: ButtonSize): string {
  const variants: Record<ButtonVariant, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'h-auto p-0 text-primary underline-offset-4 hover:underline',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    'destructive-outline':
      'border border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground',
  };
  const sizes: Record<ButtonSize, string> = {
    xs: 'h-7 px-2 text-xs',
    sm: 'h-8 px-3 text-xs',
    default: 'h-9 px-4 py-2 text-sm',
    lg: 'h-10 px-5 text-sm',
    xl: 'h-11 px-6 text-base',
    icon: 'h-9 w-9',
    'icon-sm': 'h-8 w-8',
    'icon-lg': 'h-10 w-10',
  };
  return joinClasses(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
    focusRing,
    variants[variant],
    sizes[size],
  );
}

@Directive({
  standalone: true,
  selector: 'button[cossButton], a[cossButton]',
})
export class CossButtonDirective {
  @NgInput() variant: ButtonVariant = 'default';
  @NgInput() size: ButtonSize = 'default';
  @NgInput({ transform: booleanAttribute }) loading = false;

  @HostBinding('class') get hostClass(): string {
    return joinClasses(buttonClasses(this.variant, this.size), this.loading && 'relative');
  }

  @HostBinding('attr.aria-disabled') get ariaDisabled(): string | null {
    return this.loading ? 'true' : null;
  }

  @HostBinding('attr.data-loading') get dataLoading(): string | null {
    return this.loading ? 'true' : null;
  }

  @HostBinding('attr.disabled') get disabled(): string | null {
    return this.loading ? '' : null;
  }
}

@Component({
  standalone: true,
  selector: 'coss-button',
  imports: [CommonModule],
  template: `
    <button [type]="type" [disabled]="disabled || loading" [class]="classes()" [attr.aria-disabled]="disabled || loading">
      <span *ngIf="loading" aria-hidden="true" class="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"></span>
      <span [class.invisible]="loading"><ng-content /></span>
    </button>
  `,
})
export class CossButtonComponent {
  @NgInput() variant: ButtonVariant = 'default';
  @NgInput() size: ButtonSize = 'default';
  @NgInput() type: 'button' | 'submit' | 'reset' = 'button';
  @NgInput({ transform: booleanAttribute }) disabled = false;
  @NgInput({ transform: booleanAttribute }) loading = false;

  classes(): string {
    return buttonClasses(this.variant, this.size);
  }
}

@Component({
  standalone: true,
  selector: 'coss-spinner',
  template: `<span class="inline-block animate-spin rounded-full border-2 border-current border-r-transparent" [class]="sizeClass" role="status" [attr.aria-label]="label"></span>`,
})
export class CossSpinnerComponent {
  @NgInput() label = 'Loading';
  @NgInput() size: 'sm' | 'default' | 'lg' = 'default';

  get sizeClass(): string {
    return this.size === 'sm' ? 'h-3 w-3' : this.size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
  }
}

@Component({
  standalone: true,
  selector: 'coss-badge',
  template: `<span [class]="classes()"><ng-content /></span>`,
})
export class CossBadgeComponent {
  @NgInput() variant: BadgeVariant = 'default';

  classes(): string {
    const variants: Record<BadgeVariant, string> = {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      outline: 'border border-border text-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
      success: 'bg-success text-success-foreground',
      warning: 'bg-warning text-warning-foreground',
      info: 'bg-info text-info-foreground',
    };
    return joinClasses(
      'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
      variants[this.variant],
    );
  }
}

@Directive({
  standalone: true,
  selector: 'input[cossInput], select[cossInput]',
})
export class CossInputDirective {
  @NgInput() size: 'sm' | 'default' | 'lg' = 'default';
  @NgInput({ transform: booleanAttribute }) unstyled = false;

  @HostBinding('class') get hostClass(): string {
    if (this.unstyled) {
      return joinClasses('bg-transparent outline-none', focusRing);
    }
    const sizes = {
      sm: 'h-8 px-2 text-xs',
      default: 'h-9 px-3 text-sm',
      lg: 'h-10 px-4 text-base',
    };
    return joinClasses('w-full rounded-md', controlBase, focusRing, sizes[this.size]);
  }
}

@Directive({
  standalone: true,
  selector: 'textarea[cossTextarea]',
})
export class CossTextareaDirective {
  @HostBinding('class') hostClass = joinClasses(
    'min-h-20 w-full rounded-md px-3 py-2 text-sm',
    controlBase,
    focusRing,
  );
}

@Directive({
  standalone: true,
  selector: 'label[cossLabel]',
})
export class CossLabelDirective {
  @HostBinding('class') hostClass =
    'text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
}

@Component({
  standalone: true,
  selector: 'coss-card',
  template: `<section class="rounded-lg border border-border bg-card text-card-foreground shadow-sm"><ng-content /></section>`,
})
export class CossCardComponent {}

@Component({
  standalone: true,
  selector: 'coss-card-header',
  template: `<header class="flex flex-col space-y-1.5 p-6"><ng-content /></header>`,
})
export class CossCardHeaderComponent {}

@Component({
  standalone: true,
  selector: 'coss-card-title',
  template: `<h3 class="font-semibold leading-none tracking-normal"><ng-content /></h3>`,
})
export class CossCardTitleComponent {}

@Component({
  standalone: true,
  selector: 'coss-card-description',
  template: `<p class="text-muted-foreground text-sm"><ng-content /></p>`,
})
export class CossCardDescriptionComponent {}

@Component({
  standalone: true,
  selector: 'coss-card-content',
  template: `<div class="p-6 pt-0"><ng-content /></div>`,
})
export class CossCardContentComponent {}

@Component({
  standalone: true,
  selector: 'coss-card-footer',
  template: `<footer class="flex items-center p-6 pt-0"><ng-content /></footer>`,
})
export class CossCardFooterComponent {}

@Component({
  standalone: true,
  selector: 'coss-alert',
  template: `<div role="alert" [class]="classes()"><ng-content /></div>`,
})
export class CossAlertComponent {
  @NgInput() variant: 'default' | 'destructive' | 'info' | 'success' | 'warning' = 'default';

  classes(): string {
    const variants = {
      default: 'border-border text-foreground',
      destructive: 'border-destructive/50 text-destructive',
      info: 'border-info/50 text-info',
      success: 'border-success/50 text-success',
      warning: 'border-warning/50 text-warning',
    };
    return joinClasses(
      'relative w-full rounded-lg border bg-background px-4 py-3 text-sm',
      variants[this.variant],
    );
  }
}

@Component({
  standalone: true,
  selector: 'coss-avatar',
  imports: [CommonModule],
  template: `
    <span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
      <img *ngIf="src" class="aspect-square h-full w-full object-cover" [src]="src" [alt]="alt" />
      <span *ngIf="!src" class="flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium">{{ fallback }}</span>
    </span>
  `,
})
export class CossAvatarComponent {
  @NgInput() src = '';
  @NgInput() alt = '';
  @NgInput() fallback = '';
}

@Component({
  standalone: true,
  selector: 'coss-separator',
  template: `<div role="separator" [attr.aria-orientation]="orientation" [class]="classes()"></div>`,
})
export class CossSeparatorComponent {
  @NgInput() orientation: 'horizontal' | 'vertical' = 'horizontal';

  classes(): string {
    return this.orientation === 'vertical' ? 'h-full w-px bg-border' : 'h-px w-full bg-border';
  }
}

@Component({
  standalone: true,
  selector: 'coss-skeleton',
  template: `<div aria-hidden="true" class="animate-pulse rounded-md bg-muted" [class]="className"></div>`,
})
export class CossSkeletonComponent {
  @NgInput() className = 'h-4 w-full';
}

@Component({
  standalone: true,
  selector: 'coss-kbd',
  template: `<kbd class="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-[11px] text-muted-foreground shadow-sm"><ng-content /></kbd>`,
})
export class CossKbdComponent {}

@Component({
  standalone: true,
  selector: 'coss-kbd-group',
  template: `<span class="inline-flex items-center gap-1"><ng-content /></span>`,
})
export class CossKbdGroupComponent {}

@Component({
  standalone: true,
  selector: 'coss-group',
  template: `<div role="group" class="inline-flex items-stretch overflow-hidden rounded-md border border-border [&>*]:rounded-none [&>*:not(:first-child)]:border-l-0"><ng-content /></div>`,
})
export class CossGroupComponent {}

@Component({
  standalone: true,
  selector: 'coss-group-separator',
  template: `<div aria-hidden="true" class="w-px bg-border"></div>`,
})
export class CossGroupSeparatorComponent {}

@Component({
  standalone: true,
  selector: 'coss-input-group',
  template: `<div class="flex w-full items-center rounded-md border border-border bg-background shadow-sm focus-within:ring-2 focus-within:ring-brand"><ng-content /></div>`,
})
export class CossInputGroupComponent {}

@Component({
  standalone: true,
  selector: 'coss-input-addon',
  template: `<span class="flex h-9 items-center px-3 text-muted-foreground text-sm"><ng-content /></span>`,
})
export class CossInputAddonComponent {}

@Component({
  standalone: true,
  selector: 'coss-frame',
  template: `<div class="rounded-lg border border-border bg-card p-4 shadow-sm"><ng-content /></div>`,
})
export class CossFrameComponent {}

@Component({
  standalone: true,
  selector: 'coss-empty',
  template: `
    <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
      <ng-content />
    </div>
  `,
})
export class CossEmptyComponent {}

@Component({
  standalone: true,
  selector: 'coss-field',
  template: `<div class="grid gap-2"><ng-content /></div>`,
})
export class CossFieldComponent {}

@Component({
  standalone: true,
  selector: 'coss-field-description',
  template: `<p class="text-muted-foreground text-sm"><ng-content /></p>`,
})
export class CossFieldDescriptionComponent {}

@Component({
  standalone: true,
  selector: 'coss-field-error',
  template: `<p class="text-destructive text-sm" role="alert"><ng-content /></p>`,
})
export class CossFieldErrorComponent {}

@Component({
  standalone: true,
  selector: 'coss-fieldset',
  template: `<fieldset class="grid gap-4 rounded-lg border border-border p-4"><ng-content /></fieldset>`,
})
export class CossFieldsetComponent {}

@Component({
  standalone: true,
  selector: 'coss-legend',
  template: `<legend class="px-1 text-sm font-medium"><ng-content /></legend>`,
})
export class CossLegendComponent {}

@Component({
  standalone: true,
  selector: 'coss-form',
  template: `<form class="grid gap-4" novalidate><ng-content /></form>`,
})
export class CossFormComponent {}

@Component({
  standalone: true,
  selector: 'coss-checkbox',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CossCheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <button
      type="button"
      role="checkbox"
      [attr.aria-checked]="checked()"
      [disabled]="disabled"
      [class]="boxClasses()"
      (click)="toggle()"
    >
      <span *ngIf="checked()" aria-hidden="true">✓</span>
    </button>
  `,
  imports: [CommonModule],
})
export class CossCheckboxComponent implements ControlValueAccessor {
  @NgInput({ transform: booleanAttribute }) disabled = false;
  readonly checked = signal(false);
  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
  toggle(): void {
    if (this.disabled) return;
    this.checked.update((value) => !value);
    this.onChange(this.checked());
    this.onTouched();
  }
  boxClasses(): string {
    return joinClasses(
      'inline-flex h-4 w-4 items-center justify-center rounded border border-primary text-[10px] text-primary-foreground',
      this.checked() ? 'bg-primary' : 'bg-background',
      focusRing,
    );
  }
}

@Component({
  standalone: true,
  selector: 'coss-checkbox-group',
  template: `<div role="group" class="grid gap-2"><ng-content /></div>`,
})
export class CossCheckboxGroupComponent {}

@Component({
  standalone: true,
  selector: 'coss-switch',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CossSwitchComponent),
      multi: true,
    },
  ],
  template: `
    <button type="button" role="switch" [attr.aria-checked]="checked()" [disabled]="disabled" [class]="classes()" (click)="toggle()">
      <span class="block h-4 w-4 rounded-full bg-background shadow transition-transform" [class.translate-x-5]="checked()"></span>
    </button>
  `,
})
export class CossSwitchComponent implements ControlValueAccessor {
  @NgInput({ transform: booleanAttribute }) disabled = false;
  readonly checked = signal(false);
  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
  toggle(): void {
    if (this.disabled) return;
    this.checked.update((value) => !value);
    this.onChange(this.checked());
    this.onTouched();
  }
  classes(): string {
    return joinClasses(
      'inline-flex h-6 w-11 items-center rounded-full p-1 transition-colors',
      this.checked() ? 'bg-primary' : 'bg-muted',
      focusRing,
    );
  }
}

@Component({
  standalone: true,
  selector: 'coss-toggle',
  template: `<button type="button" [attr.aria-pressed]="pressed()" [class]="classes()" (click)="toggle()"><ng-content /></button>`,
})
export class CossToggleComponent {
  readonly pressed = signal(false);
  @NgInput() variant: 'default' | 'outline' = 'default';

  classes(): string {
    return joinClasses(
      'inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors',
      this.variant === 'outline' ? 'border border-border' : '',
      this.pressed() ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
      focusRing,
    );
  }
  toggle(): void {
    this.pressed.update((value) => !value);
  }
}

@Component({
  standalone: true,
  selector: 'coss-toggle-group',
  template: `<div role="group" class="inline-flex rounded-md border border-border"><ng-content /></div>`,
})
export class CossToggleGroupComponent {}

@Component({
  standalone: true,
  selector: 'coss-radio-group',
  template: `
    <div role="radiogroup" class="grid gap-2">
      <label *ngFor="let option of options" class="flex items-center gap-2 text-sm">
        <input class="sr-only" type="radio" [name]="name" [value]="option.value" [checked]="value === option.value" (change)="select(option.value)" />
        <span class="flex h-4 w-4 items-center justify-center rounded-full border border-primary">
          <span *ngIf="value === option.value" class="h-2 w-2 rounded-full bg-primary"></span>
        </span>
        {{ option.label }}
      </label>
    </div>
  `,
  imports: [CommonModule],
})
export class CossRadioGroupComponent {
  @NgInput() name = `coss-radio-${Math.random().toString(36).slice(2)}`;
  @NgInput() value = '';
  @NgInput() options: Array<{ label: string; value: string }> = [];
  @Output() valueChange = new EventEmitter<string>();

  select(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
  }
}

@Component({
  standalone: true,
  selector: 'coss-select',
  template: `
    <select cossInput [value]="value" (change)="change($event)" [attr.aria-label]="label">
      <option *ngFor="let option of options" [value]="option.value">{{ option.label }}</option>
    </select>
  `,
  imports: [CommonModule, CossInputDirective],
})
export class CossSelectComponent {
  @NgInput() label = 'Select option';
  @NgInput() value = '';
  @NgInput() options: Array<{ label: string; value: string }> = [];
  @Output() valueChange = new EventEmitter<string>();

  change(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.value = value;
    this.valueChange.emit(value);
  }
}

@Component({
  standalone: true,
  selector: 'coss-slider',
  template: `<input class="w-full accent-primary" type="range" [min]="min" [max]="max" [step]="step" [value]="value" (input)="setValue($event)" [attr.aria-label]="label" />`,
})
export class CossSliderComponent {
  @NgInput() label = 'Slider';
  @NgInput({ transform: numberAttribute }) min = 0;
  @NgInput({ transform: numberAttribute }) max = 100;
  @NgInput({ transform: numberAttribute }) step = 1;
  @NgInput({ transform: numberAttribute }) value = 0;
  @Output() valueChange = new EventEmitter<number>();

  setValue(event: Event): void {
    this.value = Number((event.target as HTMLInputElement).value);
    this.valueChange.emit(this.value);
  }
}

@Component({
  standalone: true,
  selector: 'coss-progress',
  template: `
    <div class="relative h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar" [attr.aria-valuenow]="value" [attr.aria-valuemin]="0" [attr.aria-valuemax]="max">
      <div class="h-full bg-primary transition-all" [style.width.%]="percent()"></div>
    </div>
  `,
})
export class CossProgressComponent {
  @NgInput({ transform: numberAttribute }) value = 0;
  @NgInput({ transform: numberAttribute }) max = 100;
  percent(): number {
    return Math.max(0, Math.min(100, (this.value / this.max) * 100));
  }
}

@Component({
  standalone: true,
  selector: 'coss-meter',
  template: `
    <div role="meter" [attr.aria-valuenow]="value" [attr.aria-valuemin]="min" [attr.aria-valuemax]="max" class="grid gap-2">
      <ng-content />
      <div class="h-2 overflow-hidden rounded-full bg-muted">
        <div class="h-full bg-primary" [style.width.%]="percent()"></div>
      </div>
    </div>
  `,
})
export class CossMeterComponent {
  @NgInput({ transform: numberAttribute }) value = 0;
  @NgInput({ transform: numberAttribute }) min = 0;
  @NgInput({ transform: numberAttribute }) max = 100;
  percent(): number {
    return Math.max(0, Math.min(100, ((this.value - this.min) / (this.max - this.min)) * 100));
  }
}

@Component({
  standalone: true,
  selector: 'coss-number-field',
  imports: [CossInputDirective, CossButtonDirective],
  template: `
    <div class="flex items-center gap-2">
      <button cossButton variant="outline" size="icon-sm" type="button" (click)="stepBy(-step)" [attr.aria-label]="'Decrease ' + label">−</button>
      <input cossInput type="number" [attr.aria-label]="label" [min]="min" [max]="max" [step]="step" [value]="value" (input)="setValue($event)" />
      <button cossButton variant="outline" size="icon-sm" type="button" (click)="stepBy(step)" [attr.aria-label]="'Increase ' + label">+</button>
    </div>
  `,
})
export class CossNumberFieldComponent {
  @NgInput() label = 'Number';
  @NgInput({ transform: numberAttribute }) min = Number.NEGATIVE_INFINITY;
  @NgInput({ transform: numberAttribute }) max = Number.POSITIVE_INFINITY;
  @NgInput({ transform: numberAttribute }) step = 1;
  @NgInput({ transform: numberAttribute }) value = 0;
  @Output() valueChange = new EventEmitter<number>();

  setValue(event: Event): void {
    this.setNumber(Number((event.target as HTMLInputElement).value));
  }
  stepBy(delta: number): void {
    this.setNumber(this.value + delta);
  }
  private setNumber(value: number): void {
    this.value = Math.max(this.min, Math.min(this.max, value));
    this.valueChange.emit(this.value);
  }
}

@Component({
  standalone: true,
  selector: 'coss-otp-field',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex gap-2" role="group" [attr.aria-label]="label">
      <input
        *ngFor="let item of boxes; let index = index"
        #box
        class="h-10 w-10 rounded-md border border-border bg-background text-center text-sm"
        inputmode="numeric"
        maxlength="1"
        [attr.aria-label]="label + ' digit ' + (index + 1)"
        [(ngModel)]="values[index]"
        (input)="onInput(index, box)"
        (keydown.backspace)="onBackspace(index, box)"
      />
    </div>
  `,
})
export class CossOtpFieldComponent {
  @NgInput() label = 'One-time password';
  @NgInput({ transform: numberAttribute }) length = 6;
  @Output() completed = new EventEmitter<string>();
  values: string[] = [];

  get boxes(): number[] {
    this.ensureValues();
    return Array.from({ length: this.length }, (_, index) => index);
  }

  onInput(index: number, input: HTMLInputElement): void {
    this.ensureValues();
    this.values[index] = input.value.slice(-1);
    input.value = this.values[index];
    const next = input.nextElementSibling as HTMLInputElement | null;
    if (this.values[index] && next) next.focus();
    this.emit();
  }
  onBackspace(index: number, input: HTMLInputElement): void {
    if (!input.value && index > 0) {
      (input.previousElementSibling as HTMLInputElement | null)?.focus();
    }
    queueMicrotask(() => this.emit());
  }
  private ensureValues(): void {
    if (this.values.length !== this.length) {
      this.values = new Array(this.length).fill('');
    }
  }
  private emit(): void {
    const code = this.values.join('');
    this.completed.emit(code.length === this.length && this.values.every(Boolean) ? code : '');
  }
}

@Component({
  standalone: true,
  selector: 'coss-accordion',
  template: `<div class="divide-y divide-border rounded-md border border-border"><ng-content /></div>`,
})
export class CossAccordionComponent {}

@Component({
  standalone: true,
  selector: 'coss-accordion-item',
  template: `
    <details class="group">
      <summary class="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium">
        <ng-content select="[accordion-trigger]" />
        <span aria-hidden="true" class="transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <div class="px-4 pb-4 text-muted-foreground text-sm"><ng-content /></div>
    </details>
  `,
})
export class CossAccordionItemComponent {}

@Component({
  standalone: true,
  selector: 'coss-collapsible',
  imports: [CommonModule, CossButtonDirective],
  template: `
    <button cossButton variant="ghost" type="button" [attr.aria-expanded]="open()" (click)="toggle()"><ng-content select="[collapsible-trigger]" /></button>
    <div *ngIf="open()" class="mt-2"><ng-content /></div>
  `,
})
export class CossCollapsibleComponent {
  readonly open = signal(false);
  toggle(): void {
    this.open.update((value) => !value);
  }
}

@Component({
  standalone: true,
  selector: 'coss-tabs',
  imports: [CommonModule],
  template: `
    <div>
      <div role="tablist" class="inline-flex h-9 items-center rounded-md bg-muted p-1">
        <button
          *ngFor="let tab of tabs"
          type="button"
          role="tab"
          class="inline-flex h-7 items-center justify-center rounded px-3 text-sm"
          [class.bg-background]="active() === tab.value"
          [attr.aria-selected]="active() === tab.value"
          (click)="active.set(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>
      <section role="tabpanel" class="mt-3 rounded-md border border-border p-4 text-sm"><ng-content /></section>
    </div>
  `,
})
export class CossTabsComponent {
  @NgInput() tabs: Array<{ label: string; value: string }> = [];
  @NgInput() set value(value: string) {
    if (value) this.active.set(value);
  }
  readonly active = signal('');
}

@Component({
  standalone: true,
  selector: 'coss-dialog',
  imports: [CommonModule, CossButtonDirective],
  template: `
    <button *ngIf="showTrigger" cossButton type="button" (click)="openChange.emit(true)"><ng-content select="[dialog-trigger]" /></button>
    <div *ngIf="open" class="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" (click)="close()">
      <section class="w-full max-w-lg rounded-lg border border-border bg-background p-6 shadow-lg" role="dialog" aria-modal="true" [attr.aria-label]="label" (click)="$event.stopPropagation()">
        <ng-content />
      </section>
    </div>
  `,
})
export class CossDialogComponent {
  @NgInput({ transform: booleanAttribute }) open = false;
  @NgInput({ transform: booleanAttribute }) showTrigger = false;
  @NgInput() label = 'Dialog';
  @Output() openChange = new EventEmitter<boolean>();

  @HostListener('document:keydown.escape')
  close(): void {
    this.openChange.emit(false);
  }
}

@Component({
  standalone: true,
  selector: 'coss-alert-dialog',
  imports: [CossDialogComponent],
  template: `<coss-dialog [open]="open" [label]="label" (openChange)="openChange.emit($event)"><ng-content /></coss-dialog>`,
})
export class CossAlertDialogComponent {
  @NgInput({ transform: booleanAttribute }) open = false;
  @NgInput() label = 'Alert dialog';
  @Output() openChange = new EventEmitter<boolean>();
}

@Component({
  standalone: true,
  selector: 'coss-sheet, coss-drawer',
  imports: [CommonModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 bg-black/70" (click)="openChange.emit(false)"></div>
    <aside *ngIf="open" role="dialog" aria-modal="true" [attr.aria-label]="label" [class]="classes()">
      <ng-content />
    </aside>
  `,
})
export class CossDrawerComponent {
  @NgInput({ transform: booleanAttribute }) open = false;
  @NgInput() side: 'left' | 'right' | 'top' | 'bottom' = 'right';
  @NgInput() label = 'Drawer';
  @Output() openChange = new EventEmitter<boolean>();

  classes(): string {
    const position = {
      right: 'right-0 top-0 h-full w-80',
      left: 'left-0 top-0 h-full w-80',
      top: 'left-0 top-0 h-80 w-full',
      bottom: 'bottom-0 left-0 h-80 w-full',
    };
    return joinClasses('fixed z-50 border-border bg-background p-6 shadow-lg', position[this.side]);
  }
}

@Component({
  standalone: true,
  selector: 'coss-popover',
  imports: [CommonModule],
  template: `
    <span class="relative inline-block">
      <button type="button" [class]="buttonClasses" [attr.aria-expanded]="open()" (click)="toggle()"><ng-content select="[popover-trigger]" /></button>
      <div *ngIf="open()" role="dialog" class="absolute left-0 top-full z-20 mt-2 w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md"><ng-content /></div>
    </span>
  `,
})
export class CossPopoverComponent {
  readonly open = signal(false);
  buttonClasses = joinClasses(buttonClasses('outline', 'default'), 'w-full');
  toggle(): void {
    this.open.update((value) => !value);
  }
}

@Component({
  standalone: true,
  selector: 'coss-tooltip',
  template: `
    <span class="group relative inline-flex">
      <ng-content />
      <span role="tooltip" class="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-primary px-2 py-1 text-primary-foreground text-xs opacity-0 shadow group-focus-within:opacity-100 group-hover:opacity-100">{{ text }}</span>
    </span>
  `,
})
export class CossTooltipComponent {
  @NgInput() text = '';
}

@Component({
  standalone: true,
  selector: 'coss-preview-card',
  template: `
    <span class="group relative inline-flex">
      <ng-content select="[preview-trigger]" />
      <span class="pointer-events-none absolute left-0 top-full z-20 mt-2 w-72 rounded-md border border-border bg-popover p-4 text-sm opacity-0 shadow group-focus-within:opacity-100 group-hover:opacity-100"><ng-content /></span>
    </span>
  `,
})
export class CossPreviewCardComponent {}

@Component({
  standalone: true,
  selector: 'coss-menu',
  imports: [CommonModule],
  template: `
    <div class="relative inline-block">
      <button type="button" [class]="triggerClasses" aria-haspopup="menu" [attr.aria-expanded]="open()" (click)="toggle()"><ng-content select="[menu-trigger]" /></button>
      <div *ngIf="open()" role="menu" class="absolute right-0 z-20 mt-2 min-w-40 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"><ng-content /></div>
    </div>
  `,
})
export class CossMenuComponent {
  readonly open = signal(false);
  triggerClasses = buttonClasses('outline', 'default');
  toggle(): void {
    this.open.update((value) => !value);
  }
}

@Component({
  standalone: true,
  selector: 'coss-menu-item',
  template: `<button type="button" role="menuitem" class="flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"><ng-content /></button>`,
})
export class CossMenuItemComponent {}

@Component({
  standalone: true,
  selector: 'coss-command',
  imports: [CommonModule, FormsModule, CossInputDirective],
  template: `
    <div class="overflow-hidden rounded-lg border border-border bg-popover">
      <input cossInput [(ngModel)]="query" [placeholder]="placeholder" aria-label="Command search" />
      <div role="listbox" class="max-h-64 overflow-y-auto p-1">
        <button *ngFor="let item of filtered()" type="button" role="option" class="flex w-full rounded px-2 py-1.5 text-left text-sm hover:bg-accent">{{ item.label }}</button>
      </div>
    </div>
  `,
})
export class CossCommandComponent {
  @NgInput() placeholder = 'Search...';
  @NgInput() items: Array<{ label: string; value: string }> = [];
  query = '';

  filtered(): Array<{ label: string; value: string }> {
    const query = this.query.toLowerCase();
    return this.items.filter((item) => item.label.toLowerCase().includes(query));
  }
}

@Component({
  standalone: true,
  selector: 'coss-autocomplete, coss-combobox',
  imports: [CommonModule, FormsModule, CossInputDirective],
  template: `
    <div class="relative">
      <input cossInput role="combobox" [attr.aria-expanded]="filtered().length > 0" [attr.aria-label]="label" [(ngModel)]="query" [placeholder]="placeholder" />
      <div *ngIf="filtered().length" role="listbox" class="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-md">
        <button *ngFor="let option of filtered()" type="button" role="option" class="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-accent" (click)="select(option)">{{ option.label }}</button>
      </div>
    </div>
  `,
})
export class CossAutocompleteComponent {
  @NgInput() label = 'Autocomplete';
  @NgInput() placeholder = 'Search...';
  @NgInput() options: Array<{ label: string; value: string }> = [];
  @Output() valueChange = new EventEmitter<string>();
  query = '';

  filtered(): Array<{ label: string; value: string }> {
    const query = this.query.toLowerCase();
    return query ? this.options.filter((option) => option.label.toLowerCase().includes(query)) : [];
  }
  select(option: { label: string; value: string }): void {
    this.query = option.label;
    this.valueChange.emit(option.value);
  }
}

@Component({
  standalone: true,
  selector: 'coss-calendar',
  imports: [CossInputDirective],
  template: `<input cossInput type="date" [value]="value" [attr.aria-label]="label" (change)="change($event)" />`,
})
export class CossCalendarComponent {
  @NgInput() label = 'Choose date';
  @NgInput() value = '';
  @Output() valueChange = new EventEmitter<string>();
  change(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(this.value);
  }
}

@Component({
  standalone: true,
  selector: 'coss-date-picker',
  imports: [CossCalendarComponent],
  template: `<coss-calendar [label]="label" [value]="value" (valueChange)="valueChange.emit($event)" />`,
})
export class CossDatePickerComponent {
  @NgInput() label = 'Choose date';
  @NgInput() value = '';
  @Output() valueChange = new EventEmitter<string>();
}

@Component({
  standalone: true,
  selector: 'coss-pagination',
  imports: [CommonModule, CossButtonDirective],
  template: `
    <nav class="flex items-center gap-1" aria-label="Pagination">
      <button cossButton variant="outline" size="sm" type="button" [disabled]="page <= 1" (click)="go(page - 1)">Previous</button>
      <button *ngFor="let item of pages()" cossButton [variant]="item === page ? 'default' : 'ghost'" size="sm" type="button" [attr.aria-current]="item === page ? 'page' : null" (click)="go(item)">{{ item }}</button>
      <button cossButton variant="outline" size="sm" type="button" [disabled]="page >= total" (click)="go(page + 1)">Next</button>
    </nav>
  `,
})
export class CossPaginationComponent {
  @NgInput({ transform: numberAttribute }) page = 1;
  @NgInput({ transform: numberAttribute }) total = 1;
  @Output() pageChange = new EventEmitter<number>();

  pages(): number[] {
    return Array.from({ length: this.total }, (_, index) => index + 1);
  }
  go(page: number): void {
    this.page = Math.max(1, Math.min(this.total, page));
    this.pageChange.emit(this.page);
  }
}

@Component({
  standalone: true,
  selector: 'coss-scroll-area',
  template: `<div class="overflow-auto rounded-md border border-border" [style.max-height]="maxHeight"><ng-content /></div>`,
})
export class CossScrollAreaComponent {
  @NgInput() maxHeight = '16rem';
}

@Component({
  standalone: true,
  selector: 'coss-table',
  template: `<div class="w-full overflow-auto"><table class="w-full caption-bottom text-sm"><ng-content /></table></div>`,
})
export class CossTableComponent {}

@Component({
  standalone: true,
  selector: 'coss-toolbar',
  template: `<div role="toolbar" class="flex items-center gap-1 rounded-md border border-border bg-background p-1"><ng-content /></div>`,
})
export class CossToolbarComponent {}

@Component({
  standalone: true,
  selector: 'coss-breadcrumb',
  template: `<nav aria-label="Breadcrumb"><ol class="flex flex-wrap items-center gap-1.5 text-muted-foreground text-sm"><ng-content /></ol></nav>`,
})
export class CossBreadcrumbComponent {}

@Component({
  standalone: true,
  selector: 'coss-breadcrumb-item',
  template: `<li class="inline-flex items-center gap-1.5"><ng-content /></li>`,
})
export class CossBreadcrumbItemComponent {}

@Component({
  standalone: true,
  selector: 'coss-toast',
  template: `<div role="status" class="rounded-md border border-border bg-background p-4 text-sm shadow-lg"><ng-content /></div>`,
})
export class CossToastComponent {}

export const COSS_COMPONENTS = [
  CossAccordionComponent,
  CossAccordionItemComponent,
  CossAlertComponent,
  CossAlertDialogComponent,
  CossAutocompleteComponent,
  CossAvatarComponent,
  CossBadgeComponent,
  CossBreadcrumbComponent,
  CossBreadcrumbItemComponent,
  CossButtonComponent,
  CossButtonDirective,
  CossCalendarComponent,
  CossCardComponent,
  CossCardContentComponent,
  CossCardDescriptionComponent,
  CossCardFooterComponent,
  CossCardHeaderComponent,
  CossCardTitleComponent,
  CossCheckboxComponent,
  CossCheckboxGroupComponent,
  CossCollapsibleComponent,
  CossCommandComponent,
  CossDatePickerComponent,
  CossDialogComponent,
  CossDrawerComponent,
  CossEmptyComponent,
  CossFieldComponent,
  CossFieldDescriptionComponent,
  CossFieldErrorComponent,
  CossFieldsetComponent,
  CossFormComponent,
  CossFrameComponent,
  CossGroupComponent,
  CossGroupSeparatorComponent,
  CossInputAddonComponent,
  CossInputDirective,
  CossInputGroupComponent,
  CossKbdComponent,
  CossKbdGroupComponent,
  CossLabelDirective,
  CossLegendComponent,
  CossMenuComponent,
  CossMenuItemComponent,
  CossMeterComponent,
  CossNumberFieldComponent,
  CossOtpFieldComponent,
  CossPaginationComponent,
  CossPopoverComponent,
  CossPreviewCardComponent,
  CossProgressComponent,
  CossRadioGroupComponent,
  CossScrollAreaComponent,
  CossSelectComponent,
  CossSeparatorComponent,
  CossSkeletonComponent,
  CossSliderComponent,
  CossSpinnerComponent,
  CossSwitchComponent,
  CossTableComponent,
  CossTabsComponent,
  CossTextareaDirective,
  CossToastComponent,
  CossToggleComponent,
  CossToggleGroupComponent,
  CossTooltipComponent,
  CossToolbarComponent,
] as const;
