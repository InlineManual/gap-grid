# Gap Grid

Generates list of boxes that will cover whole canvas, excepts defined gaps.

[![npm](https://img.shields.io/npm/v/@fczbkk/gap-grid.svg?maxAge=2592000)](https://www.npmjs.com/package/@fczbkk/gap-grid)
[![npm](https://img.shields.io/github/license/fczbkk/gap-grid.svg?maxAge=2592000)](https://github.com/fczbkk/gap-grid/blob/master/LICENSE)
[![David](https://img.shields.io/david/fczbkk/gap-grid.svg?maxAge=2592000)](https://david-dm.org/fczbkk/gap-grid)
[![Travis](https://img.shields.io/travis/fczbkk/gap-grid.svg?maxAge=2592000)](https://travis-ci.org/fczbkk/gap-grid)

This library was originaly created for [Backdrop](https://github.com/fczbkk/Backdrop). But it is abstract and has no requirements, so it can be used anywhere else. Let's see what it does:

![](assets/explanation.png)

It starts with a box (canvas) containing other boxes (gaps). Then it finds minimum number of boxes to fill out whole canvas around the gaps without overlaps.

## How to use it

```javascript
import GapGrid from '@fczbkk/gap-grid';

// create instance
var my_gap_grid = new GapGrid();

// set canvas box
my_gap_grid.setCanvas({left: 0, top: 0, width: 500, height: 500});

// add gap boxes
my_gap_grid.addGap({left: 100, top: 100, width: 100, height: 200});
my_gap_grid.addGap({left: 300, top: 200, width: 100, height: 200});

// get list of cover boxes
var cover_boxes = my_gap_grid.generate();
```

## Documentation

### Box

Object representing a Box.

**Properties**

-   `left` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `top` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `width` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `height` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### GapGrid

Class representing a GapGrid.

#### constructor

Create a GapGrid object.

**Parameters**

-   `canvas` **\[[Box](#box)]** Box representing the area which you want to cover.
-   `gaps` **\[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Box](#box)>]** List of Box objects representing areas which should not be covered.

#### setCanvas

Update the canvas.

**Parameters**

-   `canvas` **[Box](#box)** 

#### clearGaps

Removes all the gap boxes.

#### addGaps

Adds multiple gaps at once.

**Parameters**

-   `gaps` **\[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Box](#box)>](default \[])** 

#### addGap

Add single gap.

**Parameters**

-   `gap` **[Box](#box)** 

#### removeGaps

Remove multiple gaps at once.

**Parameters**

-   `gaps` **\[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Box](#box)>](default \[])** 

#### removeGap

Remove single gap.

**Parameters**

-   `gap` **[Box](#box)** 

#### generate

Creates list of Box objects. They represent the minimum number of boxes that, if combined, will cover the whole area of canvas, without overlapping and without covering areas of gaps.

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Box](#box)>** 

## Bug reports, feature requests and contact

If you found any bugs, if you have feature requests or any questions, please, either [file an issue at GitHub](https://github.com/fczbkk/gap-grid/issues) or send me an e-mail at <a href="mailto:riki@fczbkk.com">riki@fczbkk.com</a>.

## License

Gap Grid is published under the [MIT license](https://github.com/fczbkk/gap-grid/blob/master/LICENSE).
