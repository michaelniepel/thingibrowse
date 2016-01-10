import React from 'react';

require("./Application.css");

export default class Application extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log('application component will mount');
  }

  render() {
    return (
      <div className="app">
        {this.props.children}
      </div>
    );
  }
}
