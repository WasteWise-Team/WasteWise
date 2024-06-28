import React, { useEffect, useState, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import ThemeContext from '../context/ThemeContext';
import { getAuth } from 'firebase/auth';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { collection, query, where, orderBy, limit, startAfter, getDocs, onSnapshot } from 'firebase/firestore';

// Memoized Item Component
const Item = React.memo(({ item, theme }) => (
  <View style={styles.item}>
    <Text style={[styles.itemName, { color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D' }]}>{item.name}</Text>
    <Text style={[styles.itemDate, { color: theme === 'dark' ? '#C4D8BF90' : '#2D5A3D90' }]}>{item.date}</Text>
  </View>
));

const fetchHistoryData = async (lastDoc, setData, setLoading, setHasMore, setLastDoc, setMessage) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    setMessage('Please sign in to use this function.');
    setLoading(false);
    return;
  }

  const userUid = user.uid;
  const pageSize = 12;

  let itemsQuery = query(
    collection(FIRESTORE_DB, 'scannedItems'),
    where('userId', '==', userUid),
    orderBy('timestamp', 'desc'),
    limit(pageSize)
  );

  if (lastDoc) {
    itemsQuery = query(
      collection(FIRESTORE_DB, 'scannedItems'),
      where('userId', '==', userUid),
      orderBy('timestamp', 'desc'),
      startAfter(lastDoc),
      limit(pageSize)
    );
  }

  try {
    const querySnapshot = await getDocs(itemsQuery);
    const newData = querySnapshot.docs.map(doc => {
      const item = doc.data();
      return {
        id: doc.id,
        name: item.name,
        date: item.timestamp.toDate().toLocaleDateString(), // Format the timestamp
      };
    });

    if (newData.length === 0) {
      setHasMore(false);
    }

    setData(prevData => {
      const mergedData = [...prevData, ...newData];
      const uniqueData = mergedData.filter((item, index, self) => self.findIndex(i => i.id === item.id) === index);
      return uniqueData;
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    setLastDoc(lastVisible);
  } catch (error) {
    console.error('Error fetching history data:', error);
    setMessage('Failed to fetch history data');
  } finally {
    setLoading(false);
  }
};

const setupRealTimeListener = (setData, setMessage) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    setMessage('Please sign in to use this function.');
    return;
  }

  const userUid = user.uid;
  const itemsQuery = query(
    collection(FIRESTORE_DB, 'scannedItems'),
    where('userId', '==', userUid),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(itemsQuery, (querySnapshot) => {
    const newData = querySnapshot.docs.map(doc => {
      const item = doc.data();
      return {
        id: doc.id,
        name: item.name,
        date: item.timestamp.toDate().toLocaleDateString(), // Format the timestamp
      };
    });

    setData(prevData => {
      const mergedData = [...newData, ...prevData];
      const uniqueData = mergedData.filter((item, index, self) => self.findIndex(i => i.id === item.id) === index);
      return uniqueData;
    });
  }, (error) => {
    console.error('Error setting up real-time listener:', error);
    setMessage('Failed to fetch real-time data');
  });
};

export default function ScanHistory() {
  const [data, setData] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState('');
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = setupRealTimeListener(setData, setMessage);
    fetchHistoryData(null, setData, setLoading, setHasMore, setLastDoc, setMessage);
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const loadMoreData = () => {
    if (loading || !hasMore) return;
    setLoading(true);
    fetchHistoryData(lastDoc, setData, setLoading, setHasMore, setLastDoc, setMessage);
  };

  const renderItem = useCallback(({ item }) => (
    <Item item={item} theme={theme} />
  ), [theme]);

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#9ee8a4" />;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF' }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D' }]}>Scan History</Text>
        {message ? (
          <Text style={[styles.emptyMessage, { color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D' }]}>{message}</Text>
        ) : data.length === 0 && !loading ? (
          <Text style={[styles.emptyMessage, { color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D' }]}>Scan your first item!</Text>
        ) : (
          <>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              initialNumToRender={10} // Render a small number of items initially
              getItemLayout={(data, index) => (
                { length: 70, offset: 70 * index, index }
              )} // Assumes each item has a fixed height of 70
            />
            {hasMore && !loading && (
              <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreData}>
                <Text style={[styles.loadMoreButtonText, { color: theme === 'dark' ? '#C4D8BF90' : '#274d2990' }]}>Load More</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        {renderFooter()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    width: '87%',
    alignSelf: 'center',
    height: '93%',
  },
  title: {
    paddingTop: 20,
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    textAlign: 'left',
    marginVertical: 20,
    paddingLeft: 25,
  },
  listContainer: {
    paddingBottom: 15,
    paddingRight: 20,
    paddingLeft: 20,
  },
  item: {
    fontFamily: 'Nunito-Regular',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  itemName: {
    flex: 1,
    textAlign: 'left',
    fontSize: 15,
  },
  itemDate: {
    flex: 1,
    textAlign: 'right',
    fontSize: 15,
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  loadMoreButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreButtonText: {
    fontSize: 16,
  },
});
