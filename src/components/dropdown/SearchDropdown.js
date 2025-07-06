import React, { useState, useMemo, useRef } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, List, Text, Menu } from "react-native-paper";
import { ms, sc, vs } from "../../constant/Dimension";
import useAuthStore from "../../stores/AuthStore";

const SearchDropdown = ({ selectedValue, onValueChange, maxHeight = 200 }) => {
  const { employeeData } = useAuthStore();

  const processedItems = useMemo(() => {
    if (!employeeData) return [];
    return employeeData.map((employee) => ({
      label: employee.name,
      value: employee.id,
      id: employee.id,
    }));
  }, [employeeData]);

  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [anchorWidth, setWidth] = useState(0);
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    if (!query) return processedItems;
    return processedItems.filter((i) =>
      i.label.toLowerCase().includes(query.toLowerCase()),
    );
  }, [processedItems, query]);

  const selectedLabel = useMemo(() => {
    if (selectedValue && selectedValue.id) {
      const found = processedItems.find((i) => i.value === selectedValue.id);
      return found ? found.label : "";
    }
    return "";
  }, [selectedValue, processedItems]);

  return (
    <View style={styles.wrapper}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentStyle={{ maxHeight, width: anchorWidth }}
        anchor={
          <TouchableOpacity
            style={styles.anchor}
            activeOpacity={0.7}
            onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
            onPress={() => {
              setQuery("");
              setVisible(true);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
          >
            <Text style={selectedLabel ? styles.text : styles.placeholder}>
              {selectedLabel || "Choose"}
            </Text>
            <List.Icon icon={visible ? "chevron-up" : "chevron-down"} />
          </TouchableOpacity>
        }
      >
        <View style={styles.searchContainer}>
          <TextInput
            ref={inputRef}
            placeholder="Search..."
            value={query}
            onChangeText={setQuery}
            mode="flat"
            dense
            left={<TextInput.Icon icon="magnify" />}
            style={styles.searchInput}
          />
        </View>

        <ScrollView>
          {filtered.length ? (
            filtered.map((item) => (
              <Menu.Item
                key={item.id}
                title={item.label}
                onPress={() => {
                  onValueChange({ name: item.label, id: item.value });
                  setVisible(false);
                }}
                titleStyle={styles.itemTitle}
                style={styles.item}
              />
            ))
          ) : (
            <Menu.Item
              title="Nothing matches"
              disabled
              titleStyle={[styles.itemTitle, { color: "#999" }]}
              style={styles.item}
            />
          )}
        </ScrollView>
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    position: "relative",
    overflow: "visible",
  },
  label: {
    marginBottom: vs(4),
    fontSize: ms(14, 0.3),
    fontFamily: "QuicksandMedium",
    color: "#555",
  },
  anchor: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: ms(4),
    paddingHorizontal: sc(12),
    paddingVertical: vs(10),
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
  },
  text: {
    fontSize: ms(14, 0.3),
    fontFamily: "QuicksandMedium",
    color: "#000",
    textTransform: "capitalize",
  },
  placeholder: {
    fontSize: ms(14, 0.3),
    fontFamily: "QuicksandMedium",
    color: "#888",
    textTransform: "capitalize",
  },
  searchContainer: {
    paddingHorizontal: sc(8),
    paddingVertical: vs(4),
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  searchInput: {
    backgroundColor: "transparent",
    margin: 0,
    height: vs(31),
  },
  item: {
    height: vs(38),
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: ms(13, 0.3),
    fontFamily: "QuicksandMedium",
    textTransform: "capitalize",
  },
});

export default SearchDropdown;
