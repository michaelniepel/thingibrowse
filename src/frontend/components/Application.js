import React from 'react';
import { fetchDirs } from '../actions';
import { connect } from 'react-redux';

class Application extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(fetchDirs());
  }

  render() {
    return (
      <div>
        <h1>Dirs { this.props.models_path }</h1>
        <ul>
          { this.props.dirs.map((s, i) => <li key={i}>{s}</li>) }
        </ul>
      </div>
    );
  }
}

export default connect(state => ({ dirs: state.dirs, models_path: '/' }))(Application);
