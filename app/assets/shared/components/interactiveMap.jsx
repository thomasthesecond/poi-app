import React from "react";
import radium, { Style } from "radium";
import leaflet from "leaflet";
import { browserHistory, Link } from "react-router";
import { color, components, timing, zIndex } from "rizzo-next/sass/settings.json";
import { rgb } from "../../universal/utils/color";
import Flyout from "./flyout";
import difference from "lodash/difference";

const svgIcons = {
  default: "<svg class='svg-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><path d='M16 0c-7.1 0-12.8 5.7-12.8 12.8 0 9.6 12.8 19.2 12.8 19.2s12.8-9.6 12.8-19.2c0-7.1-5.7-12.8-12.8-12.8zM16 19.2c-3.5 0-6.4-2.9-6.4-6.4s2.9-6.4 6.4-6.4 6.4 2.9 6.4 6.4-2.9 6.4-6.4 6.4z'></path></svg>",
  drink: "<svg class='svg-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><path d='M0 0l4.6 32h22.9l4.5-32h-32zM9.1 13.9l7.3-6.8 6.8 6.8h-14.1z'></path></svg>",
  eat: "<svg class='svg-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><path d='M13.2 9.3h-1.1v-9.3h-2.3v9.3h-1.2v-9.3h-2.2v13.8c0 2.1 1.5 3.9 3.4 4.4v13.8h2.3v-13.7c2-0.5 3.4-2.3 3.4-4.4v-13.9h-2.3v9.3z'></path><path d='M23 0h-2.7v32h2.3v-13.7h0.4c1.5 0 2.7-1.2 2.7-2.7v-12.9c-0.1-1.5-1.3-2.7-2.7-2.7z'></path></svg>",
  play: "<svg class='svg-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><path d='M31.8 11.4l-4.2-4.2c-0.1 0.2-0.2 0.3-0.3 0.5-0.8 0.8-2.1 0.8-2.9 0s-0.8-2.1 0-2.9c0.1-0.1 0.3-0.2 0.5-0.3l-4.2-4.2c-0.2-0.2-0.6-0.2-0.8 0l-19.7 19.5c-0.2 0.2-0.2 0.6 0 0.8l4.2 4.2c0.1-0.2 0.2-0.3 0.3-0.5 0.8-0.8 2.1-0.8 2.9 0s0.8 2.1 0 2.9c-0.1 0.1-0.3 0.2-0.5 0.3l4.2 4.2c0.2 0.2 0.6 0.2 0.8 0l19.6-19.6c0.4-0.1 0.4-0.5 0.1-0.7zM11.4 12.9l1.5-1.5 1.5 1.5-1.5 1.5-1.5-1.5zM14.5 16l1.5-1.5 1.5 1.5-1.5 1.6-1.5-1.6zM19.1 20.7l-1.5-1.5 1.5-1.5 1.5 1.5-1.5 1.5z'></path></svg>",
  see: "<svg class='svg-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><path d='M16 10.7c-2.9 0-5.3 2.4-5.3 5.3s2.4 5.3 5.3 5.3 5.3-2.4 5.3-5.3c0-2.9-2.4-5.3-5.3-5.3zM16 18.7c-1.5 0-2.7-1.2-2.7-2.7s1.2-2.7 2.7-2.7 2.7 1.2 2.7 2.7c0 1.5-1.2 2.7-2.7 2.7z'></path><path d='M16 5.3c-8.1 0-16 10.7-16 10.7s7.9 10.7 16 10.7 16-10.7 16-10.7-7.9-10.7-16-10.7zM16.2 24c-4.5 0-8.2-3.6-8.2-8s3.7-8 8.2-8 8.2 3.6 8.2 8-3.6 8-8.2 8z'></path></svg>",
  shop: "<svg class='svg-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><path d='M25.6 8h-3.2v-1.9c0-3.4-2.9-6.1-6.4-6.1s-6.4 2.7-6.4 6.1v1.9h-3.2c-0.9 0-1.6 0.7-1.6 1.6v20.8c0 0.9 0.7 1.6 1.6 1.6h19.2c0.9 0 1.6-0.7 1.6-1.6v-20.8c0-0.9-0.7-1.6-1.6-1.6zM19.2 8h-6.4v-1.3c0-1.7 1.4-3.1 3.2-3.1s3.2 1.4 3.2 3.1v1.3z'></path></svg>",
  sleep: "<svg class='svg-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><path d='M23.8 23.1c-8.2 0-14.9-6.7-14.9-14.9 0-3 0.9-5.8 2.4-8.2-6.5 2.1-11.3 8.3-11.3 15.6 0 9.1 7.3 16.4 16.4 16.4 7.3 0 13.5-4.8 15.6-11.4-2.3 1.6-5.1 2.5-8.2 2.5z'></path></svg>",
  transport: "<svg class='svg-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><path d='M26.1 0h-20.2c-1.9 0-3.4 1.5-3.4 3.4v20.2c0 1.9 1.5 3.4 3.4 3.4v0 3.4c0 0.9 0.8 1.7 1.7 1.7s1.7-0.8 1.7-1.7v-3.4h13.5v3.4c0 0.9 0.8 1.7 1.7 1.7s1.7-0.8 1.7-1.7v-3.4c1.9 0 3.4-1.5 3.4-3.4v-20.2c-0.1-1.9-1.6-3.4-3.5-3.4zM10.5 23.1c-0.3 0.3-0.8 0.5-1.2 0.5-0.5 0-0.9-0.2-1.2-0.5s-0.5-0.8-0.5-1.2 0.1-0.9 0.4-1.2 0.8-0.5 1.2-0.5c0.5 0 0.9 0.2 1.2 0.5s0.5 0.8 0.5 1.2-0.1 0.9-0.4 1.2zM24 23.1c-0.3 0.3-0.8 0.5-1.2 0.5-0.5 0-0.9-0.2-1.2-0.5s-0.5-0.8-0.5-1.2 0.2-0.9 0.5-1.2 0.8-0.5 1.2-0.5c0.5 0 0.9 0.2 1.2 0.5s0.5 0.8 0.5 1.2-0.2 0.9-0.5 1.2zM26.1 18.5h-20.2v-15.1h20.2v15.1z'></path></svg>",
};

