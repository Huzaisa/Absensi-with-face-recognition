import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { DataTable } from "react-native-paper";
import { sc, vs, ms } from "../../constant/Dimension";

const CommonContentTable = ({ headerData, bodyData, assign }) => {
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
                  { minWidth: header.key === "no" ? sc(30) : sc(80) },
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
                    { minWidth: header.key === "no" ? sc(30) : sc(80) },
                  ]}
                  textStyle={[
                    styles.bodyText,
                    header.key === "status" && {
                      color:
                        item[header.key]?.toLowerCase() === "approve"
                          ? "#4CAF50"
                          : item[header.key]?.toLowerCase() === "waiting"
                            ? "#FFC107"
                            : "#F44336",
                      fontFamily: "QuicksandBold",
                      textAlign: "center",
                    },
                  ]}
                >
                  {item[header.key]}
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
    paddingBottom: vs(8),
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
    paddingVertical: vs(2),
  },
  headerText: {
    fontFamily: "QuicksandBold",
    color: "white",
    fontSize: ms(14, 0.3),
    textAlign: "center",
  },
  tableRow: {
    height: vs(43),
  },
  evenRow: {
    backgroundColor: "#f8f9fa",
  },
  oddRow: {
    backgroundColor: "white",
  },
  bodyCell: {
    justifyContent: "center",
  },
  bodyText: {
    fontSize: ms(13, 0.3),
    fontFamily: "QuicksandMedium",
    textAlign: "center",
  },
});

export default CommonContentTable;
