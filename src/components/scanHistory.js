import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';

// Mock data fetching function
const fetchHistoryData = async (page) => {
  // Replace this with your actual data fetching logic
  return new Array(10).fill(null).map((_, index) => ({
    id: `${page}-${index}`,
    name: `Item ${page}-${index}`,
    date: new Date().toLocaleDateString(),
  }));
};

export default function ScanHistory({ history }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMoreData = async () => {
    if (loading) return;
    setLoading(true);
    const newData = await fetchHistoryData(page);
    setData([...data, ...newData]);
    setPage(page + 1);
    setLoading(false);
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDate}>{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Scan History</Text>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && <ActivityIndicator size="large" color="#0000ff" />}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4D8BF',
    padding: 16, // Add padding around the container
  },
  content: {
    width: '70%', // Make content 80% of the screen width
    alignSelf: 'center', // Center the content
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left', // Align title to the left
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 16, // Add padding at the bottom of the list
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemName: {
    flex: 1,
    textAlign: 'left',
  },
  itemDate: {
    flex: 1,
    textAlign: 'right',
  },
});
