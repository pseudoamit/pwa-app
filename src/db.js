import Dexie from "dexie";

export const db = new Dexie("MyDatabase");

db.version(1).stores({
  userList: "++id", // Define your data structure here. Adjust according to the response structure of your API.
  // userList: "dataKey",
});

export const addData = async (dataArray) => {
  // Check if dataArray is an array
  if (Array.isArray(dataArray)) {
    await db.userList.bulkPut(dataArray); // Use bulkPut for an array of objects
  } else {
    await db.userList.add(dataArray); // Use add for a single object
  }
};
