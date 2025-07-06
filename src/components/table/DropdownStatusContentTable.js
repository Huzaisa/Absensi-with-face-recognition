import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { DataTable, List } from "react-native-paper";
import { sc, vs, ms } from "../../constant/Dimension";
import Dropdown from "../dropdown/Dropdown";

const DropdownStatusContentTable = ({ headerData, bodyData }) => {
  const [rows, setRows] = useState(bodyData);

  const statuses = [
    { id: 1, name: "Approved", color: "#4CAF50" },
    { id: 2, name: "Rejected", color: "#F44336" },
  ];

  const handleStatus = (rowId, stat) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, status: stat } : r)),
    );
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tableContainer}
      >
        <DataTable style={styles.table}>
          <DataTable.Header style={styles.header}>
            {headerData.map((col) => (
              <DataTable.Title
                key={col.key}
                style={[
                  styles.headerCell,
                  { minWidth: col.key === "no" ? sc(30) : sc(130) },
                ]}
                textStyle={styles.headerText}
              >
                {col.label}
              </DataTable.Title>
            ))}
          </DataTable.Header>

          {rows.map((row, idx) => (
            <DataTable.Row
              key={row.id}
              style={[
                styles.row,
                idx % 2 === 0 ? styles.evenRow : styles.oddRow,
              ]}
            >
              {headerData.map((col) => (
                <DataTable.Cell
                  key={`${row.id}-${col.key}`}
                  style={[
                    styles.cell,
                    { minWidth: col.key === "no" ? sc(30) : sc(130) },
                  ]}
                  textStyle={styles.cellText}
                >
                  {col.key === "status" ? (
                    <Dropdown
                      rowId={row.id}
                      current={row.status}
                      onSelect={handleStatus}
                      data={statuses}
                    />
                  ) : col.key === "fileUpload" ? (
                    row.fileUpload ? (
                      <TouchableOpacity
                        onPress={() => {}} //TODO onPress
                      >
                        <List.Icon icon="download" />
                      </TouchableOpacity>
                    ) : null
                  ) : (
                    row[col.key]
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
  wrapper: {
    width: "100%",
    overflow: "visible",
    marginLeft: sc(7),
  },
  tableContainer: {
    paddingVertical: vs(8),
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
    overflow: "visible",
  },
  table: {
    borderRadius: ms(8),
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#3f51b5",
    height: vs(50),
    alignItems: "center",
  },
  headerCell: {
    justifyContent: "center",
    paddingVertical: vs(4),
  },
  headerText: {
    fontFamily: "QuicksandBold",
    color: "#fff",
    fontSize: ms(14, 0.3),
    textAlign: "center",
  },
  row: {
    minHeight: vs(60),
    overflow: "visible",
  },
  evenRow: {
    backgroundColor: "#f8f9fa",
  },
  oddRow: {
    backgroundColor: "#fff",
  },
  cell: {
    justifyContent: "center",
    overflow: "visible",
  },
  cellText: {
    fontSize: ms(13, 0.3),
    fontFamily: "QuicksandMedium",
    textAlign: "center",
    color: "#000",
  },
});

export default DropdownStatusContentTable;
