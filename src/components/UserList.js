// Here we use react for Provides core functionality for building the component (useState, useEffect, and useCallback).

import React, { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import './UserList.css';
import '../App.css'; 

// Functional component is used for displaying and managing user data
const UserList = () => {
    // State variables are
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [filterConfig, setFilterConfig] = useState({ gender: '', country: '' });
  
  // It Fetch user data and country list
  const fetchMoreData = useCallback(async () => {
    try {
      const response = await axios.get(`https://dummyjson.com/users?limit=10&skip=${skip}`);
      const newUsers = response.data.users;

      // it is for Extract unique countries
      const newCountries = [...new Set(newUsers.map(user => user.address.country))];

       // It Update state with fetched users and countries
      setUsers(prevUsers => [...prevUsers, ...newUsers]);
      setCountries(prevCountries => [...new Set([...prevCountries, ...newCountries])]);
      setSkip(prevSkip => prevSkip + 10);
      if (newUsers.length === 0) {
        setHasMore(false); // No more users to load so it is false
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }, [skip]);  // Dependencies for fetching data
 // Initial data fetch on component mount
  useEffect(() => {
    fetchMoreData();
  }, [fetchMoreData]); // Dependencies for fetching data

  // Sort functionality -// Handle sorting of users
  const handleSort = (key) => {
    let direction = 'asc'; //  sorting direction in asc
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'; // sorting direction in desc
    }
    setSortConfig({ key, direction });
    setUsers([...users].sort((a, b) => {
      if (key === 'age') {
        return direction === 'asc' ? a.age - b.age : b.age - a.age;
      }
      if (key === 'country') {
        return direction === 'asc' ? a.address.country.localeCompare(b.address.country) : b.address.country.localeCompare(a.address.country);
      }
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    }));
  };

  // Handle filter change   // Handle changes in filter settings

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterConfig({ ...filterConfig, [name]: value });
  };

  // Transform gender value for display
  function transformGender(gender) {
    return gender === 'female' ? 'F' : 'M';
  }
  // Filter users based on selected country and gender
  const filteredUsers = users.filter(user => {
    return (!filterConfig.gender || user.gender === filterConfig.gender) &&
           (!filterConfig.country || user.address.country === filterConfig.country);
  });

  return (
    <div className="App">
      <div className="header">
        <div className='logo'>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3MF3cDnJ_3rdSjWqhVTsZQR2kyE00zL9oEsCK_XDcpbtt9c_g8ApL&usqp=CAE&s" alt="Company Logo" className="company-logo" />
        </div>
        <div className="menu-icon">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className="header-content">
        <h1>Employees</h1>
        <div className="filters">
          <img src="https://img.icons8.com/?size=100&id=3720&format=png&color=FA5252" alt="Filter Icon" className="filter-icon" />
          <select name="country" value={filterConfig.country} onChange={handleFilterChange}>
            <option  value="">Country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          <select name="gender" value={filterConfig.gender} onChange={handleFilterChange}>
            <option value="">Gender</option>
            <option value="male">M</option>
            <option value="female">F</option>
          </select>
        </div>
      </div>
      
      {/* It will Automatically fetch more user data as the user scrolls down the page. */}
      <InfiniteScroll
        dataLength={filteredUsers.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>
                ID <span className={`sort-icon ${sortConfig.key === 'id' ? sortConfig.direction : ''}`}>
                  <span className="up-arrow">&#8593;</span>
                  <span className="down-arrow">&#8595;</span>
                </span>
              </th>
              <th>Image</th>
              <th onClick={() => handleSort('firstName')}>
                Full Name <span className={`sort-icon ${sortConfig.key === 'firstName' ? sortConfig.direction : ''}`}>
                  <span className="up-arrow">&#8593;</span>
                  <span className="down-arrow">&#8595;</span>
                </span>
              </th>
              <th onClick={() => handleSort('age')}>
                Demography <span className={`sort-icon ${sortConfig.key === 'age' ? sortConfig.direction : ''}`}>
                  {/*<span className="up-arrow">&#8593;</span>
                  <span className="down-arrow">&#8595;</span>*/}
                </span>
              </th>
              <th>Designation</th>
              <th onClick={() => handleSort('country')}>
                Location <span className={`sort-icon ${sortConfig.key === 'country' ? sortConfig.direction : ''}`}>
                {/* <span className="up-arrow">&#8593;</span> */}
                  {/* <span className="down-arrow">&#8595;</span> */}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td><img src={user.image} alt={user.firstName} className="table-image" /></td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{transformGender(user.gender)}/{user.age}</td>
                <td>{user.company.title}</td>
                <td> {user.address.state}, {user.address.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};

export default UserList;
