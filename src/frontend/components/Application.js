import React from 'react';
import { fetchDirs } from '../actions';
import { connect } from 'react-redux';

import { ModelViewer } from './ModelViewer';

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
        <h1>Dirs { this.props.current_dir }</h1>
        <ul>
          {
            this.props.dirs.map((s, i) => {
              return s.indexOf('.stl') > 0 || s.indexOf('.STL') > 0 ?
                <li key={i}>
                  <ModelViewer stl_url={s}/>
                </li>
              : <li key={i}>{s}</li>;
            })
          }
        </ul>
      </div>
    );
  }
}

export default connect(state => ({ dirs: state.dirs, current_dir: '/' }))(Application);
