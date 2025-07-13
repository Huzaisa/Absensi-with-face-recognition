import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { DataTable } from "react-native-paper";
import { sc, vs, ms } from "../../constant/Dimension";
import axios from "axios";
import useAuthStore from "../../stores/AuthStore";
import DeleteButton from "../button/DeleteButton";

const CommonContentTable = ({ headerData, bodyData, onRefresh }) => {
  const { token } = useAuthStore();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  };

  const handleDeleteRow = (userId, date) => {
    Alert.alert(
      "Warning!",
      "Are you sure want to delete this assigned shift?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const data = {
                userId: userId,
                date: formatDate(date),
              };

              const response = await axios.delete(
                `http://192.168.1.8:3000/api/shift/mapping`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  data: data,
                },
              );

              ToastAndroid.show("Data deleted successful", ToastAndroid.SHORT);

              if (onRefresh) {
                onRefresh();
              }
            } catch (error) {
              console.log(
                "Error delete data:",
                error.response ? error.response.data : error.message,
              );
              Alert.alert("Warning!", error.response.data.message);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={{ width: "auto" }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.tableContainer}
      >
        <DataTable style={styles.table}>
          <DataTable.Header style={styles.tableHeader}>
            {headerData.map((header) => (
              <DataTable.Title
                key={header.key}
                style={[
                  styles.headerCell,
                  { minWidth: header.key === "no" ? sc(30) : sc(110) },
                ]}
                textStyle={styles.headerText}
              >
                {header.label}
              </DataTable.Title>
            ))}
          </DataTable.Header>

          {bodyData.map((item, index) => (
            <DataTable.Row
              key={item.id}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.evenRow : styles.oddRow,
              ]}
            >
              {headerData.map((header) => (
                <DataTable.Cell
                  key={`${item.id}-${header.key}`}
                  style={[
                    styles.bodyCell,
                    { minWidth: header.key === "no" ? sc(30) : sc(110) },
                  ]}
                  textStyle={[
                    styles.bodyText,
                    header.key === "status" && {
                      color:
                        item[header.key]?.toLowerCase() === "approved"
                          ? "#4CAF50"
                          : item[header.key]?.toLowerCase() === "pending"
                            ? "#FFC107"
                            : "#F44336",
                      fontFamily: "QuicksandBold",
                      textAlign: "center",
                    },
                  ]}
                >
                  {header.key === "action" ? (
                    <DeleteButton
                      text={"Delete"}
                      onPress={() => {
                        handleDeleteRow(item.userId, item.date);
                      }}
                    />
                  ) : (
                    item[header.key]
                  )}
                </DataTable.Cell>
              ))}
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    borderRadius: ms(8),
    overflow: "hidden",
    elevation: 3,
    backgroundColor: "white",
    alignItems: "center",
    marginLeft: sc(7),
    flexGrow: 1,
  },
  table: {
    borderRadius: ms(8),
  },
  tableHeader: {
    backgroundColor: "#3f51b5",
    height: vs(50),
    alignItems: "center",
  },
  headerCell: {
    justifyContent: "center",
  },
  headerText: {
    fontFamily: "QuicksandBold",
    color: "#fff",
    fontSize: ms(14, 0.3),
    textAlign: "center",
  },
  tableRow: {
    minHeight: vs(60),
  },
  evenRow: {
    backgroundColor: "#f8f9fa",
  },
  oddRow: {
    backgroundColor: "#fff",
  },
  bodyCell: {
    justifyContent: "center",
    alignItems: "center",
  },
  bodyText: {
    fontSize: ms(12, 0.3),
    fontFamily: "QuicksandMedium",
    textAlign: "center",
    color: "#000",
    textTransform: "capitalize",
  },
});

export default CommonContentTable;
