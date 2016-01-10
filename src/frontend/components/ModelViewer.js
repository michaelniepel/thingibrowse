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
    const { stl_url } = this.props
    return (
      <div>
        <strong>File { stl_url }</strong>
      </div>
    );
  }
}
ModelViewer.propTypes = { stl_url: React.PropTypes.string };
