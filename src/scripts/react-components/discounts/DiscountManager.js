/* REACT COMPONENT : DISCOUNT MANAGERtotal_price ? 
 *
 * ..:: SAMPLES - DISCOUNT CONFIG ::..
 *
 *
 *  #1 - Spend X, Get Y item free (or whatever you set its price to)
 *
 *		thresholdDiscounts: [{
 *			discountId: 1,					// DISCOUNT ID -- Unique identifier for this discount, so we can tell if its already applied
 *			giftId: 17667671031906, 		// VARIANT ID --- Item being given for free, see docs for formatting rules
 *			grantType: 'all',				// GRANT TYPE --- Does user get this gift if higher threshold is met? -- (OPTIONS: 'all' or 'pick')
 *			inventoryId: 17275313422434,	// INVENTORY ID - Variant ID of full-price original version (gift is untracked usually, uses full-cost variant to see how many left)
 *			message: "For spending over $200, here is your free gift!",
 *			minSpend: 200,					// THRESHOLD ---- Dollar (or current currency) amount to trigger free gift
 *			productHandle: 'mens-northwest-territory-socks'
 *		}]
 *
 *****************************************************************************/ 
const PropTypes = require( 'prop-types' );
const Promise = require( 'bluebird' );
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const DiscountModal = require( './DiscountModal.js' );


class DiscountManager extends React.Component {
	constructor( props ) {
		super( props );

		// CONFIG : Discount Configuration Manifest
		this.config = props.config;
		this.config.thresholdDiscounts = this.config.thresholdDiscounts || []; // Safety net
		this.config.currencySymbol = this.config.currencySymbol ? entities.decode( this.config.currencySymbol ) : '$';

		/* EXAMPLE CONFIG : 3 Gift items set to "Pick" after spending $200+ in cart total (Sample is on muckboot-dev)
			{
				cookieExpireInDays: 60,						// COOKIE : # of days before cookie expires
				thresholdDiscounts: [
					// SAMPLE : Pick Style, spend over 200 and pick among these..		
					{
						discountId: 1,						// DISCOUNT ID -- Unique identifier for this discount, so we can tell if its already applied
						displayName: 'Wigwam Hat (Black)',	// DISPLAY NAME - Name displayed under item in the ModalItem component (Falls back to "title" provided during the item inventory check)
						giftId: 18107441610850, 			// VARIANT ID --- Item being given for free, see docs for formatting rules
						grantType: 'pick',					// GRANT TYPE --- Does user get this gift if higher threshold is met? -- (OPTIONS: 'all' or 'pick')
						inventoryId: 18107441610850,		// INVENTORY ID - Variant ID of full-price original version (gift is untracked usually, uses full-cost variant to see how many left)
						minSpend: 200,						// THRESHOLD ---- Dollar (or current currency) amount to trigger free gift
						productHandle: 'wigwam-winter-hat'  // HANDLE NAME -- Handle name of product (found in seo-block on product page in admin)
					},
					{
						discountId: 2,						// DISCOUNT ID -- Unique identifier for this discount, so we can tell if its already applied
						displayName: 'Wigwam Hat (Gray)',	// DISPLAY NAME - Name displayed under item in the ModalItem component
						giftId: 18107441643618, 			// VARIANT ID --- Item being given for free, see docs for formatting rules
						grantType: 'pick',					// GRANT TYPE --- Does user get this gift if higher threshold is met? -- (OPTIONS: 'all' or 'pick')
						inventoryId: 18107441643618,		// INVENTORY ID - Variant ID of full-price original version (gift is untracked usually, uses full-cost variant to see how many left)
						minSpend: 200,						// THRESHOLD ---- Dollar (or current currency) amount to trigger free gift
						productHandle: 'wigwam-winter-hat'	// HANDLE NAME -- Handle name of product (found in seo-block on product page in admin)
					},
					{
						discountId: 3,						// DISCOUNT ID -- Unique identifier for this discount, so we can tell if its already applied
						displayName: 'Wigwam Hat (Natural)',// DISPLAY NAME - Name displayed under item in the ModalItem component
						giftId: 18107441676386, 			// VARIANT ID --- Item being given for free, see docs for formatting rules
						grantType: 'pick',					// GRANT TYPE --- Does user get this gift if higher threshold is met? -- (OPTIONS: 'all' or 'pick')
						inventoryId: 18107441676386,		// INVENTORY ID - Variant ID of full-price original version (gift is untracked usually, uses full-cost variant to see how many left)
						minSpend: 200,						// THRESHOLD ---- Dollar (or current currency) amount to trigger free gift
						productHandle: 'wigwam-winter-hat'	// HANDLE NAME -- Handle name of product (found in seo-block on product page in admin)
					}
				]
			}
		*/

		// ENABLED : Did the user disable showing the modal?
		const doNotShowAgain = $.cookie( 'BOL_hide_discounts_modal' );

		// LAST SESSION : Do we have any discount data saved from a previous session?
		var savedUsedDiscounts = $.cookie( 'BOL_used_discounts' );
		var savedRejectedDiscounts = $.cookie( 'BOL_rejected_discounts' );

		try {
			if ( savedUsedDiscounts ) { 
				savedUsedDiscounts = JSON.parse( savedUsedDiscounts );
			}
			if ( savedRejectedDiscounts ) { 
				savedRejectedDiscounts = JSON.parse( savedRejectedDiscounts );
			}
		}
		catch( err ) {
			console.log( `DiscountManager : Choked while eating the cookies, they may have gone bad...\n${err}` );
		}

		// STATE : Current state in manager
		this.state = {
			cartTotal: 0,
			discountsToApply: [],
			doNotShowAgain: doNotShowAgain || false,
			rejectedDiscounts: savedRejectedDiscounts || [],
			removedDiscounts: [],
			usedDiscounts: savedUsedDiscounts || []
		};

		this.inFlightIds = [];

		// EVENTS : Bind functions to current context
		this.calcCartTotal = this.calcCartTotal.bind( this );
		this.calcThresholdDiscounts = this.calcThresholdDiscounts.bind( this );
		this.confirmRemoval = this.confirmRemoval.bind( this );
		this.enableDoNotShowAgain = this.enableDoNotShowAgain.bind( this );
		this.markDiscountUsed = this.markDiscountUsed.bind( this );
		this.onCartUpdate = this.onCartUpdate.bind( this );
		this.rejectDiscount = this.rejectDiscount.bind( this );
		this.rejectOnGiftRemoval = this.rejectOnGiftRemoval.bind( this );
		this.removeCartItem = this.removeCartItem.bind( this );
		this.updateInFlightIds = this.updateInFlightIds.bind( this );
	}

