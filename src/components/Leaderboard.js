import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, SafeAreaView, Image } from 'react-native';

// Mock data fetching function
const fetchLeaderboardData = async () => {
  // Replace this with your actual data fetching logic
  return new Array(20).fill(null).map((_, index) => ({
    id: `${index}`,
    name: `Person ${index}`,
    city: `City ${index}`,
    recycledItems: Math.floor(Math.random() * 100), // Random number of recycled items
    photoUrl: 'https://i.pinimg.com/564x/1b/2d/d6/1b2dd6610bb3570191685dcfb3e5e68e.jpg', // Placeholder image URL, replace with actual image URLs
  }));
};

export default function Leaderboard({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Recycling Leaderboard</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4D8BF',
    padding: 16,
  },
  content: {
    width: '90%',
    height: '95%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'Nunito-Bold',
    color: '#2D5A3D'

  },
  listContainer: {
    paddingBottom: 16,
    paddingRight: 20,
    paddingLeft: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
    alignItems: 'flex-end', // Align items to the right
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5A3D'
  },
  itemCity: {
    fontSize: 14,
    color: '#2D5A3D'
  },
  itemRecycledItems: {
    fontSize: 14,
    color: '#2D5A3D'
  },
});
