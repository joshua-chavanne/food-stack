# Food Stack
___
## San Francisco Food Truck Search Service

A simple search by location and range (in miles) for food trucks in San Francisco using data.sfgov.org,
focused on making a small front-end view.

Can be viewed live at: [http://laudable.info](http://laudable.info)
Primary repo at: [https://github.com/joshua-chavanne/food-stack](https://github.com/joshua-chavanne/food-stack)

Requirements:
 * [JQuery (tested with JQuery 3.1.0)](https://jquery.com/download/)
 * [Underscore (underscore 1.8.3)](http://underscorejs.org/)
 * [Backbone (Backbone 1.3.3)](http://backbonejs.org/)
 * [LeafletJS (Leaflet ^0.7.7)](http://leafletjs.com/)

Additional Requirements:
 * [Mapbox Access Token](https://www.mapbox.com/studio/account/tokens/) - Requires free sign-up

Optional Requirements (for quick install):
 * [Node.js](https://nodejs.org)
 * [npm](https://npmjs.com)

Services Used:
 * [Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding/intro)
 * [Mapbox](https://www.mapbox.com/)

## Installation:

### Quick install (requires Node):

#### Step One
```
git clone https://github.com/joshua-chavanne/food-stack food-stack
cd food-stack
npm install
```
#### Step Two
Copy example-config.js to config.js.
Get a Mapbox Access Token.
Configure Mapbox user ID and Access Token in config.js

```
var AppConfig = AppConfig || {};

AppConfig.data  = {
  mapboxId: '<user ID>',
  accessToken: '<access token'
}
```

Visit index.html in your browser, or configure your server to serve it.

### Slower install (requires path changes)
#### Step One
 * Download repo by clicking "Clone or download"
#### Step Two
 * Download required libraries and link in src tags
#### Step Three
* Follow Step Two from Quick install.

### Todos:
(Things I'd do had I spent more time on this)
 * Parse the non-normalized days, and allow sort by days open.
 * Use better practices for library loading and passing of data to AppObj

Attributions:
 - [Distance Formula - Geodatasource.com (LGPLv3)](http://www.geodatasource.com/developers/javascript)
