import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/globalContext';
import { JsonToExcel } from 'react-json-to-excel';

function History() {
    const {transactionHistory,selectedMonth, setSelectedMonth,selectedYear, setSelectedYear,getMonthsIncome,getMonthsExpenses} = useGlobalContext()

    const [...history] = transactionHistory()
    const data= history.map(({title, amount,description,type,category,date})=>({title,amount,description,type,category,date}))
const [duration ,setDuration]=useState(("Recent"))
const years = Array.from({ length: 10 }, (_, index) => new Date().getFullYear() - index);
useEffect(()=>{
    getMonthsIncome()
    getMonthsExpenses()
   
},[selectedMonth,selectedYear])
    return (
        <HistoryStyled>
           {/* <select className='history-item' onChange={(e)=>setDuration(e.target.value)}>
             <option value="Recent">Last 10 Transactions</option>
             <option value="Monthly">Monthly</option>
             <option value="Yearly">Yearly</option>
           </select>
          {duration==="Monthly"&&<div>
            <label>Select Month </label>  <input className='history-item' value={selectedMonth} onChange={(e)=>setSelectedMonth(e.target.value)} type='month'/>
          </div>}
          {duration==="Yearly"&&<div>
          <select className='history-item' onChange={(e)=>setSelectedYear(e.target.value)} >
             <option value="">--Select--</option>
            {years.map((item)=> <option key={item} value={item}>{item}</option>)}
             
           </select>
          </div>}
          <JsonToExcel
        title="Download as Excel"
        // data={[{ test: "test" }]}
        data={data}
        fileName="transactions"
        btnClassName="btn"
      /> */}
        {/* <button className='btn' >Download</button> */}
          <h2>Recent Transactions</h2>
            {history.map((item) =>{
                const {_id, title, amount, type} = item
                return (
                    <div key={_id} className="history-item">
                        <p style={{
                            color: type === 'expense' ? 'red' : 'var(--color-green)'
                        }}>
                            {title}
                        </p>

                        <p style={{
                            color: type === 'expense' ? 'red' : 'var(--color-green)'
                        }}>
                            {
                                type === 'expense' ? `-${amount <= 0 ? 0 : amount}` : `+${amount <= 0 ? 0: amount}`
                            }
                        </p>
                    </div>
                )
            })}
        </HistoryStyled>
    )
}

const HistoryStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .history-item{
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        padding: 1rem;
        border-radius: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .btn{
        text-align:center;
    padding: 0.5rem 1rem;
    border: 3px;
    border-radius: 10px;
    background: var(--color-green);
    color: white;
    cursor: pointer;
    }
    
`;

export default History