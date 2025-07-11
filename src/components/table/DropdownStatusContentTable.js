import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { DataTable, Modal, Portal } from "react-native-paper";
import { sc, vs, ms } from "../../constant/Dimension";
import SaveButton from "../button/SaveButton";
import AssignStatusForm from "../form/AssignStatusForm";

const DropdownStatusContentTable = ({
  headerData,
  bodyData,
  type,
  onRefresh,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [fileUpload, setFileUpload] = useState(null);

  const handleShowModal = (requestId, fileUpload) => {
    setRequestId(requestId);
    setFileUpload(fileUpload);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRequestId(null);
    setFileUpload(null);
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
                  col.key === "no"
                    ? styles.columnNo
                    : col.key === "reason"
                      ? styles.columnReason
                      : col.key === "status"
                        ? styles.columnStatus
                        : col.key === "action"
                          ? styles.columnAction
                          : styles.columnDefault,
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
                    col.key === "no"
                      ? styles.columnNo
                      : col.key === "reason"
                        ? styles.columnReason
                        : col.key === "status"
                          ? styles.columnStatus
                          : col.key === "action"
                            ? styles.columnAction
                            : styles.columnDefault,
                  ]}
                >
                  {col.key === "action" ? (
                    <SaveButton
                      text="Action"
                      onPress={() => handleShowModal(row.id, row.fileUpload)}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.cellText,
                        col.key === "status" && {
                          color:
                            row[col.key]?.toLowerCase() === "approved"
                              ? "#4CAF50"
                              : row[col.key]?.toLowerCase() === "pending"
                                ? "#FFC107"
                                : "#F44336",
                          fontFamily: "QuicksandBold",
                        },
                      ]}
                    >
                      {row[col.key]}
                    </Text>
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
          <AssignStatusForm
            requestId={requestId}
            onDismiss={handleCloseModal}
            fileUpload={fileUpload}
            type={type}
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
    paddingLeft: sc(7),
  },
  tableContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  table: {
    borderRadius: ms(8),
    overflow: "hidden",
    minWidth: "100%",
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
    flexWrap: "wrap",
  },
  row: {
    minHeight: vs(60),
    alignItems: "stretch",
  },
  evenRow: {
    backgroundColor: "#f8f9fa",
  },
  oddRow: {
    backgroundColor: "#fff",
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: sc(5),
    overflow: "hidden",
  },
  cellText: {
    fontSize: ms(13, 0.3),
    fontFamily: "QuicksandMedium",
    textAlign: "center",
    color: "#000",
    flexShrink: 1,
    flexWrap: "wrap",
    textTransform: "capitalize",
  },
  columnNo: {
    width: sc(40),
  },
  columnReason: {
    width: sc(180),
  },
  columnStatus: {
    width: sc(110),
    marginRight: sc(20),
  },
  columnAction: {
    width: sc(120),
  },
  columnDefault: {
    width: sc(100),
  },
  modalContent: {
    backgroundColor: "white",
    padding: ms(20),
    marginHorizontal: sc(20),
    borderRadius: ms(8),
  },
});

export default DropdownStatusContentTable;
