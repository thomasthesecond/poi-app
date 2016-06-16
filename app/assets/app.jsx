import { connect } from "react-redux";
import React from "react";
import { StyleRoot } from "radium";
import settings from "rizzo-next/sass/settings.json";
import * as actions from "./shared/actions/layoutMobile";
import DevTools from "./shared/containers/devTools";
// import Ad from "react-google-publisher-tag";

/**
 * Renders a list of pois
 */
export class AppComponent extends React.Component {
  constructor() {
    super();

    this.handleLayoutChange = this.handleLayoutChange.bind(this);
  }

  componentDidMount() {
    this.mql = window.matchMedia(`(max-width: ${settings.media.max["768"]})`);

    this.mql.addListener(this.handleLayoutChange);

    this.props.dispatch(actions.layoutMobile(this.mql.matches));
  }

  componentWillUnmount() {
    this.mql.removeListener(this.handleLayoutChange);
  }

  handleLayoutChange() {
    this.props.dispatch(actions.layoutMobile(this.mql.matches));
  }

  render() {
    const { userAgent } = this.props;
    const isDev = process.env.NODE_ENV === "development";

    return (
      <StyleRoot radiumConfig={{ userAgent }}>
        {this.props.children}
        {isDev && <DevTools />}
      </StyleRoot>
    );
  }
}

AppComponent.propTypes = {
  userAgent: React.PropTypes.string,

  children: React.PropTypes.object,

  dispatch: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  userAgent: state.userAgent,
});

export default connect(mapStateToProps)(AppComponent);
