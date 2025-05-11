import { useState } from 'react';
import icon_close from '../assets/images/icon-close-modal.svg'
import { updatePotTotal } from '../api/Api';


const AddToPotModal = ({pots, potId, handleCloseAddToPots, updatePotAndBalance }) => {


    const [amountToAdd, setAmountToAdd] = useState('');
    const [error, setError] = useState('')
    const pot = pots.find(pot => pot.id === potId)
  
    const total = Number(pot.total) || 0

    const action = 'add';
    
    const newAmount = amountToAdd ? (total + parseFloat(amountToAdd)).toFixed(2) : total.toFixed(2)

    const handleInputChange = (e) => {
        const value = e.target.value;

        if (value === ''){
            setAmountToAdd('');
            setError('');
            return;
        }

        const numValue = parseFloat(value)
        if (isNaN(numValue)) {
            setError('Please enter a valid number')
        } else if (numValue < 0){
            setError("Amount cannot be a negative")
        } else {
            setError('')
            setAmountToAdd(value)
        }
    }

    const handleConfirmation = async () => {
        if(!amountToAdd || parseFloat(amountToAdd) <= 0) {
            setError("Please enter a valid amoout to add")
            return
        }

        
        try {
            const amount = parseFloat(amountToAdd);
            console.log(`Sending update: potId=${potId}, action=${action}, amount=${amount}`);
            const response = await updatePotTotal(potId, action, amount);
            console.log("Response received:", response);
            if (response && response.record && response.balance !== undefined) {
                // Explicitly convert values to ensure they're treated as numbers
                const updatedTotal = parseFloat(response.record.total);
                const updatedBalance = parseFloat(response.balance);
                
                console.log(`Updating pot: ${potId} with total: ${updatedTotal} and balance: ${updatedBalance}`);
                updatePotAndBalance(potId, updatedTotal, updatedBalance);
                
                setAmountToAdd('');
                setError('');
                handleCloseAddToPots();
              } else {
                setError("Received invalid response format");
                console.error("Invalid response format:", response);
              }
        } catch (error) {
            setError(error.message || "Failed to update pot");
            console.error("Error in handleConfirmation:", error);
        }
    };


    return (
        <section className='absolute md:right-28 z-30 lg:right-0'>
          
                <article className="p-5 bg-white rounded-xl w-[335px] md:w-[560px]">
                    <div className='flex flex-row justify-between items-center my-6'>
                        <h2 className="bg-bold text-xl font-bold md:text-[32px]">Add to {pot.name}</h2>
                        <img src={icon_close} alt="icon close" onClick={handleCloseAddToPots}/>

                    </div>
                      
                    <p className='text-sm pr-4 mb-3'>Add money to your pot to keep it separate rom your main account. As soon as you add this money, it will be deducted from your current account.</p>
                    {error && <p>{error}</p>}
                    <div className='flex flex-row justify-between items-center my-4'>
                        <p className='text-sm text-gray-500'>New Amount</p>
                        <p className=' font-bold text-[32px] '>${newAmount  }</p>
                    </div>

                    <div className=" mb-8">
                        <div className="flex flex-row items-center bg-[#F8f4f0] p-1 rounded-2xl mb-3">
                            <div style={{backgroundColor: "black", width: `${total/pot.target * 100}%`}} className="h-2 w-2 rounded-l-2xl mr-0.5"></div>

                            <div style={{backgroundColor: pot.theme, width: `${amountToAdd/pot.target * 100}%`}} className="h-2 w-2 rounded-r-2xl"></div>

                        </div>
                        
                        <div className="flex flex-row justify-between items-center text-gray-500">
                            <p style={{color: pot.theme}} className="font-bold">{total != null && newAmount <= pot.target? (newAmount/pot.target * 100).toFixed(2) : total != null &&  newAmount > pot.target ? "100" : "0.00"}%</p>
                            <p>Target of {pot.target}</p>
                        </div>
                    </div>

                    <label className='relative'>
                        <span>Amount to Add</span>
                        <span className="absolute left-3 top-[38px] text-gray-500">$</span>
                        <input type="text" onChange={handleInputChange} className='border border-gray-500 rounded-lg w-full py-2 px-6 mt-2' inputMode='numeric'/>
                    </label>

                    <button className="w-full bg-gray-900 rounded-xl text-white p-3 my-4" onClick={handleConfirmation}>Confirm Addition</button>
                </article>
            

        </section>
    )
}

export default AddToPotModal;