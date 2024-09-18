import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { addData, db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";

const Users = () => {
  const [data, setData] = useState([]);

  const allUserDetails = useLiveQuery(
    () => db.userList.where("dataKey").equals("dataKey").toArray(),
    []
  );

  const fetchData = async () => {
    try {
      let url = "https://jsonplaceholder.typicode.com/users";
      const response = await fetch(url); // Replace with your actual API URL
      const resultData = await response.json();
      setData(resultData);
      await addData(resultData);
    } catch (error) {
      if (allUserDetails?.length > 0) {
        console.log("Using stored data from IndexedDB:", allUserDetails);
        setData(allUserDetails[0]?.userDetails);
      }
    }
  };

  useEffect(() => {
    if (
      allUserDetails &&
      Array.isArray(allUserDetails) &&
      allUserDetails.length > 0 &&
      allUserDetails[0]?.userDetails?.length > 0
    ) {
      setData(allUserDetails[0].userDetails);
    } else {
      fetchData(); // Fetch new data if nothing is stored
    }
  }, [allUserDetails]);

  return (
    <>
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>id</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.username}</td>
                  <td>{item.email}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default Users;
