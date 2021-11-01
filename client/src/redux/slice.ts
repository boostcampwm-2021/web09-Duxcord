import { createSlice } from '@reduxjs/toolkit'

const {reducer, actions} = createSlice({
  name:'application',
  initialState: {
    userName:''
  },
  reducers:{
    updateUserName: (state, { payload: userName }) => ({
        ...state,
        userName
    })
  }
})

export const {
  updateUserName
} = actions

export default reducer;