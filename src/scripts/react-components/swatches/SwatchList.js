/* REACT COMPONENT : SWATCHES
 *
 * ..:: REQUIRED - SWATCH OBJ: Required data in each swatch ::..
 *   colorDisplayName: option['title'],                // NAME : Color Name that user sees in tooltip
 *   colorValueName: this.slugify( option['title'] ),  // NAME : CSS name for color style fallback
 *
 *   productId: data.id,                               // ID : Product ID
 *   swatchId: data.id + '-' + option['title'],        // ID : Swatch : Swatch Color Unique ID
 *
 *   productImgUrl,                                    // IMAGE : Product image original (for restoring after hover)
 *   swatchImgUrl,                                     // SWATCH : Image url for swatch (fallback = name as color)    
 *   variantImgUrl                                     // IMAGE : Product Variant Image for that color option
 *
 * ..:: REQUIRED - IMAGE LOCATION: ID of image to swap src ::..
 *   'product-image-PRODUCT_ID_HERE' (EX: 'product-image-13243223')
 *****************************************************************************/ 
var PropTypes = require( 'prop-types' );
var SwatchItem = require( './SwatchItem.js' );

class SwatchList extends React.Component {
  constructor(props) {
    super(props);

    // Ensure Product Info is Present
    const { productId, productImgUrl } = this.props.swatchData[0] || {};
    if ( !productId || !productImgUrl ) {
      const culprit = !productId ? 'Product ID' : 'Product Img URL';
      console.log( '[SwatchList.js] -- Swatch data is missing the ' + culprit + '!' );
    }

    this.state = {
      activeSwatchId: null,
      activeImgUrl: productImgUrl,
      productId: productId
    };

    // BIND CONTEXT : Imperative, bind 'this' context to the current class scope
    this.selectSwatch = this.selectSwatch.bind(this);
    this.resetProductImg = this.resetProductImg.bind(this);
  }


  // SWAP IMAGE : Change to variant image and set active state if clicked (handles hover also)
  selectSwatch(swatchId, variantImgUrl, isHover = false ) {
    const { activeImgUrl, productId } = this.state;

    // SWAP IMAGE : When hover / click swap image to that color variant if it is present
    if ( variantImgUrl && variantImgUrl.length > 10 ) {
      const targetImg = document.getElementById( 'product-image-' + productId );
      targetImg.src = variantImgUrl;
    }

    // SET ACTIVE : Indicate which swatch is active currently
    if ( !isHover ) {
      this.setState({ 
        activeSwatchId: swatchId,
        activeImgUrl: variantImgUrl.length > 10 ? variantImgUrl : activeImgUrl
      });
    }
  }

  // RESET IMAGE : Set image back to main product img after hover exit
  resetProductImg() {
    const { activeImgUrl, productId } = this.state;
    const targetImg = document.getElementById( 'product-image-' + productId );
    targetImg.src = activeImgUrl;
  }



  render() {
    const { swatchData } = this.props; // Destructuring = verbosity saver
    const { activeSwatchId } = this.state; // Destructuring = verbosity saver
    let swatches = null;

    if (swatchData.length > 0) {
      let usedColors = [];

      swatches = swatchData.map( (swatchObj) => {
        const { 
          colorValueName, 
          swatchId,
          swatchImgUrl,
          variantImgUrl 
        } = swatchObj;

        const isAlreadyDisplayed = usedColors.find( color => color === colorValueName ); //colorValueName = this-is-my-color-name

        // UNUSED - Lets add to list and render swatch
        if ( !isAlreadyDisplayed ) {
          usedColors.push( colorValueName ); //Add color to list of used colors
          return ( 
            <SwatchItem
              active={ swatchId === activeSwatchId }
              colorValueName={ colorValueName }
              key={ swatchId }
              resetProductImg={ this.resetProductImg }
              selectSwatch={ this.selectSwatch }
              swatchId={ swatchId }
              swatchImgUrl={ swatchImgUrl }
              variantImgUrl={ variantImgUrl } />
          );
        }
      });
    }

    return (
      <div className="swatch-list">
        { swatches }
      </div>
    );
  }
}

SwatchList.propTypes = {
  swatchData: PropTypes.array.isRequired
}

module.exports = SwatchList;