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

  handleDirClick(e) {
    // console.log(e.target.text);
    const dirName = e.target.text;
    const fullPath = [...this.props.path, dirName]
    this.props.dispatch(fetchDirs(fullPath));
  }

  render() {
    const { dirs, isFetching, path } = this.props
    return (
      <div>
        <h2>{path}</h2>
        <ul>
          {
            dirs.map((s, i) => {
              return s.indexOf('.stl') > 0 || s.indexOf('.STL') > 0 ?
                <li key={i}>
                  <ModelViewer stl_url={s}/>
                </li>
              : <li key={i}><a href="#" onClick={s => this.handleDirClick(s)}>{s}</a></li>;
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
  parh: React.PropTypes.array
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
