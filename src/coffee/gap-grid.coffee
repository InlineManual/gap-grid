# helper crossrowser function to get unique values from an array
getUnique = (list) ->
  dummy = {}
  dummy[item] = item for item in list
  val for key, val of dummy


class GapGrid


  constructor: (canvas, gaps = []) ->
    @gaps = []
    @setCanvas canvas
    @addGaps gaps


  # sets the canvas for which we want to generate the grid
  setCanvas: (canvas) ->
    @canvas = canvas if @isValidBox canvas


  # removes all gaps
  clearGaps: ->
    @gaps = []


  # adds multiple gaps to the list of gaps at once
  addGaps: (gaps = []) ->
    @addGap gap for gap in gaps


  # adds gap to the list of gaps, prevents duplicates
  addGap: (gap) ->
    if @isValidBox gap
      unless gap in @gaps
        @gaps.push gap


  removeGaps: (gaps = []) ->
    @removeGap gap for gap in gaps


  # removes gap from the list of gaps
  removeGap: (gap) ->
    for existing_gap, i in @gaps
      @gaps.splice i, 1


  # returns true if box has all required properties
  isValidBox: (gap) ->
    return false unless typeof gap is 'object'
    for property in ['left', 'top', 'width', 'height']
      return false unless gap[property]?
    return true


  # returns list of all horizontal and vertical points used in grid
  getGridPoints: ->
    result =
      horizontal: [@canvas.left, @canvas.left + @canvas.width]
      vertical: [@canvas.top, @canvas.top + @canvas.height]

    for gap in @gaps
      result.horizontal.push gap.left, gap.left + gap.width
      result.vertical.push gap.top, gap.top + gap.height

    # all values need to be rounded, to prevent strange artifacts when zoomed
    result.horizontal = (Math.round n for n in result.horizontal)
    result.vertical = (Math.round n for n in result.vertical)

    # helper function to get only list items within given range
    filterByRange = (list, min, max) ->
      list.filter (item) ->
        min <= item <= max

    result.horizontal = filterByRange(
      getUnique result.horizontal
      @canvas.left
      @canvas.left + @canvas.width
    ).sort (a, b) -> a - b

    result.vertical = filterByRange(
      getUnique result.vertical
      @canvas.top
      @canvas.top + @canvas.height
    ).sort (a, b) -> a - b

    result


  # returns matrix used in optimization of cover boxes
  getGridMatrix: (points) ->

    result = []

    for y, i in points.vertical
      row = []
      for x, j in points.horizontal
        is_last =
          (i is points.vertical.length - 1) or
          (j is points.horizontal.length - 1)
        point_state = is_last or @isPointInGaps {left: x, top: y}
        row.push if point_state is true then 1 else 0
      result.push row

    result


  # returns true if point is inside the gap or at its top/left edge
  isPointInGap: (point, gap) ->
    (gap.left <= point.left < gap.left + gap.width) and
    (gap.top <= point.top < gap.top + gap.height)


  isPointInGaps: (point) ->
    for gap in @gaps
      return true if @isPointInGap point, gap
    return false


  getMatrixBlockRight: (matrix, x1, y1) ->
    result = x1
    result++ while matrix[y1][result] is 0
    result


  getMatrixBlockBottom: (matrix, x1, y1, x2) ->
    result = y1
    result++ while @getMatrixBlockRight(matrix, x1, result) is x2
    result


  getMatrixBlock: (matrix, x1, y1) ->
    x2 = @getMatrixBlockRight matrix, x1, y1
    y2 = @getMatrixBlockBottom matrix, x1, y1, x2, y2

    {
      x1: x1
      y1: y1
      x2: x2
      y2: y2
    }


  markMatrixBlock: (matrix, block) ->
    for x in [block.x1 ... block.x2]
      for y in [block.y1 ... block.y2]
        matrix[y][x] = 1
    matrix


  getAllMatrixBlocks: (matrix) ->
    result = []

    for y in [0 ... matrix.length]
      for x in [0 ... matrix[0].length]

        if matrix[y][x] is 0
          block = @getMatrixBlock matrix, x, y
          matrix = @markMatrixBlock matrix, block
          result.push block

    result


  # Returns list of boxes that will collectively cover whole canvas, except
  # areas with gaps.
  generate: ->
    result = []

    points = @getGridPoints()
    matrix = @getGridMatrix points
    blocks = @getAllMatrixBlocks matrix

    for block in blocks
      result.push
        left:   points.horizontal[block.x1]
        width:  points.horizontal[block.x2] - points.horizontal[block.x1]
        top:    points.vertical[block.y1]
        height: points.vertical[block.y2] - points.vertical[block.y1]

    result


# Expose object to the global namespace.
root = if typeof exports is 'object' then exports else this
root.GapGrid = GapGrid
