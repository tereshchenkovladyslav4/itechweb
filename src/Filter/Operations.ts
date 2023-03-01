const Operations = [
  {
    rowId: 9,
    datatype: "String",
    operations: ["Contains", "Not Contains", "Exactly Matching"],
  },
  {
    rowId: 4,
    datatype: "Int",
    operations: ["Equals", "Not Equals", "Greater Than", "Less Than"],
  },
  {
    rowId: 5,
    datatype: "Long",
    operations: ["Equals", "Not Equals", "Greater Than", "Less Than"],
  },
  {
    rowId: 6,
    datatype: "Float",
    operations: ["Equals", "Not Equals", "Greater Than", "Less Than"],
  },
  // { rowId: 8, datatype: "DateTime", operations: ["Before", "After"]},
  { rowId: 13, datatype: "User", operations: ["Equals", "Not Equals"]},
  { rowId: 14, datatype: "User", operations: ["Equals", "Not Equals"]},
  { rowId: 15, datatype: "User", operations: ["Equals", "Not Equals"]},
  { rowId: 17, datatype: "User", operations: ["Equals", "Not Equals"]},
  // { datatype: "Boolean", operations: ["Equals"]},
  // { datatype: "SecurityObject", operations: ["Equals"]},
  // { datatype: "Identifier", operations: ["Equals"]},
  // { datatype: "Group", operations: ["In"]},
  { rowId: 12, datatype: "Type", operations: ["Equals", "Not Equals"]},
];

export { Operations };
