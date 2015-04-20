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
      textField.val('');
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
      textField.val(result);
      operator = null;
      lastNum = null;
      resultShown = true;
    }
  });
  
  $('#btn-clear').click(function() {
    lastNum = null;
    operator = null;
    textField.val('');
    resultShown = false;
  });
});