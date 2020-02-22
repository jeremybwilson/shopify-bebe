/* REACT - EXAMPLE #1
 *
 * GLOBAL-COMPONENT : 
 *     Simple React-Component Rendered into our "Theme.Liquid" template's
 *     DOM Node with ID "example-global-react"
 *
 *  This component waits for the dom to be ready, and then if its target elem
 *  is present on the page, will require in its react component "Example.js" 
 *  and render it into the element.
 *****************************************************************************/

/* 
1. Wait for DOM Ready:
    Its good practice to wrap parent components (not just react ones) in ready, 
    but its also not always necessary (on PDP pages perhaps for example), or 
    when importing parent components into a block already wrapped in ready().
*/
$(document).ready(function(){ 

  // 2. Find our Global Div Element
  const rootEl = document.getElementById('example-global-react');

  // 3. Ensure element is present and has some prop data for us to ingest
  if ( rootEl && rootEl.dataset.infoPassedToReact ) {
    
    // 4. Import our Root-level React component
    var ExampleReactComponent = require('./Example.js');

    // 5. Use ReactDOM to render react components into a DOM Node
    ReactDOM.render(
      <ExampleReactComponent data={ rootEl.dataset.infoPassedToReact } />,
      rootEl
    );
  }
});