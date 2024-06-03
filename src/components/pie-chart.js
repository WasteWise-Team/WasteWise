import React, { Component, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PieChart from 'react-native-pie-chart';
import ThemeContext from '../context/ThemeContext';


export default class TestChart extends Component {
  static contextType = ThemeContext;

  render() {
    const { theme, toggleTheme } = this.context;
    const widthAndHeight = 250;
    const series = [123, 321, 123];
    const sliceColor = ['#99DAB3', '#2D5A3D', '#FFFFFF'];

    const styles = StyleSheet.create({
      container: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      title: {
        fontSize: 18,
        marginVertical: 30, // Reduce vertical margin to minimize space
        color: theme === 'dark' ? '#F8F8F8' : '#2D5A3D',
      },
    });

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


