import React from 'react';
import { fetchShouts, fetchDirs } from '../actions';
import { connect } from 'react-redux';

class Application extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(fetchShouts());
    this.props.dispatch(fetchDirs());
  }

  render() {
    return (
      <div>
        <h1>Shouts</h1>
        <ul>
          { this.props.shouts.map((s, i) => <li key={i}>{s}</li>) }
        </ul>
        <h2>Dirs</h2>
        <ul>
          { this.props.dirs.map((s, i) => <li key={i}>{s}</li>) }
        </ul>
      </div>
    );
  }
}

export default connect(state => ({ shouts: state.shouts, dirs: state.dirs }))(Application);
