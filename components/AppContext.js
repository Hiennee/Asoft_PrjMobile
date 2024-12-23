import React, { createContext, useState } from 'react';

export const AppContext = createContext();
export const AppProvider = ({ children }) => {
  var [ listProjectContext, setListProjectContext ] = useState([]);
  var [ listEmployeeContext, setListEmployeeContext ] = useState([]);
  var [ listTaskContext, setListTaskContext ] = useState([]);
  var [ listIssueContext, setListIssueContext ] = useState([]);
  var [ listPositionContext, setListPositionContext ] = useState([]);

  //var [ jwt, setJwt ] = useState("");

  return (
    <AppContext.Provider value={{ 
        listProjectContext, setListProjectContext,
        listEmployeeContext, setListEmployeeContext,
        listTaskContext, setListTaskContext,
        listIssueContext, setListIssueContext,
        listPositionContext, setListPositionContext
     }}>
      {children}
    </AppContext.Provider>
  );
};
