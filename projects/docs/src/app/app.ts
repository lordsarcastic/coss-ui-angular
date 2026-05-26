import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { COSS_COMPONENTS } from 'coss-ui-angular';

type ComponentDoc = {
  name: string;
  selector: string;
  category: string;
  summary: string;
  usage: string;
  api: string[];
  accessibility: string;
};

const docs: ComponentDoc[] = [
  {
    name: 'Accordion',
    selector: 'coss-accordion, coss-accordion-item',
    category: 'Disclosure',
    summary: 'Stacked disclosure panels for dense settings, FAQs, and supporting details.',
    usage:
      '<coss-accordion><coss-accordion-item><span accordion-trigger>Details</span>Content</coss-accordion-item></coss-accordion>',
    api: [
      'Use the accordion-trigger attribute for the summary content.',
      'Projects regular body content into the open panel.',
    ],
    accessibility: 'Built on native details and summary for keyboard and screen-reader support.',
  },
  {
    name: 'Alert',
    selector: 'coss-alert',
    category: 'Feedback',
    summary: 'Status messaging for contextual success, warning, info, and destructive states.',
    usage: '<coss-alert variant="warning">Review this before continuing.</coss-alert>',
    api: ['variant: default | destructive | info | success | warning'],
    accessibility: 'Uses role="alert" so important messages are announced by assistive technology.',
  },
  {
    name: 'Alert Dialog',
    selector: 'coss-alert-dialog',
    category: 'Overlay',
    summary: 'A confirmation dialog wrapper for destructive or high-impact actions.',
    usage: '<coss-alert-dialog [open]="isOpen" label="Delete item">...</coss-alert-dialog>',
    api: ['open: boolean', 'label: string', 'openChange: EventEmitter<boolean>'],
    accessibility: 'Wraps the dialog primitive with aria-modal and an explicit label.',
  },
  {
    name: 'Autocomplete',
    selector: 'coss-autocomplete, coss-combobox',
    category: 'Input',
    summary: 'Search-as-you-type suggestions for selecting a value from a provided option list.',
    usage: '<coss-autocomplete [options]="options" (valueChange)="value = $event" />',
    api: [
      'label: string',
      'placeholder: string',
      'options: { label; value }[]',
      'valueChange: EventEmitter<string>',
    ],
    accessibility: 'Uses combobox and listbox roles with labelled input semantics.',
  },
  {
    name: 'Avatar',
    selector: 'coss-avatar',
    category: 'Display',
    summary: 'Circular identity image with text fallback for users, teams, and objects.',
    usage: '<coss-avatar src="/avatar.png" alt="Ada Lovelace" fallback="AL" />',
    api: ['src: string', 'alt: string', 'fallback: string'],
    accessibility:
      'Pass meaningful alt text for real people; use an empty alt for decorative images.',
  },
  {
    name: 'Badge',
    selector: 'coss-badge',
    category: 'Display',
    summary: 'Compact metadata labels for status, counts, priorities, and tags.',
    usage: '<coss-badge variant="success">Stable</coss-badge>',
    api: ['variant: default | secondary | outline | destructive | success | warning | info'],
    accessibility: 'Rendered as inline text so it inherits surrounding reading order naturally.',
  },
  {
    name: 'Breadcrumb',
    selector: 'coss-breadcrumb, coss-breadcrumb-item',
    category: 'Navigation',
    summary: 'A hierarchical trail for nested pages and documentation sections.',
    usage:
      '<coss-breadcrumb><coss-breadcrumb-item><a href="/">Home</a></coss-breadcrumb-item></coss-breadcrumb>',
    api: [
      'Use coss-breadcrumb-item for each item.',
      'Place anchors or current-page text inside items.',
    ],
    accessibility: 'Uses aria-label="Breadcrumb" and an ordered list structure.',
  },
  {
    name: 'Button',
    selector: 'button[cossButton], a[cossButton], coss-button',
    category: 'Action',
    summary: 'Primary command primitive with COSS variants and predictable sizing.',
    usage: '<button cossButton variant="outline" size="sm" type="button">Save</button>',
    api: [
      'variant: default | secondary | outline | ghost | link | destructive | destructive-outline',
      'size: xs | sm | default | lg | xl | icon | icon-sm | icon-lg',
      'loading: boolean',
    ],
    accessibility:
      'Prefer the directive on native button or anchor elements to preserve native semantics.',
  },
  {
    name: 'Calendar',
    selector: 'coss-calendar',
    category: 'Input',
    summary: 'Date selection wrapper using native date input semantics.',
    usage: '<coss-calendar label="Due date" [(value)]="date" />',
    api: ['label: string', 'value: string', 'valueChange: EventEmitter<string>'],
    accessibility: 'Uses native input type="date" and requires a label for screen readers.',
  },
  {
    name: 'Card',
    selector: 'coss-card and card subcomponents',
    category: 'Layout',
    summary: 'A framed surface for related content with header, content, and footer slots.',
    usage:
      '<coss-card><coss-card-header><coss-card-title>Title</coss-card-title></coss-card-header></coss-card>',
    api: [
      'coss-card-header',
      'coss-card-title',
      'coss-card-description',
      'coss-card-content',
      'coss-card-footer',
    ],
    accessibility: 'Uses semantic section/header/footer wrappers where appropriate.',
  },
  {
    name: 'Checkbox',
    selector: 'coss-checkbox, coss-checkbox-group',
    category: 'Input',
    summary: 'Boolean input compatible with Angular forms through ControlValueAccessor.',
    usage: '<coss-checkbox [(ngModel)]="accepted" />',
    api: ['disabled: boolean', 'ngModel / formControl support'],
    accessibility: 'Exposes role="checkbox" and aria-checked state.',
  },
  {
    name: 'Collapsible',
    selector: 'coss-collapsible',
    category: 'Disclosure',
    summary: 'Lightweight controlled disclosure pattern for inline expandable content.',
    usage:
      '<coss-collapsible><span collapsible-trigger>More</span>Hidden content</coss-collapsible>',
    api: [
      'Use collapsible-trigger for trigger content.',
      'Internal open state is managed by the component.',
    ],
    accessibility: 'The trigger exposes aria-expanded.',
  },
  {
    name: 'Command',
    selector: 'coss-command',
    category: 'Navigation',
    summary: 'Filterable command list for quick actions, navigation, and palettes.',
    usage: '<coss-command [items]="commands" placeholder="Search commands..." />',
    api: ['placeholder: string', 'items: { label; value }[]'],
    accessibility: 'Uses a labelled search field with listbox and option roles.',
  },
  {
    name: 'Date Picker',
    selector: 'coss-date-picker',
    category: 'Input',
    summary: 'Convenience date picker component that reuses the calendar primitive.',
    usage: '<coss-date-picker label="Start date" (valueChange)="date = $event" />',
    api: ['label: string', 'value: string', 'valueChange: EventEmitter<string>'],
    accessibility: 'Inherits native date input behavior from Calendar.',
  },
  {
    name: 'Dialog',
    selector: 'coss-dialog',
    category: 'Overlay',
    summary: 'Modal overlay for forms, confirmations, and focused detail views.',
    usage:
      '<coss-dialog [open]="open" label="Edit profile" (openChange)="open = $event">...</coss-dialog>',
    api: [
      'open: boolean',
      'showTrigger: boolean',
      'label: string',
      'openChange: EventEmitter<boolean>',
    ],
    accessibility: 'Uses role="dialog", aria-modal, escape-to-close, and click-outside close.',
  },
  {
    name: 'Drawer / Sheet',
    selector: 'coss-drawer, coss-sheet',
    category: 'Overlay',
    summary: 'Edge-attached dialog for navigation, filters, and secondary workflows.',
    usage: '<coss-drawer [open]="open" side="right" label="Filters">...</coss-drawer>',
    api: [
      'open: boolean',
      'side: left | right | top | bottom',
      'label: string',
      'openChange: EventEmitter<boolean>',
    ],
    accessibility: 'Uses dialog semantics and a backdrop that closes the surface.',
  },
  {
    name: 'Empty',
    selector: 'coss-empty',
    category: 'Feedback',
    summary: 'Centered empty-state region for missing data and first-run experiences.',
    usage: '<coss-empty>No records yet.</coss-empty>',
    api: ['Projects arbitrary content.'],
    accessibility: 'Keeps text in normal document flow for straightforward announcements.',
  },
  {
    name: 'Field',
    selector: 'coss-field, coss-field-description, coss-field-error',
    category: 'Form',
    summary: 'Composable form field structure for labels, descriptions, controls, and errors.',
    usage:
      '<coss-field><label cossLabel>Email</label><input cossInput /><coss-field-error>Required</coss-field-error></coss-field>',
    api: ['Use label[cossLabel], coss-field-description, and coss-field-error together.'],
    accessibility: 'Error text uses role="alert"; connect IDs with aria-describedby in app forms.',
  },
  {
    name: 'Fieldset',
    selector: 'coss-fieldset, coss-legend',
    category: 'Form',
    summary: 'Grouped form section with semantic legend support.',
    usage: '<coss-fieldset><coss-legend>Preferences</coss-legend>...</coss-fieldset>',
    api: ['Projects grouped controls.', 'Use coss-legend for group title.'],
    accessibility: 'Renders a native fieldset and legend.',
  },
  {
    name: 'Form',
    selector: 'coss-form',
    category: 'Form',
    summary: 'Simple form layout primitive with consistent vertical rhythm.',
    usage: '<coss-form>...</coss-form>',
    api: ['Projects form content.', 'Uses novalidate by default.'],
    accessibility: 'Renders a native form element.',
  },
  {
    name: 'Frame',
    selector: 'coss-frame',
    category: 'Layout',
    summary: 'Minimal bordered container for previews, code samples, and embedded tools.',
    usage: '<coss-frame>Preview content</coss-frame>',
    api: ['Projects arbitrary content.'],
    accessibility: 'Visual-only structure; add labels/headings around complex framed content.',
  },
  {
    name: 'Group',
    selector: 'coss-group, coss-group-separator',
    category: 'Action',
    summary: 'Button or control grouping with shared borders and separators.',
    usage:
      '<coss-group><button cossButton>One</button><button cossButton>Two</button></coss-group>',
    api: ['Projects controls.', 'Use coss-group-separator for explicit divisions.'],
    accessibility: 'Uses role="group" for grouped controls.',
  },
  {
    name: 'Input',
    selector: 'input[cossInput], select[cossInput]',
    category: 'Form',
    summary: 'Native text/select styling directive with COSS focus and disabled states.',
    usage: '<input cossInput id="email" type="email" placeholder="you@example.com" />',
    api: ['size: sm | default | lg', 'unstyled: boolean'],
    accessibility: 'Keeps native input semantics; pair with label[cossLabel].',
  },
  {
    name: 'Input Group',
    selector: 'coss-input-group, coss-input-addon',
    category: 'Form',
    summary: 'Inline composition for controls with prefixes, suffixes, and action buttons.',
    usage:
      '<coss-input-group><coss-input-addon>$</coss-input-addon><input cossInput unstyled /></coss-input-group>',
    api: ['Use coss-input-addon for prefix or suffix content.'],
    accessibility: 'Ensure addons are decorative or included in the input accessible name.',
  },
  {
    name: 'Keyboard Key',
    selector: 'coss-kbd, coss-kbd-group',
    category: 'Display',
    summary: 'Keyboard shortcut display for command surfaces and help text.',
    usage: '<coss-kbd-group><coss-kbd>⌘</coss-kbd><coss-kbd>K</coss-kbd></coss-kbd-group>',
    api: ['Projects shortcut labels.'],
    accessibility: 'Rendered as kbd for semantic keyboard input text.',
  },
  {
    name: 'Label',
    selector: 'label[cossLabel]',
    category: 'Form',
    summary: 'Consistent form label styling while preserving native label behavior.',
    usage: '<label cossLabel for="email">Email</label>',
    api: ['Use as an attribute directive on native label elements.'],
    accessibility: 'The native label element keeps click and screen-reader associations.',
  },
  {
    name: 'Menu',
    selector: 'coss-menu, coss-menu-item',
    category: 'Overlay',
    summary: 'Compact popup menu for contextual actions.',
    usage:
      '<coss-menu><span menu-trigger>Open</span><coss-menu-item>Edit</coss-menu-item></coss-menu>',
    api: ['Use menu-trigger for trigger content.', 'Use coss-menu-item for actions.'],
    accessibility: 'Trigger exposes aria-haspopup and aria-expanded; menu items use menuitem role.',
  },
  {
    name: 'Meter',
    selector: 'coss-meter',
    category: 'Feedback',
    summary: 'Bounded scalar value display for usage, health, and quota indicators.',
    usage: '<coss-meter [value]="42" [min]="0" [max]="100">Usage</coss-meter>',
    api: ['value: number', 'min: number', 'max: number'],
    accessibility: 'Uses role="meter" with aria-valuemin, aria-valuemax, and aria-valuenow.',
  },
  {
    name: 'Number Field',
    selector: 'coss-number-field',
    category: 'Form',
    summary: 'Numeric input with increment and decrement controls.',
    usage: '<coss-number-field label="Seats" [min]="1" [max]="10" [(value)]="seats" />',
    api: [
      'label: string',
      'min: number',
      'max: number',
      'step: number',
      'valueChange: EventEmitter<number>',
    ],
    accessibility:
      'Buttons include descriptive aria-label values and input remains native number input.',
  },
  {
    name: 'OTP Field',
    selector: 'coss-otp-field',
    category: 'Form',
    summary: 'One-time password input split into single-character boxes.',
    usage: '<coss-otp-field [length]="6" (completed)="code = $event" />',
    api: ['label: string', 'length: number', 'completed: EventEmitter<string>'],
    accessibility: 'Uses a labelled group and per-digit input labels.',
  },
  {
    name: 'Pagination',
    selector: 'coss-pagination',
    category: 'Navigation',
    summary: 'Page navigation control with previous, numeric, and next buttons.',
    usage: '<coss-pagination [page]="page" [total]="8" (pageChange)="page = $event" />',
    api: ['page: number', 'total: number', 'pageChange: EventEmitter<number>'],
    accessibility: 'Uses nav aria-label="Pagination" and aria-current for the active page.',
  },
  {
    name: 'Popover',
    selector: 'coss-popover',
    category: 'Overlay',
    summary: 'Small positioned surface for supplementary content and lightweight forms.',
    usage: '<coss-popover><span popover-trigger>Open</span>Popover content</coss-popover>',
    api: [
      'Use popover-trigger for trigger content.',
      'Internal open state is managed by the component.',
    ],
    accessibility: 'Trigger exposes aria-expanded and content uses dialog role.',
  },
  {
    name: 'Preview Card',
    selector: 'coss-preview-card',
    category: 'Overlay',
    summary: 'Hover/focus preview surface for links, users, and referenced objects.',
    usage: '<coss-preview-card><a preview-trigger href="/">Home</a>Preview</coss-preview-card>',
    api: ['Use preview-trigger for trigger content.', 'Projects preview content.'],
    accessibility: 'Preview appears on hover and focus-within.',
  },
  {
    name: 'Progress',
    selector: 'coss-progress',
    category: 'Feedback',
    summary: 'Horizontal progress indicator for completion and loading state.',
    usage: '<coss-progress [value]="60" [max]="100" />',
    api: ['value: number', 'max: number'],
    accessibility: 'Uses progressbar role with numeric ARIA value attributes.',
  },
  {
    name: 'Radio Group',
    selector: 'coss-radio-group',
    category: 'Form',
    summary: 'Single-choice option group using native radio inputs.',
    usage: '<coss-radio-group [options]="options" [(value)]="selected" />',
    api: [
      'name: string',
      'value: string',
      'options: { label; value }[]',
      'valueChange: EventEmitter<string>',
    ],
    accessibility: 'Uses radiogroup role and native radio inputs hidden visually.',
  },
  {
    name: 'Scroll Area',
    selector: 'coss-scroll-area',
    category: 'Layout',
    summary: 'Bounded scroll container with consistent border treatment.',
    usage: '<coss-scroll-area maxHeight="20rem">Long content</coss-scroll-area>',
    api: ['maxHeight: string'],
    accessibility: 'Content remains in the DOM and native scrolling is preserved.',
  },
  {
    name: 'Select',
    selector: 'coss-select',
    category: 'Form',
    summary: 'Styled native select wrapper for small option sets.',
    usage: '<coss-select [options]="options" label="Status" [(value)]="status" />',
    api: [
      'label: string',
      'value: string',
      'options: { label; value }[]',
      'valueChange: EventEmitter<string>',
    ],
    accessibility: 'Uses native select semantics.',
  },
  {
    name: 'Separator',
    selector: 'coss-separator',
    category: 'Layout',
    summary: 'Horizontal or vertical visual divider.',
    usage: '<coss-separator orientation="horizontal" />',
    api: ['orientation: horizontal | vertical'],
    accessibility: 'Uses role="separator" with aria-orientation.',
  },
  {
    name: 'Skeleton',
    selector: 'coss-skeleton',
    category: 'Feedback',
    summary: 'Placeholder block for loading cards, rows, and controls.',
    usage: '<coss-skeleton className="h-8 w-48" />',
    api: ['className: string'],
    accessibility: 'Marked aria-hidden; pair with visible loading text when needed.',
  },
  {
    name: 'Slider',
    selector: 'coss-slider',
    category: 'Form',
    summary: 'Range input for continuous numeric values.',
    usage: '<coss-slider label="Volume" [min]="0" [max]="100" [(value)]="volume" />',
    api: [
      'label: string',
      'min: number',
      'max: number',
      'step: number',
      'value: number',
      'valueChange: EventEmitter<number>',
    ],
    accessibility: 'Uses native input type="range" with aria-label.',
  },
  {
    name: 'Spinner',
    selector: 'coss-spinner',
    category: 'Feedback',
    summary: 'Small loading indicator for buttons and inline async states.',
    usage: '<coss-spinner size="sm" label="Saving" />',
    api: ['size: sm | default | lg', 'label: string'],
    accessibility: 'Uses role="status" and an accessible label.',
  },
  {
    name: 'Switch',
    selector: 'coss-switch',
    category: 'Form',
    summary: 'Boolean setting toggle compatible with Angular forms.',
    usage: '<coss-switch [(ngModel)]="enabled" />',
    api: ['disabled: boolean', 'ngModel / formControl support'],
    accessibility: 'Exposes role="switch" and aria-checked state.',
  },
  {
    name: 'Table',
    selector: 'coss-table',
    category: 'Data',
    summary: 'Responsive table wrapper for structured tabular data.',
    usage: '<coss-table><thead>...</thead><tbody>...</tbody></coss-table>',
    api: ['Projects native table sections and rows.'],
    accessibility: 'Preserves native table semantics.',
  },
  {
    name: 'Tabs',
    selector: 'coss-tabs',
    category: 'Navigation',
    summary: 'Tabbed navigation header with panel slot.',
    usage: '<coss-tabs [tabs]="tabs" value="preview">Panel content</coss-tabs>',
    api: ['tabs: { label; value }[]', 'value: string'],
    accessibility: 'Uses tablist, tab, tabpanel, and aria-selected attributes.',
  },
  {
    name: 'Textarea',
    selector: 'textarea[cossTextarea]',
    category: 'Form',
    summary: 'Multi-line text input styling directive.',
    usage: '<textarea cossTextarea id="notes"></textarea>',
    api: ['Use as an attribute directive on native textarea elements.'],
    accessibility: 'Keeps native textarea behavior; pair with label[cossLabel].',
  },
  {
    name: 'Toast',
    selector: 'coss-toast',
    category: 'Feedback',
    summary: 'Small notification surface for transient updates.',
    usage: '<coss-toast>Saved successfully.</coss-toast>',
    api: ['Projects arbitrary toast content.'],
    accessibility: 'Uses role="status" for polite announcement.',
  },
  {
    name: 'Toggle',
    selector: 'coss-toggle, coss-toggle-group',
    category: 'Action',
    summary: 'Pressed/unpressed button state for formatting, filters, and segmented controls.',
    usage: '<coss-toggle variant="outline">Bold</coss-toggle>',
    api: ['variant: default | outline', 'Internal pressed state is managed by the component.'],
    accessibility: 'Uses aria-pressed on the toggle button.',
  },
  {
    name: 'Toolbar',
    selector: 'coss-toolbar',
    category: 'Action',
    summary: 'Horizontal command strip for editor and dashboard controls.',
    usage: '<coss-toolbar><button cossButton size="icon">B</button></coss-toolbar>',
    api: ['Projects controls.'],
    accessibility: 'Uses role="toolbar".',
  },
  {
    name: 'Tooltip',
    selector: 'coss-tooltip',
    category: 'Overlay',
    summary: 'Hover/focus label for icon-only controls and compact UI.',
    usage: '<coss-tooltip text="Refresh"><button cossButton size="icon">↻</button></coss-tooltip>',
    api: ['text: string'],
    accessibility: 'Tooltip content uses role="tooltip" and appears on hover or focus-within.',
  },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, COSS_COMPONENTS],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly query = signal('');
  readonly category = signal('All');
  readonly docs = docs;
  readonly categories = ['All', ...Array.from(new Set(docs.map((doc) => doc.category))).sort()];
  readonly filteredDocs = computed(() => {
    const query = this.query().trim().toLowerCase();
    const category = this.category();

    return this.docs.filter((doc) => {
      const matchesCategory = category === 'All' || doc.category === category;
      const text = `${doc.name} ${doc.selector} ${doc.summary} ${doc.category}`.toLowerCase();
      return matchesCategory && (!query || text.includes(query));
    });
  });

  readonly installSnippet = `npm install coss-ui-angular`;
  readonly importSnippet =
    `import { CossButtonDirective, CossCardComponent } from 'coss-ui-angular';`;
  readonly themeSnippet = `content: [
  './src/**/*.{html,ts}',
  './node_modules/coss-ui-angular/**/*.{mjs,js}',
]`;

  readonly commandItems = [
    { label: 'Open docs', value: 'docs' },
    { label: 'Install package', value: 'install' },
    { label: 'Read accessibility notes', value: 'a11y' },
  ];
  readonly selectOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ];
  readonly radioOptions = [
    { label: 'Compact', value: 'compact' },
    { label: 'Comfortable', value: 'comfortable' },
  ];
  readonly tabItems = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' },
    { label: 'A11y', value: 'a11y' },
  ];
}
