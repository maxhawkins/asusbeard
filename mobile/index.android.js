import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';

import WebRTC, { RTCView, MediaStreamTrack } from 'react-native-webrtc';

class CameraPage extends Component {
  render() {
    var cameraView = null;
    if (this.props.streamURL) {
      var {width, height} = Dimensions.get('window');
      cameraView = (<RTCView
                      style={ { width: width, height: height } }
                      streamURL={ this.props.streamURL } />);
    }

    return (
      <View style={ styles.cameraPage }>
        { cameraView }
        <TouchableOpacity
          onPress={ this.props.onClose }
          style={ styles.backButton }>
          <Text style={ { color: 'white' } }>
            Back
          </Text>
        </TouchableOpacity>
      </View>
      );
  }
}

function getSources() {
  return new Promise(function(resolve, reject) {
    MediaStreamTrack.getSources(resolve);
  });
}

function getFrontCamera() {
  return getSources().then(function(sources) {
    return sources[0];

    var source = sources.find(info => info.kind === 'video' && info.facing === 'front');
    if (source === undefined) {
      return Promise.reject(new Error('couldn\'t find front camera'));
    }
    return source;
  });
}

function getUserMedia(constraints) {
  return new Promise(function(resolve, reject) {
    WebRTC.getUserMedia(constraints, resolve, reject);
  });
}

function getCameraStream() {
  return getFrontCamera().then(function(camera) {
    return getUserMedia({
      audio: true,
      video: {
        optional: [{ sourceId: camera.id }],
      }
    });
  })
}

class ASUS extends Component {
  state = {
    streamURL: null,
    cameraVisible: false,
  }
  componentDidMount() {
    getCameraStream().then((stream) => {
      this.setState({ streamURL: stream.toURL() });
    }, (err) => {
      alert(err);
    })
  }
  render() {
    var cameraPage;
    if (this.state.cameraVisible) {
      cameraPage = (<CameraPage
                      onClose={ () => this.setState({ cameraVisible: false }) }
                      streamURL={ this.state.streamURL } />);
    }
    return (
      <View style={ styles.container }>
        <Image
          style={ styles.avatarImage }
          resizeMode="cover"
          source={ require('./bg.jpg') } />
        <TouchableOpacity
          onPress={ () => this.setState({ cameraVisible: true }) }
          style={ { backgroundColor: 'red', width: 100, height: 100 } }>
        </TouchableOpacity>
        { cameraPage }
      </View>
      );
  }
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  avatarImage: {
    flex: 1,
  },
  cameraPage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'black',
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#AAA',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ASUS', () => ASUS);
