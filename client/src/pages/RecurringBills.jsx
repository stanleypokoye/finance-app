import React, { useState, useEffect } from 'react';
import recurring_icon from '../assets/images/icon-recurring-bills.svg';
import icon_due from '../assets/images/icon-bill-due.svg'
import icon_paid from '../assets/images/icon-bill-paid.svg'
import icon_sort from '../assets/images/icon-sort-mobile.svg'
import icon_down from '../assets/images/icon-caret-down.svg'


const RecurringBills = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Latest');
  const [uniqueRecurringBills, setUniqueRecurringBills] = useState([]);
  const [paidSummary, setPaidSummary] = useState({ count: 0, total: 0 });
  const [upcomingSummary, setUpcomingSummary] = useState({ count: 0, total: 0 });
  const [dueSoonSummary, setDueSoonSummary] = useState({ count: 0, total: 0 });
  const [isPaid, setIsPaid] = useState([]);
  const [isDue, setIsDue] = useState([])
  const [showSort, setShowSort] = useState(false)
  
  // Extract recurring transactions - moved outside useEffect to avoid re-calculation on every render
  const recurring = React.useMemo(() => {
    return data?.transactions?.filter(tx => tx.recurring === true) || [];
  }, [data]);
  
  // Calculate total recurring amount - moved outside useEffect 
  const totalRecurring = React.useMemo(() => {
    return recurring.reduce((sum, item) => sum + item.amount, 0);
  }, [recurring]);
  
  // Sort transactions based on selected option
  const sortTransactions = React.useCallback((items, option) => {
    switch(option) {
      case 'Latest':
        return [...items].sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'Oldest':
        return [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'A to Z':
        return [...items].sort((a, b) => a.name.localeCompare(b.name));
      case 'Z to A':
        return [...items].sort((a, b) => b.name.localeCompare(a.name));
      case 'Highest':
        return [...items].sort((a, b) => a.amount - b.amount);
      case 'Lowest':
        return [...items].sort((a, b) => b.amount - a.amount);
      default:
        return items;
    }
  }, []);
  
  // Process transactions - moved to useEffect with proper dependencies
  useEffect(() => {
    if (!recurring.length) return;
  
    const isValidDate = (date) => !isNaN(new Date(date).getTime());
    const dateAug = new Date(Date.UTC(2024, 7, 1)); // August 1, 2024, UTC
    const latestTransactionDate = new Date(Date.UTC(2024, 7, 19)); // August 19, 2024, UTC
  
    // Unique vendors
    const uniqueVendors = {};
    recurring.forEach(item => {
      if (!isValidDate(item.date)) return;
      const vendor = item.name;
      if (!uniqueVendors[vendor] || new Date(item.date) > new Date(uniqueVendors[vendor].date)) {
        uniqueVendors[vendor] = item;
      }
    });
    const uniqueRecurring = Object.values(uniqueVendors);
  
    // Paid transactions (August 2024, before August 19)
    const paid = recurring.filter(item => {
      const itemDate = new Date(item.date);
      return isValidDate(item.date) &&
             itemDate.getUTCMonth() === dateAug.getUTCMonth() &&
             itemDate.getUTCFullYear() === dateAug.getUTCFullYear() &&
             itemDate < latestTransactionDate;
    });
    setIsPaid(paid)
    const paidTotal = paid.reduce((sum, item) => sum + item.amount, 0);
    setPaidSummary({ count: paid.length, total: paidTotal });
  
    // Upcoming transactions (expected to recur in August after August 19)
    const upcoming = recurring.filter(item => {
      const itemDate = new Date(item.date);
      if (!isValidDate(item.date)) return false;
      const isJuly2024 = itemDate.getUTCMonth() === 6 && itemDate.getUTCFullYear() === 2024;
      const expectedDue = new Date(itemDate);
      expectedDue.setUTCMonth(expectedDue.getUTCMonth() + 1); // Monthly recurrence
      const hasAugustOccurrence = recurring.some(tx => {
        const txDate = new Date(tx.date);
        return isValidDate(tx.date) &&
               tx.name === item.name &&
               txDate.getUTCMonth() === 7 &&
               txDate.getUTCFullYear() === 2024;
      });
      return isJuly2024 &&
             !hasAugustOccurrence &&
             expectedDue >= latestTransactionDate;
    });
    
    const upcomingTotal = upcoming.reduce((sum, item) => sum + item.amount, 0);
    setUpcomingSummary({ count: upcoming.length, total: upcomingTotal });
  
    // Due soon transactions (expected to recur August 19–24)
    const dueSoon = recurring.filter(item => {
      const itemDate = new Date(item.date);
      if (!isValidDate(item.date)) return false;
      const isJuly2024 = itemDate.getUTCMonth() === 6 && itemDate.getUTCFullYear() === 2024;
      const expectedDue = new Date(itemDate);
      expectedDue.setUTCMonth(expectedDue.getUTCMonth() + 1); // Monthly recurrence
      const augustWindowStart = new Date(Date.UTC(2024, 7, 19)); // August 19, 2024
      const augustWindowEnd = new Date(augustWindowStart);
      augustWindowEnd.setUTCDate(augustWindowEnd.getUTCDate() + 5); // August 24, 2024
      const hasAugustOccurrence = recurring.some(tx => {
        const txDate = new Date(tx.date);
        return isValidDate(tx.date) &&
               tx.name === item.name &&
               txDate.getUTCMonth() === 7 &&
               txDate.getUTCFullYear() === 2024;
      });
      
      return isJuly2024 &&
             !hasAugustOccurrence &&
             expectedDue >= augustWindowStart &&
             expectedDue <= augustWindowEnd;
    });
    setIsDue(dueSoon)
    console.log("due", dueSoon)
    const dueSoonTotal = dueSoon.reduce((sum, item) => sum + item.amount, 0);
    setDueSoonSummary({ count: dueSoon.length, total: dueSoonTotal });
  
    // Search and sort
    const filtered = uniqueRecurring.filter(item =>
      isValidDate(item.date) && item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const sorted = sortTransactions(filtered, sortOption);
    setUniqueRecurringBills(sorted);
  }, [recurring, searchTerm, sortOption, sortTransactions]);
  
  // Format date to readable format
  const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return 'Invalid Date'; // Handle invalid dates

  const day = date.getUTCDate(); // Get day in UTC to match data's timezone

  // Add ordinal suffix
  const getOrdinalSuffix = (day) => {
        if (day >= 11 && day <= 13) return `${day}th`; // Special case for 11th, 12th, 13th
        const lastDigit = day % 10;
        switch (lastDigit) {
            case 1: return `${day}st`;
            case 2: return `${day}nd`;
            case 3: return `${day}rd`;
            default: return `${day}th`;
        }
        };

        return getOrdinalSuffix(day);
    };

    const hanleShowSort = () => {
        setShowSort(!showSort)
    } 
  
  return (
    <section className="bg-[#F8f4f0] min-h-screen w-full p-5 overflow-hidden md:p-10 lg:w-full lg:px-10 lg:pb-0  ">
      <h1 className='text-gray-900 font-bold text-[32px] mb-6'>Recurring Bills</h1>

      <div className='lg:flex lg:flex-row'>


      
      {/* Total Bills Card */}
      <article className='md:flex md:flex-row md:justify-between lg:flex-col lg:justify-start '>
            <div className='bg-black text-white flex flex-row items-center p-6 rounded-xl mb-6 md:w-[332px] md:flex-col md:items-start md:justify-between md:py-8'>
                <img src={recurring_icon} alt="" className='mr-6 ' />
                <div>
                <h2 className=''>Total Bills</h2>
                <h3 className='font-bold text-[32px]'>${Math.abs(totalRecurring).toFixed(2)}</h3>
                </div>
            </div>
            
            {/* Summary Cards */}
            <div className='bg-white p-6 mb-6 md:w-[332px]'>
                <h3 className='font-bold'>Summary</h3>
                {/* Paid Summary Card */}
                <div className='flex flex-row justify-between items-center border-b border-gray-300 py-4'>
                <h4 className=' text-xs text-gray-500'>Paid Bills</h4>
                <p className='font-bold text-sm'>{paidSummary.count} (${Math.abs(paidSummary.total).toFixed(2)})</p>
                </div>

                {/* Upcoming Summary Card */}
                <div className='flex flex-row justify-between items-center border-b border-gray-300 py-4'>
                <h4 className='text-xs text-gray-500'>Upcoming Bills</h4>
                <p className='font-bold text-sm'>{upcomingSummary.count}(${Math.abs(upcomingSummary.total).toFixed(2)})</p>
                </div>
                
                {/* Due Soon Summary Card */}
                <div className='flex flex-row justify-between items-center  py-4'>
                <h4 className='text-xs text-gray-500'>Due Soon</h4>
                <p className='font-bold text-sm text-red-500'>{dueSoonSummary.count}(${Math.abs(dueSoonSummary.total).toFixed(2)})</p>
                </div>
                
                
            </div>
        </article>
            
      
      
      
      {/* All Recurring Bills (Unique Vendors) */}
      <div className='bg-white rounded-xl p-6 md:p-10 lg:w-[699px] lg:ml-6'>
            <div className='flex flex-row md:flex-row justify-between items-center md:items-center mb-6 gap-4'>
                <div className='relative w-full md:w-64'>
                <input 
                    type="text" 
                    placeholder="Search bills" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg'
                />
                
                </div>
                
                <div className='relative'> 
                    <div className='md:flex md:flex-row md:justify-between md:items-center'>
                        <p className='hidden md:flex md:mr-3 md:text-sm'>Sort by</p>

                        <button onClick={hanleShowSort} className='md:flex md:flex-row md:border border-gray-500 rounded-lg p-2'>
                            <img src={icon_sort} alt="icon sort" className='md:hidden' />
                            <span className='hidden md:flex md:mr-3 md:text-sm'>{sortOption === 'Latest' ? "Latest" : sortOption }</span>
                            <img src={icon_down} alt="icon down" className='hidden md:flex'/>

                        </button>
                    </div>
                    
                    <ul className={`${showSort ? "flex absolute " : 'hidden'} flex-col -right-5 top-6 bg-white border text-sm w-20 border-black p-3 cursor-pointer rounded-xl z-20 md:w-32 md:top-12 `}>
                    {['Latest', 'Oldest', 'A to Z', 'Z to A', 'Highest', 'Lowest'].map(option => (
                        <li key={option} className='border-b border-gray-300 my-1'>
                            <button onClick={() => setSortOption(option)}>{option}</button>
                        </li>
                    ))}
                    
                    </ul>
                
                </div>
            </div>
        
        
        {uniqueRecurringBills.length > 0 ? (
          <div className='space-y-4 '>
            <div className=' hidden md:flex md:flex-row p-4 text-gray-500 text-xs' >
                    <h5 className='w-[320px]'>Bill Title</h5>
                    <h5 className='w-[240px]'>Due Date</h5>
                    <h5>Amount</h5>
                </div>
            {uniqueRecurringBills.map((item, index) => (
              <div key={index} className='flex justify-between items-center p-4 border-b border-gray-300 w-full'>
                
                
                <div className='w-full md:flex md:flex-row'>
                
                    <div className='flex flex-row items-center md:w-[340px]'>
                        <img src={item.avatar} alt="avatar" className='h-8 w-8 rounded-full mr-3' />
                        <h3 className='font-bold text-sm'>{item.name}</h3>

                    </div>
                  
                  <div className='flex flex-row justify-between items-center w-full md:w-[320px]'>
                        <div className='flex flex-row '>
                            <p className='text-green-700 text-xs mr-3'>Monthly-{formatDate(item.date)}</p>
                            {isPaid.some(tx => tx.name === item.name) ? (
                            <img src={icon_paid} alt="Paid" />
                            ) : isDue.some(tx => tx.name === item.name) ? (
                            <img src={icon_due} alt="Due" />
                            ) : null}
                        </div>
                        <span className='font-bold text-sm'>${Math.abs(item.amount).toFixed(2)}</span>      
                  </div>
                  
                </div>
               
                
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-500'>No recurring bills found</p>
        )}
      </div>
      </div>
    </section>
  );
};

export default RecurringBills;