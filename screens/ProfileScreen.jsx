import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import axiosConfig from "../helpers/axiosConfig";
import { format } from "date-fns";
import RenderItem from "../components/RenderItem";

export default function ProfileScreen({ route, navigation }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isLoadingTweets, setIsLoadingTweets] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [isAtEndOfScrolling, setIsAtEndOfScrolling] = useState(false);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    getUserProfile();
    getUserTweets();
  }, [page]);

  function getUserProfile() {
    axiosConfig
      .get(`/users/${route.params.userId}`)
      .then((response) => {
        setUser(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setIsRefreshing(false);
      });
  }

  function getUserTweets() {
    axiosConfig
      .get(`/users/${route.params.userId}/tweets?page=${page}`)
      .then((response) => {
        if (page === 1) {
          setData(response.data.data);
        } else if (page > 1 && response.data.next_page_url == null) {
          setData([...data, ...response.data.data]);
        } else {
          setIsAtEndOfScrolling(true);
        }

        setLastPage(response.data.last_page);

        if (!response.data.next_page_url) {
          setIsAtEndOfScrolling(true);
        }

        setIsLoadingTweets(false);
        setIsRefreshing(false);
        console.log("Data Successfully Fetched");
        console.log("page: " + page);
        console.log("data length: " + data.length);
      })
      .catch((error) => {
        console.log(error);
        setIsLoadingTweets(false);
        setIsRefreshing(false);
      });
  }

  function handleRefresh() {
    setPage(1);
    setIsAtEndOfScrolling(false);
    setIsRefreshing(true);
    getUserTweets();
  }

  function handleEnd() {
    if (page != lastPage) {
      setPage(page + 1);
    }
    // sleepFor(3000);
  }

  const ProfileHeader = () => (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 8 }} size="large" color="gray" />
      ) : (
        <>
          <Image
            style={styles.backgroundImage}
            source={{
              uri: "https://images.unsplash.com/photo-1554034483-04fda0d3507b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            }}
          />
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={{
                uri: user.avatar,
              }}
            />
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileHandle}>@{user.username}</Text>
          </View>

          <View style={styles.profileContainer}>
            <Text style={styles.profileContainerText}>{user.profile}</Text>
          </View>

          <View style={styles.locationContainer}>
            <EvilIcons name="location" size={24} color="gray" />
            <Text style={styles.textGray}>{user.location}</Text>
          </View>

          <View style={styles.linkContainer}>
            <TouchableOpacity
              style={styles.linkItem}
              onPress={() => Linking.openURL(user.link)}
            >
              <EvilIcons name="link" size={24} color="gray" />
              <Text style={styles.linkColor}>{user.linkText}</Text>
            </TouchableOpacity>
            <View style={[styles.linkItem, styles.ml4]}>
              <EvilIcons name="calendar" size={24} color="gray" />
              <Text style={styles.textGray}>
                Joined {format(new Date(user.created_at), "MMM yyyy")}
              </Text>
            </View>
          </View>

          <View style={styles.followContainer}>
            <View style={styles.followItem}>
              <Text style={styles.followItemNumber}>509</Text>
              <Text style={styles.followItemLabel}>Following</Text>
            </View>
            <View style={[styles.followItem, styles.ml4]}>
              <Text style={styles.followItemNumber}>2,354</Text>
              <Text style={styles.followItemLabel}>Followers</Text>
            </View>
          </View>

          <View style={styles.separator}></View>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 8 }} size="large" color="gray" />
      ) : (
        <FlatList
          data={data}
          renderItem={(props) => <RenderItem {...props} />}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator}></View>}
          ListHeaderComponent={ProfileHeader}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          onEndReached={handleEnd}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            !isAtEndOfScrolling && (
              <ActivityIndicator size="large" color="gray" />
            )
          }
          scrollIndicatorInsets={{right: 1}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textGray: {
    color: "gray",
  },
  ml4: {
    marginLeft: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backgroundImage: {
    width: 800,
    height: 120,
  },
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    marginTop: -34,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "white",
  },
  followButton: {
    backgroundColor: "#0f1418",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  followButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  nameContainer: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  profileName: {
    fontWeight: "bold",
    fontSize: 22,
  },
  profileHandle: {
    color: "gray",
    marginTop: 1,
  },
  profileContainer: {
    paddingHorizontal: 10,
    marginTop: 8,
  },
  profileContainerText: {
    lineHeight: 22,
  },
  locationContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    marginTop: 12,
  },
  linkContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    marginTop: 4,
  },
  linkColor: {
    color: "#1d9bf1",
  },
  linkItem: {
    flexDirection: "row",
  },
  followContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  followItem: {
    flexDirection: "row",
  },
  followItemNumber: {
    fontWeight: "bold",
  },
  followItemLabel: {
    marginLeft: 4,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
});
