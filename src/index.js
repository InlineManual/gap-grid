import {
  isValidBox,
  getAllMatrixBlocks,
  getGridPoints,
  getGridMatrix
} from './utilities';


/**
 * Object representing a Box.
 * @typedef {Object} Box
 * @property {number} left
 * @property {number} top
 * @property {number} width
 * @property {number} height
 */


/**
 * Class representing a GapGrid.
 * @name GapGrid
 */
export default class GapGrid {

  /**
   * Create a GapGrid object.
   * @param {Box} [canvas] - Box representing the area which you want to cover.
   * @param {Box[]} [gaps] - List of Box objects representing areas which should not be covered.
   */
  constructor (canvas, gaps = []) {
    this.gaps = [];

    this.setCanvas(canvas);
    this.addGaps(gaps);
  }

  /**
   * Update the canvas.
   * @param {Box} canvas
   */
  setCanvas (canvas) {
    if (isValidBox(canvas)) {
      this.canvas = canvas;
    }
  }

  /**
   * Removes all the gap boxes.
   */
  clearGaps () {
    this.gaps = [];
  }

  /**
   * Adds multiple gaps at once.
   * @param {Box[]} gaps
   */
  addGaps (gaps = []) {
    gaps.forEach((gap) => this.addGap(gap));
  }

  /**
   * Add single gap.
   * @param {Box} gap
   */
  addGap (gap) {
    if (isValidBox(gap) &&  (this.gaps.indexOf(gap) === -1)) {
      this.gaps.push(gap);
    }
  }

  /**
   * Remove multiple gaps at once.
   * @param {Box[]} gaps
   */
  removeGaps (gaps = []) {
    gaps.forEach((gap) => this.removeGap(gap));
  }

  /**
   * Remove single gap.
   * @param {Box} gap
   */
  removeGap (gap) {
    const index = this.gaps.indexOf(gap);
    if (index !== -1) {
      this.gaps.splice(index, 1);
    }
  }

  /**
   * Creates list of Box objects. They represent the minimum number of boxes that, if combined, will cover the whole area of canvas, without overlapping and without covering areas of gaps.
   * @returns {Box[]}
   */
  generate () {
    const result = [];

    const points = getGridPoints(this.canvas, this.gaps);
    const matrix = getGridMatrix(points, this.gaps);
    const blocks = getAllMatrixBlocks(matrix);

    blocks.forEach(function (block) {
      result.push({
        left   : points.horizontal[block.x1],
        width  : points.horizontal[block.x2] - points.horizontal[block.x1],
        top    : points.vertical[block.y1],
        height : points.vertical[block.y2] - points.vertical[block.y1]
      });
    });

    return result;
  }

}
