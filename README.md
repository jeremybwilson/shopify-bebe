# SHOPIFY-SEED
Boilerplate project to spin up new Shopify stores from. Once a store is launched, merge back any new features that can be added as new modules (things like "Compare Tool" or standalone features work best). 
<br>


# Connected Apps:
```
    - Product Filter and Search  (REQUIRED -- So collections have multi-select filtering)
    - Zaius  (OPTIONAL -- Setup to work with it though)
```
<br>


# Included Features:
```
    - Slate v0.14 Friendly
    - Hero Slideshows
    - Nested Meganavs
    - Promo Banner Headers
    - Tag-Based Collection Filtering (Multi-select friendly)
    - ES6 Compiling
    - Circle CI Setup (just tweak for your destination)
    - SCSS
    - React Components 
    - Require Statement Friendly
    - Auto-Upload to Shopify "Files" directory from "Upload" folder with Circle CI (Coming Soon)
```
<br>

# Where's The On Switch?
For the initial setup, you'll need Node.js and the "Old" Slate Tool v0.14 (Not 1.x) installed globally. Then you'llIf you are unsure about having these, the commands below will help you check and install all missing utils.
<br>

## INSTALL: 
```
1. Ensure Slate (v0.14~) & NPM (Node.js) are installed by checking their versions: ***
	> npm -v && slate -v  


2. Missing NPM (Node.js)? 
	> Download and Install : https://nodejs.org/en/download


3. Missing Slate? 
	> npm i -g @shopify/slate (in terminal window)


4. READY TO BOOTSTRAP PROJECT! (Installs modules + bootstraps the slate build tool for ES6 compiling)
	> npm run bootstrap
```
 
 
(ﾉ´･ω･)ﾉ ﾐ ┸━┸   _GREAT! Now that the modules are out of the way, lets connect your local to a theme._
<br>
<br>
<br>

## CONFIG: 
Next, you'll need to make a config.yml file in the project root so the slate tool knows where to push your changes for testing. This sample file will walk you though filling in it's data. 

  1. _Copy the sample contents below into a new, empty file_
  2. _Follow steps in file to fill data_
  3. _Save it as "config.yml" in project root_

