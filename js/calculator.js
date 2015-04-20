// TODO: Round the answer to the number of decimal places of the most precise operand.
// This will mitigate floating point errors that could cause 1 + 2 = 2.9999.
// 
// But not for division.

$(function() {
  var textField = $('#calculator-text-field');
  
  var lastNum = null;
  var operator = null;
  
  $('#numpad button[data-char]').click(function() {
    var chr = $(this).attr('data-char');
    if (chr != '.' || textField.val().indexOf('.') == -1) {
      textField.val(textField.val() + chr);
    }
  });
  
  function makeOperator(callback) {
    return function() {
      lastNum = parseFloat(textField.val());
      textField.val('');
      operator = callback;
    }
  }
  
  $('#btn-add').click(makeOperator(function(a, b) {
    return a + b;
  }));
  
  $('#btn-subtract').click(makeOperator(function(a, b) {
    return a - b;
  }));
  
  $('#btn-multiply').click(makeOperator(function(a, b) {
    return a * b;
  }));
  
  $('#btn-divide').click(makeOperator(function(a, b) {
    return a / b;
  }));
  
  $('#btn-evaluate').click(function() {
    if (operator && lastNum) {
      var currentNum = parseFloat(textField.val());
      var result = operator(lastNum, currentNum);
      textField.val(result);
      operator = null;
      lastNum = null;
    }
  });
  
  $('#btn-clear').click(function() {
    lastNum = null;
    operator = null;
    textField.val('');
  });
});