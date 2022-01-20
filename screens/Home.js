import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {HeaderBar} from '../components';
import {COLORS, SIZES, constants, images, icons, dummyData} from '../constants';
import {connect} from 'react-redux';

const Home = ({navigation, appTheme}) => {
  return (
    <View style={styles.container}>
      <HeaderBar />
      <ScrollView
        style={{
          flex: 1,
          marginTop: -25,
          borderTopLeftRadius: SIZES.radius * 2,
          borderTopRightRadius: SIZES.radius * 2,
          backgroundColor: appTheme.backgroundColor,
        }}></ScrollView>
    </View>
  );
};

function mapStateToProps(state) {
  return {
    appTheme: state.appTheme,
    error: state.error,
  };
}

export default connect(mapStateToProps, null)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
