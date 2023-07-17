import React, { useContext, useEffect } from "react";
import { View, Text } from "react-native";
import axiosConfig from "../helpers/axiosConfig";
import { AuthContext } from "../context/AuthProvider";

function SearchScreen() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axiosConfig.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${user.token}`;
    axiosConfig
      .get("/user")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Search Screen</Text>
    </View>
  );
  s;
}

export default SearchScreen;
