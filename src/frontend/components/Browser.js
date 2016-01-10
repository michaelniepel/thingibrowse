import React from 'react';
import { fetchDirs } from '../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { ModelViewer } from './ModelViewer';

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
      <div>
        <ul>
          {
            dirs.map((s, i) => {
              const lastIndex = path.lastIndexOf('/');
              const link = (s !== '..' ? path+'/'+s : (lastIndex === -1 ? '/' : '/'+path.slice(0, lastIndex)))
              return s.indexOf('.stl') > 0 || s.indexOf('.STL') > 0 ?
                <li key={i}>
                  <ModelViewer stl_url={s}/>
                </li>
              : <li key={i}><Link to={link}>{s}</Link></li>;
            })
          }
        </ul>
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

export default connect(select)(Browser);
