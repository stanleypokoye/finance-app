import { NavLink } from "react-router-dom";
import nav_overview from '../assets/images/icon-nav-overview.svg'
import nav_overview_active from '../assets/images/icon-nav-overview-active.svg'
import nav_transaction from '../assets/images/icon-nav-transactions.svg'
import nav_transaction_active from '../assets/images/icon-nav-transactions-active.svg'
import nav_budget from '../assets/images/icon-nav-budgets.svg'
import nav_budget_active from '../assets/images/icon-nav-budgets-active.svg'
import nav_pots from '../assets/images/icon-nav-pots.svg'
import nav_pots_active from '../assets/images/icon-nav-pots-active.svg'
import nav_recurring from '../assets/images/icon-nav-recurring-bills.svg'
import nav_recurring_active from '../assets/images/icon-nav-recurring-bills-active.svg'
import logo_large from '../assets/images/logo-large.svg'


const Navigation = () => {
    return (
        <nav className="  pt-3 px-6 h-14 bg-gray-900 md:h-[74px] lg:w-[300px] lg:min-h-screen lg:h-auto lg:rounded-r-xl ">
            <img 
                src={logo_large} 
                alt="logo" 
                className="hidden lg:flex lg:mt-7" 
            />
            <div className="flex flex-row justify-between items-center  lg:flex-col lg:mt-3" >

                <NavLink 
                    to="/" 
                    className={({ isActive }) => isActive? "flex flex-col justify-center items-center h-11 w-16 rounded-t-xl bg-[#F8F4F0] border-b-5 border-[#277C78] md:w-[104px] md:h-16  lg:w-[276px] lg:border-b-0 lg:border-l-5 lg:rounded-t-none lg:rounded-r-xl p-5 mb-2":  "lg:w-[276px] lg:border-b-0  lg:rounded-t-none lg:rounded-r-xl md:text-[#F8F4F0] p-5 mb-2" }
                >
                    {({isActive}) => (
                        <div className="md:flex md:flex-col md:items-center lg:flex-row  lg:w-full lg:pl-4">
                            <img 
                            src={isActive ? nav_overview_active :nav_overview} 
                            alt="navigation to overview icon"
                            className="md:mb-2 lg:mr-4 lg:mb-0" 
                            />
                            <p className="hidden md:flex md:text-xs md:font-bold md:text-center lg:text-base ">Overview</p>
                        </div>
                    
                    )}
                    
                </NavLink>

                <NavLink to="/transactions"  className={({ isActive }) => isActive? "flex flex-col justify-center items-center h-11 w-16 rounded-t-xl bg-[#F8F4F0] border-b-5 border-[#277C78] md:w-[104px] md:h-16  lg:w-[276px] lg:border-b-0 lg:border-l-5 lg:rounded-t-none lg:rounded-r-xl p-5 mb-2 ": "lg:w-[276px] lg:border-b-0  lg:rounded-t-none lg:rounded-r-xl md:text-[#F8F4F0] p-5 mb-2 "}>
                    {({isActive}) => (
                        <div className="md:flex md:flex-col md:items-center lg:flex-row  lg:w-full lg:pl-4">
                            <img 
                            src={isActive ? nav_transaction_active :nav_transaction} 
                            alt="navigation to overview icon"
                            className="md:mb-2 lg:mr-4 lg:mb-0" 
                            />
                            <p className="hidden md:flex md:text-xs md:font-bold md:text-center lg:text-base ">Transactions</p>
                        </div>
                    
                    )}
                </NavLink>

                <NavLink to="/budget" className={({ isActive }) => isActive? "flex flex-col justify-center items-center h-11 w-16 rounded-t-xl bg-[#F8F4F0] border-b-5 border-[#277C78] md:w-[104px] md:h-16  lg:w-[276px] lg:border-b-0 lg:border-l-5 lg:rounded-t-none lg:rounded-r-xl p-5 mb-2": "lg:w-[276px] lg:border-b-0  lg:rounded-t-none lg:rounded-r-xl md:text-[#F8F4F0] p-5 mb-2"}>
                    {({isActive}) => (
                        <div className="md:flex md:flex-col md:items-center lg:flex-row  lg:w-full lg:pl-4">
                            <img 
                            src={isActive ? nav_budget_active :nav_budget} 
                            alt="navigation to budget icon"
                            className="md:mb-2 lg:mr-4 lg:mb-0" 
                            />
                            <p className="hidden md:flex md:text-xs md:font-bold md:text-center lg:text-base ">Budget</p>
                        </div>
                    
                    )}
                    
                </NavLink>
                <NavLink to="/pots" className={({ isActive }) => isActive? "flex flex-col justify-center items-center h-11 w-16 rounded-t-xl bg-[#F8F4F0] border-b-5 border-[#277C78] md:w-[104px] md:h-16  lg:w-[276px] lg:border-b-0 lg:border-l-5 lg:rounded-t-none lg:rounded-r-xl p-5 mb-2": "lg:w-[276px] lg:border-b-0  lg:rounded-t-none lg:rounded-r-xl md:text-[#F8F4F0] p-5 mb-2"}>
                    {({isActive}) => (
                        <div className="md:flex md:flex-col md:items-center lg:flex-row  lg:w-full lg:pl-4">
                            <img src={isActive ? nav_pots_active : nav_pots} alt="navigation to pots icon" 
                            className="md:mb-2 lg:mr-4 lg:mb-0"  />
                            <p className="hidden md:flex md:text-xs md:font-bold md:text-center lg:text-base ">Budget</p> 
                        </div>
                    )}
                    
                </NavLink>
                <NavLink to='/recurring' className={({ isActive }) => isActive? "flex flex-col justify-center items-center h-11 w-16 rounded-t-xl bg-[#F8F4F0] border-b-5 border-[#277C78] md:w-[104px] md:h-16  lg:w-[276px] lg:border-b-0 lg:border-l-5 lg:rounded-t-none lg:rounded-r-xl p-5 mb-2": "lg:w-[276px] lg:border-b-0  lg:rounded-t-none lg:rounded-r-xl md:text-[#F8F4F0] p-5 mb-2"}>
                    {({isActive}) => (
                        <div className="md:flex md:flex-col md:items-center lg:flex-row  lg:w-full lg:pl-4">
                            <img src={isActive ? nav_recurring_active : nav_recurring} alt="navigation to pots icon" 
                            className="md:mb-2 lg:mr-4 lg:mb-0"  />
                            <p className="hidden md:flex md:text-xs md:font-bold md:text-center lg:text-base ">Reoccuring</p> 
                        </div>
                    )}
                    
                </NavLink>
            </div>
        </nav>
    )
}

export default Navigation;