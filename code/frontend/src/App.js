import React, {useState, useMemo} from 'react'
import styled from "styled-components";
import bg from './img/bg.png';
import Homepage from './Components/Homepage/Homepage';
import {MainLayout} from './styles/Layouts'
import Orb from './Components/Orb/Orb'
import Navigation from './Components/Navigation/Navigation'
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income'
import Expenses from './Components/Expenses/Expenses';
import { useGlobalContext } from './context/globalContext';
import Login from './Components/auth/Login';
import Profile from './Components/auth/Profile';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import AllTransactions from './History/AllTransactions';
function App() {
  const [active, setActive] = useState(1)
const user= JSON.parse(sessionStorage.getItem("user"));

 
 

  const displayData = () => {
    switch(active){
      case 1:
        return <Dashboard />
      case 2:
        return <AllTransactions />
      case 3:
        return <Income />
      case 4: 
        return <Expenses />
        case 5:
          return <Profile/>
      default: 
        return <Dashboard />
    }
  }

  const orbMemo = useMemo(() => {
    return <Orb />
  },[])

  return (
    <AppStyled bg={bg} className="App">
      {orbMemo}
      <MainLayout>
        {user ?
         <><Navigation active={active} setActive={setActive} />
         <main>
           {displayData()}
         </main></>
        : <Homepage />}
      </MainLayout>
<ToastContainer/>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  position: relative;
  main{
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar{
      width: 0;
    }
  }
`;

export default App;
