import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { formatDistanceToNowStrict } from "date-fns";
import locale from "date-fns/locale/en-US";
import formatDistance from "../helpers/formatDistanceCustom";
import { ActivityIndicator } from "react-native-web";
import axiosConfig from '../helpers/axiosConfig';

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [isAtEndOfScrolling, setIsAtEndOfScrolling] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [onPageLoading, setOnPageLoading] = useState(false);


  useEffect(() => {
    getAllTweets();
  }, [page]);

  function getAllTweets() {
    axiosConfig
      .get(`/tweets?page=${page}`)
      .then((response) => {
        if(page === 1){
          setData(response.data.data);
        }else if(page > 1 && response.data.next_page_url == null){
          setData([...data, ...response.data.data]);
        }else{
          setIsAtEndOfScrolling(true);
        }

        setLastPage(response.data.last_page);

        if(!response.data.next_page_url){
          setIsAtEndOfScrolling(true);
        }

        setIsLoading(false);
        setIsRefreshing(false);
        console.log("Data Successfully Fetched");
        console.log('page: ' + page);
        console.log('data length: ' + data.length);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setIsRefreshing(false);
      });
  }

  function handleRefresh(){
    setPage(1);
    setIsAtEndOfScrolling(false);
    setIsRefreshing(true);
    getAllTweets();
  }

  function sleepFor(sleepDuration){
    setOnPageLoading(true);
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ 
        /* Do nothing */ 
    }
    setOnPageLoading(false);

}

  function handleEnd(){
    if(page != lastPage){
      setPage(page + 1);
    }
    sleepFor(3000);
  }

  function gotoProfile() {
    navigation.navigate("Profile Screen");
  }

  function gotoSingleTweet(tweetId) {
    navigation.navigate("Tweet Screen", {
      tweetId: tweetId
    });
  }

  function gotoNewTweet() {
    navigation.navigate("New Tweet");
  }

  const renderItem = ({ item: tweet }) => (
    <View style={styles.tweetContainer}>
      <TouchableOpacity onPress={() => gotoProfile()}>
        <Image style={styles.avatar} source={{ uri: tweet.user.avatar }} />
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.flexRow}
          onPress={() => gotoSingleTweet(tweet.id)}
        >
          <Text numberOfLines={1} style={styles.tweetName}>
            {tweet.user.name}
          </Text>
          <Text numberOfLines={1} style={styles.tweetHandle}>
            @{tweet.user.username}
          </Text>
          <Text>&middot;</Text>
          <Text numberOfLines={1} style={styles.tweetHandle}>
            {/* {formatDistanceToNowStrict(new Date(tweet.created_at))} */}
            {formatDistanceToNowStrict(new Date(tweet.created_at), {
              locale: {
                ...locale,
                formatDistance,
              },
            })}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => gotoSingleTweet(tweet.id)}>
          <Text style={styles.tweetContent}>{tweet.body}</Text>
        </TouchableOpacity>
        <View style={styles.tweetEngagement}>
          <TouchableOpacity style={styles.flexRow}>
            <EvilIcons
              name="comment"
              size={22}
              color="gray"
              style={{ marginRight: 2 }}
            />
            <Text style={styles.textGray}>456</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.flexRow, styles.ml4]}>
            <EvilIcons
              name="retweet"
              size={22}
              color="gray"
              style={{ marginRight: 2 }}
            />
            <Text style={styles.textGray}>32</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.flexRow, styles.ml4]}>
            <EvilIcons
              name="heart"
              size={22}
              color="gray"
              style={{ marginRight: 2 }}
            />
            <Text style={styles.textGray}>4,456</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.flexRow, styles.ml4]}>
            <EvilIcons
              name={Platform.OS === "ios" ? "share-apple" : "share-google"}
              size={22}
              color="gray"
              style={{ marginRight: 2 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 8 }} size="large" color="gray" />
      ) : (
        <View style={{flex: 1}}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => (
              <View style={styles.tweetSeparator}></View>
            )}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            onEndReached={() => {
              onPageLoading ? '' : handleEnd()
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => !isAtEndOfScrolling &&
              (<ActivityIndicator size="large" color="gray"/>)}
          />
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => gotoNewTweet()}
          >
            <AntDesign name="plus" size={26} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  flexRow: {
    flexDirection: "row",
  },
  tweetContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  tweetSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  avatar: {
    width: 42,
    height: 42,
    marginRight: 8,
    borderRadius: 21,
  },
  tweetName: {
    fontWeight: "bold",
    color: "#222222",
  },
  tweetHandle: {
    marginHorizontal: 8,
    color: "gray",
  },
  tweetContentContainer: {
    marginTop: 4,
  },
  tweetContent: {
    lineHeight: 20,
  },
  textGray: {
    color: "gray",
  },
  tweetEngagement: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1d9bf1",
    position: "absolute",
    bottom: 20,
    right: 12,
  },
  ml4: {
    marginLeft: 16,
  },
});
