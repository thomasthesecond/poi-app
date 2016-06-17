/* eslint-disable */
import React from "react";
import { Link } from "react-router";
import { StyleRoot } from "radium";
import {
  Heading,
  Button,
} from "backpack-ui";
import $ from "jquery";
import { color } from "rizzo-next/sass/settings.json";

class HomeComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    $.ajax({
      url: "https://lp-pois.herokuapp.com/pois?limit=100",
      dataType: "json",
      type: "GET",
      // contentType: "application/json",
      success: function(data) {
        this.setState({ data });
        // this.data = data;
        // console.log(this.data);
      }.bind(this),
      error: function(xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.items = nextState.data.map((item, index) => (
      <li key={index}>
        <div className="title">{item.name}</div>
        {item.city && item.state &&
          <div className="location">
            {item.city}, {item.state}
          </div>
        }
      </li>
    ));

    return true;
  }

  render() {
    // let items = null;
    //
    // setTimeout(() => {
    //   console.log(this.state.data);
    //   items = this.state.data.map((item, index) => (
    //     <li key={index}>
    //       {item.name}
    //     </li>
    //   ));
    // }, 2000);

    return (
      <StyleRoot>
        <div className="PageContainer HomeComponent">
          <div style={{
            textAlign: "center",
          }}>
            <br /><br />
            <Heading size="medium" weight="thick">
              My Places
            </Heading>

            <br />

            <button style={{
              border: `1px solid ${color.blue}`,
              marginRight: "20px",
              width: "120px",
            }} className="button button--inverse" type="button">Edit</button>

            <Link
              to="/add"
              key="1"
              className="Button"
              activeClassName=""
              style={{ width: "120px" }}
            >
              Add
            </Link>
          </div>

          <br /><br />

          <ul>
            {this.items}
          </ul>
        </div>
      </StyleRoot>
    );
  }
}

HomeComponent.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default HomeComponent;
