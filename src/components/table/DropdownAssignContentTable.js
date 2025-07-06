import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { DataTable, Modal, Portal } from "react-native-paper";
import { sc, vs, ms } from "../../constant/Dimension";
import SaveButton from "../button/SaveButton";
import AssignShiftForm from "../form/AssignShiftForm";

const DropdownAssignContentTable = ({ headerData, bodyData, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState(null);

  const handleShowModal = (shiftId) => {
    setSelectedShiftId(shiftId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedShiftId(null);
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

          {bodyData.map((row, idx) => (
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
                    <SaveButton
                      text="Assign"
                      onPress={() => handleShowModal(row.id)}
                    />
                  ) : (
                    row[col.key]
                  )}
                </DataTable.Cell>
              ))}
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>

      <Portal>
        <Modal
          visible={showModal}
          onDismiss={handleCloseModal}
          contentContainerStyle={styles.modalContent}
        >
          <AssignShiftForm
            shiftId={selectedShiftId}
            onDismiss={handleCloseModal}
            onRefresh={onRefresh}
          />
        </Modal>
      </Portal>
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
    alignItems: "center",
  },
  cellText: {
    fontSize: ms(13, 0.3),
    fontFamily: "QuicksandMedium",
    textAlign: "center",
    color: "#000",
  },
  modalContent: {
    backgroundColor: "white",
    padding: ms(20),
    marginHorizontal: sc(20),
    borderRadius: ms(8),
  },
});

export default DropdownAssignContentTable;
