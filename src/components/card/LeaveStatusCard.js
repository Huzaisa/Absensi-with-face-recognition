import React from "react";
import { View, StyleSheet } from "react-native";
import BoldText from "../text/BoldText";
import SemiBoldText from "../text/SemiBoldText";
import MediumText from "../text/MediumText";
import { ms, sc, vs } from "../../constant/Dimension";

const LeaveStatusCard = ({ status, startDate, endDate }) => {
  const backgroundColor =
    status === "PENDING"
      ? "#FFC107"
      : status === "APPROVED"
        ? "#4CAF50"
        : "#F44336";

  if (status == null) {
    return <BoldText text="No request submitted" size={15} color="#999999" />;
  }

  return (
    <View style={[styles.card, { backgroundColor }]}>
      {/* Leave Status */}
      <View style={styles.row}>
        <View style={[styles.leaveStatusGroup]}>
          <SemiBoldText text="Leave Status" size={11} />
          <SemiBoldText text=":" size={11} />
        </View>

        <MediumText text={status} size={12} />
      </View>

      {/* Start Date */}
      <View style={styles.row}>
        <View style={[styles.startDateGroup]}>
          <SemiBoldText text="Start Date" size={11} />
          <SemiBoldText text=":" size={11} />
        </View>

        <MediumText text={startDate} size={12} />
      </View>

      {/* End Date */}
      <View style={styles.row}>
        <View style={[styles.endDateGroup]}>
          <SemiBoldText text="End Date" size={11} />
          <SemiBoldText text=":" size={11} />
        </View>

        <MediumText text={endDate} size={12} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: sc(312),
    height: vs(117),
    borderRadius: ms(20),
    paddingLeft: sc(30),
    paddingTop: vs(12),
    gap: vs(20),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: sc(10),
  },
  leaveStatusGroup: {
    flexDirection: "row",
    gap: sc(2),
  },
  startDateGroup: {
    flexDirection: "row",
    gap: sc(15),
  },
  endDateGroup: {
    flexDirection: "row",
    gap: sc(21),
  },
});

export default LeaveStatusCard;
