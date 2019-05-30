/* REACT COMPONENT : DISCOUNT METER
 *  A visual meter wrapper and mount point 
 *
 * ..:: SAMPLES - DISCOUNT CONFIG ::..
 *
 *  #1 - Spend X, Get Y Style
 *    thresholdDiscount: [{
 *      giftId: 17667671031906,     // VARIANT ID --- Item being given for free, see docs for formatting rules
 *      inventoryId: 17275313422434,  // INVENTORY ID - Variant ID of full-price orig. item (gift untracked, uses full-cost variant to validate inventory - use gift id if only instance and is tracked)
 *      minSpend: 200         // THRESHOLD ---- Dollar (or current currency) amount to trigger free gift
 *    }]
 *
 *****************************************************************************/ 














const meterRoot = document.getElementById( 'react-discount-meter' );

class DiscountMeter extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    meterRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    meterRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    );
  }
}