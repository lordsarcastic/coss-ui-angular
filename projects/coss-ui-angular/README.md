# @lordsarcastic/coss-ui-angular

Standalone Angular components inspired by COSS UI and built for copyable, accessible product interfaces.

Hosted documentation: https://coss-ui.lordsarcastic.dev

## Install

```bash
npm install @lordsarcastic/coss-ui-angular
```

## Import

```ts
import { CossButtonDirective, CossCardComponent } from '@lordsarcastic/coss-ui-angular';
```

Every export is standalone. You can import one component at a time, or use `COSS_COMPONENTS` for the full collection.

## Example

```html
<coss-card>
  <coss-card-header>
    <coss-card-title>Create project</coss-card-title>
    <coss-card-description>Set up a new workspace.</coss-card-description>
  </coss-card-header>
  <coss-card-content>
    <coss-field>
      <label cossLabel for="project-name">Name</label>
      <input cossInput id="project-name" placeholder="Design system" />
    </coss-field>
  </coss-card-content>
  <coss-card-footer>
    <button cossButton type="button">Create</button>
  </coss-card-footer>
</coss-card>
```

## Exports

Accordion, alert, alert dialog, autocomplete, avatar, badge, breadcrumb, button, calendar, card, checkbox, checkbox group, collapsible, combobox, command, date picker, dialog, drawer, empty state, field, fieldset, form, frame, group, input, input group, keyboard key, label, menu, meter, number field, OTP field, pagination, popover, preview card, progress, radio group, scroll area, select, separator, sheet, skeleton, slider, spinner, switch, table, tabs, textarea, toast, toggle, toggle group, toolbar, and tooltip.