	componentDidMount() {
		$( document ).on( "cartUpdated", this.onCartUpdate ); // Listen for cart updates
		$( document ).on( "giftItemRemoved", this.rejectOnGiftRemoval ); // Listen for user manually removing gift, mark as rejected

		// INIT : If on /cart, must gather cart data to adjust any deals potentially
		const onCartPage = window.location.pathname.indexOf( '/cart' ) !== -1;
		if ( onCartPage ) {
			ShopifyAPI.getCart( ajaxCart.cartUpdateCallback ); 
		}
	}
	
	componentDidUnmount() {
		$( document ).off( "cartUpdated", this.onCartUpdate );
	}



	calcCartTotal( total_price = 0 ) {
		// CONVERT : Change cart value to a whole dollar (or other currency) amount
		var dollar, cents, cartTotal, total = JSON.stringify( total_price );
		
		if ( total.length < 3 ) {
			dollar = 0;
			cents = total
		
		} else {
			dollar = total.substring( 0, total.length - 2 );
			cents = total.substring( total.length - 2, total.length );
		}

		cartTotal = JSON.parse( dollar + '.' + cents );
		// console.log( `::: DEBUG : Parsed cart total: $${cartTotal}` );
		return cartTotal;
	}

	calcThresholdDiscounts( cartTotal, cartItems ) {
		var { thresholdDiscounts } = this.config;
		const { rejectedDiscounts, usedDiscounts } = this.state;
		var metDiscounts = [];

		// CHECK : Did we meet any discount thresholds? (Safety, as this evolves..)
		if ( thresholdDiscounts.length > 0 ) {

			// SCAN CART : Check cart items to ensure no other discounts are met, if they are lets remove their other pick choices (ones set to grantType: 'pick' that are also met)
			cartItems.forEach( item => {
				const discountInCart = thresholdDiscounts.find( rule => rule.giftId === item.variant_id );

				// MATCH : Remove any other discounts that would be prevented by having added this one
				if ( discountInCart ) {
					
					// FILTER : Remove any other discounts that are pick type and under our spend threshold
					thresholdDiscounts = thresholdDiscounts.filter( discount => {
						const spendConflict = discount.minSpend <= discountInCart.minSpend;
						const isPickType = discount.grantType === 'pick';

						if ( !spendConflict && !isPickType ) {
							return discount;
						}
					});
				}
			});


			// BUILD : ARRAY : Discounts NOT used yet + Past "minSpend" Threshold + No other "Pick" discounts at same minSpend are met
			metDiscounts = thresholdDiscounts.filter( rule => {
				const hasBeenUsed = usedDiscounts.find( discountObj => discountObj.discountId === rule.discountId );
				const hasBeenRejected = rejectedDiscounts.find( rejectId => rejectId === rule.discountId );
				const hasBeenMet = rule.minSpend <= cartTotal;
				
				// TIME RANGE : Ensure discount is currently in its active time window
				if ( rule.time_start && rule.time_end ) {
					const now = new Date();
					const start = new Date( rule.time_start );
					const end = new Date( rule.time_end );
					const meetsTimeWindow = now >= start && now < end;

					return !hasBeenUsed && !hasBeenRejected && hasBeenMet && meetsTimeWindow;
				
				} else {
					console.log( `ERROR : [ GWP - DiscountManager.js ] : Time range on discount '${rule.displayName}' is invalid:\n   Start: ${rule.time_start}\n   End: ${rule.time_end}` );
					return false; // Skip this discount
				}
			});
		}
		return metDiscounts; //Extra protection is all here..
	}

