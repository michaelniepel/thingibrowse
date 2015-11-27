import React from 'react';
// import { fetchStl } from '../actions';

export class ModelViewer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // this.props.dispatch(fetchStl(this.props.stl_url));
  }

  render() {
    return (
      <div>
        <h1>File { this.props.stl_url }</h1>
      </div>
    );
  }
}
ModelViewer.propTypes = { stl_url: React.PropTypes.string };
