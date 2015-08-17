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
    var nextNumClears = false;
    
    // Constructs a BigNumber from the number in the text field. Returns 0 if the
    // text field contains an invalid string.
    function getInput() {
      var str = textField.val();
      try {
        return new BigNumber(str);
      } catch(e) {
        return 0.
      }
    }
    
    // Returns a function. The function updates the calculator's state to reflect
    // that an operator was chosen. The functionality of the operator is defined by the
    // callback. The callback takes two BigNumber objects and should return a BigNumber.
    function makeOperator(callback) {
      return function() {
        lastNum = getInput();
        operator = callback;
        textField.focus();
        nextNumClears = true;
      }
    }
    
    function stripTrailing(str) {
      str = str.replace(/0+$/, '');
      return str.replace(/\.$/, '');
    }
    
    $e('.numpad button[data-char]').click(function() {
      var chr = $(this).attr('data-char');
      if (chr != '.' || textField.val().indexOf('.') == -1) {
        if (nextNumClears) {
          textField.val('');
          nextNumClears = false;
        }
        textField.val(textField.val() + chr);
      }
    });
  
    $e('.btn-add').click(makeOperator(function(a, b) {
      return a.plus(b);
    }));
  
    $e('.btn-subtract').click(makeOperator(function(a, b) {
      return a.minus(b);
    }));
    
    $e('.btn-multiply').click(makeOperator(function(a, b) {
      return a.times(b);
    }));
  
    $e('.btn-divide').click(makeOperator(function(a, b) {
      return a.dividedBy(b);
    }));
  
    $e('.btn-evaluate').click(function() {
      if (operator && lastNum) {
        var currentNum = getInput();
        var result = operator(lastNum, currentNum); // Returns a BigNumber.
        textField.val(
          stripTrailing(
            result
              .toPrecision(14)
              .toString()
          )
        ).focus();
        operator = null;
        lastNum = null;
        nextNumClears = true;
      }
    });
  
    $e('.btn-clear').click(function() {
      lastNum = null;
      operator = null;
      textField.val('').focus();
      nextNumClears = false;
    });
    
    function clearLastChar() {
      var str = textField.val();
      textField.val(
        str.substring(0, str.length - 1)
      );
    }
    
    calculator.keyup(function(event) {
      if (event.keyCode == 13) {
        // Return key.
        $e('.btn-evaluate').trigger('click');
      }
    });
    
    textField.on('input', function(event) {
      var str = textField.val();
      var lastChar = str.substr(str.length - 1, 1);
      var wasOp = false;
      
      switch (lastChar) {
        case '+':
          clearLastChar();
          wasOp = true;
          $e('.btn-add').trigger('click');
          break;
        case '-':
          clearLastChar();
          wasOp = true;
          $e('.btn-subtract').trigger('click');
          break;
        case '*':
          clearLastChar();
          wasOp = true;
          $e('.btn-multiply').trigger('click');
          break;
        case '/':
          clearLastChar();
          wasOp = true;
          $e('.btn-divide').trigger('click');
          break;
      }
      
      if (!wasOp && nextNumClears) {
        textField.val(lastChar);
        nextNumClears = false;
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