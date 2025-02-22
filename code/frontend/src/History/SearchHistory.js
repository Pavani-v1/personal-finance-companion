import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/globalContext';
import { JsonToExcel } from 'react-json-to-excel';

function SearchHistory() {
    const {transactionHistory,searchText,searchDate,searchInHistory} = useGlobalContext()
const [...searches]=searchInHistory()

const data= searches.map(({title, amount,description,type,category,date})=>({title,amount,description,type,category,date}))


    return (
        <HistoryStyled>
            <h2>Searched Transactions</h2>
            {searches.map((item) =>{
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
            })}
             <JsonToExcel
        title="Download as Excel"
        // data={[{ test: "test" }]}
        data={data}
        fileName="transactions"
        btnClassName="btn"
      />
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
`;

export default SearchHistory