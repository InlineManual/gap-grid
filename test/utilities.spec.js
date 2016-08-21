import {
  getUnique,
  isValidBox,
  isPointInBox,
  isPointInBoxes,
  getMatrixBlockRight,
  getMatrixBlockBottom,
  getMatrixBlock,
  markMatrixBlock,
  getAllMatrixBlocks,
  getGridPoints,
  getGridMatrix
} from './../src/utilities';


describe('utilities', function () {

  const canvas_box = {left: 0, top: 0, width: 500, height: 500};
  const gap_box1 = {left: 100, top: 100, width: 100, height: 200};
  const gap_box2 = {left: 300, top: 200, width: 100, height: 200};
  const gap_box3 = {left: 100, top: 100, width: 200, height: 100};

  let matrix;

  beforeEach(function() {
    matrix = [
      [0, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 1],
      [0, 1, 0, 1, 0, 1],
      [0, 0, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1]
    ];
  });


  describe('getUnique', function () {

    it('should get unique values of an array', function () {
      expect(getUnique(['aaa', 'aaa'])).toEqual(['aaa']);
    });

    it('should keep original type of value', function () {
      const result = getUnique(['123', 123]);
      expect(result).toContain(123);
      expect(result).toContain('123');
    });

  });

  describe('isValidBox', function() {

    it('should `true` on valid box', function() {
      const result = isValidBox(gap_box1);
      expect(result).toEqual(true);
    });

    it('should `false` on invalid box', function() {
      const result = isValidBox('xxx');
      expect(result).toEqual(false);
    });

  });

  describe('isPointInBox', function() {

    const box = {left: 100, top: 100, width: 100, height: 100};

    it('should `false` if point is outside gap', function() {
      const point = {left: 0, top: 0};
      expect(isPointInBox(point, box)).toEqual(false);
    });

    it('should `true` if point is inside gap', function() {
      const point = {left: 150, top: 150};
      expect(isPointInBox(point, box)).toEqual(true);
    });

    it('should `true` if point is at top edge of gap', function() {
      const point = {left: 150, top: 100};
      expect(isPointInBox(point, box)).toEqual(true);
    });

    it('should `true` if point is at left edge of gap', function() {
      const point = {left: 100, top: 150};
      expect(isPointInBox(point, box)).toEqual(true);
    });

    it('should `false` if point is at bottom edge of gap', function() {
      const point = {left: 150, top: 200};
      expect(isPointInBox(point, box)).toEqual(false);
    });

    it('should `false` if point is at right edge of gap', function() {
      const point = {left: 200, top: 150};
      expect(isPointInBox(point, box)).toEqual(false);
    });

  });

  describe('isPointInBoxes', function() {

    it('should `false` if point is outside any gap', function() {
      const point = {left: 50, top: 50};
      expect(isPointInBoxes(point, [gap_box1, gap_box2])).toEqual(false);
    });

    it('should `true` if point is inside any gap', function() {
      const point = {left: 150, top: 150};
      expect(isPointInBoxes(point, [gap_box1, gap_box2])).toEqual(true);
    });

  });

  describe('getMatrixBlockRight', function() {

    it('narrow block', function() {
      const result = getMatrixBlockRight(matrix, 0, 1);
      expect(result).toEqual(1);
    });

    it('wide block', function() {
      const result = getMatrixBlockRight(matrix, 0, 0);
      expect(result).toEqual(5);
    });

  });

  describe('getMatrixBlockBottom', function() {

    it('low block', function() {
      const result = getMatrixBlockBottom(matrix, 0, 0, 5);
      expect(result).toEqual(1);
    });

    it('high block', function() {
      const result = getMatrixBlockBottom(matrix, 0, 1, 1);
      expect(result).toEqual(3);
    });

  });

  describe('getMatrixBlock', function() {

    it('wide block', function() {
      const result = getMatrixBlock(matrix, 0, 0);
      const expectation = {x1: 0, y1: 0, x2: 5, y2: 1};
      expect(result).toEqual(expectation);
    });

    it('high block', function() {
      const result = getMatrixBlock(matrix, 0, 1);
      const expectation = {x1: 0, y1: 1, x2: 1, y2: 3};
      expect(result).toEqual(expectation);
    });

    it('block-y block', function() {
      const result = getMatrixBlock(matrix, 2, 0);
      const expectation = {x1: 2, y1: 0, x2: 5, y2: 2};
      expect(result).toEqual(expectation);
    });

  });

  describe('markMatrixBlock', function() {

    it('should fill in ones in matrix', function() {
      const result = markMatrixBlock(matrix, {x1: 2, y1: 0, x2: 5, y2: 2});
      const expectation = [
        [0, 0, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1],
        [0, 1, 0, 1, 0, 1],
        [0, 0, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1]
      ];
      expect(result).toEqual(expectation);
    });

  });

  describe('getAllMatrixBlocks', function() {

    it('should get list of all matrix blocks', function() {
      const result = getAllMatrixBlocks(matrix);
      const expectation = [
        {x1: 0, y1: 0, x2: 5, y2: 1},
        {x1: 0, y1: 1, x2: 1, y2: 3},
        {x1: 2, y1: 1, x2: 5, y2: 2},
        {x1: 2, y1: 2, x2: 3, y2: 4},
        {x1: 4, y1: 2, x2: 5, y2: 5},
        {x1: 0, y1: 3, x2: 2, y2: 4},
        {x1: 0, y1: 4, x2: 4, y2: 5}
      ];
      expect(result).toEqual(expectation);
    });

  });

  describe('getGridPoints', function() {

    it('should get vertical and horizontal grid points for single box', function() {
      const expectation = {
        horizontal: [0, 100, 200, 500],
        vertical: [0, 100, 300, 500]
      };
      const result = getGridPoints(canvas_box, [gap_box1]);
      expect(result).toEqual(expectation);
    });

    it('should get vertical and horizontal grid points for multiple boxes', function() {
      const expectation = {
        horizontal: [0, 100, 200, 300, 400, 500],
        vertical: [0, 100, 200, 300, 400, 500]
      };
      const result = getGridPoints(canvas_box, [gap_box1, gap_box2]);
      expect(result).toEqual(expectation);
    });

    it('should get vertical and horizontal grid points for overlaping boxes', function() {
      const expectation = {
        horizontal: [0, 100, 200, 300, 500],
        vertical: [0, 100, 200, 300, 500]
      };
      const result = getGridPoints(canvas_box, [gap_box1, gap_box3]);
      expect(result).toEqual(expectation);
    });

    it('should sort points', function() {
      const expectation = {
        horizontal: [0, 100, 200, 300, 400, 500],
        vertical: [0, 100, 200, 300, 400, 500]
      };
      const result = getGridPoints(canvas_box, [gap_box2, gap_box1]);
      expect(result).toEqual(expectation);
    });

    it('should not contain duplicate points', function() {
      const expectation = {
        horizontal: [0, 100, 200, 300, 500],
        vertical: [0, 100, 200, 300, 500]
      };
      const result = getGridPoints(canvas_box, [gap_box1, gap_box3]);
      expect(result).toEqual(expectation);
    });

    it('should only contain points inside canvas', function() {
      const canvas = {
        left: 100,
        top: 100,
        width: 200,
        height: 200
      };
      const gap = {
        left: 0,
        top: 0,
        width: 200,
        height: 200
      };
      const expectation = {
        horizontal: [100, 200, 300],
        vertical: [100, 200, 300]
      };
      const result = getGridPoints(canvas, [gap]);
      expect(result).toEqual(expectation);
    });

  });

  describe('getGridMatrix', function() {

    it('should get matrix', function() {
      const expectation = [
        [0, 0, 0, 0, 0, 1],
        [0, 1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0, 1],
        [0, 0, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1]
      ];
      const points = getGridPoints(canvas_box, [gap_box1, gap_box2]);
      const result = getGridMatrix(points, [gap_box1, gap_box2]);
      expect(result).toEqual(expectation);
    });

  });

});
