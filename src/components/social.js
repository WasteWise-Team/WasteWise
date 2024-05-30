import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, SafeAreaView, ActivityIndicator } from 'react-native';

// Mock data fetching function
const fetchRecyclingData = async (page) => {
  // Replace this with your actual data fetching logic
  const items = [
    'Recycled Dasani water bottle',
    'Recycled batteries',
    'Recycled wheels',
    'is looking to recycle:\nbatteries\nwheels',
  ];

  const date = new Date();
  return new Array(10).fill(null).map((_, index) => ({
    id: `${page}-${index}`,
    user: index % 2 === 0 ? 'You' : 'Hermione',
    profilePic: index % 2 === 0
      ? 'https://i.pinimg.com/564x/1b/2d/d6/1b2dd6610bb3570191685dcfb3e5e68e.jpg'
      : 'https://i.pinimg.com/564x/2a/97/f1/2a97f1ce022557060bec269248a7c274.jpg',
    item: items[index % items.length],
    time: `${date.getHours()}:${date.getMinutes()}`,
    date: new Date(date.setDate(date.getDate() - Math.floor(index / 3))).toLocaleDateString(), // Different date every 3 messages
  }));
};

export default function CommunityRecords() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMoreData = async () => {
    if (loading) return;
    setLoading(true);
    const newData = await fetchRecyclingData(page);
    setData([...newData, ...data]);
    setPage(page + 1);
    setLoading(false);
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const renderItem = ({ item }) => {
    const isCurrentUser = item.user === 'You';
    return (
      <View style={[styles.itemContainer, isCurrentUser ? styles.currentUserContainer : styles.friendContainer]}>
        {!isCurrentUser && <Image source={{ uri: item.profilePic }} style={styles.profilePic} />}
        <View style={isCurrentUser ? styles.currentUserTextContainer : styles.friendTextContainer}>
          <Text style={styles.userName}>{item.user}</Text>
          <View style={[styles.chatBubble, isCurrentUser ? styles.currentUserBubble : styles.friendBubble]}>
            <Text style={isCurrentUser ? styles.currentUserItemText : styles.friendItemText}>
              {item.item.split(' ')[0]} <Text style={isCurrentUser ? styles.currentUserItemTextHighlight : styles.friendItemTextHighlight}>{item.item.split(' ').slice(1).join(' ')}</Text>
            </Text>
          </View>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        {isCurrentUser && <Image source={{ uri: item.profilePic }} style={styles.profilePic} />}
      </View>
    );
  };

  const renderDateSeparator = (date) => (
    <View style={styles.dateSeparator}>
      <View style={styles.separatorLine} />
      <Text style={styles.dateSeparatorText}>{date}</Text>
      <View style={styles.separatorLine} />
    </View>
  );

  const renderListItem = ({ item, index }) => {
    const previousItem = data[index + 1]; // Inverted list, so the previous item is the next one in the array
    const isNewDay = !previousItem || previousItem.date !== item.date;
    const showDateSeparator = index % 3 === 0 || isNewDay; // Show date separator every 3 messages or on a new day
    return (
      <>
        {showDateSeparator && renderDateSeparator(item.date)}
        {renderItem({ item })}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator size="large" color="#0000ff" />}
        contentContainerStyle={styles.listContainer}
        inverted // To show new entries at the top
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4D8BF',
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    width: '90%',
    alignItems: 'flex-end',
    alignSelf: 'center', // Center the container itself
    justifyContent: 'flex-end', // Center the content within the container
  },
  currentUserContainer: {
    // flexDirection: 'row-reverse', // Ensure profile pic is on the right
    justifyContent: 'flex-end',
    alignItems: 'flex-end', // Align all items to the right
  },
  friendContainer: {
    flexDirection: 'row', // Ensure profile pic is on the left
    justifyContent: 'flex-start',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  textContainer: {
    maxWidth: '80%',
  },
  currentUserTextContainer: {
    alignItems: 'flex-end',
    marginLeft: 'auto', // Push the current user's text container to the right
  },
  friendTextContainer: {
    alignItems: 'flex-start',
  },
  chatBubble: {
    padding: 10,
    borderRadius: 20,
  },
  currentUserBubble: {
    backgroundColor: '#2D5A3D',
  },
  friendBubble: {
    backgroundColor: '#FFFFFF',
  },
  currentUserItemText: {
    color: '#FFFFFF', // Text color for current user
  },
  friendItemText: {
    color: '#000000', // Text color for friend
  },
  currentUserItemTextHighlight: {
    color: '#C4D8BF', // Highlight color for current user
  },
  friendItemTextHighlight: {
    color: '#68A77C', // Highlight color for friend
  },
  timeText: {
    fontSize: 12,
    color: '#2D5A3D',
    marginTop: 5, // Add margin to separate from chat bubble
  },
  userName: {
    fontSize: 14,
    color: '#2D5A3D',
    marginBottom: 5, // Add margin to separate from chat bubble
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2D5A3D',
  },
  dateSeparatorText: {
    marginHorizontal: 10,
    color: '#2D5A3D',
  },
});
