import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Menu, List } from "react-native-paper";
import { sc, vs, ms } from "../../constant/Dimension";

const Dropdown = ({ rowId, current, onSelect, data, extend }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [anchorWidth, setAnchorWidth] = useState(0);

  return (
    <View
      style={[styles.wrapper, extend && { width: "100%" }]}
      onLayout={(event) => {
        setAnchorWidth(event.nativeEvent.layout.width);
      }}
    >
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
            <Text style={[styles.text, current?.color && { color: "#fff" }]}>
              {current?.name ?? "Select"}
            </Text>
            <List.Icon
              icon={menuVisible ? "chevron-up" : "chevron-down"}
              style={styles.icon}
              color={current?.color ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        }
        anchorPosition="bottom"
        contentStyle={[styles.menuContent, { width: anchorWidth }]}
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
    backgroundColor: "#fff",
  },
  text: {
    flex: 1,
    fontSize: ms(13, 0.3),
    fontFamily: "QuicksandMedium",
    textAlign: "center",
    color: "#000",
  },
  icon: {
    marginLeft: sc(4),
  },
  menuContent: {
    backgroundColor: "#fff",
    borderRadius: ms(6),
  },
  menuItem: {
    height: vs(40),
    justifyContent: "center",
  },
  menuItemTitle: {
    fontFamily: "QuicksandMedium",
    fontSize: ms(13, 0.3),
    color: "#000",
  },
});

export default Dropdown;
