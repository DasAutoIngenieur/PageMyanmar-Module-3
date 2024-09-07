import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CInput, CLabel, CSelect, CImg } from '@coreui/react';
import { ApiRequest } from '../../common/ApiRequest';
import { useHistory } from 'react-router-dom';
import Loading from "../../common/Loading";
import SuccessError from "../../common/SuccessError";
import NPagination from '../../common/pagination/NPagination';

const EmployeeListIndex = () => {
  const [success, setSuccess] = useState([]); // for success message
  const [error, setError] = useState([]); // for error message
  const [loading, setLoading] = useState(false); // for loading condition
  const [employeeList, setEmployeeList] = useState([]); // for user list table data
  const [currentPage, setCurrentPage] = useState(); // for user list table current page
  const [lastPage, setLastPage] = useState(""); // for user list table last page
  const [genderData, setGenderData] = useState([
    { id: "0", name: "All" },
    { id: "1", name: "Male" },
    { id: "2", name: "Female" },
    { id: "3", name: "Other" },
  ]);
  const [selectGender, setSelectGender] = useState("");
  const [userName, setUserName] = useState("");
  const [total, setTotal] = useState(""); // total rows
  let history = useHistory();

  useEffect(() => {
    let flag = localStorage.getItem(`LoginProcess`);
    if (flag === "true") {
      console.log("Login process success");
    } else {
      history.push(`/Login`);
    }

    (async () => {
      setLoading(true);
      await search();
      setLoading(false);
    })();
  }, []);

  const search = async (page = 1) => {
    let search = {
      method: "get",
      url: `employee/search?page=${page}`,
      params: {
        name: userName,
        gender: selectGender,
      },
    };
    let response = await ApiRequest(search);
    if (response.flag === false) {
      setEmployeeList([]);
      setError(response.message);
    } else {
      if (response.data.status === "OK") {
        setEmployeeList(response.data.data.data);
        setCurrentPage(response.data.data.current_page);
        setLastPage(response.data.data.last_page);
        setTotal(response.data.data.total);
      } else {
        setError([response.data.message]);
        setEmployeeList([]);
      }
    }
  };

  const tempSearch = async (page) => {
    let search = {
      method: "get",
      url: `employee/search?page=${page}`,
      params: {
        name: userName,
        gender: selectGender,
      },
    };
    let response = await ApiRequest(search);
    if (response.flag === false) {
      setEmployeeList([]);
    } else {
      if (response.data.status === "OK") {
        setEmployeeList(response.data.data.data);
        setCurrentPage(response.data.data.current_page);
        setLastPage(response.data.data.last_page);
        setTotal(response.data.data.total);
      } else {
        setEmployeeList([]);
      }
    }
  };

  const searchClick = () => {
    search();
  };

  const pagination = (i) => {
    setCurrentPage(i);
    tempSearch(i);
  };

  const editClick = (id) => {
    history.push('/employee-management/employee-register');
    localStorage.setItem("Update", id);
  };

  const delClick = async (deleteId) => {
    setLoading(true);
    let obj = {
      method: "delete",
      url: `employee/delete/${deleteId}`,
    };
    let response = await ApiRequest(obj);
    setLoading(false);
    if (response.flag === false) {
      setSuccess([]);
      setError(response.message);
    } else {
      if (response.data.status === "OK") {
        let page = currentPage;
        setSuccess([response.data.message]);
        if (employeeList.length - 1 === 0) {
          page = currentPage - 1;
        }
        tempSearch(page);
        setError([]);
      } else {
        setError([response.data.message]);
        setSuccess([]);
      }
    }
  };

  const userNameChange = (e) => {
    setUserName(e.target.value);
  };

  const selectGenderChange = (e) => {
    setSelectGender(e.target.value);
  };

  return (
    <>
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              <h4 className='m-0'>Employee List</h4>
            </CCardHeader>
            <CCardBody>
              <SuccessError success={success} error={error} />
              <div className='mt-4'>
                <CRow alignHorizontal='center' className="mb-3">
                  <CCol lg="6">
                    <CRow>
                      <CCol lg="1"></CCol>
                      <CCol lg="3">
                        <p className='mt-2'>UserName</p>
                      </CCol>
                      <CCol lg="7">
                        <CInput type="text" value={userName} onChange={userNameChange} />
                      </CCol>
                      <CCol lg="1"></CCol>
                    </CRow>
                  </CCol>
                  <CCol lg="6">
                    <CRow>
                      <CCol lg="1"></CCol>
                      <CCol lg="3">
                        <p className='mt-2'>Gender</p>
                      </CCol>
                      <CCol lg="7">
                        <CSelect
                          value={selectGender}
                          onChange={selectGenderChange}
                        >
                          <option value="">-- Select --</option>
                          {genderData.map((data, index) => {
                            return (
                              <option
                                key={index}
                                value={data.name}
                              >
                                {data.name}
                              </option>
                            )
                          })}
                        </CSelect>
                      </CCol>
                      <CCol lg="1"></CCol>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow alignHorizontal="center" className="mt-5">
                  <CButton className="form-btn" onClick={searchClick}>
                    Search
                  </CButton>
                </CRow>
                <CRow className='mt-5'>
                  <CCol>
                    {employeeList.length > 0 && (
                      <>
                        <p className='mb-0 font-weight-bold'>Total : {total} row(s)</p>
                        <div className='overflow'>
                          <table className='emp-list-table'>
                            <thead>
                              <tr>
                                <th className="text-center" width={50}>No</th>
                                <th className='text-center' width={180}>UserName</th>
                                <th className='text-center' width={250}>Email</th>
                                <th className='text-center' width={200}>Date Of Birth</th>
                                <th className='text-center' width={150}>Gender</th>
                                <th className='text-center' width={230}>English Skill</th>
                                <th className='text-center' width={150}>Japanese Skill</th>
                                <th className='text-center' width={80} colSpan={2}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {employeeList.map((data, index) => {
                                return (
                                  <tr key={index}>
                                    <td width={50} className="text-center">{index + 1}</td>
                                    <td className="text-center">{data.name}</td>
                                    <td className="text-center">{data.email}</td>
                                    <td className='text-center'>{data.date_of_birth}</td>
                                    <td className='text-center'>{data.gender}</td>
                                    <td className="text-center">{data.english_skill}</td>
                                    <td className="text-center">{data.japanese_skill}</td>
                                    <td style={{ border: "1px solid", textAlign: "center" }}>
                                      <div className="user-before">
                                        <CImg
                                          src="/image/Edit-Component-inactive.svg"
                                          onClick={() => editClick(data.id)}
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                            cursor: "pointer",
                                          }}
                                        />
                                        <CImg
                                          className="user-after"
                                          src="/image/Edit-Component-active.svg"
                                          onClick={() => editClick(data.id)}
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                            cursor: "pointer",
                                          }}
                                        />
                                      </div>
                                    </td>
                                    <td style={{ border: "1px solid", textAlign: "center" }}>
                                      <div className="user-before">
                                        <CImg
                                          src="/image/Delete-Component-inactive.svg"
                                          onClick={() => delClick(data.id)}
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                            cursor: "pointer",
                                          }}
                                        />
                                        <CImg
                                          className="user-after"
                                          src="/image/Delete-Component-active.svg"
                                          onClick={() => delClick(data.id)}
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                            cursor: "pointer",
                                          }}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </CCol>
                </CRow>
                <br />
                {total > 10 &&
                  <NPagination
                    activePage={currentPage}
                    pages={lastPage}
                    currentPage={currentPage}
                    totalPage={lastPage}
                    pagination={pagination}
                  />
                }
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <Loading start={loading} />
    </>
  );
}

export default EmployeeListIndex;