function markerStylesMixin(markerColor, mode, state) {
  if (state === "active") {
    return {
      backgroundColor: color.white,
      border: `1px solid ${color.white}`,
      boxShadow: `0 0 5px rgba(${rgb(color.black)}, .25)`,
      color: markerColor,
      fontSize: "26px",
      paddingTop: "9px",
    };
  }

  return {
    // backgroundColor: markerColor,
    // border: `1px solid rgba(${rgb(color.black)}, .15)`,
    // boxShadow: `0 1px 5px rgba(${rgb(color.black)}, .25)`,
    // color: color.white,
    // fontSize: mode === "explore" ? "14px" : "12px",
    // lineHeight: 1,
    // paddingTop: mode === "explore" ? "4px" : "2px",

    backgroundColor: color.white,
    border: `1px solid ${color.white}`,
    boxShadow: `0 0 5px rgba(${rgb(color.black)}, .25)`,
    color: markerColor,
    fontSize: "26px",
    paddingTop: "12px",
  };
}

const _ = { difference };

const flyoutPopupStyles = Flyout.styles.type.mapPopup;

const styles = {
  container: {
    base: {},

    fill: {
      height: "100%",
      width: "100%",
    },
  },

  map: {
    base: {
      height: "100%",
      width: "100%",
    },
  },

  popupBanner: {
    container: {
      base: {
        backgroundColor: color.white,
        fontSize: "16px",
        height: "80px",
        left: 0,
        paddingTop: `${17 / 16}em`,
        position: "absolute",
        textAlign: "center",
        top: components.header.heightMobile,
        transition: `transform ${timing.fast}`,
        width: "100%",
        zIndex: zIndex.videoOverlayClose + 1,
      },

      hidden: {
        transform: "translateY(-80px)",
      },

      visible: {
        boxShadow: `40px 2px 20px rgba(${rgb(color.black)}, 0.1),
          -40px 2px 20px rgba(${rgb(color.black)}, 0.1)`, // TODO: get values from design file
        transform: "translateY(0)",
      },
    },

    anchor: {
      base: {
        display: "block",
      },
    },

    name: {
      base: {
        color: color.darkGray,
        fontSize: "1em",
        fontWeight: 600,
      },
    },

    subtype: {
      base: {
        color: "#c2ced4",
        fontSize: `${12 / 16}em`,
        fontWeight: 600,
        marginTop: `${4 / 16}em`,
        textTransform: "uppercase",
      },
    },
  },
};

