/*
 * SWATCHES : REACT
 *  - Displays swatch options for a product
 *
 * REQUIRED DATA:
 *  - Root EL(s) need 'data-swatches' as stringified JSON array of swatch objects
 *  - Swatch Object Sample:
 *    {
 *      colorDisplayName: STRING,                    // NAME : Color Name that user sees in tooltip
 *      colorValueName: STRING (word-word),          // NAME : CSS name for color style fallback
 *      productId: STRING,                           // ID : Product ID
 *      productImgUrl: STRING,                       // IMAGE : Product image original (for restoring after hover)
 *      swatchId: STRING (productId-colorValueName), // ID : Swatch : Swatch Color Unique ID
 *      swatchImgUrl: STRING,                        // SWATCH : Image url for swatch (fallback = name as color)    
 *      variantImgUrl: STRING                        // IMAGE : Product Variant Image for that color option
 *    }
 *********************************************/
var SwatchList = require('./SwatchList');
 

// RENDER : Find all swatch elements and render a SwatchList in each element
var buildSwatches = function() {
  const elements = document.getElementsByClassName('react-swatch-list') || [];
  [...elements].forEach( el => {
    
    // SAFETY : Ensure data exists
    if ( el.dataset && el.dataset.swatches ) {


      // PARSE : Read + Pass data to component if valid JSON
      try {
        const swatchData = JSON.parse(el.dataset.swatches);
        
        // RENDER : If > 1 color, Render SwatchList into target el
        if ( swatchData.length > 1 ) {
          ReactDOM.render( <SwatchList swatchData={ swatchData } />, el );
        }
        

      // SAFETY : Malformatted JSON = most common error
      } catch (err) {
        console.log(`Swatch Data malformed, please check 'data-swatches' info on element\n  >${err.message || err}`);
      }
    }
  });
};

module.exports = buildSwatches;