import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuDrawerButton from "../../components/button/MenuDrawerButton";
import { StyleSheet, View } from "react-native";
import { sc, vs, ms } from "../../constant/Dimension";
import DropdownStatusContentTable from "../../components/table/DropdownStatusContentTable";
import axios from "axios";
import useAuthStore from "../../stores/AuthStore";
import { useFocusEffect } from "@react-navigation/native";

const OvertimeScreen = () => {
  const { token, overtimeAllData, setOvertimeAllData } = useAuthStore();

  const fetchOvertimeData = useCallback(async () => {
    try {
      const documentDataResponse = await axios.get(
        "http://192.168.1.7:3000/api/upload/user/72010be3-acc3-4723-a868-2f0ab95bc3ac",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("DOCUMENT: ", documentDataResponse.data);

      // const formattedDocumentData = documentDataResponse.data.map((item) => ({
      //   fileName: item.fileName,
      //   userId: item.user.id,
      // }));

      //console.log("DOCUMENT: ", formattedDocumentData);

      // const overtimeDataResponse = await axios.get(
      //   `http://192.168.1.7:3000/api/overtime/all`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      // console.log("OVERTIME: ", overtimeDataResponse.data);
      // const formattedOvertimeData = overtimeDataResponse.data.map(
      //   (item, index) => ({
      //     no: (index + 1).toString(),
      //     //id: item.id,
      //     date: item.date,
      //     startTime: item.startTime,
      //     endTime: item.endTime,
      //     name: item.user.name,
      //     reason: item.reason,
      //     status: item.status,
      //     fileUpload: item.fileUpload,
      //   })
      // );
      //console.log("OVERTIME ALL: ", formattedOvertimeData);
      //setOvertimeAllData(formattedOvertimeData);
    } catch (error) {}
  }, [token, setOvertimeAllData]);

  useFocusEffect(
    useCallback(() => {
      fetchOvertimeData();
      return () => {
        console.log("OvertimeScreen is blurring");
      };
    }, [fetchOvertimeData]),
  );
  const headerData = [
    {
      key: "no",
      label: "No.",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "startTime",
      label: "Start Time",
    },
    {
      key: "endTime",
      label: "End Time",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "reason",
      label: "Reason",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "fileUpload",
      label: "File",
    },
  ];

  const bodyData = [
    {
      id: 1,
      no: "1",
      date: "19-06-2025",
      startTime: "18:00",
      endTime: "22:00",
      name: "Arda",
      reason: "Work overtime",
      status: null,
      fileUpload: true,
    },
    {
      id: 2,
      no: "2",
      date: "20-06-2025",
      startTime: "08:00",
      endTime: "22:00",
      name: "Damar",
      reason: null,
      status: null,
      fileUpload: null,
    },
    {
      id: 3,
      no: "3",
      date: "21-06-2025",
      startTime: "07:00",
      endTime: "17:00",
      name: "Hajik",
      reason: "Work overtime",
      status: null,
      fileUpload: null,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuWrapper}>
        <MenuDrawerButton />
      </View>

      <View style={styles.tableWrapper}>
        <DropdownStatusContentTable
          headerData={headerData}
          bodyData={bodyData}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  menuWrapper: {
    paddingHorizontal: sc(22),
  },
  tableWrapper: {
    marginTop: vs(20),
  },
});

export default OvertimeScreen;