	confirmRemoval() {
		// CONFIRMED : Clear out the "removedDiscounts" array since we've informed the user now
		this.setState( state => {
	    	return { removedDiscounts: [] };
	    });
	}

	enableDoNotShowAgain() {
		$.cookie( 'BOL_hide_discounts_modal','true', { 
			expires: 90,
			path: '/'
		}); //Expire in days
		this.setState({ doNotShowAgain: true });
	}

	fetchProduct( productHandle ) {
		return fetch( `/products/${productHandle}?view=availability` )
			.then( res => {
		        if ( res.status >= 400 ) {
		            throw new Error( "Bad res from server" );
		        }
		        return res.json();
		    })
		    .then( productJson => {
		        return productJson;
			})
			.catch( err => {
				const theError = err && err.message ? err.message : err || 'Request failed for an unknown reason with no error object returned..';
				console.log( `[ DiscountManager -- fetchProduct() ] : Failed request :\n${ theError }` );
				throw new Error( theError );
			});
	}


	markDiscountUsed( discountId ) {
		var { usedDiscounts } = this.state;
		
		// CHECK : If not present, add to the list
		var isAlreadyMarked = usedDiscounts.find( used => used.discountId === discountId );
		if ( !isAlreadyMarked ) {

			// UPDATE : Create new array to for state-based render update
			this.setState( state => {

				// USED : Update the used list with our fully-built discount obj (includes image_url)
				const appliedDiscount = state.discountsToApply.find( discount => discount.discountId === discountId );
		    	const updatedUsedList = appliedDiscount ? state.usedDiscounts.concat( [ appliedDiscount ] ) : state.usedDiscounts;
		    	
		    	// TO APPLY : Remove the now applied discount from the manifest of those to apply still
		    	const updatedApplyList = state.discountsToApply.filter( discount => discount.discountId !== discountId );
		    	const discountsToApply = [].concat( updatedApplyList );

		    	// SAVE : Save our data before updating the app, in case user leaves site
		    	$.cookie( 'BOL_used_discounts', JSON.stringify( updatedUsedList ), { 
		    		expires: this.config.cookieExpireInDays,
		    		path: '/'
		    	});
		    	
		    	return { 
		    		discountsToApply,
		    		usedDiscounts: updatedUsedList
		    	};
		    });
		}
	}

