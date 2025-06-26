import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MediumText from "../text/MediumText";
import RegularText from "../text/RegularText";
import { sc } from "../../constant/Dimension";

const HomeScreenTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatCustomDate = (date) => {
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}, ${day} ${month} ${year}`;
  };

  const formatCustomTime = (date) => {
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    const s = date.getSeconds().toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      <MediumText text={formatCustomDate(currentTime)} size={11} />
      <View style={styles.timeRow}>
        <RegularText text={formatCustomTime(currentTime)} size={11} />
        <RegularText text="WIB" size={11} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  timeRow: {
    flexDirection: "row",
    gap: sc(4),
  },
});

export default HomeScreenTime;
