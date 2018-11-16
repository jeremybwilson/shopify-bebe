class BadgeItem extends React.Component {
	constructor( props ) {
		super(props);
		this.populateText = this.populateText.bind( this );
		this.findLongWord = this.findLongWord.bind( this );
	}

	// TEXT : Replace Spaces with <BR> so words flow as designed
	// 		  -- Why? Padding can't account for "Back in Stock" on 3 lines
	populateText(text) {
		text = text.replace( / /g, '<BR>' );
		return { __html: text };
	}

	// TEXT : Finds the longest word in the string for our sizing logic
	findLongWord(text) {
		let wordArr = text.split( ' ' );
		let longest = 0;
		wordArr.forEach( word => {
			if ( longest < word.length ) {
				longest = word.length;
			}
		});

		return longest;
	}

	render() {
		var { bg, color, shape, text } = this.props;
		const style = {};

		// CUSTOM COLORS : Product supplied custom color / bg tags, apply style
		if ( bg ) { style.background = bg }
		if ( color ) { style.color = color }

		// TEXT : Size text based on length
		const spaceLess = text.replace( / /g, '' ); // Don't count spaces for length since they become <BR> in populateText
		const textLength = spaceLess.length;
		const longWord = this.findLongWord( text );
		
		var textSize = 'tiny';
		switch( true ) {
			case textLength < 4: // 1-3
				textSize = 'large';
				break;

			case textLength < 6 && longWord < 6: // 4-6
				textSize = 'medium';
				break;

			case textLength < 11 && longWord < 7: // (A.) 7-10 Chars -- (B.) Longest less than 7 chars
				textSize = 'small';
				break;

			case textLength > 10 || longWord >= 7: // (A.) 11+ chars -- (B.) Longest word 7+ chars
				textSize = 'tiny';
				break;

			default: 
				textSize = 'tiny';
				break;
		}

		return (
			<div className={ "item-badge " + shape } style={ style }>
				<div class={ "item-badge-text " + textSize } dangerouslySetInnerHTML={ this.populateText(text) }></div>
			</div>
		)
	}
}

module.exports = BadgeItem;