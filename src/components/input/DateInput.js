import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import LightText from "../text/LightText";
import SemiBoldText from "../text/SemiBoldText";
import MediumText from "../text/MediumText";
import Calendar from "../../../assets/images/calendar.svg";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ms, sc, vs } from "../../constant/Dimension";

const DateInput = ({ text, date, setDate, extend }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [hasSelectedDate, setHasSelectedDate] = useState(false);

  const showDatePicker = () => setShowPicker(true);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    if (selectedDate) {
      setDate(currentDate);
      setHasSelectedDate(true);
      setShowPicker(false);
    }
  };

  const formatDate = (d) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <SemiBoldText text={text} size={15} />

      <TouchableOpacity
        style={[
          styles.inputButton,
          !extend && { width: sc(130), justifyContent: "center" },
          extend && { paddingLeft: sc(15) },
        ]}
        onPress={showDatePicker}
      >
        <Calendar />
        {hasSelectedDate ? (
          <MediumText text={formatDate(date)} size={12} />
        ) : (
          <LightText text="Fri, 4 July 2025" size={12} />
        )}
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: vs(10),
  },
  inputButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#999999",
    borderWidth: 1,
    borderRadius: ms(20),
    height: vs(60),
    gap: sc(5),
  },
});

export default DateInput;
