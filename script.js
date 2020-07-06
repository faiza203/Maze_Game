let wallsManagment;
const { Engine, Render, Runner, World, Bodies } = Matter;
const engine = Engine.create();
const { world } = engine;
const cells = 3;
const width = 800;
const height = 600;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width,
    height,
  },
});
Render.run(render);
Runner.run(Runner.create(), engine);
const shuffle = (arr) => {
  let counter = arr.lenght;
  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;
    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
};
const walls = [
  Bodies.rectangle(width / 2, 0, width, 40, {
    isStatic: true,
  }),
  Bodies.rectangle(width / 2, height, width, 40, {
    isStatic: true,
  }),
  Bodies.rectangle(0, height / 2, 40, height, {
    isStatic: true,
  }),
  Bodies.rectangle(width, height / 2, 40, height, {
    isStatic: true,
  }),
];
World.add(world, walls);
const grid = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false));
const horizontal = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells).fill(false));
const verticular = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false));
const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);
const stepThroughCell = (row, column) => {
  if (grid[row][column]) {
    return;
  }
  grid[row][column] = true;
  const neighbours = shuffle([
    // Current Time we only need of one statement
    // [row - 1, column, "up"],
    // [row, column + 1,"right"],
    // [row + 1, column,"down"],
    [row, column - 1, "left"]
  ]);
  for (let neighbour of neighbours) {
    const [nextrow, nextcolumn, direction] = neighbour;

    if (
      nextrow < 0 ||
      nextrow >= cells ||
      nextcolumn < 0 ||
      nextcolumn >= cells
    ) {
      continue;
    }
    if ((grid[nextrow],[nextcolumn] === false)) {
      continue;
    }
    if (direction === "left") {
      verticular[row][column - 1] = true;
    } else if (direction === "right") {
      verticular[row][column] = true;
    } else if (direction === "up") {
      horizontal[row - 1][column] = true;
    } else if (direction === "down") {
      horizontal[row][column] = true;
    }
  }
};
stepThroughCell(startRow,startColumn);
