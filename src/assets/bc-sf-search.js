// Override Settings
var bcSfSearchSettings = {
    search: {
        //suggestionMode: 'test',
        //suggestionPosition: 'left',
    }
};

// Customize style of Suggestion box
BCSfFilter.prototype.customizeSuggestion = function(suggestionElement, searchElement, searchBoxId) {
  	if (jQ(searchBoxId).closest('.searchbox').length > 0) {
      	this.setSuggestionWidth(searchBoxId, 300);
  	}
};