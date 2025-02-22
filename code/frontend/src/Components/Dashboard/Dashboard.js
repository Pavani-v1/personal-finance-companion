import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import History from "../../History/History";
import { InnerLayout } from "../../styles/Layouts";
import { dollar } from "../../utils/Icons";
import Chart from "../Chart/Chart";
import SearchHistory from "../../History/SearchHistory";

function Dashboard() {
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
    getMonthsIncome
  } = useGlobalContext();

  useEffect(() => {
    getIncomes();
    getExpenses();
    getMonthsIncome()
  }, []);
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
  return (
    <DashboardStyled>
      <InnerLayout>
        {/* <p style={{display:"flex", justifyContent:"center"}}>
          <input
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ borderRadius: "5px", height: "2rem", width: "30rem" , padding:"5px"}}
          />{" "}
          <input type="date" value={searchDate} onChange={(e)=>setSearchDate(e.target.value)} style={{width:"70px", borderRadius:"8px", marginLeft:"5px"}}/>
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
          }}>clear</a>
        </p> */}
        {/* {showHistory ? (
          <SearchHistory />
        ) :  */}
        {/* ( */}
          <div>
            <h1>All Transactions</h1>
            <div className="stats-con">
              <div className="chart-con">
                <div>
                  <Chart />
                </div>
                <div className="amount-con">
                  <div className="income">
                    <h2>Total Income</h2>
                    <p>
                      {dollar} {totalIncome()}
                    </p>
                  </div>
                  <div className="expense">
                    <h2>Total Expense</h2>
                    <p>
                      {dollar} {totalExpenses()}
                    </p>
                  </div>
                  <div className="balance">
                    <h2>Total Balance</h2>
                    <p>
                      {dollar}{" "}
                      {totalBalance() > 0 ? (
                        <span
                          style={{
                            color: "green",
                          }}
                        >
                          {totalBalance()}
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "red",
                          }}
                        >
                          {totalBalance()}
                          <br />
                          <span
                            style={{
                              color: "#54575c",
                              fontSize: "14px",
                              padding: "0",
                            }}
                          >
                            You are running low balance, control your expenses
                            and focus on earning income
                          </span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="history-con">
                <History />
                <h2 className="salary-title">
                  Min <span>Salary</span>Max
                </h2>
                <div className="salary-item">
                  <p>${Math.min(...incomes.map((item) => item.amount))}</p>
                  <p>${Math.max(...incomes.map((item) => item.amount))}</p>
                </div>
                <h2 className="salary-title">
                  Min <span>Expense</span>Max
                </h2>
                <div className="salary-item">
                  <p>${Math.min(...expenses.map((item) => item.amount))}</p>
                  <p>${Math.max(...expenses.map((item) => item.amount))}</p>
                </div>
              </div>
            </div>
          </div>
        {/* ) */}
        {/* } */}
      </InnerLayout>
    </DashboardStyled>
  );
}

const DashboardStyled = styled.div`
  .stats-con {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 2rem;
    .chart-con {
      grid-column: 1 / 4;
      height: 400px;
      .amount-con {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
        margin-top: 2rem;
        .income,
        .expense {
          grid-column: span 2;
        }
        .income,
        .expense,
        .balance {
          background: #fcf6f9;
          border: 2px solid #ffffff;
          box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
          border-radius: 20px;
          padding: 1rem;
          p {
            font-size: 2.5rem;
            font-weight: 700;
          }
        }

        .balance {
          grid-column: 2 / 4;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          p {
            color: var(--color-green);
            opacity: 0.6;
            font-size: 2.5rem;
          }
        }
      }
    }

    .history-con {
      grid-column: 4 / -1;
      h2 {
        margin: 1rem 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .salary-title {
        font-size: 1.2rem;
        span {
          font-size: 1.8rem;
        }
      }
      .salary-item {
        background: #fcf6f9;
        border: 2px solid #ffffff;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        padding: 1rem;
        border-radius: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
          font-weight: 600;
          font-size: 1.6rem;
        }
      }
    }
  }
`;

export default Dashboard;
