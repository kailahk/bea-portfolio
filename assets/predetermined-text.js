// Predetermined text for new text areas — edit this file directly to change
// what shows up. Each string in this array is one entry.
//
// How it's used (see main.js's pickNextText()):
//   - The first 3 entries seed the page's starting text areas on load.
//   - Every "+ Add Text Area" click after that pulls the next entry in
//     order (4th, 5th, 6th, ...).
//   - Once the list runs out, "+" falls back to the random Frankenstein
//     text generator as before.
//
// Font size ranges follow the same rule as the Frankenstein text: entries
// of 320 characters or less are treated as "short" and get a larger random
// font size (55-95px); anything longer is treated as a "long" passage and
// gets a smaller random font size (20-42px). See RANDOM_BOUNDS and
// classifyTextLength() in main.js if those thresholds or ranges ever need
// to change.
//
// A "\n" inside an entry is a real line break in the text area (used below
// for the two multi-line credit/title blocks).
window.PREDETERMINED_TEXTS = [
    "Bea Korsh",
    "Artist, Musician, & Designer",
    "Drawings Drums Photographs Posters Calligraphy Comics\nGlitches Typefaces",
    "Intrusive Thots",
    "40 Page Broadsheet Newsprint Comic\nPublished in 2026\nby the People’s\nCoalition of Tandy",
    "Intrusive Thots is the personal record I started in August 2024, anxiously awaiting my admittance into an intensive outpatient program for personality disorders. I concluded both the program and IT a year later, no longer needing either to survive.",
    "IT started out as mine alone, but by the end, I was intent on publishing it. The result is a twisted assemblage of revelation and redaction, neither a chronicle nor a journal. I begin depicting self harm, masturbation, childhood trauma, and dissociative episodes. I continue hiding deep secrets. I redact names and only include information concerning my peers with their consent. As I whirl through painful cycles of joy and dread, love and paranoia, introspection and psychoticism, new desires emerge on the page: to embrace reality, to be understood, to relax. Nothing resolves, but everything evolves, most of all my sense of self and others.",
    "Intrusive Thots is available from PCOT, Domino Books, Desert Island",
    "Join Bea for Figure Drawing on Mondays at the Salon on Kingston",
    "Bea enjoys the privilege of working for accomplished typeface designers like David Jonathan Ross, Christian Schwartz, and Lynne Yun. Her own fonts are informed by drum kits and comics as much as they are by letterform history and convention."
];
