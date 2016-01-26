import React from 'react';
import { fetchStl } from '../actions';
import { connect } from 'react-redux';

import THREE from 'three'
import { Scene, PerspectiveCamera, DirectionalLight, Mesh, Object3D, Renderer } from './React3'

class ModelViewer extends React.Component {
  constructor(props) {
    super(props);
    var initialcamera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    initialcamera.position.x = 300;
    initialcamera.position.y = 300;
    initialcamera.position.z = 300;
    initialcamera.userData = null; // will set this up in componentDidMount
    this.state = { camera: initialcamera, turning: false };
  }

  parseStlBinary = function(stl) {
    var geo = new THREE.Geometry();
    var dv = new DataView(stl, 80); // 80 == unused header
    var isLittleEndian = true;
    var triangles = dv.getUint32(0, isLittleEndian);
    // console.log('arraybuffer length:  ' + stl.byteLength);
    // console.log('number of triangles: ' + triangles);
    var offset = 4;
    for (var i = 0; i < triangles; i++) {
      // Get the normal for this triangle
      var normal = new THREE.Vector3(
        dv.getFloat32(offset, isLittleEndian),
        dv.getFloat32(offset+4, isLittleEndian),
        dv.getFloat32(offset+8, isLittleEndian)
      );
      offset += 12;
      // Get all 3 vertices for this triangle
      for (var j = 0; j < 3; j++) {
        geo.vertices.push(
          new THREE.Vector3(
              dv.getFloat32(offset, isLittleEndian),
              dv.getFloat32(offset+4, isLittleEndian),
              dv.getFloat32(offset+8, isLittleEndian)
          )
        );
        offset += 12
      }
      // there's also a Uint16 "attribute byte count" that we
      // don't need, it should always be zero.
      offset += 2;
      // Create a new face for from the vertices and the normal
      geo.faces.push(new THREE.Face3(i*3, i*3+1, i*3+2, normal));
    }
    // The binary STL I'm testing with seems to have all
    // zeroes for the normals, unlike its ASCII counterpart.
    // We can use three.js to compute the normals for us, though,
    // once we've assembled our geometry. This is a relatively
    // expensive operation, but only needs to be done once.
    geo.computeFaceNormals();
    let mesh = new THREE.Mesh(
      geo,
      new THREE.MeshLambertMaterial({
        overdraw:true,
        color: 0xaa0000,
        // shading: THREE.FlatShading
      })
    );
    // scene.add(mesh);
    // stl = null;
    return mesh;
  }

  parseStl = function(stl) {
    var state = '';
    var lines = stl.split('\n');
    var geo = new THREE.Geometry();
    var name, parts, line, normal, done, vertices = [];
    var vCount = 0;
    stl = null;
    for (var len = lines.length, i = 0; i < len; i++) {
      if (done) {
          break;
      }
      line = trim(lines[i]);
      parts = line.split(' ');
      switch (state) {
          case '':
              if (parts[0] !== 'solid') {
                  console.error(line);
                  console.error('Invalid state "' + parts[0] + '", should be "solid"');
                  return;
              } else {
                  name = parts[1];
                  state = 'solid';
              }
              break;
          case 'solid':
              if (parts[0] !== 'facet' || parts[1] !== 'normal') {
                  console.error(line);
                  console.error('Invalid state "' + parts[0] + '", should be "facet normal"');
                  return;
              } else {
                  normal = [
                      parseFloat(parts[2]),
                      parseFloat(parts[3]),
                      parseFloat(parts[4])
                  ];
                  state = 'facet normal';
              }
              break;
          case 'facet normal':
              if (parts[0] !== 'outer' || parts[1] !== 'loop') {
                  console.error(line);
                  console.error('Invalid state "' + parts[0] + '", should be "outer loop"');
                  return;
              } else {
                  state = 'vertex';
              }
              break;
          case 'vertex':
              if (parts[0] === 'vertex') {
                  geo.vertices.push(new THREE.Vector3(
                      parseFloat(parts[1]),
                      parseFloat(parts[2]),
                      parseFloat(parts[3])
                  ));
              } else if (parts[0] === 'endloop') {
                  geo.faces.push( new THREE.Face3( vCount*3, vCount*3+1, vCount*3+2, new THREE.Vector3(normal[0], normal[1], normal[2]) ) );
                  vCount++;
                  state = 'endloop';
              } else {
                  console.error(line);
                  console.error('Invalid state "' + parts[0] + '", should be "vertex" or "endloop"');
                  return;
              }
              break;
          case 'endloop':
              if (parts[0] !== 'endfacet') {
                  console.error(line);
                  console.error('Invalid state "' + parts[0] + '", should be "endfacet"');
                  return;
              } else {
                  state = 'endfacet';
              }
              break;
          case 'endfacet':
              if (parts[0] === 'endsolid') {
                  //mesh = new THREE.Mesh( geo, new THREE.MeshNormalMaterial({overdraw:true}));
                  mesh = new THREE.Mesh(
                      geo,
                      new THREE.MeshLambertMaterial({
                          overdraw:true,
                          color: 0xaa0000,
                          // shading: THREE.FlatShading
                      }
                  ));
                  scene.add(mesh);
                  done = true;
              } else if (parts[0] === 'facet' && parts[1] === 'normal') {
                  normal = [
                      parseFloat(parts[2]),
                      parseFloat(parts[3]),
                      parseFloat(parts[4])
                  ];
                  if (vCount % 1000 === 0) {
                      console.log(normal);
                  }
                  state = 'facet normal';
              } else {
                  console.error(line);
                  console.error('Invalid state "' + parts[0] + '", should be "endsolid" or "facet normal"');
                  return;
              }
              break;
          default:
              console.error('Invalid state "' + state + '"');
              break;
      }
    }
  }

