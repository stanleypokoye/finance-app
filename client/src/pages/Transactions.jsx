import icon_search from '../assets/images/icon-search.svg'
import icon_filter from '../assets/images/icon-filter-mobile.svg'
import icon_sort from '../assets/images/icon-sort-mobile.svg'
import icon_previous from '../assets/images/icon-caret-left.svg'
import icon_next from '../assets/images/icon-caret-right.svg'
import icon_down from '../assets/images/icon-caret-down.svg'
import { useEffect, useMemo, useState } from 'react'

const Transactions = ({data, activeCategory, setActiveCategory}) => {

    const transactions = useMemo(() => data?.transactions || [], [data])
    const [filteredTransaction, setFilteredTransaction] = useState(transactions);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');
    
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    //pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedtransaction, setPaginatedTransaction] = useState([])
    const [isWidthMedium, setIsWidthMedium] = useState(false)

    

    // get unique categories from the transaction data

    const categories = [ ...new Set(transactions?.map(t => t.category))].sort();

    //format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-Us', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const handleSortButton = () => {
        setShowSortMenu(!showSortMenu)
        setShowFilterMenu(false)
        setSortOption("")
        
    } 

    const handleFilterMenu = () => {
        setShowFilterMenu(!showFilterMenu)
        setShowSortMenu(false)
        setActiveCategory("")
    }

    const handleSearchInput = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleCategoryFilter = (category) => {
        setActiveCategory(category === activeCategory ? "" : category)
        setShowFilterMenu(false)
        setCurrentPage(1);
    }

    const handleSort = (option) => {
        setSortOption(option)
        setShowSortMenu(false);
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    //apply sortng and filtering when ever the states change
    useEffect(() => {
        let result = [...transactions]

        //apply search filter
        if(searchTerm) {
            result = result.filter(t =>
                t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (activeCategory) {
            result = result.filter(t => t.category === activeCategory);
        }

        switch(sortOption){
            case 'Latest':
                result.sort((a,b) => new Date(b.date) - new Date(a.date));
                break;
            case 'Oldest':
                result.sort((a,b) => new Date(a.date) - new Date(b.date));
                break;
            case 'A to Z' :
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'Z to A':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break
            case 'Highest':
                result.sort((a, b) => b.amount - a.amount);
                break;
            case 'Lowest':
                result.sort((a, b) => a.amount - b.amount);
                break;
            default:
                break
        }

        setFilteredTransaction(result)

    }, [searchTerm, activeCategory, sortOption, transactions])

    useEffect(() => {
        const indexOfLastTransaction = currentPage * 10;
        const indexOfFirstTransaction = indexOfLastTransaction - 10;
        const currentTransactions = filteredTransaction.slice(indexOfFirstTransaction, indexOfLastTransaction)
        setPaginatedTransaction(currentTransactions)
    }, [filteredTransaction, currentPage,])

    const totalPages = Math.ceil(filteredTransaction?.length/10)
    

    
    //creates a smart pagination range
    const getPaginationRange = () => {
        const range = [];
        const maxPagesToShow = 4;
        console.log("before", range)

        if (isWidthMedium) {

            for (let i = 1; i <= totalPages; i++) {
                range.push(i)}
        
        } else if (totalPages <= maxPagesToShow) {
            //if total pages is less tham max to show, just return all pages
            for (let i = 1; i <= totalPages; i++) {
                range.push(i)
            }
        } else {
            range.push(1); // Always show the first page
            
            
            // Show the ellipsis or intermediate pages
            if (currentPage > 2) {
                range.push('...');
            }
    
           
            if (currentPage > 1 && currentPage < totalPages){
                range.push(currentPage)
            }

            if (currentPage == 1){
                range.push(currentPage + 1)
            }

            if (currentPage == totalPages){
                range.push(totalPages - 1)
            }
    
            // Show the ellipsis if there are more pages on the right
            if (currentPage < totalPages - 2) {
                range.push('...');
            }
    
            range.push(totalPages); // Always show the last page
        }
    
        return range;
       

    

    }

    useEffect(() => {
        const checkWidth = () => {
            setIsWidthMedium(window.innerWidth >= 768)
        }

        //check width on mount
        checkWidth()

        //add event listener for window resize
        window.addEventListener('resize', checkWidth)

        return () => window.removeEventListener('resize', checkWidth)
    }, [])

    const paginationRange = getPaginationRange()


    return (
        <section className="bg-[#F8f4f0] min-h-screen w-full p-5 overflow-hidden md:p-10 lg:w-full lg:px-16 lg:pb-0  ">
            <h1 className="font-bold  text-[32px] md:mb-7">Transactions</h1>
            <article className='bg-white p-4 lg:px-8 rounded-xl'>
                <div className='flex flex-row items-center justify-between' >
                    <div className=' md:pt-3'>
                        <input 
                            className='border border-gray-600 rounded-md h-11 p-2  md:placeholder:truncate md:text-ellipsis md:w-40  md:px-8 lg:w-80' 
                            value={searchTerm} 
                            onChange={handleSearchInput}
                            placeholder='Search Transctions'
                        />
                        <img src={icon_search} alt="search icon" className='relative bottom-8 left-48 md:bottom-7 md:left-32 lg:left-72'/>

                    </div>

                    <div className='lg:ml-40'>
                      <div>
                            <button onClick={handleSortButton} className='md:flex md:flex-row md:items-center md:justify-between md:w-44 '>
                                <img src={icon_sort} alt="sort icon" className='md:hidden'/>
                                <label className='hidden md:flex'>Sort by</label>
                                <div className=' hidden md:flex md:flex-row md:items-center md:justify-between border border-gray-500 w-28 md:px-3 md:py-2 md:rounded-xl'>
                                    {sortOption === "" ? <p>Latest</p> : <p>{sortOption}</p>}
                                    <img src={icon_down} alt="caret down" className='ml-2 md:w-4 md:h-4'/>
                                </div>
                            </button>
                            <ul className={` absolute right-16 top-36 ${showSortMenu? "flex " : "hidden"} flex-col bg-white border text-sm w-20 border-black p-3 cursor-pointer rounded-xl z-20 md:top-48 md:right-80 md:w-40 lg:top-56`}>
                                {['Latest', 'Oldest', 'A to Z', 'Z to A', 'Highest', 'Lowest'].map(option => (
                                    <li key={option} className={`${sortOption === option? "font-bold":""} border-b border-gray-400 p-1`}>
                                        <button onClick={() => handleSort(option)}>{option}</button>
                                    </li>
                                    
                                ))}
                            </ul>
                      </div>

                    </div>

                    <div>
                        <button onClick={handleFilterMenu} className=' md:flex md:flex-row md:items-center  md:w-60'>
                            <img src={icon_filter} alt="filter icon"  className='flex md:hidden'/>
                            <label className='hidden md:flex md:mr-2'>Category</label>
                            <div className='hidden md:flex md:flex-row md:justify-between md:items-center border border-gray-500 w-full md:px-3 md:py-2 md:rounded-xl'>
                                {activeCategory === "" ? <p className='text-sm'>All Transactions</p> : <p className='text-sm'>{activeCategory}</p>}
                                <img src={icon_down} alt="caret down" className='ml-2 md:w-4 md:h-4'/>
                            </div>
                            

                        </button>
                        <ul className={` absolute right-6 top-36 ${showFilterMenu? "flex " : "hidden"} flex-col bg-white border text-sm  border-black p-3 cursor-pointer rounded-xl z-20 md:top-48 md:right-13 md:w-44 lg:top-56 lg:right-20`}>
                            {categories.map(category => (
                                <li key={category} className={`${activeCategory === category? "font-bold":""} border-b border-gray-400 p-1`}>
                                    <button onClick={() => handleCategoryFilter(category)}>
                                        {category}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    
                </div>

                <div className='mt-7'>
                    <div className='hidden md:flex md:flex-row md:justify-between md:w-full md:text-xs md:text-gray-500 md:pb-6 md:mb-6 md:border-b md:border-gray-300'>
                        <p className='md:w-[207px] lg:w-[400px]'>Recepient/Sender</p>
                        <p className=''>Category</p>
                        <p>Transaction Date</p>
                        <p className=' lg:w-[190px] lg:text-right'>Amount</p>
                    </div>
                    {paginatedtransaction.length > 0 && paginatedtransaction.map((transaction, index) => (
                        <div key={index} className='flex flex-row justify-between w-full h-11  border-b border-gray-200 pb-14 mb-2'>
                           <div className='flex flex-row '>
                            <img src={transaction.avatar} alt={transaction.name} className='h-8 w-8 rounded-full mr-3'/>
                                <div className='text-left md:flex md:flex-row   '>
                                    <p className='text-sm font-bold mb-0.5 md:w-[262px] lg:w-[430px]'>{transaction.name}</p>
                                    <p className='text-xs text'>{transaction.category}</p>
                                </div>
                           </div>

                            <div className='text-right md:flex md:flex-row-reverse'>
                                <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'} text-sm mb-0.5 md:w-40 lg:w-[280px]`}>{transaction.amount > 0 ? "+" : ""}{transaction.amount.toFixed(2)}</p>
                                <p className='text-xs text '>{formatDate(transaction.date)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    
                    <div>
                        
                        <nav className='flex flex-row w-full justify-between py-5'>
                            {/** previous button */}
                            <button 
                                onClick={() => currentPage > 1 && handlePageChange(currentPage-1)} disabled={currentPage === 1}
                                className={`flex flex-col justify-center items-center h-10 w-11 border border-gray-400 rounded-xl md:flex-row md:w-20 md:justify-between md:px-4`}>
                                <img src={icon_previous} alt="previous icon" />
                                {isWidthMedium && <p>Prev</p>}
                            </button>

                            <div className='flex flex-row'>
                            {/**rane of pagenumber */}
                            {paginationRange.map((pageNumber, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => pageNumber !== '...' && handlePageChange(pageNumber)} 
                                    disabled={pageNumber === '...'}
                                    className={`flex flex-col justify-center items-center h-10 w-11 border border-gray-400 rounded-xl mr-1 md:mr-2 ${pageNumber === currentPage ? "bg-gray-900 text-white" : ""}`}
                                >{pageNumber}</button>
                            ))}
                            </div>

                            {/** next button */} 
                            <button onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`flex flex-col justify-center items-center h-10 w-11 border border-gray-400 rounded-xl md:flex-row md:w-20 md:justify-between md:px-4`}>
                                {isWidthMedium && <p>Next</p>}
                                <img src={icon_next} alt="next icon" />
                                

                            </button>
                        </nav>
                    </div>
                )}
            </article>
        </section>
    )
}

export default Transactions;