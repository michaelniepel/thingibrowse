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
        <h3><i className="fa fa-file-o fa-5x"></i><br/> { stl_url }</h3>
      </div>
    );
  }
}
ModelViewer.propTypes = { stl_url: React.PropTypes.string };
