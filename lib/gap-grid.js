/*
Gap Grid, v0.1.0
by Riki Fridrich <riki@fczbkk.com> (https://github.com/fczbkk)
https://github.com/fczbkk/gap-grid
*/
(function() {
    var GapGrid, getUnique, root, __indexOf = [].indexOf || function(item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item) return i;
        }
        return -1;
    };
    getUnique = function(list) {
        var dummy, item, key, val, _i, _len, _results;
        dummy = {};
        for (_i = 0, _len = list.length; _i < _len; _i++) {
            item = list[_i];
            dummy[item] = item;
        }
        _results = [];
        for (key in dummy) {
            val = dummy[key];
            _results.push(val);
        }
        return _results;
    };
    GapGrid = function() {
        function GapGrid(canvas, gaps) {
            if (gaps == null) {
                gaps = [];
            }
            this.gaps = [];
            this.setCanvas(canvas);
            this.addGaps(gaps);
        }
        GapGrid.prototype.setCanvas = function(canvas) {
            if (this.isValidBox(canvas)) {
                return this.canvas = canvas;
            }
        };
        GapGrid.prototype.clearGaps = function() {
            return this.gaps = [];
        };
        GapGrid.prototype.addGaps = function(gaps) {
            var gap, _i, _len, _results;
            if (gaps == null) {
                gaps = [];
            }
            _results = [];
            for (_i = 0, _len = gaps.length; _i < _len; _i++) {
                gap = gaps[_i];
                _results.push(this.addGap(gap));
            }
            return _results;
        };
        GapGrid.prototype.addGap = function(gap) {
            if (this.isValidBox(gap)) {
                if (__indexOf.call(this.gaps, gap) < 0) {
                    return this.gaps.push(gap);
                }
            }
        };
        GapGrid.prototype.removeGaps = function(gaps) {
            var gap, _i, _len, _results;
            if (gaps == null) {
                gaps = [];
            }
            _results = [];
            for (_i = 0, _len = gaps.length; _i < _len; _i++) {
                gap = gaps[_i];
                _results.push(this.removeGap(gap));
            }
            return _results;
        };
        GapGrid.prototype.removeGap = function(gap) {
            var existing_gap, i, _i, _len, _ref, _results;
            _ref = this.gaps;
            _results = [];
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
                existing_gap = _ref[i];
                _results.push(this.gaps.splice(i, 1));
            }
            return _results;
        };
        GapGrid.prototype.isValidBox = function(gap) {
            var property, _i, _len, _ref;
            if (typeof gap !== "object") {
                return false;
            }
            _ref = [ "left", "top", "width", "height" ];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                property = _ref[_i];
                if (gap[property] == null) {
                    return false;
                }
            }
            return true;
        };
        GapGrid.prototype.getGridPoints = function() {
            var filterByRange, gap, result, _i, _len, _ref;
            result = {
                horizontal: [ this.canvas.left, this.canvas.left + this.canvas.width ],
                vertical: [ this.canvas.top, this.canvas.top + this.canvas.height ]
            };
            _ref = this.gaps;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                gap = _ref[_i];
                result.horizontal.push(gap.left, gap.left + gap.width);
                result.vertical.push(gap.top, gap.top + gap.height);
            }
            filterByRange = function(list, min, max) {
                return list.filter(function(item) {
                    return min <= item && item <= max;
                });
            };
            result.horizontal = filterByRange(getUnique(result.horizontal), this.canvas.left, this.canvas.left + this.canvas.width).sort(function(a, b) {
                return a - b;
            });
            result.vertical = filterByRange(getUnique(result.vertical), this.canvas.top, this.canvas.top + this.canvas.height).sort(function(a, b) {
                return a - b;
            });
            return result;
        };
        GapGrid.prototype.getGridMatrix = function(points) {
            var i, is_last, j, point_state, result, row, x, y, _i, _j, _len, _len1, _ref, _ref1;
            result = [];
            _ref = points.vertical;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
                y = _ref[i];
                row = [];
                _ref1 = points.horizontal;
                for (j = _j = 0, _len1 = _ref1.length; _j < _len1; j = ++_j) {
                    x = _ref1[j];
                    is_last = i === points.vertical.length - 1 || j === points.horizontal.length - 1;
                    point_state = is_last || this.isPointInGaps({
                        left: x,
                        top: y
                    });
                    row.push(point_state === true ? 1 : 0);
                }
                result.push(row);
            }
            return result;
        };
        GapGrid.prototype.isPointInGap = function(point, gap) {
            var _ref, _ref1;
            return gap.left <= (_ref = point.left) && _ref < gap.left + gap.width && (gap.top <= (_ref1 = point.top) && _ref1 < gap.top + gap.height);
        };
        GapGrid.prototype.isPointInGaps = function(point) {
            var gap, _i, _len, _ref;
            _ref = this.gaps;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                gap = _ref[_i];
                if (this.isPointInGap(point, gap)) {
                    return true;
                }
            }
            return false;
        };
        GapGrid.prototype.getMatrixBlockRight = function(matrix, x1, y1) {
            var result;
            result = x1;
            while (matrix[y1][result] === 0) {
                result++;
            }
            return result;
        };
        GapGrid.prototype.getMatrixBlockBottom = function(matrix, x1, y1, x2) {
            var result;
            result = y1;
            while (this.getMatrixBlockRight(matrix, x1, result) === x2) {
                result++;
            }
            return result;
        };
        GapGrid.prototype.getMatrixBlock = function(matrix, x1, y1) {
            var x2, y2;
            x2 = this.getMatrixBlockRight(matrix, x1, y1);
            y2 = this.getMatrixBlockBottom(matrix, x1, y1, x2, y2);
            return {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
            };
        };
        GapGrid.prototype.markMatrixBlock = function(matrix, block) {
            var x, y, _i, _j, _ref, _ref1, _ref2, _ref3;
            for (x = _i = _ref = block.x1, _ref1 = block.x2; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; x = _ref <= _ref1 ? ++_i : --_i) {
                for (y = _j = _ref2 = block.y1, _ref3 = block.y2; _ref2 <= _ref3 ? _j < _ref3 : _j > _ref3; y = _ref2 <= _ref3 ? ++_j : --_j) {
                    matrix[y][x] = 1;
                }
            }
            return matrix;
        };
        GapGrid.prototype.getAllMatrixBlocks = function(matrix) {
            var block, result, x, y, _i, _j, _ref, _ref1;
            result = [];
            for (y = _i = 0, _ref = matrix.length; 0 <= _ref ? _i < _ref : _i > _ref; y = 0 <= _ref ? ++_i : --_i) {
                for (x = _j = 0, _ref1 = matrix[0].length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
                    if (matrix[y][x] === 0) {
                        block = this.getMatrixBlock(matrix, x, y);
                        matrix = this.markMatrixBlock(matrix, block);
                        result.push(block);
                    }
                }
            }
            return result;
        };
        GapGrid.prototype.generate = function() {
            var block, blocks, matrix, points, result, _i, _len;
            result = [];
            points = this.getGridPoints();
            matrix = this.getGridMatrix(points);
            blocks = this.getAllMatrixBlocks(matrix);
            for (_i = 0, _len = blocks.length; _i < _len; _i++) {
                block = blocks[_i];
                result.push({
                    left: points.horizontal[block.x1],
                    width: points.horizontal[block.x2] - points.horizontal[block.x1],
                    top: points.vertical[block.y1],
                    height: points.vertical[block.y2] - points.vertical[block.y1]
                });
            }
            return result;
        };
        return GapGrid;
    }();
    root = typeof exports === "object" ? exports : this;
    root.GapGrid = GapGrid;
}).call(this);