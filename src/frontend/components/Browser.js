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

  render() {
    const { dirs, isFetching, routeParams } = this.props;
    const path = routeParams.splat === undefined ? '' : routeParams.splat;
    return (
      <div className="pure-g browser">
          {
            dirs.map((s, i) => {
              const lastIndex = path.lastIndexOf('/');
              const link = (s !== '..' ? path+'/'+s : (lastIndex === -1 ? '/' : '/'+path.slice(0, lastIndex)))
              const stl_url = path+'/'+s
              let w = 300
              let h = 300
              return s.indexOf('.stl') > 0 || s.indexOf('.STL') > 0 ?
                <div className="pure-u-1-4" key={i}>
                  <ModelViewer stl_url={stl_url} name={s} width={w} height={h} />
                </div>
              : <div className="pure-u-1-4 dirItem" key={i}>
                  <h3><Link to={link}><i className="fa fa-folder-o fa-5x"></i><br/>{s}</Link></h3>
                </div>;
            })
          }
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
