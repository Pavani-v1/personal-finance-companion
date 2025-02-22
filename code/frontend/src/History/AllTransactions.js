import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../context/globalContext";
import { JsonToExcel } from "react-json-to-excel";
import SearchHistory from "./SearchHistory";
import { usePDF } from 'react-to-pdf';
function AllTransactions() {
  const {
    totalExpenses,
    incomes,
    expenses,
    totalIncome,
    totalBalance,
    getIncomes,
    getExpenses,
    searchText,
    setSearchText, 
    searchDate, 
    setSearchDate, 
    searchExpense,
    searchIncome,
    // getMonthsIncome
    transactionHistory,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    getMonthsIncome,
    getMonthsExpenses,
    transactionHistoryforMonth
  } = useGlobalContext();
  const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});
  const [...history2] = transactionHistory();
  const [...history] = transactionHistoryforMonth();
  const data = history.map(
    ({ title, amount, description, type, category, date }) => ({
      title,
      amount,
      description,
      type,
      category,
      date,
    })
  );
  const [duration, setDuration] = useState("Recent");
  const years = Array.from(
    { length: 10 },
    (_, index) => new Date().getFullYear() - index
  );
  useEffect(() => {
    getIncomes();
    getExpenses();
    // getMonthsIncome()
  }, [duration]);
  useEffect(() => {
    getMonthsIncome();
    getMonthsExpenses();
  }, [selectedMonth, selectedYear]);
  const [showHistory, setShowHistory] = useState(false);
  const searchFunction=async () =>{
    setShowHistory(true);
    try {
     searchExpense();
     searchIncome()
    } catch (error) {
      setShowHistory(false);
      console.log(error);
    }
  }
//   const data= history.map(({title, amount,description,type,category,date})=>({title,amount,description,type,category,date}))
function printPageArea(areaID){
  var printContent = document.getElementById(areaID).innerHTML;
  var originalContent = document.body.innerHTML;
  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;
}

  return (
    <HistoryStyled>
      {/* <h2>All Transactions</h2> */}
      {/* {searches.map((item) =>{
                const {_id, title, amount, type,date} = item
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
                        <p>{date.slice(0, 10)}</p>
                    </div>
                )
            })} */}
              <p style={{display:"flex", justifyContent:"center"}}>
          <input
            type="search"
            className="history-item"
            value={searchText}
            placeholder="search..."
            onChange={(e) => setSearchText(e.target.value)}
            style={{ borderRadius: "5px", height: "2rem", width: "30rem" , padding:"5px"}}
          />{" "}
          <input type="date" value={searchDate} className="history-item" onChange={(e)=>setSearchDate(e.target.value)} style={{width:"140px", borderRadius:"8px", marginLeft:"5px", height:"30px"}}/>
          <button onClick={searchFunction} style={{borderRadius:"8px", width:"3rem", padding:"2px", backgroundColor:"#875755", marginLeft:"3px",}}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#ffffff"
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          </button>
          <a href="#" style={{padding:"5px"}} onClick={()=>{
            setShowHistory(false);
            setSearchText("");
            setSearchDate("");
            setDuration("Recent")
          }}>clear</a>
        </p>
      <select
        className="history-item"
        onChange={(e) => {
          if(e.target.value==="Monthly"){
            setSelectedYear("")
          }else if(e.target.value==="Yearly"){
            setSelectedMonth("")
          }
          else{
            setSelectedMonth("")
            setSelectedYear("")
          }
          setDuration(e.target.value)}}
      >
        <option value="Recent">Recent Transactions</option>
        <option value="Monthly">Monthly</option>
        <option value="Yearly">Yearly</option>
      </select>
      {duration === "Monthly" && (
        <div>
          <label>Select Month </label>{" "}
          <input
            className="history-item"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            type="month"
          />
        </div>
      )}
      {duration === "Yearly" && (
        <div>
          <select
            className="history-item"
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">--Select--</option>
            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* <JsonToExcel
        title="Download as Excel"
        // data={[{ test: "test" }]}
        data={data}
        fileName="transactions"
        btnClassName="btn"
      /> */}
      {/* <button className='btn' >Download</button> */}
      {/* <h2>{duration} Transactions</h2> */}
      <div id="printbutton" className="printing" ref={targetRef}>
      
      {showHistory ? (
      <div ><SearchHistory /></div>
          
        ) :
      (duration==="Recent"&&history2.map((item) => {
        const { _id, title, amount, type,date } = item;
        return (
          <div key={_id} className="history-item" >
            <p
              style={{
                color: type === "expense" ? "red" : "var(--color-green)",
              }}
            >
              {title}
            </p>

            <p
              style={{
                color: type === "expense" ? "red" : "var(--color-green)",
              }}
            >
              {type === "expense"
                ? `-${amount <= 0 ? 0 : amount}`
                : `+${amount <= 0 ? 0 : amount}`}
            </p>
            <p>{date.slice(0, 10)}</p>
          </div>
        );
      }))}
     { duration!=="Recent"&&history.map((item) => {
        const { _id, title, amount, type,date } = item;
        return (
          <div key={_id} id="printbutton" className="history-item">
            <p
              style={{
                color: type === "expense" ? "red" : "var(--color-green)",
              }}
            >
              {title}
            </p>

            <p
              style={{
                color: type === "expense" ? "red" : "var(--color-green)",
              }}
            >
              {type === "expense"
                ? `-${amount <= 0 ? 0 : amount}`
                : `+${amount <= 0 ? 0 : amount}`}
            </p>
            <p>{date.slice(0, 10)}</p>
          </div>
        );
      })}</div>
      {!showHistory&& <JsonToExcel
        title="Download as Excel"
        // data={[{ test: "test" }]}
        data={data}
        fileName="transactions"
        btnClassName="btn"
      />}
      <button
      onClick={() => toPDF()}
      // onClick={()=>printPageArea("printbutton")} 
      className="btn">Download as Pdf</button>
    </HistoryStyled>
  );
}

const HistoryStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 15px;
  .history-item {
    background: #fcf6f9;
    border: 2px solid #ffffff;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .btn {
    text-align: center;
    padding: 0.5rem 1rem;
    border: 3px;
    border-radius: 10px;
    background: var(--color-green);
    color: white;
    cursor: pointer;
  }
  .printing{
    padding: 12px;
    margin: -10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

`;

export default AllTransactions;
