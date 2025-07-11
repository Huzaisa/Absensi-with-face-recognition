import React, { useState } from "react";
import { View, StyleSheet, ToastAndroid, Alert } from "react-native";
import { sc, vs } from "../../constant/Dimension";
import BoldText from "../text/BoldText";
import SemiBoldText from "../text/SemiBoldText";
import SearchDropdown from "../dropdown/SearchDropdown";
import DateInput from "../input/DateInput";
import CancelButton from "../button/CancelButton";
import SaveButton from "../button/SaveButton";
import useAuthStore from "../../stores/AuthStore";
import axios from "axios";

const AssignShiftForm = ({ onDismiss, shiftId, onRefresh }) => {
  const { token } = useAuthStore();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [date, setDate] = useState(new Date());

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmitForm = async () => {
    try {
      if (!shiftId || !selectedEmployee || !selectedEmployee.id || !date) {
        Alert.alert("Warning!!, Please fill all fields");
        return;
      }

      const data = {
        userId: selectedEmployee.id,
        shiftId: shiftId,
        date: formatDate(date),
      };

      const response = await axios.post(
        `http://192.168.1.7:3000/api/shift/assign`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      ToastAndroid.show("Shift assign successful", ToastAndroid.SHORT);
      setTimeout(onDismiss, 1000);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.log(
        "Error assign shift:",
        error.response ? error.response.data : error.message,
      );
      Alert.alert("Warning!", error.response.data.message);
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.titleWrapper}>
        <BoldText text="FILL OUT THIS FORM" size={15} />
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.fieldGroup}>
          <SemiBoldText text="Select Employee" size={15} />
          <SearchDropdown
            selectedValue={selectedEmployee}
            onValueChange={setSelectedEmployee}
          />
        </View>

        <DateInput text="Select Date" date={date} setDate={setDate} extend />
      </View>

      <View style={styles.actionsRow}>
        <CancelButton text="Cancel" onPress={onDismiss} />
        <SaveButton text="Save" onPress={handleSubmitForm} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    gap: vs(20),
  },
  titleWrapper: {
    alignItems: "center",
  },
  inputGroup: {
    gap: vs(20),
  },
  fieldGroup: {
    gap: vs(10),
  },
  actionsRow: {
    flexDirection: "row",
    gap: sc(30),
    alignSelf: "center",
    marginTop: vs(5),
  },
});

export default AssignShiftForm;
