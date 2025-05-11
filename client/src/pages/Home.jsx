import { useState, useEffect } from "react";

import potIcon from '../assets/images/icon-pot.svg'
import DonutChart from "../components/DonutChart";

const Home = ({data}) => {

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(!data);
    }, [data]);


    const totalSaved = data.pots? data.pots.reduce((sum, pot) => sum + pot.total, 0) : 0;
    

    return (
        <section className="bg-[#F8f4f0] lg:w-full ">
            {isLoading? 
            <div>
                    <p>Loading...</p>
            </div> 
            
            :
            
            <div className="p-4 md:px-10 lg:grid lg:grid-cols-2 lg:gap-y-1  lg:gap-x-48 lg:content-between ">
                    <h1 className="text-3xl font-bold leading-8 mb-6 lg:col-span-2">Overview</h1>

                    <article className="md:flex md:flex-row  md:justify-between lg:col-span-2 ">
                        <div className="h-28 bg-black text-white rounded-2xl p-4 px-6 mb-3 lg:w-[337px] ">
                            <h2 className="text-sm mb-4">Current Balance</h2>
                            <p className="text-3xl font-bold leading-8 ">${data.balance?.current.toLocaleString(undefined, ({minimumFractionDigits: 2, maximumFractionDigits: 2}))}</p>
                        </div>

                        <div className="bg-white h-28 rounded-2xl p-4 px-6 mb-3 lg:w-[337px]">
                            <h2 className="text-sm mb-4">Income </h2>
                            <p className="text-3xl font-bold leading-8 ">${data.balance?.income.toLocaleString(undefined, ({minimumFractionDigits: 2, maximumFractionDigits: 2}))}</p>
                        </div>

                        <div className="bg-white h-28 rounded-2xl p-4 px-6 mb-3 lg:w-[337px]">
                            <h2 className="text-sm mb-4">Expenses</h2>
                            <p className="text-3xl font-bold leading-8 ">${data.balance?.expenses.toLocaleString(undefined, ({minimumFractionDigits: 2, maximumFractionDigits: 2}))}</p>

                        </div>
                    </article>

                    <article className="bg-white p-4 px-6 md:mb-7 lg:col-span-1 lg:w-[600px]  ">

                        <div className="flex flex-row justify-between w-full md:mb-7">
                            <h2 className="text-xl font-bold">Pots</h2>
                            <button className="text-sm text-gray-500">See Details</button>

                        </div>

                        <div className="md:flex md:flex-row md:justify-between">
                            <div className="flex flex-row items-center bg-[#F8f4f0] p-5 rounded-2xl my-4 md:w-60  ">
                                <img 
                                    src={potIcon} 
                                    alt="potIcon"
                                    className="mr-4"
                                />
                                <div >
                                    <h3 className="text-sm text-gray-500 mb-3">Total Saved</h3>
                                    <p className="text-3xl font-bold leading-8">${totalSaved.toLocaleString(undefined, ({minimumFractionDigits: 2, maximumFractionDigits: 2}))}</p>

                                </div>

                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 md:w-[357px] lg:w-[277px]">
                            
                                {data.pots?.map((potItem, index) => (
                                    <div key={index} className="flex flex-row">
                                        <div style={{ backgroundColor: potItem.theme}} className="h-11 w-1 mr-3"></div>
                                        <div>
                                            <p className="text-xs">{potItem.name}</p>
                                            <p className="text-sm font-bold">${potItem.total}</p>
                                        </div>
                                    
                                    </div>

                                ))}
                            </div>
                        </div>
                    </article>

                    <article className="bg-white p-4 px-6 mb-4 lg:col-span-1 lg:row-span-2 lg:w-[600px] lg:order-5 lg:mb-0">
                        <div className="flex flex-row justify-between w-full">
                            <h2 className="text-xl font-bold">Transactions </h2>
                            <button className="text-sm text-gray-500">See Details</button>

                        </div>
                        
                                {data.transactions?.slice(0, 5).map((transactionsItem, index) => (
                                        <div key={index} className="flex flex-row items-center justify-between  w-full border-b border-gray-200 py-4 px-2 ">
                                            <div className="flex flex-row items-center">
                                                <img src={transactionsItem.avatar} alt="avatar" className="h-8 w-8 rounded-full mr-2 md:mr-4"/>
                                                <p className="text-sm font-bold text-left">{transactionsItem.name}</p>

                                            </div>
                                            
                                            <div className="flex flex-col text-right ">
                                                <p className={`text-sm font-bold ${transactionsItem.amount > 0? 'text-green-500' : 'text-red-500'}`}>
                                                    {transactionsItem.amount > 0 ? '+' : ''}
                                                    {transactionsItem.amount.toLocaleString(undefined, ({minimumFractionDigits: 2, maximumFractionDigits: 2}))}
                                                </p>
                                                <p className="text-xs">{new Date(transactionsItem.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}</p>
                                            </div>
                                        </div>

                                ))}
                                

                    </article>

                    <article className="bg-white p-4 md:px-7 lg:col-span-1 lg:row-span-2 lg:order-4 lg:w-[428px] lg:h-[410px]">
                        <div className="flex flex-row justify-between w-full md:mb-7">
                            <h2 className="text-xl font-bold">Budgets </h2>
                            <button className="text-sm text-gray-500">See Details</button>

                        </div>
                        
                        <div className="md:flex  md:flex-row md:justify-between ">

                            <DonutChart data={data}/>
                            

                            <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                                {data.budgets?.map((budget, index) => (
                                    <div key={index} className="flex flex-row">
                                        <div style={{ backgroundColor: budget.theme}} className="h-11 w-1 mr-3"></div>
                                        <div>
                                            <p>{budget.category}</p>
                                            <p>${budget.maximum.toLocaleString(undefined, ({minimumFractionDigits: 2, maximumFractionDigits: 2}))}</p>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>

                    </article>

                    <article className="bg-white px-3 py-4 mt-5 rounded-xl lg:col-span-1 lg:row-span-2 lg:order-6 lg:-mt-10 lg:h-[327px] ">
                        <div className="flex flex-row justify-between w-full mb-5">
                            <h2 className="text-xl font-bold">Recurring Bills</h2>
                            <button className="text-sm text-gray-500">See Details</button>
                        </div>
                        {Object.entries((data.transactions || []).filter(tx => tx.recurring).reduce((acc, tx) => {
                            if (!acc[tx.category]){
                                acc[tx.category] = 0;
                            }

                            acc[tx.category] += tx.amount;
                            return acc;
                        }, {})).slice(0, 3).map(([category, totalAmount], index) =>(
                            <div key={index} className="">
                                <div className="flex flex-row items-center h-15 mb-5">
                                    <div className={`${Math.abs(totalAmount) > 150 ? 'bg-amber-400': Math.abs(totalAmount) > 100 ? 'bg-blue-800': Math.abs(totalAmount) > 50 ? 'bg-cyan-400' : 'bg-amber-800'} w-3 h-full rounded-l-xl `}></div>
                                    <div className="flex flex-row justify-between items-center bg-[#F8F4F0] rounded-xl w-full h-full relative z-10 right-2 px-6">
                                        <p className="text-gray-500">{category}</p>
                                        <p className="font-bold ">${Math.abs(totalAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                                    </div>
                                </div>

                            </div>

                        ))}
                    </article>



            </div>
            }
            
            
               
        </section>
    )
}

export default Home;