  startCamera() {
    var zeroVec = new THREE.Vector3(0,0,0);
    var componentinstance = this;
    var spinquaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0.1);
    var animationcallback = function(/*t*/) {
      var camera = componentinstance.state.camera;
      camera.position.applyQuaternion(spinquaternion);
      camera.lookAt(zeroVec);
      componentinstance.setState({camera:camera});      // 'update' the camera
      if (componentinstance.state.turning)
        camera.userData = requestAnimationFrame(animationcallback);
    };
    // add an interval timer function to rotation the camera
    // the rAQ timer ID is dumped into the camera. Not the best place to put it probably.
    this.state.camera.userData = requestAnimationFrame(animationcallback);
  }

  componentDidMount() {
    this.startCamera();
  }

  componentWillMount() {
    this.props.dispatch(fetchStl(this.props.stl_url));
  }

  componentWillUnmount() {
    if (this.state.camera.userData !== null) {
      cancelAnimationFrame(this.state.camera.userData);
    }
    this.state.camera.userData = null;
  }

  handleOnMouseEnter(e) {
    this.setState({turning: true});
  }

  handleOnMouseLeave(e) {
    this.setState({turning: false});
  }

  shouldComponentUpdate(nextProps, nextState){
    if (this.state.turning != nextState.turning)
      return true;
    return false;
  }
  componentWillUpdate(nextProps, nextState) {
    this.startCamera()
  }

  render() {
    const { stl_url, name, stl, width, height } = this.props
    let aspectratio = width / height
    let cameraprops = {fov:75, aspect:aspectratio, position:new THREE.Vector3(100,100,200), lookat:new THREE.Vector3(0,0,0)}
    let mesh = null
    let meshProps = {}
    if (stl && !stl.isFetching) {
      mesh = this.parseStlBinary(stl.stl)
      meshProps.position = new THREE.Vector3(0,0,0)
      meshProps.geometry = mesh.geometry
      meshProps.material = new THREE.MeshBasicMaterial( { overdraw:true, color: 0x99ff33, shading: THREE.FlatShading } )
    }

    return (
      <div onMouseEnter={this.handleOnMouseEnter.bind(this)} onMouseLeave={this.handleOnMouseLeave.bind(this)}>
        <h3><i className="fa fa-file fa-5x"></i><br/> { name }</h3>
        {
          stl && stl.isFetching && <div>Loading..</div>
        }
        {
          stl && !stl.isFetching &&
            React.createElement(
              Renderer, {width: width, height: height },
                React.createElement(Scene, {width: width, height: height, camera:this.state.camera },
                  React.createElement(Mesh, {...meshProps}))
            )
        }
      </div>
    );
  }
}
ModelViewer.propTypes = {
  stl_url: React.PropTypes.string,
  name: React.PropTypes.string,
  stl: React.PropTypes.object,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
};

function select(state, ownProps) {
  return {
    stl: state.stls.items[ownProps.stl_url],
  }
}


export default connect(select)(ModelViewer)
