/*
 * DISCOUNTS : REACT
 *  - Handles discounts based on things like...
 *      "Spend $___ and get Product Y for Free / Discounted" (currently)
 *      "Spend $___ pick from set of products" 
 *
 *  - DOES NOT handle Coupon Code stuff, "Buy 2 get 1 free" are done via shopify scripts (For now)
 *
 * REQUIRED DATA:
 *  - Root EL with ID "react-discounts" in root of theme layout and a base64, stringified config object on data-discount-config prop
 *
 *
 * OPTIONAL DATA:
 *  - Element with ID "react-discount-meter" in the cart slideout (or wherever)
 *
 *********************************************/
const DiscountManager = require('./DiscountManager.js');


// PARENT : Initialize discounts manager + Render into Root el
$(document).ready( function(){
  
  // SAFETY : I can haz DOM Node + Config settings?
  const rootEl = document.getElementById('react-discounts');

  // SAFETY : DOM Node + Proper Config
  if ( rootEl ) {
    const discountConfig = rootEl.dataset.discountConfig;
    var parsedConfig = null;

    // SAFETY : Attempt to parse config from dom data
    if ( discountConfig && discountConfig.length > 0 ) {
      try {
        parsedConfig = JSON.parse( discountConfig );
      }

      catch( err ) {
        console.log( `[ DiscountParent -- init() ] ERROR : Looks like the discountConfig was not parsable, printout below:\n${discountConfig}` );
      }
    }

    // RENDER : If we have a config and a DOM Node, lets render the component!
    if ( parsedConfig && parsedConfig.cookieExpireInDays ) {
      ReactDOM.render(
        <DiscountManager config={ parsedConfig }/>,
        rootEl
      );
    }
  
  // SAFETY : No DOM Node : Report node is missing, but script was invoked still
  } else {
    // console.log('::: DEBUG : React-Discounts is being invoked, but was unable to locate the "react-discounts" DOM Node..');
  }
});