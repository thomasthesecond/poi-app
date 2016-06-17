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

export class PoiComponent extends React.Component {
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
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextState);
    // this.items = nextState.data.map((item, index) => (
    //   <li key={index}>
    //     <Link
    //       to={`/poi/${item.id}`}
    //       key={index}
    //     >
    //       <div className="title">{item.name}</div>
    //       {item.city && item.state &&
    //         <div className="location">
    //           {item.city}, {item.state}
    //         </div>
    //       }
    //     </Link>
    //   </li>
    // ));

    return true;
  }

  // componentWillMount() {
  //   this.poiId = window.location.pathname.split("/")[2];
  //
  //   $.ajax({
  //     url: `https://lp-pois.herokuapp.com/pois/${this.poiId}`,
  //     dataType: "json",
  //     type: "GET",
  //     // contentType: "application/json",
  //     success: function(data) {
  //       this.setState({
  //         name: data.name,
  //         address: data.address,
  //         category: data.category,
  //         tips: data.tips,
  //         coordinates: data.coordinates,
  //         city: data.city,
  //       });
  //       console.log(this.state);
  //     }.bind(this),
  //     error: function(xhr, status, err) {
  //       // console.error(this.props.url, status, err.toString());
  //     }.bind(this)
  //   });
  // }

  componentDidMount() {
    this.setState({
      renderMap: true,
    });

    this.formData = new FormData();

    this.reader = new FileReader();

    this.poiId = window.location.pathname.split("/")[2];

    $.ajax({
      url: `https://lp-pois.herokuapp.com/pois/${this.poiId}`,
      dataType: "json",
      type: "GET",
      // contentType: "application/json",
      success: function(data) {
        this.setState({
          name: data.name,
          address: data.address,
          category: data.category,
          tips: data.tips,
          coordinates: data.coordinates,
          city: data.city,
        });
        console.log(this.state);
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

  render() {
    this.markerMap = {
      "Hotel": "sleep",
      "Drinking / Nightlife": "drink",
      "Entertainment": "play",
      "Shopping": "shop",
      "Restaurant": "eat",
      "Sight": "see",
    };

    return (
      <div className="PageContainer PoiComponent">
        <div style={{ textAlign: "center" }}>
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
              value={this.state.name}
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
                center={[this.state.coordinates.latitude, this.state.coordinates.longitude]}
                height={250}
                marker={this.markerMap[this.state.category]}
                zoom={15}
                markerSize={[50, 50]}
                hideZoomControls
              />
            }
            <br />
            <textarea type="text" placeholder="Address" ref="address"
              value={this.state.address} required
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
              <button className="button" type="button" style={{ width: "160px" }}>Save</button>
            </div>

            <br />

            <div>
              <a style={{
                border: `1px solid ${color.blue}`,
                width: "160px",
              }} className="button button--inverse" type="button" href="/">Cancel</a>
            </div>

            <br /><br />
          </div>
        </div>
      </div>
    );
  }
}

PoiComponent.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //
});

export default connect(mapStateToProps)(PoiComponent);
