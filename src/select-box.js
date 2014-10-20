(function (window, undefined) {
  'use strict';
  
  var ElemObj = function () {
    this.init.apply(this, arguments);
  };
  ElemObj.prototype = {
    init: function (tagName) {
      this.element = document.createElement(tagName);
    },
    addAttr: function (attrObj) {
      for (var key in attrObj) {
        this.element.setAttribute(key, attrObj[key]);
      }
    },
    addHTML: function (innerHTML) {
      this.element.innerHTML = innerHTML;
    },
    gen: function () {
      if (arguments.length === 1) {
        var arguType = typeof arguments[0];
        if (arguType === 'string') {
          this.addHTML(arguments[0]);
        } else if (arguType === 'object') {
          this.addAttr(arguments[0]);
        }
      } else if (arguments.length > 1) {
        this.addHTML(arguments[0]);
        this.addAttr(arguments[1]);
      }
      return this.element;
    }
  };

  var genSelectBox = function (text, index, array) {
    var spanText = (new ElemObj('span')).gen(text, {'class': 'choice-text'});
    var iArrow = (new ElemObj('i')).gen({'class': 'arrow'});
    var aSelect = (new ElemObj('a')).gen({'class': 'select-choice'});
    aSelect.appendChild(spanText);
    aSelect.appendChild(iArrow);
    var ulSelect = (new ElemObj('ul')).gen({'class': 'select-ul'});
    array.map(function (item) {
      var aElem = (new ElemObj('a')).gen(item.text, {
        'class': 'select-li-a',
        'data-index': index,
        'data-id': item.id,
        'data-text': item.text
      });
      var liElem = (new ElemObj('li')).gen({'class': 'select-li'});
      liElem.appendChild(aElem);
      ulSelect.appendChild(liElem);
    });
    var selectBox = (new ElemObj('div')).gen({'class': 'select-box'});
    selectBox.appendChild(aSelect);
    selectBox.appendChild(ulSelect);
    return selectBox;
  };

  var selectBoxsShow = function (elem, array, fillBack) {
    var genByIndex = function (index, linkId) {
      var item = array[index];
      var linkIdArray = item.linkIds[linkId];
      if (Array.isArray(linkIdArray)) {
        collDoms[index] = genSelectBox(item.defaultText, index, linkIdArray);
        elem.appendChild(collDoms[index]);
      } else {
        isEnd = true;
      }
    };
    var collDoms = [];
    var results = [];
    var arrayLen = array.length;
    var isEnd = false;

    if (!fillBack) {
      genByIndex(0, '0');
    } else {
      fillBack.map(function (item, index) {
        var linkIdArray;
        if (index == 0) {
          linkIdArray = array[index].linkIds[0];
        } else {
          var linkId = fillBack[index - 1].id;
          linkIdArray = array[index].linkIds[linkId];
        }
        collDoms[index] = genSelectBox(item.text, index, linkIdArray);
        elem.appendChild(collDoms[index]);
      });
      results = fillBack;
      var timeoutID = setTimeout(function () {
        elem.dispatchEvent(new CustomEvent('change', {detail: results}));
        clearTimeout(timeoutID);
      }, 100);
    }

    elem.addEventListener('click', function (e) {
      var target = e.target;
      if (target.className == 'select-li-a') {
        isEnd = false;
        var index = parseInt(target.getAttribute('data-index'));
        var thisId = target.getAttribute('data-id');
        var thisText = target.getAttribute('data-text');
        results[index] = {id: thisId, text: thisText};
        results.length = index + 1;
        collDoms[index].querySelector('.choice-text').innerHTML = target.innerHTML;
        if (index < arrayLen - 1) {
          for (var i = index + 1; i < arrayLen; i++) {
            if (collDoms[i] != undefined) {
              elem.removeChild(collDoms[i]);
              collDoms[i] = undefined;
            }
          }
          genByIndex(index + 1, thisId);
        }
        if (results.length == arrayLen || isEnd) {
          this.dispatchEvent(new CustomEvent('change', {detail: results}));
        }
      }
    }, false);
  };

  var selectBoxs = {
    show: selectBoxsShow,
    filter: function (key, array) {
      var newArray = [];
      array.map(function (item) {
        newArray.push(item[key]);
      });
      return newArray;
    },
    genFillById: function (selectData, itemId) {
      var findItem = function (key, value, array) {
        for (var i = array.length - 1; i >= 0; i--) {
          if (array[i][key] == value) {
            return array[i];
          }
        }
        return null;
      };
      var find = function (index, id) {
        var linkIds = selectData[index].linkIds;
        var key, findResult;
        for (key in linkIds) {
          findResult = findItem('id', id, linkIds[key]);
          if (findResult) {
            result.unshift(findResult);
            if (index > 0) {
              find(index - 1, key);
            }
            return true;
          }
        }
        return false;
      };
      var result = [];
      for (var i = selectData.length - 1; i >= 0; i--) {
        if (find(i, itemId)) {
          break;
        }
      }
      return result;
    }
  };
  window.selectBoxs = selectBoxs;

})(window);