import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PieChart from 'react-native-pie-chart';

export default class TestChart extends Component {
  render() {
    const widthAndHeight = 250;
    const series = [123, 321, 123];
    const sliceColor = ['#99DAB3', '#2D5A3D', '#FFFFFF'];

    return (
      <View style={styles.container}>
        <Text style={styles.title}>You've recycled:</Text>
        <PieChart
          widthAndHeight={widthAndHeight}
          series={series}
          sliceColor={sliceColor}
          coverRadius={0.6}
          coverFill={'#C4D8BF'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    marginVertical: 30, // Reduce vertical margin to minimize space
    color: '#2D5A3D',
  },
});
