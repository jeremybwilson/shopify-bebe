var PropTypes = require( 'prop-types' );

class SwatchItem extends React.Component {
  constructor(props) {
    super(props);
    this.callSelectSwatch = this.callSelectSwatch.bind(this);
    this.hoverSwatch = this.hoverSwatch.bind(this);
  }



  // SWAP IMAGE : Select swatch changes image and sets active state
  callSelectSwatch( isHover ) {
    const { selectSwatch, swatchId, variantImgUrl } = this.props;
    const isHoverState = isHover === true; //Click events cause this to be the "event" object instead
    selectSwatch( swatchId, variantImgUrl, isHoverState );
  }

  // HOVER TILE : Swap variant image on hover, don't store as selection
  hoverSwatch() { this.callSelectSwatch( true ) }



  render() {
    const { 
      active,
      colorValueName, 
      resetProductImg, 
      swatchId,
      swatchImgUrl,
      variantImgUrl
    } = this.props; // Destructuring = verbosity save

    const isActive = active ? 'active' : '';
    const swatchColorStyle = {
      backgroundColor: colorValueName,
      backgroundImage: `url( ${swatchImgUrl} )` //May or may not have swatch img
    }

    return (
      <div 
        className={ 'swatch-item-wrap ' + isActive }
        onMouseEnter={ this.hoverSwatch }
        onMouseLeave={ resetProductImg }
        onClick={ this.callSelectSwatch }>
        
        <div className="swatch-highlight"></div>
        <div style={ swatchColorStyle } className={ 'swatch-item ' + colorValueName }></div>
      </div>
    );
  }
}

SwatchItem.propTypes = {
  active: PropTypes.bool.isRequired,
  colorValueName: PropTypes.string.isRequired,
  selectSwatch: PropTypes.func.isRequired,
  swatchId: PropTypes.string.isRequired,
  swatchImgUrl: PropTypes.string,
  variantImgUrl: PropTypes.string.isRequired
};

module.exports = SwatchItem;