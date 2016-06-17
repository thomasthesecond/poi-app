/* eslint-disable */
import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";
import { connect } from "react-redux";
// import PageHeader from "../pois/components/pageHeader";
// import ContentHeader from "../pois/components/contentHeader";
// import Amenities from "../pois/components/amenities";
import { StyleRoot } from "radium";
import nodeGeocoder from "node-geocoder";
import {
  Heading,
  Button,
  Icon,
} from "backpack-ui";
import $ from "jquery";
import { color } from "rizzo-next/sass/settings.json";

let InteractiveMap;

if (typeof window !== "undefined") {
  InteractiveMap = require("../shared/components/interactiveMap").default;
}

export class AddComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      category: "",
      name: "",
      tips: "",
      image: "",
      city: "",
      state: "",
    };

    this.photoOnChange = this.photoOnChange.bind(this);

    this.displayPosition = this.displayPosition.bind(this);
    this.displayError = this.displayError.bind(this);
    this.saveCategory = this.saveCategory.bind(this);
    this.saveInformation = this.saveInformation.bind(this);

    this.submitData = this.submitData.bind(this);

    this.saveValues = this.saveValues.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.previousStep = this.previousStep.bind(this);
  }

  componentDidMount() {
    if (navigator.geolocation) {
      const timeoutVal = 10 * 1000 * 1000;
      navigator.geolocation.getCurrentPosition(
        this.displayPosition,
        this.displayError,
        { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
      );
    } else {
      console.log("Geolocation is not supported by this browser");
    }

    this.setState({
      renderMap: true,
    });

    this.formData = new FormData();

    this.reader = new FileReader();

    $.ajax({
      url: "https://lp-pois.herokuapp.com/pois",
      dataType: "json",
      type: "GET",
      // contentType: "application/json",
      success: function(data) {
        // this.setState({data: data});
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  photoOnChange(e, id) {
    const file = e.currentTarget.files[0];
    const imageType = /image.*/;

    console.log(this.refs);

    if (file.type.match(imageType)) {
      const reader = new FileReader();

      reader.onload = (e) => {
        ReactDOM.findDOMNode(this.refs[`${id}-preview`]).innerHTML = "";

        let img = new Image();
        img.src = reader.result;

        ReactDOM.findDOMNode(this.refs[`${id}-preview`]).appendChild(img);
      }

      reader.readAsDataURL(file);
    }
  }

  displayPosition(position) {
    console.log("Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);

    this.setState({
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    });


    $.ajax({
      // url: `http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=2.2945%2C+48.8583&distance=200&outSR=&f=pjson&token=-p0YI0OQjug2yYiK6NCIyWM_5F8vi9MVmTdes4uzbpr295YWAEAGhBIKFe8bWUhoVCgodJ4T_ZNgZlzYnCEYuUHQXqXgP2RNCRV60tfG2XlAB-s7xabTMatDQkfO9bc0eof_vnWw9Sywmea_zkHYlw..`,
      url: `http://api.opencagedata.com/geocode/v1/json?q=${this.state.lat}+${this.state.lon}&key=07539c40155bba562c6866a0d10e017f`,
      dataType: "json",
      type: "GET",
      // contentType: "application/json",
      success: function(data) {
        // this.setState({data: data});
        console.log(data.results[0]);
        this.setState({
          address: data.results[0].formatted,
          city: data.results[0].components.city,
          state: data.results[0].components.state,
        });
      }.bind(this),
      error: function(xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  displayError(error) {
    var errors = {
      1: 'Permission denied',
      2: 'Position unavailable',
      3: 'Request timeout'
    };
    console.log("Error: " + errors[error.code]);
  }

  saveCategory(e) {
    e.preventDefault();

    this.setState({
      category: e.currentTarget.value,
    });

    this.nextStep();
  }

  saveInformation(e) {
    e.preventDefault();

    this.setState({
      name: ReactDOM.findDOMNode(this.refs.name).value,
      address: ReactDOM.findDOMNode(this.refs.address).value,
      tips: ReactDOM.findDOMNode(this.refs.tips).value,
    });

    // this.formData.append("image[image]", this.state.image, this.state.image.name);
    // console.log(this.formData.getAll("image[image]"));
    // formData.append("image[image]", files[0], files[0].name)

    this.nextStep();
  }

  saveValues(fields) {
    return function() {
      // Remember, `fieldValues` is set at the top of this file, we are simply appending
      // to and overriding keys in `fieldValues` with the `fields` with Object.assign
      // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
      this.fieldValues = Object.assign({}, this.fieldValues, fields);
      console.log(this.fieldValues);
    }();
  }

  nextStep() {
    this.setState({
      step: this.state.step + 1,
    });

    console.log(this.state);
  }

  previousStep() {
    console.log("prev");
    this.setState({
      step : this.state.step - 1,
    });
  }

  submitData(e, poi) {
    e.preventDefault();
    console.log(poi);

    $.ajax({
      url: "https://lp-pois.herokuapp.com/pois",
      dataType: "json",
      type: "POST",
      // contentType: "application/json",
      // processData: false,
      // contentType: false,
      data: poi,
      success: function(data) {
        // this.setState({data: data});
        console.log(data);

        $.ajax({
          url: "https://lp-pois.herokuapp.com/tips",
          dataType: "json",
          type: "POST",
          // contentType: "application/json",
          data: {
            "tip[text]": this.state.tips,
            "tip[poi_id]": data.id,
          },
          success: function(data) {
            // this.setState({data: data});
            console.log(data);
            window.location.href = "/";
          }.bind(this),
          error: function(xhr, status, err) {
            // console.error(this.props.url, status, err.toString());
          }.bind(this)
        });

        // this.formData.append("image[poi_id]", data.id);
        // this.formData.append("image[image]", this.state.image, this.state.image.name);
        //
        // $.ajax({
        //   url: "https://lp-pois.herokuapp.com/images",
        //   dataType: "json",
        //   type: "POST",
        //   // contentType: "application/json",
        //   processData: false,
        //   contentType: false,
        //   // contentType: "multipart/form-data",
        //   data: this.formData,
        //   success: function(data) {
        //     // this.setState({data: data});
        //     console.log(data);
        //   }.bind(this),
        //   error: function(xhr, status, err) {
        //     // console.error(this.props.url, status, err.toString());
        //   }.bind(this)
        // });

      }.bind(this),
      error: function(xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  render() {
    this.markerMap = {
      "Hotel": "sleep",
      "Drinking / Nightlife": "drink",
      "Entertainment": "play",
      "Shopping": "shop",
      "Restaurant": "eat",
      "Sight": "see",
    };

    const options = {
      provider: "opencage",

      // Optionnal depending of the providers
      httpAdapter: "https", // Default
      // httpAdapter,
      apiKey: "07539c40155bba562c6866a0d10e017f", // for Mapquest, OpenCage, Google Premier
      formatter: null,         // 'gpx', 'string', ...
    };

    const geocoder = nodeGeocoder(options);

    // geocoder.reverse({ lat: this.state.lat, lon: this.state.lon }).then((res) => {
    //   console.log(res);
    // }).catch((err) => {
    //   console.log(err);
    // });

    return (
      <div className="PageContainer AddComponent">
        <div style={{ textAlign: "center" }}>
          {this.state.step === 1 &&
            <div style={{
              borderBottom: "1px solid #e9edf0",
              padding: "22px 0 20px",
              position: "relative",
            }}>
              <Link
                to="/"
                key="1"
                className=""
                activeClassName=""
              >
                <svg viewBox="0 0 32 32" style={{
                  width: "20px",
                  height: "20px",
                  position: "absolute",
                  left: "20px",
                  top: "18px",
                }}>
                  <path class="path1" d="M32 1.9l-1.9-1.9-14.1 14.1-14.1-14.1-1.9 1.9 14.1 14.1-14.1 14.1 1.9 1.9 14.1-14.1 14.1 14.1 1.9-1.9-14.1-14.1z"></path>
                </svg>
              </Link>

              <Heading size="small" weight="thick">What kind of place is this?</Heading>
            </div>
          }

          {this.state.step === 1 &&
            <div id="step-1">
              <button style={{
                backgroundColor: "#fff",
                borderBottom: "1px solid #e9edf0"
              }} onClick={ this.saveCategory } ref="seeButton" value="Sight">
                <img src="http://cl.ly/2t1u3s2P3R14/sights.png" alt="See" />
              </button>

              <button style={{
                backgroundColor: "#fff",
                borderBottom: "1px solid #e9edf0",
                borderLeft: "1px solid #e9edf0"
              }} onClick={ this.saveCategory } ref="eatButton" value="Restaurant">
                <img src="http://cl.ly/061D2s1R020Q/food.png" alt="Eat" />
              </button>

              <button style={{
                backgroundColor: "#fff",
                borderBottom: "1px solid #e9edf0"
              }} onClick={ this.saveCategory } ref="sleepButton" value="Hotel">
                <img src="http://cl.ly/2B2L1M26050d/lodging.png" alt="Sleep" />
              </button>

              <button style={{
                backgroundColor: "#fff",
                borderBottom: "1px solid #e9edf0",
                borderLeft: "1px solid #e9edf0"
              }} onClick={ this.saveCategory } ref="shopButton" value="Shopping">
                <img src="http://cl.ly/0I0x3z291D0a/shops.png" alt="Shop" />
              </button>

              <button style={{
                backgroundColor: "#fff",
              }} onClick={ this.saveCategory } ref="drinkButton" value="Drinking / Nightlife">
                <img src="http://cl.ly/1I3W2e2u0q22/drinks.png" alt="Drink" />
              </button>

              <button style={{
                backgroundColor: "#fff",
                borderLeft: "1px solid #e9edf0"
              }} onClick={ this.saveCategory } ref="playButton" value="Entertainment">
                <img src="http://cl.ly/3U0L2D1f2n3s/entertainment.png" alt="Play" />
              </button>
            </div>
          }

          {this.state.step === 2 &&
            <div>
              <br /><br />
              <div style={{
                color: "hsla(215,5%,56%,.5)",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: ".2px",
                lineHeight: 1.3,
                textTransform: "uppercase",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {this.state.city} {this.state.category}
              </div>
              <br />
              <input type="text" placeholder="Place name" ref="name"
                defaultValue={this.state.name}
                required
                style={{
                  fontSize: "40px",
                  textAlign: "center",
                  fontWeight: 600,
                  border: 0,
                  padding: "0 20px",
                  margin: "0 auto",
                  display: "block",
                  outline: "none",
                  width: "100%",
                  appearance: "none",
                }} />
              <br />
              {this.state.renderMap &&
                <InteractiveMap
                  center={[this.state.lat, this.state.lon]}
                  height={250}
                  marker={this.markerMap[this.state.category]}
                  zoom={15}
                  markerSize={[50, 50]}
                  hideZoomControls
                />
              }
              <br />
              <textarea type="text" placeholder="Address" ref="address"
                defaultValue={this.state.address} required
                style={{
                  fontSize: "16px",
                  textAlign: "center",
                  border: 0,
                  padding: "0 20px",
                  margin: "0 auto",
                  display: "block",
                  outline: "none",
                  width: "100%",
                  resize: "none",
                  appearance: "none",
                }}></textarea>
              <br />

              <div style={{
                color: "#b2c3cd",
                fontSize: "14px",
                textTransform: "uppercase",
                fontWeight: 600,
                borderTop: "1px solid #ebecee",
                paddingTop: "40px",
              }}>Photos</div><br />

              <div>
                <div style={{
                  display: "inline-block",
                  width: "calc(100vw / 3 - 30px)",
                  border: "2px dashed #d8d8d8",
                  height: "calc(100vw / 3 - 30px)",
                  color: "#d8d8d8",
                  fontSize: "60px",
                  fontWeight: 600,
                  paddingTop: "5px",
                  margin: "0 20px",
                  position: "relative",
                }}>+<input ref="photo-1-input" type="file" accept="image/*;capture=camera"
                onChange={(e) => {
                  this.photoOnChange(e, "photo-1");
                }}
                style={{
                  width: "100%",
                  display: "block",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  opacity: 0,
                  zIndex: 2,
                }} /><div className="PhotoPreview" ref="photo-1-preview" style={{
                  width: "100%",
                  display: "block",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}></div></div>

                <div style={{
                  display: "inline-block",
                  width: "calc(100vw / 3 - 30px)",
                  border: "2px dashed #d8d8d8",
                  height: "calc(100vw / 3 - 30px)",
                  color: "#d8d8d8",
                  fontSize: "60px",
                  fontWeight: 600,
                  paddingTop: "5px",
                  position: "relative",
                }}>+<input ref="photo-2-input" type="file" accept="image/*;capture=camera"
                onChange={(e) => {
                  this.photoOnChange(e, "photo-2");
                }}
                style={{
                  width: "100%",
                  display: "block",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  opacity: 0,
                  zIndex: 2,
                }} /><div className="PhotoPreview" ref="photo-2-preview" style={{
                  width: "100%",
                  display: "block",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}></div></div>

                <div style={{
                  display: "inline-block",
                  width: "calc(100vw / 3 - 30px)",
                  border: "2px dashed #d8d8d8",
                  height: "calc(100vw / 3 - 30px)",
                  color: "#d8d8d8",
                  fontSize: "60px",
                  fontWeight: 600,
                  paddingTop: "5px",
                  margin: "0 20px",
                  position: "relative",
                }}>+<input ref="photo-3-input" type="file" accept="image/*;capture=camera"
                onChange={(e) => {
                  this.photoOnChange(e, "photo-3");
                }}
                style={{
                  width: "100%",
                  display: "block",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  opacity: 0,
                  zIndex: 2,
                }} /><div className="PhotoPreview" ref="photo-3-preview" style={{
                  width: "100%",
                  display: "block",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}></div></div>
              </div>

              <br /><br />

              <div style={{
                color: "#b2c3cd",
                fontSize: "14px",
                textTransform: "uppercase",
                fontWeight: 600,
                borderTop: "1px solid #ebecee",
                paddingTop: "40px",
              }}>Travel Tips</div><br />

              <div style={{
                borderBottom: "1px solid #ebecee",
                // margin: "0 20px",
              }}>
                <input type="text" placeholder="Add a tip" ref="tips"
                  defaultValue={this.state.tips} style={{
                    display: "block",
                    width: "100%",
                    fontSize: "16px",
                    textAlign: "center",
                    padding: "0 20px",
                    border: 0,
                    outline: 0,
                    appearance: "none",
                  }} />
                  <br /><br />
              </div>
              <br />
              <br />
              <input hidden type="file" accept="image/*;capture=camera"
                onChange={(e) => {
                  e.preventDefault();
                  const files = e.currentTarget.files;
                  this.setState({
                    image: files[0],
                  });
                  // for (var i = 0; i < files.length; i++) {
                  //   var file = files[i];
                  //   // if (!file.type.match('image.*')) {
                  //   //   continue;
                  //   // }
                  //   formData.append('photos[]', file, file.name);
                  // }
                }}/>

              <div>
                <button className="button" type="button" onClick={ (e) => {
                  this.submitData(e, {
                    "poi[name]": ReactDOM.findDOMNode(this.refs.name).value,
                    "poi[address]": this.state.address,
                    "poi[category]": this.state.category,
                    "poi[latitude]": this.state.lat,
                    "poi[longitude]": this.state.lon,
                    "poi[city]": this.state.city,
                    "poi[state]": this.state.state,
                  });
                }} style={{ width: "160px" }}>Save</button>
              </div>

              <br />

              <div>
                <button style={{
                  border: `1px solid ${color.blue}`,
                  width: "160px",
                }} className="button button--inverse" type="button"
                onClick={ this.previousStep }>Cancel</button>
              </div>

              <br /><br />
            </div>
          }
        </div>
      </div>
    );
  }
}

AddComponent.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //
});

export default connect(mapStateToProps)(AddComponent);
