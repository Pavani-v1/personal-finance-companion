import React, { useContext, useState } from "react"
import axios from 'axios'
import { toast } from "react-toastify";


const BASE_URL = "http://localhost:4000/api/v1/";


const GlobalContext = React.createContext()
const user= JSON.parse(sessionStorage.getItem("user"))
export const GlobalProvider = ({children}) => {

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)

    //calculate incomes
    const addIncome = async (income) => {
        const response = await axios.post(`${BASE_URL}add-income/${user._id}`, income)
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getIncomes()
    }

    const getIncomes = async () => {
        const response = await axios.get(`${BASE_URL}get-incomes/${user._id}`)
        setIncomes(response.data.expensives)
        console.log(response.data)
    }

    const deleteIncome = async (id) => {
        const res  = await axios.delete(`${BASE_URL}delete-income/${id}`)
        getIncomes()
    }

    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    }


    //calculate incomes
    const addExpense = async (income) => {
        const response = await axios.post(`${BASE_URL}add-expense/${user._id}`, income)
            .catch((err) =>{
                toast.error(err.response.data.message)
                setError(err.response.data.message)
            })
        getExpenses()
    }

    const getExpenses = async () => {
        const response = await axios.get(`${BASE_URL}get-expenses/${user._id}`)
        setExpenses(response.data.expensives)
        console.log(response.data)
    }

    const deleteExpense = async (id) => {
        const res  = await axios.delete(`${BASE_URL}delete-expense/${id}`)
        getExpenses()
    }

    const totalExpenses = () => {
        let totalIncome = 0;
        expenses.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    }


    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        const history2 = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })
        history2.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })
        return history.slice(0, 5),history2;
    }
    // monthly and yearly get Income and expenses
const [monthData, setMonthData]=useState([]);
const [yearData, setYearData]=useState([]);
const [selectedMonth, setSelectedMonth]=useState();
// new Date().getMonth()
const [selectedYear, setSelectedYear]=useState();
// new Date().getFullYear()
const getMonthsIncome=async()=>{
    try {
        let url=`${BASE_URL}get-incomes-month/${user._id}`;//?month=${selectedMonth}&year=${selectedYear}
       
        let url2=`${BASE_URL}get-expenses-month/${user._id}`;//?month=${selectedMonth}&year=${selectedYear}
        if(selectedMonth){
            url=url+"?"+"month="+selectedMonth;
        }
        else if(selectedYear){
            url=url+"?"+"year="+selectedYear;
        }
        // let queryParams=[]
        // if (selectedMonth) {
        //     queryParams.push(`month=${selectedMonth}`);
        // }
        // if (selectedYear) {
        //     queryParams.push(`year=${selectedYear}`);
        // }
        // if (queryParams.length > 0) {
        //     url += '?' + queryParams.join('&');
        //     // url2 += '?' + queryParams.join('&');
        // }   
        const response=await axios.get(url);
        // const response2=await axios.get(url2);
    //    console.log(response2);
        console.log("years: ", response);
        setMonthData(response.data.data);
         // get expenses month url
      
    
        
    } catch (error) {
        console.log("getMonthError:", error);
        setMonthData("")
        
    }
    // let url=`${BASE_URL}get-incomes-month/${user._id}?month=${selectedMonth}&year=${selectedYear}`;
    // const response=await axios.get(url);
    // console.log("months: ", response);
    // setMonthData(response.data);
}
const getMonthsExpenses=async()=>{
    try {
        // let url=`${BASE_URL}get-incomes-month/${user._id}`;//?month=${selectedMonth}&year=${selectedYear}
       
        let url2=`${BASE_URL}get-expense/${user._id}`;//?month=${selectedMonth}&year=${selectedYear}
if(selectedMonth){
    url2=url2+"?"+"month="+selectedMonth;
}
else if(selectedYear){
    url2=url2+"?"+"year="+selectedYear;
}
        // let queryParams=[]
        // if (selectedMonth) {
        //     queryParams.push(`month=${selectedMonth}`);
        // }
        // if (selectedYear) {
        //     queryParams.push(`year=${selectedYear}`);
        // }
        // if (queryParams.length > 0) {
        //     // url += '?' + queryParams.join('&');
        //     url2 += '?' + queryParams.join('&');
        // }   
        // const response=await axios.get(url);
        const response2=await axios.get(url2);
       console.log(response2);
        // console.log("years: ", response);
        setYearData(response2.data.data);
         // get expenses month url
      
    
        
    } catch (error) {
        setYearData("")
        console.log("getMonthError:", error);
    }
    // let url=`${BASE_URL}get-incomes-month/${user._id}?month=${selectedMonth}&year=${selectedYear}`;
    // const response=await axios.get(url);
    // console.log("months: ", response);
    // setMonthData(response.data);
}
    const transactionHistoryforMonth = () => {
        const history = [...monthData, ...yearData]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

        return history
    }

    const [searchText, setSearchText] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [searchIncomesData, setSearchIncomesData] = useState([]);
    const [searchExpensesData, setSearchExpensesData] = useState([]);
    
    const searchInHistory = () => {
        const searches = [...searchIncomesData, ...searchExpensesData];
        searches.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    
        return searches.slice(0, 10);
    };
    
    const searchExpense = async () => {
        try {
            let url = `${BASE_URL}search-expense/${user._id}`;
            let queryParams = [];
    
            if (searchText) {
                queryParams.push(`title=${searchText}`);
            }
    
            if (searchDate) {
                let start = new Date(searchDate);
                queryParams.push(`date=${searchDate}`);
            }
    
            if (queryParams.length > 0) {
                url += '?' + queryParams.join('&');
            }
    
            const response = await axios.get(url);
            if (response.data && response.data.data) {
                setSearchExpensesData(response.data.data);
            } else {
                setSearchExpensesData([]);
            }
        } catch (error) {
            console.error("Error fetching expenses:", error);
            setSearchExpensesData([]);
        }
    };
    
    const searchIncome = async () => {
        try {
            let url = `${BASE_URL}search-income/${user._id}`;
            let queryParams = [];
    
            if (searchText) {
                queryParams.push(`title=${searchText}`);
            }
    
            if (searchDate) {
                let start = new Date(searchDate);
                queryParams.push(`date=${searchDate}`);
            }
    
            if (queryParams.length > 0) {
                url += '?' + queryParams.join('&');
            }
    
            const response = await axios.get(url);
            if (response.data && response.data.data) {
                setSearchIncomesData(response.data.data);
            } else {
                setSearchIncomesData([]);
            }
        } catch (error) {
            console.error("Error fetching incomes:", error);
            setSearchIncomesData([]);
        }
    };
    
    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError,
            searchText,
            setSearchText,
            searchDate,
            setSearchDate,
            searchExpense,
            searchIncome,
            searchInHistory,
            selectedYear, 
            setSelectedYear,
            selectedMonth, 
            setSelectedMonth,
            getMonthsIncome,
            getMonthsExpenses,
            transactionHistoryforMonth
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () =>{
    return useContext(GlobalContext)
}