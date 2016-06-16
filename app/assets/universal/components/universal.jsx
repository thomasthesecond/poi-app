import { connect } from "react-redux";
import React from "react";
import {
  Heading,
} from "backpack-ui";

/**
 * Renders a list of pois
 */
export class PlacesComponent extends React.Component {
  render() {
    return (
      <div className="PageContainer">
        <Heading>Hello World</Heading>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  //
});

export default connect(mapStateToProps)(PlacesComponent);
