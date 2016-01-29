import React from 'react';
import { fetchDirs } from '../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import ModelViewer from './ModelViewer';

require("./Browser.css");

class Browser extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // console.log('browser component will mount');
    this.setState({stl: null});
    const { routeParams, dispatch } = this.props;
    dispatch(fetchDirs(routeParams.splat));
  }

  componentDidUpdate(prevProps) {
    // console.log('browser component did update');
    const oldSplat = prevProps.routeParams.splat;
    const { routeParams, dispatch } = this.props;
    if (oldSplat !== routeParams.splat)
      dispatch(fetchDirs(routeParams.splat));
  }

  handleOnMouseEnter(stl_url, name) {
    this.setState({stl: stl_url, name: name})
    console.log(this.state);
  }

  render() {
    const { dirs, isFetching, routeParams } = this.props;
    const path = routeParams.splat === undefined ? '' : routeParams.splat;
    let w = 300
    let h = 300
    return (
      <div className="pure-g browser">
        <div className="pure-u-3-5">
          <ul>
            {
              dirs.map((s, i) => {
                const lastIndex = path.lastIndexOf('/');
                const link = (s !== '..' ? path+'/'+s : (lastIndex === -1 ? '/' : '/'+path.slice(0, lastIndex)))
                const stl_url = path+'/'+s
                return s.indexOf('.stl') > 0 || s.indexOf('.STL') > 0 ?
                  <li key={i} onMouseEnter={() => this.handleOnMouseEnter(stl_url, s)}>
                    <i className="fa fa-file fa-2x"></i>{ s }
                  </li>
                : <li key={i}>
                    <Link to={link}><i className="fa fa-folder-o fa-2x"></i>{s}</Link>
                  </li>;
              })
            }
          </ul>
        </div>
        <div className="pure-u-2-5">
          {
            (
              this.state && this.state.stl ?
              <ModelViewer stl_url={this.state.stl} name={this.state.name} width={w} height={h} />
              :
              <span>N/A</span>
            )
          }
        </div>
      </div>
    );
  }
}

Browser.propTypes = {
  dirs: React.PropTypes.array,
  isFetching: React.PropTypes.bool,
  path: React.PropTypes.array
}

// Note: use https://github.com/faassen/reselect for better performance.
function select(state) {
  return {
    dirs: state.dirs.items,
    path: state.dirs.path,
    isFetching: state.dirs.isFetching
  }
}

export default connect(select)(Browser)
