import React, { lazy, useEffect, useState } from 'react'
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CCallout
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useHistory } from 'react-router';

const Dashboard = () => {

  const history = useHistory();
  const [data, setData] = useState( [
    {
        "id": 11,
        "name": "Min MIn",
        "email": "dsds",
        "gender": "Male",
        "date_of_birth": "2023-04-22",
        "english_skill": "Elementary",
        "japanese_skill": "N3",
        "deleted_at": null,
        "created_at": "2023-04-22T23:32:09.000000Z",
        "updated_at": "2023-07-23T06:09:00.000000Z"
    }
],);

  useEffect(() => {
    let flag = localStorage.getItem(`LoginProcess`)
    if(flag != "true"){
      history.push(`/Login`);
    }
}, );

const delCLick =(name,g)=>{
  alert("You Delete " + name + " He is " + g);
}

  
return (
    <>
     
    <p></p>
    {data.length > 0 &&(
     <>
     <table className='table table-warning table-striped table-bordered'>
       <thead>
        <tr>
          <th>No</th>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Gender</th>
          <th>Date of Birth</th>
          <th>Japanese Skill</th>
          <th>English Skill</th>
          <th>Delete</th>
        </tr>
       </thead>
       <tbody>
          {data.map((mappedData,index)=>{
              return(
                <tr>
                  <td>{index+1}</td>
                  <td>{mappedData.id}</td>
                  <td>{mappedData.name}</td>
                  <td>{mappedData.email}</td>
                  <td>{mappedData.gender}</td>
                  <td>{mappedData.date_of_birth}</td>
                  <td>{mappedData.english_skill}</td>
                  <td>{mappedData.japanese_skill}</td>
                  <td><CButton className="btn btn-danger"
                  onClick={() => {delCLick(mappedData.name,mappedData.gender);}}
                  >Delete</CButton></td>
                </tr>
              )

          })}
       </tbody>
     </table>
     </>
)


    }


    </>
  )
}

export default Dashboard