	markDiscountUnused( discountId ) {
		const { usedDiscounts } = this.state;
		var isOnList = usedDiscounts.find( used => used.discountId === discountId );

		if ( isOnList ) {

			// UPDATE : Create new array to for state-based render update
			this.setState( state => {

				// FILTER : Find matching ID and remove from the list of used IDs
				const filteredUsed = usedDiscounts.filter( usedObj => usedObj.discountId !== discountId );
				const updatedUsedList = [].concat( filteredUsed );

		    	// UPDATE STATE + COOKIE : Save our data before updating the app, in case user leaves site
		    	$.cookie( 'BOL_used_discounts', JSON.stringify( updatedUsedList ), { 
		    		expires: this.config.cookieExpireInDays,
		    		path: '/'
		    	});

		    	return { usedDiscounts: updatedUsedList };
		    });
		}
	}

	onCartUpdate( e ) {
		const { thresholdDiscounts } = this.config; 		// ARRAY : Configured threshold discount objects (if any setup)
		var { 
			cartTotal,
			removedDiscounts,
			usedDiscounts 
		} = this.state;		// We mod / repush the usedDiscounts arr, hence var

		var discountsToApply = [];	// Array of Discount Objects
		var discountsToRemove = []; // Array of Discount objects

		// CART : ITEMS : Store current cart manifest so we can check it for removal needs
		const cartItems = e.cart.items || [];

		// CART : CONVERT TOTAL : Calc $$$ in cart (comes as "12345" which === "$123.45" )
		//         (Assumes base10 -- last two digits seen as "cents" -- WILL NOT WORK on Yen-type currency)
		const newCartTotal = this.calcCartTotal( e.cart.total_price );

		try { // SAFETY FIRST!

			// ADD CHECK : THRESHOLD : Did we meet any new discounts with this cart change?
			if ( thresholdDiscounts && thresholdDiscounts.length > 0 ) {
				discountsToApply = this.calcThresholdDiscounts( newCartTotal, cartItems );
			}

			// ADD CHECK : IN STOCK : Are the 'discountsToApply' in stock?
			if ( discountsToApply.length !== this.state.discountsToApply.length || discountsToApply.length > 0 ) {
				var inStockDiscounts = [];

				// ITERATE : Map each discount to check if its gift is available
				Promise.all(
					discountsToApply.map( discount => {
						return this.fetchProduct( discount.productHandle )
							.then( res => {

								// IN STOCK : Are any variants in the giftData available? 
								if ( res && res.availableVariants ) {
									const inStockObj = res.availableVariants.find( variant => variant.variantId === discount.inventoryId );

									// DISCOUNT IN STOCK? 
									if ( inStockObj ) {
										inStockDiscounts.push( Object.assign( {}, discount, inStockObj ) );
									}
								}
							});
					})
				).then( () => {

					// UPDATE : Set the discounts we have into state so they can be offered
					this.setState({ discountsToApply: inStockDiscounts });
				});
			}



			// REMOVE CHECK : CART SCAN : Check cart items, if any match a discount in config, check if it still qualifies
			cartItems.forEach( ( item, index ) => {
				var matchedDiscount = thresholdDiscounts.find( rule => rule.giftId === item.variant_id );

				// CHECK : Do we still meet this deals requirements?
				if ( matchedDiscount && matchedDiscount.minSpend > newCartTotal ) {
					
					// CHECK : Have we already flagged this item to be removed?
					var isAlreadyMarked = discountsToRemove.find( rule => rule.discountId === matchedDiscount.discountId ); //Undef if not found
					var isInFlight = this.inFlightIds.find( id => id === matchedDiscount.discountId );

					// SAFETY : Ensure item was in cart still
					if ( !isAlreadyMarked && !isInFlight ) {
						matchedDiscount.line_item = index + 1; // +1 as line_item starts @ 1 not 0 for API calls
						discountsToRemove.push( matchedDiscount );
					}
				}
			});

			// REMOVE CHECK : PROCESS REMOVALS : Pull any items that are unmet and alert user to their removal
			if ( discountsToRemove.length > 0 ) {

				// REMOVE : For each item, call shopify API and await confirmation, then inform user of removal
				Promise.all(
					discountsToRemove.map( discount => {

						// If we found it in the cart...
						if ( discount.line_item ) {
							return this.removeCartItem( discount.line_item, discount )
							.then( res => {
								
								// SUCCESS : Remove discount from "usedDiscounts" list state
								const removalIndex = usedDiscounts.findIndex( used => used.discountId === discount.discountId );
								const removed = usedDiscounts.splice( removalIndex, 1 ); // Remove 1 key from 'usedDiscounts' @ removalIndex

								// FLAG : Mark removed discounts to show user we pulled them from the cart
								if ( removed[0] && removed[0].imageUrl ) {
									removedDiscounts.push( removed[0] );
								}

								// CART PAGE : Extra clean up for if we're on the actual /cart page itself
								if ( window.location.pathname.indexOf( '/cart' ) !== -1 ) {
									$( '#cart-line-item-' + discount.line_item ).remove(); // Remove line item we purged
								}
							})
							.catch( err => {
								const theError = err ? err : 'Server failed to supply an error object from Shopify side.';
								console.log( `Error Removing Deal Item: ${JSON.stringify( theError )}` );
							});
						}
						
					})
				).then( res => {
					// NOTE : Each individual removal resolution call then pulls that ID from the usedDiscounts array above in the promise.all
					// REMOVE CHECK : UPDATE : Save our data in cookie and state
	    			$.cookie( 'BOL_used_discounts', JSON.stringify( usedDiscounts ), { 
	    				expires: this.config.cookieExpireInDays,
	    				path: '/'
	    			});
					this.setState({ 
						removedDiscounts,
						usedDiscounts
					});
				});
			}



			// USED SYNC : If user manually removed item, and now we are under the threshold, re-enable that discount and remove from used list.
			//			   If its in the discountsToRemove array we will take care of it after showing the user we did, so skip any on that list.
			usedDiscounts.forEach( ( item, index ) => {
				var removalInFlight = discountsToRemove.find( discountObj => discountObj.discountId === item.discountId );

				// If not slated to remove, check if cart total is back below threshold, as it means the user manually removed the item.
				// This way if they remove the item and go back below the threshold, we can re-offer them the item when they add stuff back in cart
				if ( !removalInFlight ) {
					if ( newCartTotal < item.minSpend ) {
						this.markDiscountUnused( item.discountId );
					}
				}
			});
		}

		catch (err) {
			const theError = err ? err : 'Error object was not captured, entered the catch for [onCartUpdate] in DiscountManager';
			console.log( `::: ERROR [ DiscountManager -- onCartUpdate() ] : Something went wrong!\n  MSG: ${JSON.stringify( theError )}` );
		}

		// TOTAL : Always update cart total
		this.setState({ cartTotal: newCartTotal });
	}

