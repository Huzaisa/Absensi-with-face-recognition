import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { DataTable } from "react-native-paper";
import { sc, vs, ms } from "../../constant/Dimension";
import SearchDropdown from "../dropdown/SearchDropdown";
import axios from "axios";
import useAuthStore from "../../stores/AuthStore";

const DropdownAssignContentTable = ({ headerData, bodyData }) => {
  const { token } = useAuthStore();
  const [rows, setRows] = useState(bodyData);

  useEffect(() => {
    setRows(bodyData);
  }, [bodyData]);

  const employees = [
    { id: 1, name: "Andi Saputra" },
    { id: 2, name: "Budi Santoso" },
    { id: 3, name: "Citra Dewi" },
    { id: 4, name: "Dewi Lestari" },
    { id: 5, name: "Eka Prasetya" },
    { id: 6, name: "Fajar Nugroho" },
    { id: 7, name: "Fajar Nugroho" },
    { id: 8, name: "Fajar Nugroho" },
    { id: 9, name: "Fajar Nugroho" },
    { id: 10, name: "Fajar Nugroho" },
    { id: 11, name: "Wahyu Hening Tegar Setyo Nugroho" },
  ];

  const handleAssign = (itemId, employee) => {
    setRows((prev) =>
      prev.map((r) => (r.id === itemId ? { ...r, assign: employee } : r))
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
                    { minWidth: col.key === "no" ? sc(30) : sc(125) },
                  ]}
                  textStyle={styles.cellText}
                >
                  {col.key === "assign" ? (
                    <View style={{ width: sc(125) }}>
                      <SearchDropdown
                        placeholder="Choose"
                        items={employees.map((e) => ({
                          id: String(e.id),
                          label: e.name,
                          value: e.name,
                        }))}
                        selectedValue={row.assign}
                        onValueChange={(val) => handleAssign(row.id, val)}
                        maxDropdownHeight={vs(180)}
                      />
                    </View>
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
  },
});

export default DropdownAssignContentTable;
