import GapGrid from './../src/';


describe('GapGrid', function() {

  let x;

  const canvas_box = {left: 0, top: 0, width: 500, height: 500};
  const gap_box1 = {left: 100, top: 100, width: 100, height: 200};
  const gap_box2 = {left: 300, top: 200, width: 100, height: 200};
  const gap_box3 = {left: 100, top: 100, width: 200, height: 100};

  beforeAll(function() {
    x = new GapGrid();
  });

  beforeEach(function() {
    x.clearGaps();
    x.setCanvas(canvas_box);
  });

  it('should exist', function() {
    expect(GapGrid).toBeDefined();
  });

  describe('setCanvas', function() {

    it('should set canvas object', function() {
      x.setCanvas(canvas_box);
      expect(x.canvas).toEqual(canvas_box);
    });

  });

  describe('addGap', function() {

    it('should add a gap', function() {
      x.addGap(gap_box1);
      x.addGap(gap_box2);
      expect(x.gaps).toEqual([gap_box1, gap_box2]);
    });

    it('should prevent duplicates', function() {
      x.addGap(gap_box1);
      x.addGap(gap_box1);
      expect(x.gaps).toEqual([gap_box1]);
    });

  });

  describe('removeGap', function() {

    it('should remove a gap', function() {
      x.addGap(gap_box1);
      x.addGap(gap_box2);
      x.removeGap(gap_box1);
      expect(x.gaps).toEqual([gap_box2]);
    });

  });

  describe('addGaps', function() {

    it('should add multiple gaps at once', function() {
      x.addGaps([gap_box1, gap_box2]);
      expect(x.gaps).toEqual([gap_box1, gap_box2]);
    });

  });

  describe('removeGaps', function () {

    it('should remove multiple gaps at once', function () {
      x.addGap(gap_box1);
      x.addGap(gap_box2);
      x.addGap(gap_box3);
      x.removeGaps([gap_box1, gap_box2]);
      expect(x.gaps).toEqual([gap_box3]);
    });

  });

  describe('clearGaps', function() {

    it('should remove all gaps', function() {
      x.addGaps([gap_box1, gap_box2]);
      x.clearGaps();
      expect(x.gaps).toEqual([]);
    });

  });

  describe('generate', function() {

    it('should one big box for canvas without gaps', function() {
      expect(x.generate()).toEqual([canvas_box]);
    });

    it('should optimized list of cover boxes', function() {
      x.addGaps([gap_box1, gap_box2]);
      const expectation = [
        {left:   0, top:   0, width: 500, height: 100},
        {left:   0, top: 100, width: 100, height: 200},
        {left: 200, top: 100, width: 300, height: 100},
        {left: 200, top: 200, width: 100, height: 200},
        {left: 400, top: 200, width: 100, height: 300},
        {left:   0, top: 300, width: 200, height: 100},
        {left:   0, top: 400, width: 400, height: 100}
      ];
      expect(x.generate()).toEqual(expectation);
    });

  });

});
