window.freeShipDiffCalc = function() {
    var note = window.shipData.shipText;
    var note_free_ship = window.shipData.freeShipText;
    var threshold = window.shipData.threshold;
    jQuery.getJSON('/cart.js', function (cart) {
      var cart_total = cart.total_price/100;
      var diff = threshold - cart_total;
      if(diff<0){        
        $('.free-shipping-note').html(note_free_ship);
      }
      else{
        diff = diff * 100;
        var note_final = note.replace('$XX',Shopify.formatMoney(diff));
        $('.free-shipping-note').html(note_final);
      }      
    });
  }

  $(document).ready(function(){
    window.freeShipDiffCalc();
  });