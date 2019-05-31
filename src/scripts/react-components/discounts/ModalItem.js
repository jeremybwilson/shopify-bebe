const PropTypes = require( 'prop-types' );

class ModalItem extends React.Component {
  constructor( props ){
    super( props );
    this.addToCart = this.addToCart.bind(this);
  }

  addToCart( e ) {
    const {
      discountId,
      handleSelection,
      toggleButtonEnable
    } = this.props;

    toggleButtonEnable( false );            // BUTTONS : Prevent multiple clicks
    handleSelection( [discountId], true );  // ADD : Submit item to the cart
  }

  render() {
    var {
      grantType,
      handleSelection, 
      imageUrl, 
      name 
    } = this.props;

    return (
      <div className="modal-item">
      <div className="modal-item-image" style={{ backgroundImage: `url(${imageUrl} )` }}></div>
      <div className="modal-item-name">{ name }</div>

      <div className="modal-item-buttons">
        <button className="modal-item-btn-add" onClick={ this.addToCart }>{ grantType === 'pick' ? 'Select' : 'Add' }</button>
      </div>
      </div>
    );
  }
}


ModalItem.propTypes = {
  discountId: PropTypes.number.isRequired,
  grantType: PropTypes.string.isRequired,
  handleSelection: PropTypes.func.isRequired,
  imageUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  toggleButtonEnable: PropTypes.func.isRequired
}

module.exports = ModalItem;