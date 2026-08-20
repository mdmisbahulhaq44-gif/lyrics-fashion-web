const fs = require('fs');
const file = 'index.html';
let content = fs.readFileSync(file, 'utf8');

const oldJs = `syncPickerSheetHeight()
// Don't force the keyboard open immediately — let the sheet settle into
// view first, then focus. syncPickerSheetHeight (bound to visualViewport's
// resize event above) keeps the sheet correctly sized once the keyboard
// does appear, so the list stays visible instead of being pushed off-screen.
setTimeout(() => {
$("pickerSearchInput").focus()
syncPickerSheetHeight()
}, 150)
}`;

const newJs = `syncPickerSheetHeight()
// The keyboard is intentionally NOT auto-opened here. The search input
// stays visible and usable, but the keyboard only appears once the person
// taps into it themselves (like Facebook/YouTube search) — auto-focusing
// it used to pop the keyboard open immediately, which looked jarring and
// covered part of the list on smaller screens.
}`;

if(!content.includes(oldJs)){
console.error('❌ Target block not found — file may already be patched or different.');
process.exit(1);
}

content = content.replace(oldJs, newJs);
fs.writeFileSync(file, content, 'utf8');
console.log('✅ Patch applied successfully to ' + file);
