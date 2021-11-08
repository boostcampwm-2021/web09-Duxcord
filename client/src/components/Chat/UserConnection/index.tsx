import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { API_URL } from '../../../api/API_URL';
import { getFetcher } from '../../../util/fetcher';
import { socket } from '../../../util/socket';

const getGroupsFetcher = async (url: string) => {
    try {
      const response = await fetch(url, { credentials: 'include' });
      const responseData = await response.json();
  
      return responseData?.map((el: any) => el.group);
    } catch (error) {
      console.error(error);
    }
  };
interface userConnectionInfo {
  [key:string]: any[]
}
function UserConnection() {
const { data, error } = useSWR('/api/user', getFetcher);
const { data: groups, error:GroupInfoError, mutate } = useSWR(API_URL.user.getGroups, getGroupsFetcher);
const [state, setState] = useState<userConnectionInfo>({})

useEffect(() => {
    socket.on('userEnter', (data, code) => {
      setState((prevState) => {
        const newState:userConnectionInfo = {}
        Object.keys(prevState).forEach(v => {
          if (v === code) {
            newState[v] = [...prevState[v], data]
          } else {
            newState[v] = [...prevState[v]]
          }
        })
        return newState;
      })
     });
    socket.on('userExit', (data) => { 
      const newState:userConnectionInfo = {}
      Object.keys(state).forEach(v => {
        newState[v] = state[v].filter(a=>a.loginID === data.loginID)
      })
      setState(newState);
    });
    socket.on('userConnectionInfo', (userConnectionInfo) => {
      console.log(userConnectionInfo)
      setState(userConnectionInfo)
    })
    if (data)
      socket.emit('logIn', groups, data);
    return () => { 
      socket.off('userEnter') 
      socket.off('userExit');
      socket.off('userConnectionInfo')
    };
  }, [data, groups]);

  return (
    <div>
      {JSON.stringify(state)}
    </div>
  );
}

export default UserConnection;
