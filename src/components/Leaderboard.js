import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, SafeAreaView, Image } from 'react-native';
import ThemeContext from '../context/ThemeContext';

// Mock data fetching function
const fetchLeaderboardData = async () => {
  // Replace this with your actual data fetching logic
  return new Array(20).fill(null).map((_, index) => ({
    id: `${index}`,
    name: `gingeRon ${index}`,
    city: `London ${index}`,
    recycledItems: Math.floor(Math.random() * 100), // Random number of recycled items
    photoUrl: 'https://i.pinimg.com/564x/f7/f9/a4/f7f9a42c7b7087b2b5913a1a5bf7c47f.jpg', // Placeholder image URL, replace with actual image URLs
  }));
};

export default function Leaderboard({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const newData = await fetchLeaderboardData();
      setData(newData);
      setLoading(false);
    };
    loadData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.photoUrl }} style={styles.photo} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCity}>{item.city}</Text>
        <Text style={styles.itemRecycledItems}>{item.recycledItems} items recycled</Text>
      </View>
    </View>
  );


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
      padding: 16,
      justifyContent: 'center', 
      alignItems: 'center',
    },
    title_coming: {
      color: theme === 'dark' ? '#C4D8BF' : '#042222',
    },
    // content: {
    //   width: '90%',
    //   height: '95%',
    //   alignSelf: 'center',
    // },
    // title: {
    //   fontSize: 20,
    //   fontWeight: 'bold',
    //   textAlign: 'Left',
    //   paddingLeft: 25,
    //   marginVertical: 20,
    //   fontFamily: 'Nunito-Bold',
    //   color: theme === 'dark' ? '#C4D8BF': '#2D5A3D'
    // },
    // listContainer: {
    //   paddingBottom: 16,
    //   paddingRight: 20,
    //   paddingLeft: 20,
    // },
    // item: {
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   padding: 10,
    //   borderBottomWidth: 1,
    //   borderBottomColor: theme === 'dark' ? '#e5f0e260'  : '#82B37A', // Border color
    // },
    // photo: {
    //   width: 50,
    //   height: 50,
    //   borderRadius: 25,
    //   marginRight: 10,
    // },
    // itemInfo: {
    //   flex: 1,
    //   alignItems: 'flex-end', // Align items to the right
    // },
    // itemName: {
    //   fontSize: 18,
    //   fontfamily: 'Nunito-SemiBold',
    //   color: theme === 'dark' ? '#C4D8BF': '#2D5A3D'
    // },
    // itemCity: {
    //   fontSize: 14,
    //   color: theme === 'dark' ? '#C4D8BF': '#2D5A3D'
    // },
    // itemRecycledItems: {
    //   fontSize: 14,
    //   color: theme === 'dark' ? '#C4D8BF': '#2D5A3D'
    // },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* <Text style={styles.title}>Green Machines</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        )} */}
      </View>
      <Text style={styles.title_coming}>
        Coming Soon!
      </Text>
    </SafeAreaView>
  );
}


