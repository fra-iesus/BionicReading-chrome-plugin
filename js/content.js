(function() {
  "use strict" ;

  function bionizeWord (inputWord) {
    var letters = inputWord.match(/([^ .,;]+)/g);
    if (letters) {
      letters = letters[0];
    } else {
      letters = '';
    }
    var separator = inputWord.match(/([ .,;]+)/g);
    if (separator) {
      separator = separator[0];
    } else {
      separator = '';
    }
    if (!letters.length) return inputWord;
    var length = Math.floor(letters.length/2) + (letters.length % 2);
    return '<span class="bionized">' + letters.substring(0, length) + '</span>' + letters.substring(length) + separator;
  }
  function bionizeElement (el) {
    var inputTextBlock = el.textContent;
    var outputTextBlock = '';
    var words = inputTextBlock.replace(/([ .,;]+)/g,'$1§-bionized-separator-§').split('§-bionized-separator-§');
    if (words) {
      for (var wordsIdx = 0; wordsIdx < words.length; wordsIdx++) {
        var bionizedWord = bionizeWord(words[wordsIdx]);
        outputTextBlock += bionizedWord;
      }
    }
    var replacementNode = document.createElement('span');
    replacementNode.className = 'bionized wrapper';
    replacementNode.innerHTML = outputTextBlock;
    el.parentNode.classList.add("bionized");
    el.parentNode.insertBefore(replacementNode, el);
    el.parentNode.removeChild(el);
    return;
  }
  function bionizeHTML(elem, opt_fnFilter) {
    const excludedNodes = [
      'NOSCRIPT',
      'STYLE',
      'SCRIPT',
    ];
    if (elem) {
      for (var nodes = elem.childNodes, i = nodes.length; i--;) {
        var nodeType = nodes[i].nodeType;
        if (!excludedNodes.includes(nodes[i].tagName) && (!nodes[i].classList || !nodes[i].classList.contains('bionized'))) {
          if (nodeType == 3) {
            if (!opt_fnFilter || opt_fnFilter(nodes[i], elem)) {
              bionizeElement(nodes[i]);
            }
          } else if ( nodeType == 1 || nodeType == 9 || nodeType == 11 ) {
            bionizeHTML(nodes[i], opt_fnFilter);
          }
        }
      }
    }
  }
  function ready () {
    bionizeHTML(document.body);

    document.addEventListener('animationstart', updateOnChange, false);
    document.addEventListener('MSAnimationStart', updateOnChange, false);
    document.addEventListener('webkitAnimationStart', updateOnChange, false);
  }
  function updateOnChange (ev) {
    if (event.animationName == 'nodeInserted' &&  (!event.target.classList || !event.target.classList.contains('bionized'))) {
      bionizeHTML(event.target);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", ready, false);
  } else {
    ready();
  }
})();