	rejectDiscount( discountIds ) {
		var { 
			discountsToApply,
			rejectedDiscounts 
		} = this.state;


		// ALREADY TRACKED : Mark if already tracked
		discountIds = discountIds.filter( discountId => {
			const isMarked = rejectedDiscounts.find( rejectId => rejectId === discountId );

			if ( !isMarked ) {
				return discountId;
			}
		});

		this.setState( state => {
			const updatedRejectList = rejectedDiscounts.concat( discountIds ); // ADD : Rejected ID to the list
			const updatedApplyList = discountsToApply.filter( discount => {    // REMOVE : Discount from queue of ones to apply
				const matchedDiscount = discountIds.find( discountId => discountId === discount.discountId )
				if ( !matchedDiscount ) {
					return discount;
				}
			}); 

			// SAVE : Save our data before updating the app, in case user leaves site
	    	$.cookie( 'BOL_rejected_discounts', JSON.stringify( updatedRejectList ), { 
	    		expires: this.config.cookieExpireInDays,
	    		path: '/'
	    	});
			return {
				discountsToApply: updatedApplyList,
				rejectedDiscounts: updatedRejectList
			}
		});
	}

	rejectOnGiftRemoval( event ) {
		if ( event && event.discountId ) {
			var discountId = event.discountId;

			// CONVERT : make into number if string
			if ( typeof discountId === 'string' ){
				try {
					discountId = JSON.parse( discountId );
				}
				catch( err ) {
					console.log( `ERROR : [ DiscountManager.js - rejectOnGiftRemoval ] : Unable to parse removed Discount ID of '${event.discountId}` );
				}
			}

			// REJECT : Add to reject list
			this.rejectDiscount([ discountId ]);

		} else {
			console.log( `ERROR : [ DiscountManager.js - rejectOnGiftRemoval ] : Discount ID was missing from data attributes from ajax-cart.js.liquid @ 'giftItemRemoved' event trigger.` );
		}
	}

