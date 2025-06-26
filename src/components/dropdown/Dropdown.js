import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Menu, List } from "react-native-paper";
import { sc, vs, ms } from "../../constant/Dimension";

const Dropdown = ({ rowId, current, onSelect, data }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={[
              styles.button,
              current?.color && { backgroundColor: current.color },
            ]}
          >
            <Text style={[styles.text]}>{current?.name ?? "Choose"}</Text>
            <List.Icon
              icon={menuVisible ? "chevron-up" : "chevron-down"}
              style={styles.icon}
            />
          </TouchableOpacity>
        }
      >
        {data.map((item) => (
          <Menu.Item
            key={item.id}
            title={item.name}
            onPress={() => {
              onSelect(rowId, item);
              setMenuVisible(false);
            }}
            titleStyle={[
              styles.menuItemTitle,
              item.color && { color: item.color },
            ]}
            style={styles.menuItem}
          />
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: sc(120),
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: ms(6),
    paddingHorizontal: sc(8),
    paddingVertical: vs(6),
    width: "100%",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    fontSize: ms(13, 0.3),
    fontFamily: "QuicksandMedium",
    textAlign: "center",
  },
  icon: {
    marginLeft: sc(4),
  },
  menuItem: {
    height: vs(40),
    justifyContent: "center",
  },
  menuItemTitle: {
    fontFamily: "QuicksandMedium",
    fontSize: ms(13, 0.3),
  },
});

export default Dropdown;
