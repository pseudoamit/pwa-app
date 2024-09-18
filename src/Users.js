import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { addData, db, getAllData } from "./db";
import { useLiveQuery } from "dexie-react-hooks";

const Users = () => {
  const [data, setData] = useState([]);

  const allUserDetails = useLiveQuery(() => db.userList.toArray(), []);

  const fetchData = async () => {
    try {
      let url = "https://jsonplaceholder.typicode.com/users";
      const response = await fetch(url); // Replace with your actual API URL
      const resultData = await response.json();
      setData(resultData);
      await addData(resultData);
    } catch (error) {
      // let collection = localStorage.getItem("users");
      // setData(JSON.parse(collection));
      setData(allUserDetails);
    }
  };

  const loadData = async () => {
    if (allUserDetails?.length) {
      console.log("storedData", allUserDetails);
      setData(allUserDetails);
    } else {
      fetchData();
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
