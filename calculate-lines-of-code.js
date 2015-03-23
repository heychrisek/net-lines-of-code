// Check every 100ms for necessary DOM node to give it time to load.
// When found, stop polling, calculate linesAdded/Removed, and append
// DOM node with net change.
var calculateLinesOfCode = setInterval(function () {
  var addVals, linesAdded, linesRemoved, offset;

  addVals = function(className, symbolToReplace) {
    var results;
    results = [];
    $(className).each(function() {
      var val;
      val = $(this).html().replace(symbolToReplace, '');
      return results.push(parseInt(val));
    });
    if (results.length > 0) {
      return results.reduce(function(x, y) {
        return x + y;
      });
    };
  };

  linesAdded = addVals('.lines-added', '+');
  linesRemoved = addVals('.lines-removed', '-');
  offset = linesAdded - linesRemoved;

  // stop interval when offset is found
  if (!isNaN(offset)) {
    clearInterval(calculateLinesOfCode);
  }

  formatOffset = function(offset) {
    if (offset > 0) {
      return "<span style='font-weight:bold; color: green;'>" + offset + " lines of code added</span>"
    } else if (offset === 0) {
      return "net change of 0"
    } else {
      return "<span style='font-weight:bold; color: red;'>" + Math.abs(offset) + " lines of code removed</span>"
    }
  }

  domNodeToAppend = '<li style="border-top: 1px solid #eee;" class="iterable-item"><div class="commit-file-diff-stats"><span class="lines-added">+'
  domNodeToAppend += linesAdded
  domNodeToAppend += '</span><span class="lines-removed">-'
  domNodeToAppend += linesRemoved
  domNodeToAppend +=  '</span></div><div style="width:300px; font-style:italic;" class="count-badge">Net change: '
  domNodeToAppend += formatOffset(offset)
  domNodeToAppend += '</div></li>'

  $('ul.commit-files-summary').append(domNodeToAppend);
}, 100);

calculateLinesOfCode();