# COSS UI Angular

Accessible Angular components inspired by the public COSS UI catalogue at `coss.com/ui/docs`.

This repository contains:

- `projects/coss-ui-angular`: publishable Angular library.
- `projects/docs`: documentation website built with the library components.
- `.github/workflows/ci.yml`: CI for Biome formatting/linting, Angular tests, and production builds.

## Quick Start

```bash
npm install
npm start
```

Build everything:

```bash
npm run build
```

Run checks:

```bash
npm run ci
```

## Use the Library

Install the package after it is published:

```bash
npm install coss-ui-angular
```

Import individual standalone components or directives:

```ts
import { Component } from '@angular/core';
import { CossButtonDirective, CossInputDirective, CossFieldComponent } from 'coss-ui-angular';

@Component({
  standalone: true,
  imports: [CossButtonDirective, CossInputDirective, CossFieldComponent],
  template: `
    <coss-field>
      <label cossLabel for="email">Email</label>
      <input cossInput id="email" type="email" placeholder="you@example.com" />
    </coss-field>

    <button cossButton type="button">Save</button>
  `,
})
export class ExampleComponent {}
```

Or import the full collection:

```ts
import { COSS_COMPONENTS } from 'coss-ui-angular';
```

## Tailwind Setup

The components are styled with Tailwind utility classes and CSS variables. Add the library to your Tailwind content scan:

```js
export default {
  content: ['./src/**/*.{html,ts}', './node_modules/coss-ui-angular/**/*.{mjs,js}'],
};
```

Define the design tokens in your global stylesheet:

```css
:root {
  --background: 5 5 9;
  --foreground: 255 255 255;
  --card: 10 10 15;
  --card-foreground: 255 255 255;
  --popover: 10 10 15;
  --popover-foreground: 255 255 255;
  --primary: 246 166 35;
  --primary-foreground: 5 5 9;
  --secondary: 38 38 45;
  --secondary-foreground: 255 255 255;
  --muted: 38 38 45;
  --muted-foreground: 163 163 163;
  --accent: 39 39 42;
  --accent-foreground: 255 255 255;
  --destructive: 239 68 68;
  --destructive-foreground: 255 255 255;
  --border: 38 38 38;
  --input: 38 38 38;
  --ring: 246 166 35;
  --info: 59 130 246;
  --info-foreground: 255 255 255;
  --success: 34 197 94;
  --success-foreground: 5 5 9;
  --warning: 245 158 11;
  --warning-foreground: 5 5 9;
}
```

## Component Coverage

The library exports Angular versions of the COSS UI surface: accordion, alert, alert dialog, autocomplete, avatar, badge, breadcrumb, button, calendar, card, checkbox, checkbox group, collapsible, combobox, command, date picker, dialog, drawer, empty state, field, fieldset, form, frame, group, input, input group, keyboard key, label, menu, meter, number field, OTP field, pagination, popover, preview card, progress, radio group, scroll area, select, separator, sheet, skeleton, slider, spinner, switch, table, tabs, textarea, toast, toggle, toggle group, toolbar, and tooltip.

## Accessibility

Native controls are preferred where they provide the strongest behavior: `button`, `a`, `input`, `select`, `textarea`, `details`, `summary`, date input, radio input, and form elements. Composite components expose ARIA roles and state such as `dialog`, `menu`, `radiogroup`, `checkbox`, `switch`, `progressbar`, `meter`, `tablist`, `aria-expanded`, `aria-selected`, and `aria-current`.

## Publishing

Build the library before publishing:

```bash
npm run build:lib
cd dist/coss-ui-angular
npm publish
```
