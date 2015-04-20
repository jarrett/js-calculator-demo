$(function() {
  var textField = $('#calculator-text-field');
  
  textField.focus();
  
  var lastNum = null;
  var operator = null;
  var resultShown = false;
  
  function getInput() {
    var str = textField.val();
    split = str.split('.');
    return {
      value: parseFloat(str),
      decimals: (split.length == 1) ? 0 : split[1].length
    };
  }
  
  function makeOperator(callback) {
    return function() {
      lastNum = getInput();
      operator = callback;
      textField.val('').focus();
      resultShown = false;
    }
  }
  
  $('#numpad button[data-char]').click(function() {
    var chr = $(this).attr('data-char');
    if (chr != '.' || textField.val().indexOf('.') == -1) {
      if (resultShown) {
        resultShown = false;
        textField.val('');
      }
      textField.val(textField.val() + chr);
    }
  });
  
  $('#btn-add').click(makeOperator(function(a, b) {
    return (a.value + b.value)
      .toFixed(Math.max(a.decimals, b.decimals));
  }));
  
  $('#btn-subtract').click(makeOperator(function(a, b) {
    return (a.value - b.value)
      .toFixed(Math.max(a.decimals, b.decimals));
  }));
  
  $('#btn-multiply').click(makeOperator(function(a, b) {
    return (a.value * b.value)
      .toFixed(a.decimals + b.decimals);
  }));
  
  $('#btn-divide').click(makeOperator(function(a, b) {
    return a.value / b.value;
  }));
  
  $('#btn-evaluate').click(function() {
    if (operator && lastNum) {
      var currentNum = getInput();
      var result = operator(lastNum, currentNum);
      textField.val(result).focus();
      operator = null;
      lastNum = null;
      resultShown = true;
    }
  });
  
  $('#btn-clear').click(function() {
    lastNum = null;
    operator = null;
    textField.val('').focus();
    resultShown = false;
  });
  
  // Set tab indices.
  (function() {
    var minTabIndex = parseInt($('#calculator').attr('data-tabindex'));
    
    textField.attr('tabindex', minTabIndex);
    
    $('#numpad button[data-char]').each(function() {
      if ($(this).attr('data-char') != '.') {
        $(this).attr(
          'tabindex',
          minTabIndex + parseInt($(this).attr('data-char')) + 1
        );
      }
    });
    
    $('#btn-decimal' ).attr('tabindex', minTabIndex + 11);
    $('#btn-add'     ).attr('tabindex', minTabIndex + 12);
    $('#btn-subtract').attr('tabindex', minTabIndex + 13);
    $('#btn-multiply').attr('tabindex', minTabIndex + 14);
    $('#btn-divide'  ).attr('tabindex', minTabIndex + 15);
    $('#btn-evaluate').attr('tabindex', minTabIndex + 16);
    $('#btn-clear'   ).attr('tabindex', minTabIndex + 17);
  })();
});