// Left sidebar contents — edit this file directly to change what's listed.
// Each entry is one bullet in the always-visible left sidebar.
//
// Two kinds of entries:
//   { type: 'text', label: '...' }
//     A plain bullet — just displays the label, does nothing when clicked.
//   { type: 'button', label: '...', text: '...' }
//     A clickable bullet. Clicking it adds a brand-new text area (same as
//     clicking "+") preloaded with `text` instead of random Frankenstein
//     text — everything else about the box (font, size, leading, opsz,
//     alignment, All Caps) is still randomized fresh each time, and
//     clicking the same button again adds another box rather than
//     re-using the first one.
//
// Font size for a button's box follows the same rule as everywhere else on
// the site: `text` of 320 characters or less is treated as "short" and
// gets the larger size range (55-95px); anything longer gets the smaller
// range (20-42px). See RANDOM_BOUNDS and classifyTextLength() in main.js.
//
// The examples below are placeholders so the sidebar has something to show
// and click-test — replace label/text with whatever you actually want
// listed, add or remove entries freely, and reorder as you like.
window.SIDEBAR_ITEMS = [
    { type: 'text', label: 'About' },
    { type: 'button', label: 'Bea Korsh', text: 'Bea Korsh' },
    { type: 'text', label: 'Publications' },
    { type: 'button', label: 'Intrusive Thots', text: 'Intrusive Thots is available from PCOT, Domino Books, Desert Island' },
    { type: 'text', label: 'Events' },
    { type: 'button', label: 'Figure Drawing', text: 'Join Bea for Figure Drawing on Mondays at the Salon on Kingston' }
];
