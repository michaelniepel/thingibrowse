import React from 'react';
import { fetchDirs } from '../actions';
import { connect } from 'react-redux';

import { ModelViewer } from './ModelViewer';

class Browser extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(fetchDirs());
  }

  render() {
    return (
      <div>
        Show dirs
      </div>
    );
  }
}

Browser.propTypes = {
  dirs: React.PropTypes.array,
  isFetching: React.PropTypes.bool
}

// Note: use https://github.com/faassen/reselect for better performance.
function select(state) {
  return {
    dirs: state.dirs.items,
    isFetching: state.dirs.isFetching
  }
}

export default connect(select)(Browser);
