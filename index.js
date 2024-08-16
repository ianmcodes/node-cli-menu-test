import ansiEscapes from 'ansi-escapes';
import readline from 'readline';

const { stdin, stdout } = process;
const { rows, columns  } = stdout;

readline.emitKeypressEvents(stdin);
if (stdin.isTTY) {
  stdin.setRawMode(true);
}

// const menuItems = [
//   "dog",
//   "cat",
//   "mouse",
//   "elephant",
//   "bear"
// ];
const menuItems = [
  "dog", "cat", "mouse", "elephant", "bear", "lion", "tiger", "giraffe", "zebra", "rhino",
  "hippo", "kangaroo", "koala", "panda", "leopard", "cheetah", "wolf", "fox", "deer", "moose",
  "buffalo", "bison", "camel", "donkey", "horse", "goat", "sheep", "pig", "cow", "rabbit",
  "squirrel", "bat", "otter", "beaver", "raccoon", "skunk", "hedgehog", "porcupine", "armadillo", "sloth"
];
let selectedIndex = 0;
let pageStart = 0;
let pageEnd = Math.min(menuItems.length, rows - 3);

function drawMenu() {
  if (selectedIndex < pageStart) {
    pageStart = selectedIndex;
    pageEnd = Math.min(menuItems.length, pageStart + rows - 2);
  }
  if (selectedIndex >= pageEnd) {
    pageEnd = selectedIndex + 1;
    pageStart = Math.max(0, pageEnd - rows + 2);
  }
  let items = menuItems.slice(pageStart, pageEnd);
  return `Select one:\n${items.map((item, index) => `  ${index === (selectedIndex - pageStart) ? '>' : ' '}${item}`).join("\n")}\n`;
}

stdin.on('keypress', (key, code) => {
  // console.log(key,code);
  if (code.sequence === '\u0003') {
    process.exit();
  }
  if (code.name === 'up') {
    selectedIndex = Math.max(0, selectedIndex - 1);
  }
  if (code.name === 'down') {
    selectedIndex = Math.min(menuItems.length - 1, selectedIndex + 1);
  }
  if (code.name === 'return') {
    stdout.write(`You selected: ${menuItems[selectedIndex]}\n`);
    process.exit();
  }
  // redraw menu
  // process.stdout.write(ansiEscapes.cursorUp(menuItems.length + 1));
  stdout.write(ansiEscapes.cursorRestorePosition);
  stdout.write(ansiEscapes.eraseDown);
  stdout.write(drawMenu());
});
stdout.write(ansiEscapes.cursorSavePosition);
stdout.write(drawMenu());
stdin.resume();
