import { useState } from 'react';
import icon_close from '../assets/images/icon-close-modal.svg'
import { updatePotTotal } from '../api/Api';


const WithdrawFromPot = ({pots, potId, handleCloseWithdrawFromPots, updatePotAndBalance }) => {


    const [amountToWithdraw, setAmountToWithdraw] = useState('');
    const [error, setError] = useState('')
    const pot = pots.find(pot => pot.id === potId)
  
    const total = Number(pot.total) || 0

    const action = 'withdraw';
    
    const newAmount = amountToWithdraw ? (total - parseFloat(amountToWithdraw)).toFixed(2) : total.toFixed(2)

    const handleInputChange = (e) => {
        const value = e.target.value;

        if (value === ''){
            setAmountToWithdraw('');
            setError('');
            return;
        }

        const numValue = parseFloat(value)
        if (isNaN(numValue)) {
            setError('Please enter a valid number')
        } else if (numValue < 0){
            setError("Amount cannot be a negative")
        } else if (numValue > total) {
            setError("insufficient amount in pot")

        }else {
            setError('')
            setAmountToWithdraw(value)
        }
    }

    const handleConfirmation = async () => {
        if(!amountToWithdraw || parseFloat(amountToWithdraw) <= 0) {
            setError("Please enter a valid amoout to add")
            return
        }

        
        try {
            const amount = parseFloat(amountToWithdraw);
            
            const response = await updatePotTotal(potId, action, amount);
  
            if (response && response.record && response.balance !== undefined) {
                // Explicitly convert values to ensure they're treated as numbers
                const updatedTotal = parseFloat(response.record.total);
                const updatedBalance = parseFloat(response.balance);
                
                
                updatePotAndBalance(potId, updatedTotal, updatedBalance);
                
                setAmountToWithdraw('');
                setError('');
                handleCloseWithdrawFromPots();
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
        <section>
          
                <article className="absolute z-30 p-4 bg-white rounded-xl w-[335px] md:right-28 md:w-[560px] lg:right-0 lg:bottom-0">
                    <div className='flex flex-row justify-between items-center my-6'>
                        <h2 className="bg-bold text-xl font-bold md:text-[32px]">Withdraw from  '{pot.name}'</h2>
                        <img src={icon_close} alt="icon close" onClick={handleCloseWithdrawFromPots}/>

                    </div>
                      
                    <p className='text-sm pr-4 mb-3 text-gray-500'>Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot.</p>
                    {error && <p>{error}</p>}
                    <div className='flex flex-row justify-between items-center my-4'>
                        <p className='text-sm text-gray-500'>New Amount</p>
                        <p className=' font-bold text-[32px] '>${newAmount  }</p>
                    </div>

                    <div className=" mb-8">
                        <div className="flex flex-row items-center bg-[#F8f4f0] p-1 rounded-2xl mb-3">
                            <div style={{backgroundColor: "black", width: `${newAmount/pot.target * 100}%`}} className="h-2 w-2 rounded-l-2xl mr-0.5"></div>

                            <div style={{backgroundColor: "red", width: `${amountToWithdraw/pot.target * 100}%`}} className="h-2 w-2 rounded-r-2xl"></div>

                        </div>
                        
                        <div className="flex flex-row justify-between items-center text-gray-500">
                            <p className={`font-bold ${!amountToWithdraw ? 'text-black' : 'text-red-600'}`}>
                                {total != null && newAmount <= pot.target? (newAmount/pot.target * 100).toFixed(2) : total != null &&  newAmount > pot.target ? "100" : "0.00"}%
                            </p>
                            <p>Target of {pot.target}</p>
                        </div>
                    </div>

                    <label className='relative'>
                        <span className='text-xs text-gray-500 font-bold  '>Amount to Withdraw</span>
                        <span className="absolute left-3 top-[38px] text-gray-500">$</span>
                        <input 
                            type="text" 
                            inputMode='numeric'
                            onChange={handleInputChange}
                            className='border border-gray-500 rounded-lg w-full py-2 px-6 mt-2'
                        />
                    </label>

                    <button className="w-full bg-gray-900 rounded-xl text-white p-3 my-4" onClick={handleConfirmation} disabled={!!error || !amountToWithdraw}>Confirm Withdrawal</button>
                </article>
            

        </section>
    )
}

export default WithdrawFromPot;