```
# This file contains the information needed for Shopify to authenticate
# requests and edit/update your remote theme files.
#
# SETUP:
# --------------------
# 1. From Shopify Admin select 'Apps'.
#
# 2. At the bottom, click "Manage Private Apps". 
#
# 3. Create a new token called "BOL-Dev-YOUR FIRST NAME"
#
# 4. Required Permissions:
#       - Store content ------------ READ AND WRITE  (read_content, write_content)
#       - Script Tags -------------- READ AND WRITE  (read_script_tags, write_script_tags)
#       - Theme Templates + Assets - READ AND WRITE  (read_themes, write_themes)
#
# 5. Save the token and replace "PASSWORD_HERE" below with your API Password (NOT THE KEY ಠ_ಠ)
#
# 6. Go to Shopify Admin > Online Store > Themes
#
# 7. Duplicate theme and then rename it to "Dev-YOUR FIRST NAME" (Ex: "Dev-Greg")
#
# 8. Select Actions > Edit Code and copy the ID in the URL of that page (best way to get the theme ID)
#
# 9. Copy your theme ID to the "THEME_ID_HERE" field below
#
# 10. Copy your store name to the STORE_NAME field below (Ex: "muckboot-dev.myshopify.com" )
#
#
# DOCUMENTATION:
# --------------------
#   Config Variables | http://shopify.github.io/themekit/configuration
#   Ignore Patterns  | http://shopify.github.io/themekit/ignores



development:
  password: PASSWORD_HERE
  theme_id: "THEME_ID_HERE" #Quotes needed here only
  store: STORE_NAME.myshopify.com
  ignore_files:
    - settings_data.presets-portion.bak.json

```
 
 
( ´ ▽ ` )b   _WHEW! You should be all set to start up the theme now and begin development!_
<br>
<br>
<br>


## START :
_Use terminal to begin watching for file changes_

```
STARTING FRESH:
  > npm run start   ( runs 'slate deploy && slate watch' )

        or 

RESTARTING WATCH:
  > npm run watch   ( runs 'slate watch' - use if no changes made since last 'run start' command closed )
```
 
<br>
 
 
## COMMANDS: 
_Available terminal commands_

```
USAGE :
  > npm run ___________ (in a terminal window in projects' root dir)


    "bootstrap":
    	1. Installs node modules (npm i)
    	2. Bootstraps slate tool to handle ES6 / React with our custom Shim

    "build": 
    	1. Complies theme files by running "slate build" under the hood

    "deploy":
    	1. Compiles theme files
    	2. Deploys theme to Theme ID Configured in the Config.yml file in the project root.

    "start": 
    	1. Compiles theme file
    	2. Deploys theme to Configured Theme ID
    	3. Begins slate watch task and spawns fresh browser window to test changes with.

    "watch": 
    	1. Begins watch task without triggering a fresh compile of the theme files
    	2. Any new changes will trigger the necessary theme files to re-compile and 
         deploy to the configured theme ID 

```
 
 
<br>
 

## ABOUT ES6 + REACT: 
_This theme compiles ES6 + Require Statements for anything in the "scripts" directory_
 

```
 /* REACT - FOREWORD
 *
 *   You probably notice that "React" and "ReactDOM" are not imported in the 
 *   top of this theme file. They are included as libraries globally in our
 *   <HEAD> tag of "theme.liquid" so we don't need to continually write
 *   the "var React = require('react')" statements into every component!
 * 
 *   The goal is to make each component self contained, and embedded into its
 *   respective template or section by invoking them directly on that 
 *   section's JS Portion of the Theme.SectionName blocks. (See "Product" for
 *   a example #2 that illustrates this.) Global components can be invoked in a
 *   ready block anywhere in theme otherwise.
 *
 *   Lastly, React Components in Shopify are meant to help, but not replace,
 *   common liquid and JS architecture in the theme. React will excel at 
 *   global components like "Compare Tool" and feel cumbersome on other things.
 *   State-heavy features are where you will find it most useful.
 *   
 *****************************************************************************/
 ```
 
<br>
<br>

 
### REACT EXAMPLE : Simple, globally visible component rendered in main layout
There are currently two react components in active use in this theme, you'll find them by searching _theme.js_ for _"SwatchParent"_ and _"BadgeParent"_. Use these live samples and the sample walkthrough below to gain a deeper understanding of react usage within the shopify theme architecture. 

#### SRC / SCRIPTS / THEME.JS:
```javascript
// FILE : /src/scripts/theme.js


  /* REACT - EXAMPLE #1 - Pull in the React Component Parent Script!
   *
   * GLOBAL-COMPONENT : 
   *     Simple React-Component Rendered into our "Theme.Liquid" template's
   *     DOM Node with ID "example-global-react"
   *
   * RELATED FILES :
   *    / scripts / react-components / ExampleParent.js <-- Parent Component, Renders example.js into DOM Node
   *    / scripts / react-components / Example.js <-------- React Component we want to show
   *    / layout / theme.liquid <-------------------------- Dom node to render into setup here
   *
   *  Here, we are requiring in the parent component for our "Example" feature.
   *  React components will always have a single root parent built via invoking
   *  ReactDOM.render() into a DOM Node. Open 'ExploreParent.js' to learn more. 
   *****************************************************************************/
  
  require('./react-components/example/ExampleParent.js');

```
<br>

#### SRC / LAYOUT / THEME.LIQUID
```liquid
// FILE : /src/layout/theme.liquid

    ... (content before this)
  {% endif %}



  {% comment %}
  REACT - EXAMPLE #1 - Component Root Element! 
    
    This <div> tag serves as the location that our react component will render into. 
    It can be passed liquid data by using simple liquid template standards to insert data into 
    a data-attribute on the DOM element. Here we stubbed some fake data, but you get the idea.
  {% endcomment %} 

  <div id="example-global-react" data-info-passed-to-react='{ "name": "greg" }'></div>
  

  ... etc (content after this)
```
<br>

#### SRC / SCRIPTS / EXAMPLE / EXAMPLEPARENT.js
```javascript
// FILE : /src/scripts/example/ExampleParent.js

  /* REACT - EXAMPLE #1 - Parent React Component!
   *
   * GLOBAL-COMPONENT : 
   *     This parent component invokes the ReactDOM.render() method to render
   *     its children components.
   *
   *  Here, this parent component waits for the dom to be ready, and then if its 
   *  target elem is present on the page, will require in its react component 
   *  "Example.js" and renders it into the DOM Element.
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
```
<br>

#### SRC / SCRIPTS / EXAMPLE / EXAMPLE.JS
```javascript
// FILE : /src/scripts/example/Example.js


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

  module.exports = class ExampleReactComponent extends React.Component {
    render() {
      const data = JSON.parse(this.props.data);
      const {name} = data;
      
      return (
        <h2 id="example-react" className="example-react">
          { `COMPONENT : ${name}` }
        </h2>
      );
    }
  }

```

