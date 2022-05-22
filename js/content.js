(function() {
  "use strict" ;
  function ready () {
    function bionizeWord ( inputWord ) {
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
      return '<span style="font-weight: bold">' + letters.substring(0, length) + '</span>' + letters.substring(length) + separator;
    }
    function bionizeElement ( el ) {
      var inputTextBlock = el.textContent;
      var outputTextBlock = '';
      var words = inputTextBlock.replace(/([ .,;]+)/g,'$1§sep§').split('§sep§');
      if (words) {
        outputTextBlock += '<span style="font-weight: normal">';
        for (var wordsIdx = 0; wordsIdx < words.length; wordsIdx++) {
          var bionizedWord = bionizeWord(words[wordsIdx]);
          outputTextBlock += bionizedWord;
        }
        outputTextBlock += '</span>';
      }
      var replacementNode = document.createElement('span');
      replacementNode.innerHTML = outputTextBlock;
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
          if (nodeType == 3 && !excludedNodes.includes(nodes[i].tagName)) {
            if (!opt_fnFilter || opt_fnFilter(nodes[i], elem)) {
              bionizeElement(nodes[i]);
            }
          } else if ( (nodeType == 1 || nodeType == 9 || nodeType == 11) && !excludedNodes.includes(nodes[i].tagName) ) {
            bionizeHTML(nodes[i], opt_fnFilter);
          }
        }
      }
    }
    bionizeHTML(document.body);
  }

  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", ready, false);
  } else {
    ready();
  }
})();
