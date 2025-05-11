import { useEffect, useState } from "react";
import ThemeDropDown from "../components/ThemeDropDown";

import caret_right from '../assets/images/icon-caret-right.svg'
import elipsis from '../assets/images/icon-ellipsis.svg'
import DonutChart from "../components/DonutChart";
import { addNewRecords, deleteRecords, updateRecords } from "../api/Api";
import { useNavigate } from "react-router-dom";
import AddBudgetModal from "../components/AddBudgetModal";
import EditBudgetModal from "../components/EditBudgetModal";
import EditAndDeleteModal from "../components/EditAndDeleteModal";
import DeleteModal from "../components/DeleteModal";

const Budget = ({data, setActiveCategory, showTheme, setShowTheme}) => {


    const navigate = useNavigate()
    const transactions = data.transactions || []
    const [budgets, setBudgets] = useState([])

    useEffect(() => {
        if (data.budgets){
            setBudgets([...data.budgets])
        }
    }, [data.budgets])

    const [showAddBudgets, setShowAddBudgets] = useState(false)
    const categories = [...new Set(data.transactions?.map(items => items.category))].sort()
    const budgetCategories = budgets.map(tx => tx.category)
    const [maximumSpending, setMaximumSpending] = useState("")
    const [budgetCategory, setBudgetCategory] = useState("")
    const [budgetTheme, setBudgetTheme] = useState("")
    const [error, setError]  = useState("")
    const [budgetId, setBudgetId] = useState("")
    const [showEditBudget, setShowEditBudget] = useState(false)
    const [activeEditBudgetId, setActiveEditBudgetId] = useState("null")
    const [showDeleteBudget, setShowDeleteBudget] = useState(false)

    

    

    const handleShowAddBudget = () => {
        setShowAddBudgets(!showAddBudgets)
        setBudgetCategory('');
        setMaximumSpending('$');
        setBudgetTheme('');
        setError("")
    }

    const totalbudgetSpend = transactions.filter(tx => budgets.some(budget => budget.category === tx.category)).reduce((sum, tx) => sum + tx.amount, 0)
    
    const budgetLimit = budgets.reduce((sum, budget) => sum + budget.maximum, 0)
    console.log("sum of ",budgetLimit)



    const addBudget = async (newBudget) => {

        try {
            const response = await addNewRecords({
                type: 'budget',
                category: newBudget.budgetCategory,
                maximum: newBudget.maximum,
                theme: newBudget.budgetTheme

            })

            console.log("data", response)

            setBudgets( prev => [...prev, response])
            setBudgetCategory('');
            setMaximumSpending('$');
            setBudgetTheme('');
            setError("")
            setShowAddBudgets(false);

        } catch (error) {
            console.error('Failed to catch error', error)
        }

    }

    const handleSubmit = () => {

        const maximum = parseFloat(maximumSpending.replace("$", ""));

        if (!budgetCategory || !maximum || !budgetTheme){
            setError("Please fill all fields")
            return
        }

        if (budgetCategories.includes(budgetCategory)){
            setError("Budget already exists")
            return
        }
        const newBudget = {

            budgetCategory,
            maximum,
            budgetTheme

        }

        console.log("new budget", newBudget)

        addBudget(newBudget);
    }

    const handleSeeAll = () => {
        navigate("/transactions")
        

    }

    const handleShowEditBudget = (tx) => {
        setShowEditBudget(true)
        setBudgetCategory(tx.category)
        setMaximumSpending(tx.maximum)
        setBudgetTheme(tx.theme)
        setBudgetId(tx.id)
    }

    const handleShowDeleteBudget = () => {
        setShowDeleteBudget(true)
    }

    

    const deleteBudget = async (id) => {
        try { await deleteRecords('budgets', id)
            setBudgets(prev => prev.filter(budget => budget.id !== id))
            setShowDeleteBudget(false)
        } catch (error) {
            console.error('Failed to catch error', error)
        }
    }


    const editBudget = async(id, newBudget) => {
        try {
            await updateRecords('budgets', id, {
                category: newBudget.budgetCategory,
                maximum: newBudget.maximum,
                theme: newBudget.budgetTheme})

            setBudgets( prev => prev.map( budget => budget.id === id ? {...budget, category: newBudget.budgetCategory, maximum: newBudget.maximum, theme: newBudget.budgetTheme} : budget))
            setBudgetCategory('');
            setMaximumSpending('$');
            setBudgetTheme('');
            setShowEditBudget(false);
            setError("")

        }  catch (error) {
            console.error('Failed to catch error', error)
        }
    }

    const handleEditSubmit = () => {

        const maximum = parseFloat(maximumSpending.replace("$", ""));

        if (!budgetCategory || !maximum || !budgetTheme){
            setError("Please fill all fields")
            return
        }

        const otherBudgetCategory = budgetCategories.filter((_, index ) =>  budgets[index].id !== budgetId)
        if (!otherBudgetCategory.includes(budgetCategory)){
            setError("Budget does not exists")
            return
        }
        const newBudget = {

            budgetCategory,
            maximum,
            budgetTheme

        }
        console.log("budget id", budgetId)

        editBudget(budgetId, newBudget);
        


    }

    const handleCloseEditBudget = () => {
        setShowEditBudget(false)
        setBudgetCategory('');
        setMaximumSpending('$');
        setBudgetTheme('');
        setError("")
    }
    

   

    return (
        <section className=" min-h-screen p-4 bg-[#F8f4f0] overflow-hidden lg:w-full">
            <div className={`${(showAddBudgets || showEditBudget) ? "fixed inset-0 bg-black opacity-70 z-20" : ""}`}></div>
            <div className="flex flex-row justify-between  w-full">
                <h1 className="font-bold text-[32px]">Budgets</h1>

                <button 
                    className=" text-sm text-white border border-gray-400 bg-gray-900 cursor-pointer rounded-xl py-2 px-4 mb-6 md:h-14" 
                    onClick={handleShowAddBudget}
                > 
                    + Add New Budget
                </button>
            </div>

            <div className="lg:flex lg:flex-row lg:justify-between lg:w-full lg:px-6 ">
                <article className="flex flex-col items-center w-full bg-white py-4 mb-8 rounded-2xl px-2 md:flex-row md:px-6 lg:mb-0 lg:w-[428px] lg:h-full lg:flex-col lg:mt-4">
                    <div className=""> 
                        <DonutChart data={data}/>
                        <div className="flex flex-col items-center  relative bottom-44">
                            <p className="text-[32px] font-bold">${Math.abs(totalbudgetSpend).toFixed(0)}</p>
                            <p className="text-xs">of ${budgetLimit} limit</p>
                            
                        </div>

                    </div>
                
                    <div className="flex flex-col   w-full -mt-16 md:-mt-10">
                        <h2 className="text-xl font-bold mb-4 px-2">Spending summary</h2>
                        {budgets.map( budget => {
                            const spending = transactions
                                .filter(tx => tx.category === budget.category)
                                .reduce((sum, tx) => sum + tx.amount, 0)

                            const totalSpent = Math.abs(spending)
                            return {
                                ...budget,
                                totalSpent: totalSpent ? totalSpent.toFixed(0) : null,
                            }
                        
                        })
                        .sort((a,b) => b.totalSpent - a.totalSpent) //sort by total spent decending
                        .map((budget, index) => (
                            <div key={index} className="flex flex-row items-center w-full p-3 border-b border-gray-300 md:mb-4">
                                <div style={{ backgroundColor: budget.theme}} className="h-5 rounded-full w-1 mr-3"></div>
                                <div className="flex flex-row items-center justify-between w-full">
                                    <p className="w-36 ">{budget.category}</p>
                                    <div className="flex flex-row items-center text-right">
                                        <p className="font-bold">${budget.totalSpent}</p>
                                        <p className="text-xs ml-2">of ${budget.maximum.toLocaleString(undefined, {
                                            minimumFractionDigits: 2, 
                                            maximumFractionDigits: 2
                                        })}</p>
                                    </div>
                                </div>
                            </div>

                        ))}
                    
                    </div>
                </article>

                <article className=" py-4 lg:w-[606px] lg:py-0">
                    {transactions.map(tx => {
                        const matchingBudget = budgets.find(budget => budget.category === tx.category)
                        return {
                            ...tx,
                            budgetcategory: matchingBudget? matchingBudget.category: null,
                            maximum: matchingBudget ? matchingBudget.maximum : null,
                            theme: matchingBudget ? matchingBudget.theme : null,
                            id: matchingBudget ? matchingBudget.id : null
                        }
                    })
                    .filter((tx, index, self) => 
                        tx.budgetcategory &&
                        index === self.findIndex(t => t.budgetcategory === tx.budgetcategory)
                    )
                    .map(tx => {
                        const totalSpent = transactions
                            .filter( t => t.category === tx.budgetcategory)
                            .reduce((sum, t) => sum + t.amount, 0)

                        const spendingPercentage = tx.maximum ? Math.min((Math.abs(totalSpent)/tx.maximum) * 100, 100) : 0;
                        const freeCash = tx.maximum - Math.abs(totalSpent) 
                        const freeAmount = freeCash > 0 ? freeCash : 0
                        

                        return {
                            ...tx,
                            totalSpent: totalSpent ? totalSpent : null,
                            spendingPercentage: spendingPercentage ? spendingPercentage : null,
                            freeAmount: freeAmount
                        }

                    })
                    .map((tx, index) => (

                        
                        <div key={index} className="my-4 bg-white rounded-xl p-4 ">
                            <div className="flex flex-row justify-between  items-center mb-3">
                                <div className="flex flex-row">
                                    <div style={{backgroundColor: tx.theme}} className="w-4 h-4 rounded-full mr-4"></div>
                                    <h2 className="text-xl font-bold">{tx.budgetcategory}</h2>
                                </div>
                                <button 
                                    className="cursor-pointer"  
                                    onClick={() => {
                                        setActiveEditBudgetId(tx.id === activeEditBudgetId ? null : tx.id)
                                    }}>
                                    <img src={elipsis} alt="ellipsis image" />

                                </button>
                                
                            </div>
                            {activeEditBudgetId === tx.id && 
                            <div className="absolute right-7 z-20 bg-white">
                                <EditAndDeleteModal onEdit={() => handleShowEditBudget(tx)} onDelete={() => handleShowDeleteBudget()} text={"Budget"}/>

                            </div>
                            }
                            {activeEditBudgetId === tx.id && showDeleteBudget && 
                            <div>
                                <DeleteModal  
                                    DisplayName={tx.budgetcategory} 
                                    onDelete={() => deleteBudget(tx.id)}
                                    onClose={() => setShowDeleteBudget(false)}
                                    DisplayText = {"Are you sure you want to delete this budget? This action cannot be reversed and all the data inside will be removed forever"}
                                />
                            </div>}
                            {activeEditBudgetId === tx.id && showEditBudget &&
                            <div className="absolute  right-5 flex flex-col rounded-2xl bg-white w-[310px] h-[470px] z-20 p-2">
                                 <EditBudgetModal handleCloseEditBudget={handleCloseEditBudget} error={error} budgetCategory={budgetCategory} maximumSpending={maximumSpending} setMaximumSpending={setMaximumSpending} data={data} showTheme={showTheme} setShowTheme={setShowTheme} budgetTheme={budgetTheme} setBudgetTheme={setBudgetTheme} handleEditBudget={handleEditSubmit}/>
                                 </div>}
                            <p>Maximum of ${tx.maximum} </p>
                            <div className="my-4 bg-[#F8f4f0] p-1.5 rounded-md">
                                <div style={{ backgroundColor: tx.theme, width: `${tx.spendingPercentage}%`}} className="h-4">
                                    
                                </div>
                            </div>
                            <div>
                                <div className="flex flex-row" >

                                    <div className="border-l-4  w-36 rounded-xs px-4 md:w-96" style={{borderColor: tx.theme}}>
                                        <h3>Spent</h3>
                                        <p>${Math.abs(tx.totalSpent).toFixed(0)}</p>
                                    </div>

                                
                                    <div className="border-l-4 w-36 rounded-xs border-[#F8f4f0] px-2">
                                        <h3>Free</h3>
                                        <p>${tx.freeAmount.toFixed(0)}</p>
                                    </div>
                                </div>
                                
                            </div>

                            <div className="bg-[#F8f4f0]  rounded-lg p-3 my-4">
                                <div className="flex flex-row justify-between mb-3">
                                    <h3 className="font-bold">Latest Spending</h3>

                                    <button 
                                        className="flex flex-row justify-between items-center w-16 text-sm cursor-pointer" 
                                        onClick={() => {handleSeeAll(), setActiveCategory(tx.budgetcategory)}}
                                    >
                                        See all
                                        
                                        <img src={caret_right} alt="" className="w-4 h-4"/>
                                    </button>
                                </div>
                                <div className="space-y-3 ">
                                    {transactions
                                    .filter(t => t.category === tx.budgetcategory)
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .slice(0, 3) // Get the 3 most recent transactions for this category
                                    .map((transaction, idx) => (
                                        <div key={idx} className="flex justify-between border-b border-gray-300  pb-2">
                                            <div className="md:flex md:items-center">
                                                <img src={transaction.avatar} alt="" className="hidden md:flex w-8 h-8 rounded-full mr-3"/>
                                                <p className="font-bold text-xs">{transaction.name}</p>
                                            </div>
                                            <div className="text-right mb-3">
                                                <p className="font-medium text-xs">${Math.abs(transaction.amount).toFixed(2)}</p>
                                                <p className=" text-gray-500 text-xs">{new Date(transaction.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: '2-digit',
                                                })}</p> 
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>

                        </div>
                        
                    ))}
                </article>
            </div>

            <div className={`w-80 p-4 ${showAddBudgets ? " absolute bottom-56 xs:bottom-68 xs:right-7 right-5 flex flex-col rounded-2xl bg-white w-1/2 h-[470px] z-20 border border-black" : "hidden"}`}>
                
                <AddBudgetModal handleShowAddBudget={handleShowAddBudget} error={error} categories={categories} maximumSpending={maximumSpending} setMaximumSpending={setMaximumSpending} showTheme={showTheme} setShowTheme={setShowTheme} budgetTheme={budgetTheme} setBudgetTheme={setBudgetTheme} budgetCategory={budgetCategory} setBudgetCategory={setBudgetCategory} handleSubmit={handleSubmit} data={data} themeData={budgets}/> 

                
            </div>
            

    

            
        </section>
    )

}

export default Budget;