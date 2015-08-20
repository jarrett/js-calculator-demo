/**
 * @license for js-calculator-demo: https://github.com/jarrett/js-calculator-demo/blob/master/LICENSE
 */

$(function() {
  $('.calculator').each(function() {
    
    // -------------- //
    // DOM elements.  //
    // -------------- //
    
    // The wrapper element.
    var calculator = $(this);
    
    // Shorthand to select a child element of the wrapper.
    function $e(selector) {
      return calculator.find(selector);
    }
    
    // The text field where numbers are entered and displayed.
    var textField = $e('.calculator-text-field');
    
    // ------------------ //
    // Utility functions. //
    // ------------------ //
    
    // Constructs a BigNumber from the number in the text field. Returns 0 if the
    // text field contains an invalid string.
    function parseTextField() {
      var str = textField.val();
      try {
        return new BigNumber(str);
      } catch(e) {
        return 0.
      }
    }
    
    function stripTrailing(str) {
      str = str.replace(/0+$/, '');
      return str.replace(/\.$/, '');
    }
    
    function formatBigNumber(num) {
      return stripTrailing(
        num
          .toPrecision(14)
          .toString()
      );
    }
    
    // ---------- //
    // Operators. //
    // ---------- //
    
    function add(a, b) {
      return a.plus(b);
    }
    
    function subtract(a, b) {
      return a.minus(b);
    }
    
    function multiply(a, b) {
      return a.times(b);
    }
    
    function divide(a, b) {
      return a.dividedBy(b);
    }
    
    // -------------- //
    // State machine. //
    // -------------- //
    
    // States:
    //
    // - left: In the process of entering the left operand.
    // 
    // - middle: The left operand was terminated by entering an operator. Waiting for
    //   the first digit of the right operand.
    // 
    // - right: In the process of entering the right operand.
    // 
    // - result: Result of last operation shown. The next numeric input will be the
    //   left operand.
    // 
    // - chain: Like result, but an operator is pending, so the next numeric input will be
    //   the right operand.
    
    var operator = null;
    
    function evaluate() {
      var right = parseTextField();
      var result = operator(right);
      textField
        .val(formatBigNumber(result))
        .focus();
    }
    
    var fsm = StateMachine.create({
      initial: 'left',
      events: [
        {name: 'number',   from: 'left',     to: 'left'  },
        {name: 'number',   from: 'middle',   to: 'right' },
        {name: 'number',   from: 'right',    to: 'right' },
        {name: 'number',   from: 'result',   to: 'left'  },
        {name: 'number',   from: 'chain',    to: 'right' },
        
        {name: 'operator', from: 'left',     to: 'middle'},
        {name: 'operator', from: 'right',    to: 'chain' },
        {name: 'operator', from: 'middle',   to: 'middle'},
        {name: 'operator', from: 'result',   to: 'middle'},
        {name: 'operator', from: 'chain',    to: 'chain' },
        
        {name: 'evaluate', from: 'left',     to: 'left'  },
        {name: 'evaluate', from: 'middle',   to: 'middle'},
        {name: 'evaluate', from: 'right',    to: 'result'},
        {name: 'evaluate', from: 'result',   to: 'result'},
        {name: 'evaluate', from: 'chain',    to: 'chain' },
        
        {name: 'clear',    from: ['left',
                                  'middle',
                                  'right',
                                  'result',
                                  'chain'],  to: 'left'  }
      ],
      callbacks: {
        onnumber: function(_, _, _, chr) {
          textField.val(textField.val() + chr);
        },
        
        onoperator: function(_, _, _, op) {
          // Curry the operator function with the left value.
          var left = parseTextField();
          operator = function(right) { return op(left, right); };
        },
        
        onleft: function() {
          textField.val('');
        },
        
        onright: function() {
          textField.val('');
        },
        
        onresult: function() {
          evaluate();
        },
        
        onchain: function() {
          evaluate();
        },
        
        onclear: function() {
          textField.val('');
          fsm.clear();
        }
      }
    });
    
    window.fsm = fsm;
    
    // ----------- //
    // DOM events. //
    // ----------- //
    
    $e('.numpad button[data-char]').click(function() {
      var chr = $(this).attr('data-char');
      fsm.number(chr);
    });
    
    $e('.btn-add').click(function() {
      fsm.operator(add);
    });
  
    $e('.btn-subtract').click(function() {
      fsm.operator(subtract);
    });
    
    $e('.btn-multiply').click(function() {
      fsm.operator(multiply);
    });
  
    $e('.btn-divide').click(function() {
      fsm.operator(divide);
    });
  
    $e('.btn-evaluate').click(function() {
      fsm.evaluate();
    });
  
    $e('.btn-clear').click(function() {
      fsm.clear();
    });
    
    calculator.keyup(function(event) {
      if (event.keyCode == 13) { // Return key.
        fsm.evaluate();
      }
    });
    
    textField.on('keypress', function(event) {
      event.preventDefault();
      var chr = String.fromCharCode(event.keyCode)
      switch (chr) {
        case '+':
          fsm.operator(add);
          break;
        case '-':
          fsm.operator(subtract);
          break;
        case '*':
          fsm.operator(multiply);
          break;
        case '/':
          fsm.operator(divide);
          break;
        default:
          fsm.number(chr);
      }
    });
    
    // --------------- //
    // Initialization. //
    // --------------- //
    
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