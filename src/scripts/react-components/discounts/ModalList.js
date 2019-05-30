const PropTypes = require( 'prop-types' );
const ModalItem = require( './ModalItem.js' );

class ModalList extends React.Component {
	constructor( props ){
		super( props );
		this.selectNoThanks = this.selectNoThanks.bind( this );
	}

	selectNoThanks() {
		const { 
			discountsToApply,
			handleSelection,
			toggleButtonEnable 
		} = this.props;

		// UI : Disable buttons to prevent repeated clicks
		toggleButtonEnable( false );

		// FLAG : Mark all presented deals as used
		var rejectedDiscountIds = [];
		discountsToApply.forEach( discount => {
			rejectedDiscountIds.push( discount.discountId );
		});

		handleSelection( rejectedDiscountIds, false );
	}



	render() {
		const { 
			currencySymbol,
			disableButtons,
			discountsToApply, 
			handleSelection,
			toggleButtonEnable
		} = this.props;
		var priceThreshold = 0;


		// CHECK : OFFER DISCOUNT : Do we have any discounts to offer the user?
		var modalItems = null;
		if ( discountsToApply && discountsToApply.length > 0 ) {
			modalItems = discountsToApply.map( discount => {

				// THRESHOLD : Set Price Threshold for header msg
				priceThreshold = priceThreshold < discount.minSpend ? discount.minSpend : priceThreshold;

				// ITEM : Build list item for this component
				return (
					<ModalItem
						discountId={ discount.discountId }
						grantType={ discount.grantType }
						handleSelection={ handleSelection }
						imageUrl={ discount.imageUrl || '' }
						name={ discount.displayName || discount.title || 'Free Item!' }
						toggleButtonEnable={ toggleButtonEnable } />
				);
			})
		}


		return (
			<div id="discount-modal-list" data-option-count={ discountsToApply ? discountsToApply.length : '0' } data-enable-buttons={ disableButtons }>
				<div className="modal-list-heading">{ `For spending over ${currencySymbol}${priceThreshold}, you've earned a gift!` }</div>

				<div className="modal-list-content">
					{ modalItems }
				</div>

				<button className="modal-list-btn-no-thanks"  onClick={ this.selectNoThanks }>No Thanks</button>
			</div>
		);
	}
}


ModalList.propTypes = {
	currencySymbol: PropTypes.string.isRequired,
	discountsToApply: PropTypes.array,
	handleSelection: PropTypes.func.isRequired,
	toggleButtonEnable: PropTypes.func.isRequired
}

module.exports = ModalList;