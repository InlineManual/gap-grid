/**
 * Object representing a Point.
 * @typedef {Object} Point
 * @property {number} left
 * @property {number} top
 * @ignore
 */


/**
 * Create array containing only unique values from the list.
 * @param {Array} list
 * @returns {Array}
 * @ignore
 */
export function getUnique (list = []) {
  const result = [];

  list.forEach(function (item) {
    if (result.indexOf(item) === -1) {
      result.push(item);
    }
  });

  return result;
}


/**
 * Checks whether provided input is valid Box object (e.g. has `left`, `top`, `width` and `height` properties).
 * @param {*} input
 * @returns {boolean}
 * @ignore
 */
export function isValidBox (input) {
  if (typeof input !== 'object') {
    return false;
  }

  let result = true;

  ['left', 'top', 'width', 'height'].forEach(function (property) {
    if (typeof input[property] !== 'number') {
      result = false;
    }
  });

  return result;
}


/**
 * Checks whether provided point is positioned within the box.
 * @param {Point} point
 * @param {Box} box
 * @returns {boolean}
 * @ignore
 */
export function isPointInBox (point, box) {
  return (
    (box.left <= point.left && point.left < box.left + box.width) &&
    (box.top <= point.top && point.top < box.top + box.height)
  );
}


/**
 * Checks whether provided point is positioned within at least one of the boxes.
 * @param {Point} point
 * @param {Box[]} boxes
 * @returns {boolean}
 * @ignore
 */
export function isPointInBoxes (point, boxes) {
  for (let i = 0; i < boxes.length; i++) {
    if (isPointInBox(point, boxes[i])) {
      return true;
    }
  }
  return false;
}


export function getMatrixBlockRight (matrix, x1, y1) {
  let result = x1;
  while (matrix[y1][result] === 0) {
    result++;
  }
  return result;
}


export function getMatrixBlockBottom (matrix, x1, y1, x2) {
  let result = y1;
  while (getMatrixBlockRight(matrix, x1, result) === x2) {
    result++;
  }
  return result;
}


export function getMatrixBlock (matrix, x1, y1) {
  const x2 = getMatrixBlockRight(matrix, x1, y1);
  const y2 = getMatrixBlockBottom(matrix, x1, y1, x2);
  return {x1: x1, y1: y1, x2: x2, y2: y2};
}


export function markMatrixBlock (matrix, block) {
  for (let x = block.x1; x < block.x2; x++) {
    for (let y = block.y1; y < block.y2; y++) {
      matrix[y][x] = 1;
    }
  }
  return matrix;
}


export function getAllMatrixBlocks (matrix) {
  const result = [];

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[0].length; x++) {
      if (matrix[y][x] === 0) {
        const block = getMatrixBlock(matrix, x, y);
        matrix = markMatrixBlock(matrix, block);
        result.push(block);
      }
    }
  }

  return result;
}


export function getGridPoints (canvas, gaps) {
  const result = {
    horizontal: [canvas.left, canvas.left + canvas.width],
    vertical: [canvas.top, canvas.top + canvas.height]
  };

  gaps.forEach(function (gap) {
    result.horizontal.push(gap.left, gap.left + gap.width);
    result.vertical.push(gap.top, gap.top + gap.height);
  });

  // helper function to get only list items within given range
  const filterByRange = function (list, min, max) {
    return list.filter(function (item) {
      return (min <= item) && (item <= max);
    });
  };

  result.horizontal = filterByRange(
    getUnique(result.horizontal),
    canvas.left,
    canvas.left + canvas.width
  ).sort((a, b) => a - b);

  result.vertical = filterByRange(
    getUnique(result.vertical),
    canvas.top,
    canvas.top + canvas.height
  ).sort((a, b) => a - b);

  return result;
}


export function getGridMatrix (points, gaps) {
  const result = [];

  points.vertical.forEach((y, i) => {
    const row = [];
    points.horizontal.forEach((x, j) => {
      const is_last = (
        (i === points.vertical.length - 1) ||
        (j === points.horizontal.length - 1)
      );
      const point_state = (
        is_last ||
        isPointInBoxes({left: x, top: y}, gaps)
      ) ? 1 : 0;
      row.push(point_state);
    });
    result.push(row);
  });

  return result;
}


