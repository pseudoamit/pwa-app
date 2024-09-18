import Dexie from "dexie";

export const db = new Dexie("MyDatabase");

db.version(1).stores({
  // userList: "++id",
  userList: "dataKey",
});

export const addData = async (data) => {
  await db.userList.put({ dataKey: "dataKey", userDetails: data });
};
