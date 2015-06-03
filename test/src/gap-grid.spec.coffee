describe 'GapGrid', ->

  x = null
  canvas_box = {left: 0, top: 0, width: 500, height: 500}
  gap_box1 = {left: 100, top: 100, width: 100, height: 200}
  gap_box2 = {left: 300, top: 200, width: 100, height: 200}
  gap_box3 = {left: 100, top: 100, width: 200, height: 100}

  beforeAll ->
    x = new GapGrid

  beforeEach ->
    x.clearGaps()
    x.setCanvas canvas_box


  it 'should exist', ->
    expect(GapGrid).toBeDefined()


  describe 'isValidBox', ->

    it 'should return `true` on valid box', ->
      result = x.isValidBox gap_box1
      expect(result).toEqual true

    it 'should return `false` on invalid box', ->
      result = x.isValidBox 'xxx'
      expect(result).toEqual false


  describe 'setCanvas', ->

    it 'should set canvas object', ->
      x.setCanvas canvas_box
      expect(x.canvas).toEqual canvas_box


  describe 'addGap', ->

    it 'should add a gap', ->
      x.addGap gap_box1
      x.addGap gap_box2
      expect(x.gaps).toEqual [gap_box1, gap_box2]

    it 'should prevent duplicates', ->
      x.addGap gap_box1
      x.addGap gap_box1
      expect(x.gaps).toEqual [gap_box1]


  describe 'removeGap', ->

    it 'should remove a gap', ->
      x.addGap gap_box1
      x.addGap gap_box2
      x.removeGap gap_box1
      expect(x.gaps).toEqual [gap_box2]


  describe 'addGaps', ->

    it 'should add multiple gaps at once', ->
      x.addGaps [gap_box1, gap_box2]
      expect(x.gaps).toEqual [gap_box1, gap_box2]


  describe 'clearGaps', ->

    it 'should remove all gaps', ->
      x.addGaps [gap_box1, gap_box2]
      x.clearGaps()
      expect(x.gaps).toEqual []


  describe 'getGridPoints', ->

    it 'should get vertical and horizontal grid points for single box', ->
      x.addGap gap_box1
      expectation =
        horizontal: [0, 100, 200, 500]
        vertical: [0, 100, 300, 500]
      expect(x.getGridPoints()).toEqual expectation

    it 'should get vertical and horizontal grid points for multiple boxes', ->
      x.addGaps [gap_box1, gap_box2]
      expectation =
        horizontal: [0, 100, 200, 300, 400, 500]
        vertical: [0, 100, 200, 300, 400, 500]
      expect(x.getGridPoints()).toEqual expectation

    it 'should get vertical and horizontal grid points for overlaping boxes', ->
      x.addGaps [gap_box1, gap_box3]
      expectation =
        horizontal: [0, 100, 200, 300, 500]
        vertical: [0, 100, 200, 300, 500]
      expect(x.getGridPoints()).toEqual expectation

    it 'should sort points', ->
      x.addGaps [gap_box2, gap_box1]
      expectation =
        horizontal: [0, 100, 200, 300, 400, 500]
        vertical: [0, 100, 200, 300, 400, 500]
      expect(x.getGridPoints()).toEqual expectation

    it 'should not contain duplicate points', ->
      x.addGaps [gap_box1, gap_box3]
      expectation =
        horizontal: [0, 100, 200, 300, 500]
        vertical: [0, 100, 200, 300, 500]
      expect(x.getGridPoints()).toEqual expectation

    it 'should only contain points inside canvas', ->
      x.setCanvas {left: 100, top: 100, width: 200, height: 200}
      x.addGap {left: 0, top: 0, width: 200, height: 200}
      expectation =
        horizontal: [100, 200, 300]
        vertical: [100, 200, 300]
      expect(x.getGridPoints()).toEqual expectation


  describe 'getGridMatrix', ->

    it 'should get matrix', ->
      x.addGaps [gap_box1, gap_box2]
      expectation = [
        [0, 0, 0, 0, 0, 1]
        [0, 1, 0, 0, 0, 1]
        [0, 1, 0, 1, 0, 1]
        [0, 0, 0, 1, 0, 1]
        [0, 0, 0, 0, 0, 1]
        [1, 1, 1, 1, 1, 1]
      ]
      points = x.getGridPoints()
      expect(x.getGridMatrix points).toEqual expectation


  describe 'isPointInGap', ->

    box = {left: 100, top: 100, width: 100, height: 100}

    it 'should return `false` if point is outside gap', ->
      point = {left: 0, top: 0}
      expect(x.isPointInGap point, box).toEqual false

    it 'should return `true` if point is inside gap', ->
      point = {left: 150, top: 150}
      expect(x.isPointInGap point, box).toEqual true

    it 'should return `true` if point is at top edge of gap', ->
      point = {left: 150, top: 100}
      expect(x.isPointInGap point, box).toEqual true

    it 'should return `true` if point is at left edge of gap', ->
      point = {left: 100, top: 150}
      expect(x.isPointInGap point, box).toEqual true

    it 'should return `false` if point is at bottom edge of gap', ->
      point = {left: 150, top: 200}
      expect(x.isPointInGap point, box).toEqual false

    it 'should return `false` if point is at right edge of gap', ->
      point = {left: 200, top: 150}
      expect(x.isPointInGap point, box).toEqual false


  describe 'isPointInGaps', ->

    beforeEach ->
      x.addGaps [gap_box1, gap_box2]

    it 'should return `false` if point is outside any gap', ->
      point = {left: 50, top: 50}
      expect(x.isPointInGaps point).toEqual false

    it 'should return `true` if point is inside any gap', ->
      point = {left: 150, top: 150}
      expect(x.isPointInGaps point).toEqual true


  describe 'generate', ->

    it 'should return one big box for canvas without gaps', ->
      expect(x.generate()).toEqual [canvas_box]

    it 'should return optimized list of cover boxes', ->
      x.addGaps [gap_box1, gap_box2]
      expectation = [
        {left:   0, top:   0, width: 500, height: 100}
        {left:   0, top: 100, width: 100, height: 200}
        {left: 200, top: 100, width: 300, height: 100}
        {left: 200, top: 200, width: 100, height: 200}
        {left: 400, top: 200, width: 100, height: 300}
        {left:   0, top: 300, width: 200, height: 100}
        {left:   0, top: 400, width: 400, height: 100}
      ]
      expect(x.generate()).toEqual expectation


  describe 'matrix operations', ->

    matrix = null

    beforeEach ->
      matrix = [
        [0, 0, 0, 0, 0, 1]
        [0, 1, 0, 0, 0, 1]
        [0, 1, 0, 1, 0, 1]
        [0, 0, 0, 1, 0, 1]
        [0, 0, 0, 0, 0, 1]
        [1, 1, 1, 1, 1, 1]
      ]


    describe 'getMatrixBlockRight', ->

      it 'narrow block', ->
        result = x.getMatrixBlockRight matrix, 0, 1
        expect(result).toEqual 1

      it 'wide block', ->
        result = x.getMatrixBlockRight matrix, 0, 0
        expect(result).toEqual 5

    describe 'getMatrixBlockBottom', ->

      it 'low block', ->
        result = x.getMatrixBlockBottom matrix, 0, 0, 5
        expect(result).toEqual 1

      it 'high block', ->
        result = x.getMatrixBlockBottom matrix, 0, 1, 1
        expect(result).toEqual 3


    describe 'getMatrixBlock', ->

      it 'wide block', ->
        result = x.getMatrixBlock matrix, 0, 0
        expectation = {x1: 0, y1: 0, x2: 5, y2: 1}
        expect(result).toEqual expectation

      it 'high block', ->
        result = x.getMatrixBlock matrix, 0, 1
        expectation = {x1: 0, y1: 1, x2: 1, y2: 3}
        expect(result).toEqual expectation

      it 'blocky block', ->
        result = x.getMatrixBlock matrix, 2, 0
        expectation = {x1: 2, y1: 0, x2: 5, y2: 2}
        expect(result).toEqual expectation


    describe 'markMatrixBlock', ->

      it 'should fill in ones in matrix', ->
        result = x.markMatrixBlock matrix, {x1: 2, y1: 0, x2: 5, y2: 2}
        expectation = [
          [0, 0, 1, 1, 1, 1]
          [0, 1, 1, 1, 1, 1]
          [0, 1, 0, 1, 0, 1]
          [0, 0, 0, 1, 0, 1]
          [0, 0, 0, 0, 0, 1]
          [1, 1, 1, 1, 1, 1]
        ]
        expect(result).toEqual expectation


    describe 'getAllMatrixBlocks', ->

      it 'should get list of all matrix blocks', ->
        result = x.getAllMatrixBlocks matrix
        expectation = [
          {x1: 0, y1: 0, x2: 5, y2: 1}
          {x1: 0, y1: 1, x2: 1, y2: 3}
          {x1: 2, y1: 1, x2: 5, y2: 2}
          {x1: 2, y1: 2, x2: 3, y2: 4}
          {x1: 4, y1: 2, x2: 5, y2: 5}
          {x1: 0, y1: 3, x2: 2, y2: 4}
          {x1: 0, y1: 4, x2: 4, y2: 5}
        ]
        expect(result).toEqual expectation