const markerStyles = {};

const scopedStyles = {
  ".leaflet-popup-content-wrapper": flyoutPopupStyles.container,

  ".leaflet-popup-content": {
    margin: 0,
    lineHeight: "inherit",
  },

  ".leaflet-popup-tip": flyoutPopupStyles.arrow,

  ".leaflet-marker-icon": {
    borderRadius: "100%",
    textAlign: "center",
    transition: `backgroundColor ${timing.fast},
      color ${timing.fast},
      height ${timing.fast},
      transform ${timing.fast},
      margin ${timing.fast},
      padding ${timing.fast},
      width ${timing.fast}`,
  },

  ".leaflet-div-icon": {
    backgroundColor: color.white,
    border: `3px solid ${color.red}`,
  },

  ".leaflet-div-icon-center": {
    backgroundColor: color.blue,
  },
};

class InteractiveMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popupBanner: {
        isVisible: false,
        name: "",
        subtype: "",
      },
      clickedMarker: null,
      currentPoiType: null,
    };

    this.mapSettings = {
    };

    this.markerMapping = {
      sleeping: "sleep",
      drinking_nightlife: "drink",
      transport: "transport",
      activities: "see",
      tours: "see",
      entertainment: "play",
      shopping: "shop",
      eating: "eat",
      restaurants: "eat",
      sights: "see",
      info: "default",
      festivals_events: "play",
    };

    this.setMarkerIcon = this.setMarkerIcon.bind(this);
    this.defineCustomIcons = this.defineCustomIcons.bind(this);
    this.initializeMap = this.initializeMap.bind(this);
    this.initializeTileLayer = this.initializeTileLayer.bind(this);
    this.initializeCenterMarker = this.initializeCenterMarker.bind(this);
    this.initializeMarkers = this.initializeMarkers.bind(this);
    this.initializePopup = this.initializePopup.bind(this);
    this.initializeSpyMode = this.initializeSpyMode.bind(this);
    this.initializeHoverMode = this.initializeHoverMode.bind(this);
    this.initializeExploreMode = this.initializeExploreMode.bind(this);
  }

  componentWillMount() {
    this.mapSettings = {
      accessToken: "pk.eyJ1IjoibG9uZWx5cGxhbmV0IiwiYSI6ImNpajYyZW1iMjAwO" +
        "G51bWx2YW50ejNmN2IifQ.neyeEEzBkaNKcKUzCe3s2Q",
      attribution: "",
      iconSize: {
        default: [14, 14],
        center: [40, 40],
      },
      maxZoom: 18,
      popupOptions: {
        className: "InteractiveMap-popup",
        closeButton: false,
        maxWidth: 150,
      },
      projectId: "lonelyplanet.04cf7895",
      url: "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    };

    const markerColors = {
      eat: "#00ca8b", // green
      drink: "#88bde7", // blue
      play: "#ffc92a", // yellow
      see: "#f8324d", // red
      shop: "#ff6e8d", // pink
      sleep: "#9d69c9", // purple
      transport: "#b6c3ca", // slate
      default: "#a8a9ae", // gray
    };

    for (const type in markerColors) {
      if (markerColors.hasOwnProperty(type)) {
        Object.assign(markerStyles, {
          [`.leaflet-div-icon-${type}`]: markerStylesMixin(markerColors[type], this.props.mode),
          [`.leaflet-div-icon-${type}.is-active`]: markerStylesMixin(markerColors[type], this.props.mode, "active"),
        });
      }
    }
  }

  componentDidMount() {
    const {
      center,
      centerName,
      places,
      hideCenterPin,
      mapId,
      markerClick,
      markerMouseover,
      markerMouseout,
      zoom,
      hideZoomControls,
      marker,
    } = this.props;

    console.log(marker);

    this.defineCustomIcons();
    this.initializeMap(mapId, center, zoom, hideZoomControls);
    this.initializeTileLayer();

    if (!hideCenterPin && center && marker) {
      this.initializeCenterMarker(center, marker);
    }

    this.initializeMarkers(places, markerClick, markerMouseover, markerMouseout);
  }

  componentWillReceiveProps(nextProps) {
    const {
      mode,
      activePoi,
      markerSize,
      markerClick,
      markerMouseover,
      markerMouseout,
      places,
    } = this.props;

    if (nextProps.places.length > places.length) {
      const newPlaces = _.difference(nextProps.places, places);

      this.initializeMarkers(newPlaces, markerClick, markerMouseover, markerMouseout);
    }

    if (mode === "spy") {
      this.initializeSpyMode(activePoi, nextProps);
    }

    if (mode === "hover") {
      this.initializeHoverMode(nextProps);
    }

    if (mode === "explore") {
      this.initializeExploreMode(activePoi, markerSize, nextProps);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const markerShouldUpdate = nextState.clickedMarker &&
      this.state.currentPoiType &&
      this.state.clickedMarker !== nextState.clickedMarker;

    if (markerShouldUpdate) {
      this.setMarkerIcon();
    }
  }

  /**
   * Set the marker icon
   */
  setMarkerIcon(size = this.props.markerSize, active = false, closePopup = false) {
    const marker = this.state.clickedMarker.target;
    const icon = marker.options.icon;
    const type = this.markerMapping[this.state.currentPoiType];

    icon.options.iconSize = size;
    icon.options.className = active ?
      `leaflet-div-icon-${type} is-active` :
      `leaflet-div-icon-${type}`;

    marker.setIcon(icon);

    if (closePopup) {
      marker.closePopup();
    }
  }

  /**
   * Define custom icons for leaflet.marker
   */
  defineCustomIcons() {
    this.icons = {
      default: leaflet.divIcon({
        iconSize: this.mapSettings.iconSize.default,
      }),

      center: leaflet.divIcon({
        className: "leaflet-div-icon-center",
        iconSize: this.mapSettings.iconSize.center,
      }),

      eat: leaflet.divIcon({
        className: "leaflet-div-icon-eat",
        iconSize: this.props.markerSize,
        html: svgIcons.eat,
      }),

      drink: leaflet.divIcon({
        className: "leaflet-div-icon-drink",
        iconSize: this.props.markerSize,
        html: svgIcons.drink,
      }),

      play: leaflet.divIcon({
        className: "leaflet-div-icon-play",
        iconSize: this.props.markerSize,
        html: svgIcons.play,
      }),

      see: leaflet.divIcon({
        className: "leaflet-div-icon-see",
        iconSize: this.props.markerSize,
        html: svgIcons.see,
      }),

      shop: leaflet.divIcon({
        className: "leaflet-div-icon-shop",
        iconSize: this.props.markerSize,
        html: svgIcons.shop,
      }),

      sleep: leaflet.divIcon({
        className: "leaflet-div-icon-sleep",
        iconSize: this.props.markerSize,
        html: svgIcons.sleep,
      }),
    };
  }

  /**
   * Initialize leaflet.map
   * @see http://leafletjs.com/reference.html#map-class
   * @param  {string}  id               ID in the DOM on which to attach the map to
   * @param  {array}   center           Initial geographical center of the map
   * @param  {number}  zoom             Initial map zoom
   * @param  {boolean} hideZoomControls Whether the zoom control is added to the map by default
   * @return {object}                   Instantiates a map object given a div element (or its id)
   *                                    and optionally an object literal with map options
   */
  initializeMap(id, center, zoom, hideZoomControls) {
    this.leafletMap = leaflet.map(id, {
      scrollWheelZoom: false,
      zoomControl: !hideZoomControls,
    }).setView(center, zoom);
  }

  /**
   * Initialize leaflet.tileLayer
   * @see http://leafletjs.com/reference.html#tilelayer
   * @return {object} Instantiates a tile layer object given a URL template and optionally an
   *                  options object
   */
  initializeTileLayer() {
    leaflet.tileLayer(this.mapSettings.url, {
      accessToken: this.mapSettings.accessToken,
      attribution: this.mapSettings.attribution,
      id: this.mapSettings.projectId,
      maxZoom: this.mapSettings.maxZoom,
    }).addTo(this.leafletMap);
  }

  /**
   * Display a marker at the map's center; uses a large blue icon to denote
   * @see http://leafletjs.com/reference.html#marker
   * @return {object}
   */
  initializeCenterMarker(center, marker) {
    this.centerMarker = leaflet.marker(center, {
      opacity: 1,
      icon: this.icons[marker],
    }).addTo(this.leafletMap);
  }

  /**
   * Create the map's markers from an array of places
   * @see http://leafletjs.com/reference.html#marker
   * @return {object} Instantiates a marker object given a geographical point and optionally an
   *                  options object
   */
  initializeMarkers(places, onClick, onMouseover, onMouseout) {
    this.markers = places.filter(p => p.location).map((poi, i) =>
      leaflet.marker(poi.location.coordinates.slice(0).reverse(), {
        opacity: 1,
        icon: this.icons[this.markerMapping[poi.poiType.toLowerCase()]],
        id: `marker-${poi.id}${i}`,
      }).bindPopup(poi.name, this.mapSettings.popupOptions)
        .on("click", (marker) => {
          this.setState({
            clickedMarker: marker,
            currentPoiType: poi.poiType.toLowerCase(),
          });

          if (typeof onClick === "function") {
            onClick(poi);
          }
        })
        .on("mouseover", (marker) => {
          if (typeof onMouseover === "function") {
            onMouseover(marker, poi);
          }
        })
        .on("mouseout", (marker) => {
          if (typeof onMouseout === "function") {
            onMouseout(marker, poi);
          }
        })
        .addTo(this.leafletMap)
    );
  }

  /**
   * Create a map popup
   * @see http://leafletjs.com/reference.html#popup
   * @return {object} Instantiates a popup object given an optional options object that describes
   *                  its appearance, location and an optional source object that is used to tag the
   *                  popup with a reference to the ILayer to which it refers
   */
  initializePopup(latlng, content) {
    this.popup = leaflet.popup(this.mapSettings.popupOptions)
      .setLatLng(latlng)
      .setContent(content)
      .openOn(this.leafletMap);
  }

  /**
   * Update and display the marker's popup when the map is in "spy" mode
   * @param  {object} activePoi Data for the "current" POI
   * @param  {object} nextProps The new set of props recieved from componentWillReceiveProps
   */
  initializeSpyMode(activePoi, nextProps) {
    const shouldInitializePopup = activePoi.id !== nextProps.activePoi.id &&
      nextProps.activePoi.name &&
      nextProps.activePoi.coords.length;

    if (shouldInitializePopup) {
      this.initializePopup(nextProps.activePoi.coords, nextProps.activePoi.name);
    }
  }

  /**
   * Update and display the marker's popup when the map is in "hover" mode
   * @param  {object} nextProps The new set of props recieved from componentWillReceiveProps
   */
  initializeHoverMode(nextProps) {
    const shouldInitializePopup = nextProps.activePoi.id &&
      nextProps.activePoi.name &&
      nextProps.activePoi.coords.length;

    if (shouldInitializePopup) {
      this.initializePopup(nextProps.activePoi.coords, nextProps.activePoi.name);
    }

    if (!nextProps.activePoi.id) {
      this.leafletMap.closePopup();
    }
  }

  /**
   * Update and display the marker's popup as a banner at the top of the map
   * when the map is in "explore" mode for mobile
   * @param  {object} activePoi  Data for the "current" POI
   * @param  {array}  markerSize Width and height of the marker icon
   * @param  {object} nextProps  The new set of props recieved from componentWillReceiveProps
   */
  initializeExploreMode(activePoi, markerSize, nextProps) {
    const shouldInitializePopup = nextProps.activePoi.id &&
      nextProps.activePoi.name &&
      nextProps.activePoi.coords.length;

    /**
     * Change the clicked marker's size and update the state to show the popup
     * banner
     */
    if (shouldInitializePopup) {
      this.setMarkerIcon([50, 50], true, true);

      this.setState({
        popupBanner: {
          isVisible: true,
          name: nextProps.activePoi.name,
          subtype: nextProps.activePoi.subtype,
        },
      });
    }

    /**
     * Reset the state and clicked marker's size when the map is clicked on,
     * i.e. when a marker is clicked off of
     */
    this.leafletMap.on("click", () => {
      if (this.state.popupBanner.isVisible) {
        this.setMarkerIcon();

        this.setState({
          popupBanner: {
            isVisible: !this.state.popupBanner.isVisible,
            name: "",
            subtype: "",
          },
          clickedMarker: null,
          currentPoiType: null,
        });
      }
    });

    /**
     * If the marker is already open, go to the POI on second click/tap; this
     * mimics the functionality in Guides app
     */
    if (activePoi.id === nextProps.activePoi.id && this.state.popupBanner.isVisible) {
      browserHistory.push(`/pois/${activePoi.id}`);
    }
  }

  render() {
    const {
      fill,
      height,
      mapId,
      mode,
      activePoi,
    } = this.props;

    return (
      <div
        className="InteractiveMap-container"
        style={[
          styles.container.base,
          fill && styles.container.fill,
          height && { height: `${height}px` },
        ]}
      >
        <Style
          scopeSelector=".InteractiveMap-container"
          rules={Object.assign({}, scopedStyles, markerStyles)}
        />

        {mode === "explore" &&
          <div
            className="InteractiveMap-popupBanner"
            style={[
              styles.popupBanner.container.base,
              !this.state.popupBanner.isVisible &&
                styles.popupBanner.container.hidden,
              this.state.popupBanner.isVisible && this.state.popupBanner.name &&
                styles.popupBanner.container.visible,
            ]}
          >
            <Link to={`/pois/${activePoi.id}`} style={styles.popupBanner.anchor.base}>
              <div
                className="InteractiveMap-popupBanner-name"
                style={styles.popupBanner.name.base}
              >
                {this.state.popupBanner.name}
              </div>

              <div
                className="InteractiveMap-popupBanner-subtype"
                style={styles.popupBanner.subtype.base}
              >
                {this.state.popupBanner.subtype}
              </div>
            </Link>
          </div>
        }

        <div
          className="InteractiveMap"
          id={mapId}
          style={styles.map.base}
        />
      </div>
    );
  }
}

InteractiveMap.propTypes = {
  /**
   * Lat and long coordinates for the initial geographical center of the map
   */
  center: React.PropTypes.array.isRequired,

  /**
   * An array of places to plot on the map as markers
   */
  places: React.PropTypes.array,

  /**
   * Name of the POI at the center of the map
   */
  centerName: React.PropTypes.string,

  /**
   * Allow the map to fill its parent's dimentions
   */
  fill: React.PropTypes.bool,

  /**
   * Should the pin/marker for the centerpoint be hidden
   */
  hideCenterPin: React.PropTypes.bool,

  /**
   * Data for the current POI; expects:
   *
   * coords  Array  Lat and long coodinates of the marker that is currently active
   * name    String Name of the marker that is currently active
   * id      Number ID of POI that's selected
   * type    String Main type of the POI
   * subtype String Subtype classification of the POI
   */
  activePoi: React.PropTypes.object,

  /**
   * A height (in pixels) to constrain the map to
   */
  height: React.PropTypes.number,

  /**
   * ID to initialize the map
   */
  mapId: React.PropTypes.string,

  /**
   * Tell the map how it should behave when controlled by an outside component
   *
   * - hover: a list item is hovered and the corresponding marker popup's visibility is toggled
   * - spy: scroll a page of list items and as an item hits the top of the window, toggle the
   * 				corresponding marker popup's visibility
   * - explore: full-screen experience for mobile devices
   */
  mode: React.PropTypes.oneOf([
    "",
    "hover",
    "spy",
    "explore",
  ]),

  /**
   * Method to run when the marker receives the click event
   */
  markerClick: React.PropTypes.func,

  /**
   * Method to run when the marker receives the mouseover event
   */
  markerMouseover: React.PropTypes.func,

  /**
   * Method to run when the marker receives the mouseout event
   */
  markerMouseout: React.PropTypes.func,

  /**
   * Width and height for map's marker size
   */
  markerSize: React.PropTypes.array,

  /**
   * Initial zoom level for the map
   */
  zoom: React.PropTypes.number,

  /**
   * Whether or not to hide the map's zoom controls
   */
  hideZoomControls: React.PropTypes.bool,
};

InteractiveMap.defaultProps = {
  center: [],

  centerName: "",

  places: [],

  fill: false,

  hideCenterPin: false,

  activePoi: {},

  height: null,

  mapId: "leaflet-map-container",

  mode: "",

  markerClick: null,

  markerMouseover: null,

  markerMouseout: null,

  markerSize: [14, 14],

  zoom: 14,

  hideZoomControls: false,
};

InteractiveMap.styles = styles;

export default radium(InteractiveMap);
