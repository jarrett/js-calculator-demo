$(function() {
  $('.calculator').each(function() {
    var calculator = $(this);
    function $e(selector) {
      return calculator.find(selector);
    }
    
    var textField = $e('.calculator-text-field');
  
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
  
    $e('.numpad button[data-char]').click(function() {
      var chr = $(this).attr('data-char');
      if (chr != '.' || textField.val().indexOf('.') == -1) {
        if (resultShown) {
          resultShown = false;
          textField.val('');
        }
        textField.val(textField.val() + chr);
      }
    });
  
    $e('.btn-add').click(makeOperator(function(a, b) {
      return (a.value + b.value)
        .toFixed(Math.max(a.decimals, b.decimals));
    }));
  
    $e('.btn-subtract').click(makeOperator(function(a, b) {
      return (a.value - b.value)
        .toFixed(Math.max(a.decimals, b.decimals));
    }));
  
    $e('.btn-multiply').click(makeOperator(function(a, b) {
      return (a.value * b.value)
        .toFixed(a.decimals + b.decimals);
    }));
  
    $e('.btn-divide').click(makeOperator(function(a, b) {
      return a.value / b.value;
    }));
  
    $e('.btn-evaluate').click(function() {
      if (operator && lastNum) {
        var currentNum = getInput();
        var result = operator(lastNum, currentNum);
        textField.val(result).focus();
        operator = null;
        lastNum = null;
        resultShown = true;
      }
    });
  
    $e('.btn-clear').click(function() {
      lastNum = null;
      operator = null;
      textField.val('').focus();
      resultShown = false;
    });
  
    $e('.calculator').keyup(function(event) {
      if (event.keyCode == '187' && event.shiftKey) {
        $e('.btn-add').trigger('click');
      } else if (event.keyCode == 189 && !event.shiftKey) {
        $e('.btn-subtract').trigger('click'); 
      } else if (event.keyCode == 56 && event.shiftKey) {
        $e('.btn-multiply').trigger('click');
      } else if (event.keyCode == 191 && !event.shiftKey) {
        $e('.btn-divide').trigger('click');
      } else if ((event.keyCode == '187' && !event.shiftKey) || event.keyCode == 13) {
        $e('.btn-evaluate').trigger('click');
      }
    });
  
    // Set tab indices.
    (function() {
      var minTabIndex = parseInt($e('.calculator').attr('data-tabindex'));
    
      textField.attr('tabindex', minTabIndex);
    
      $e('.numpad button[data-char]').each(function() {
        if ($(this).attr('data-char') != '.') {
          $(this).attr(
            'tabindex',
            minTabIndex + parseInt($(this).attr('data-char')) + 1
          );
        }
      });
    
      $e('.btn-decimal' ).attr('tabindex', minTabIndex + 11);
      $e('.btn-add'     ).attr('tabindex', minTabIndex + 12);
      $e('.btn-subtract').attr('tabindex', minTabIndex + 13);
      $e('.btn-multiply').attr('tabindex', minTabIndex + 14);
      $e('.btn-divide'  ).attr('tabindex', minTabIndex + 15);
      $e('.btn-evaluate').attr('tabindex', minTabIndex + 16);
      $e('.btn-clear'   ).attr('tabindex', minTabIndex + 17);
    })();
  });
});