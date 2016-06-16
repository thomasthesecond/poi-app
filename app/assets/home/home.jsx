import React from "react";
// import PageHeader from "../pois/components/pageHeader";
// import ContentHeader from "../pois/components/contentHeader";
// import Amenities from "../pois/components/amenities";
import { StyleRoot } from "radium";

function HomeComponent() {
  return (
    <StyleRoot>
      <div className="PageContainer HomeComponent">
        OH HAI
      </div>
    </StyleRoot>
  );
}

HomeComponent.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default HomeComponent;
