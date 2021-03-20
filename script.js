const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;
const cells = 15;
const width = 1362;
const height = 621;
const unitLength = width / cells;
const engine = Engine.create();
const { world } = engine;
engine.world.gravity.y = 0;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
  },
});
Render.run(render);
Runner.run(Runner.create(), engine);
const shuffle = (arr) => {
  let counter = arr.length;
  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;
    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
};
const grid = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false));
const verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false));
const horizontals = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells).fill(false));
const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);
const stepThroughCell = (row, column) => {
  if (grid[row][column]) {
    return;
  }
  grid[row][column] = true;
  const neighbors = shuffle([
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ]);
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;
    if (
      nextRow < 0 ||
      nextRow >= cells ||
      nextColumn < 0 ||
      nextColumn >= cells
    ) {
      continue;
    }
    if (grid[nextRow][nextColumn]) {
      continue;
    }
    if (direction === "left") {
      verticals[row][column - 1] = true;
    } else if (direction === "right") {
      verticals[row][column] = true;
    } else if (direction === "up") {
      horizontals[row - 1][column] = true;
    } else if (direction === "down") {
      horizontals[row][column] = true;
    }
    stepThroughCell(nextRow, nextColumn);
  }
};
stepThroughCell(startRow, startColumn);
horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength / 2,
      rowIndex * unitLength + unitLength,
      unitLength,
      1,
      {
        isStatic: true,
        label: "wall",
        render: {
          fillStyle: "orange",
        },
      }
    );
    World.add(world, wall);
  });
});
verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength,
      rowIndex * unitLength + unitLength / 2,
      1,
      unitLength,
      {
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: "orange",
        },
      }
    );
    World.add(world, wall);
  });
});
const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, {
    isStatic: true,
    render: {
      fillStyle: "purple",
    },
  }),
  Bodies.rectangle(width / 2, height, width, 2, {
    isStatic: true,
    render: {
      fillStyle: "purple",
    },
  }),
  Bodies.rectangle(0, height / 2, 2, height, {
    isStatic: true,
    render: {
      fillStyle: "purple",
    },
  }),
  Bodies.rectangle(width, height / 2, 2, height, {
    isStatic: true,
    render: {
      fillStyle: "purple",
    },
  }),
];
World.add(world, walls);
const goal = Bodies.rectangle(
  width - unitLength / 2,
  height - unitLength / 2,
  unitLength * 0.7,
  unitLength * 0.7,
  {
    isStatic: true,
    label: "goal",
    render: {
      fillStyle: "blue",
    },
  }
);
World.add(world, goal);
const ball = Bodies.circle(unitLength / 2, unitLength / 2, unitLength / 3, {
  label: "ball",
  render: {
    fillStyle: "red",
  },
});
World.add(world, ball);

document.addEventListener("keydown", (event) => {
  const { x, y } = ball.velocity;
  if (event.key === "t") {
    Body.setVelocity(ball, { x, y: y - 5 });
  } else if (event.key === "b") {
    Body.setVelocity(ball, { x, y: y + 5 });
  } else if (event.key === "f") {
    Body.setVelocity(ball, { x: x - 5, y });
  } else if (event.key === "h") {
    Body.setVelocity(ball, { x: x + 5, y });
  }
});
Events.on(engine, "collisionStart", (events) => {
  events.pairs.forEach((collision) => {
    const labels = ["ball", "goal"];
    if (labels.includes(collision.bodyA.label && collision.bodyA.label)) {
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
          Body.setStatic(ball, false);
          Body.setStatic(goal, false);
        }
      });
    }
  });
});
