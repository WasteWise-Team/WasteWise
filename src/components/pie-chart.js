import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { useRoute } from '@react-navigation/native';
import ThemeContext from '../context/ThemeContext';


const TestChart = ({counts, plastic, metal, ewaste}) => {
  const { theme } = useContext(ThemeContext);
  const numberOfItems = counts;

  const widthAndHeight = 250;
  const plastic1 = plastic / numberOfItems;
  const metal1 = metal / numberOfItems;
  const ewaste1 = ewaste / numberOfItems;
  // const { plastic, metal, ewaste } = counts;
  const series = [plastic1, metal1, ewaste1];
  const sliceColor = ['#99DAB3', '#2D5A3D', '#FFFFFF'];

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 18,
      marginVertical: 30,
      color: theme === 'dark' ? '#F8F8F8' : '#2D5A3D',
    },
    noDataText: {
      fontSize: 16,
      color: theme === 'dark' ? '#F8F8F8' : '#2D5A3D',
    },
  });

  const totalItems = series.reduce((a, b) => a + b, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You've recycled:</Text>
      {totalItems > 0 ? (
        <PieChart
          widthAndHeight={widthAndHeight}
          series={series}
          sliceColor={sliceColor}
          coverRadius={0.6}
          coverFill={theme === 'dark' ? '#042222' : '#C4D8BF'}
        />
      ) : (
        <Text style={styles.noDataText}>No items recycled yet.</Text>
      )}
    </View>
  );
};

export default TestChart;