	removeCartItem( line_item, discount ) {
		// PRE-FLIGHT : Remove current entry from discountsToRemove so subsequent cart changes don't re-fire this guy during flight
		var _this = this;

		// RETURN : Promisifed request handler
		return new Promise(function (resolve, reject) {

			// SUCCESS : Callback for success handling
			const onSuccess = ( cart ) => {
				_this.updateInFlightIds( discount.discountId, 'remove' );
				resolve( discount );
			};

			// FAILED : Callback for failure handling
			const onFailure = (XMLHttpRequest, textStatus) => {
				_this.updateInFlightIds( discount.discountId, 'remove' );
				reject( XMLHttpRequest, textStatus );
			};

			// REMOVE : Use API from ajax-cart.js.liquid to set item quantity to 0 for a removal
			if ( _this.inFlightIds.indexOf( discount.discountId ) === -1 ) {
				
				// IN FLIGHT : Add Discount ID to in-flight manifest
				_this.updateInFlightIds( discount.discountId, 'add' );
				
				// FIRE : Enact the removal!
				ShopifyAPI.changeItem(
					line_item, 	// LINE ITEM : Which cart item is being removed
					0,			// AMOUNT : Set quantity to 0 to remove an item
					onSuccess,	// SUCCESS : Callback Handler for Successful Updates
					onFailure	// FAILED : Callback handler for failed updates
				);
			} else {
				reject( '[ DiscountManager -- removeCartItem() ] : Request to remove Line Item #' + line_item + ' for Discount ID:' + discount.discountId + ' is already in flight...' );
			}
		});
	}

	updateInFlightIds( id, addOrRemove ) {
		// Have to call this from inside shopifyAPI removal call, so needed a helper function
		// instead of binding the list to a new var and modding that inside the remove call
		if ( addOrRemove === 'add' ) {
			this.inFlightIds.push( id );
		
		} else {
			this.inFlightIds = this.inFlightIds.filter( inFlightId => inFlightId !== id );
		}
	}



	render() {
		const { 
			cartTotal, 
			discountsToApply, 
			doNotShowAgain, 
			removedDiscounts
		} = this.state;

		return (
			<div id="react-discount-manager" data-component="DiscountManager">
				<DiscountModal 
					cartTotal={ cartTotal }
					confirmRemoval={ this.confirmRemoval }
					currencySymbol={ this.config.currencySymbol }
					discountsToApply={ discountsToApply }
					doNotShowAgain={ doNotShowAgain }
					enableDoNotShowAgain ={ this.enableDoNotShowAgain }
					markDiscountUsed={ this.markDiscountUsed }
					rejectDiscount={ this.rejectDiscount }
					removedDiscounts={ removedDiscounts } />
			</div>
		);
	}
}

module.exports = DiscountManager;