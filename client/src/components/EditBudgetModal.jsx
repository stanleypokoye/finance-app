import icon_close from '../assets/images/icon-close-modal.svg'
import ThemeDropDown from './ThemeDropDown'

const EditBudgetModal = ({handleCloseEditBudget, error, budgetCategory,  maximumSpending, setMaximumSpending, data, showTheme, setShowTheme, budgetTheme, setBudgetTheme, handleEditBudget}) => {

    return (
        <section className='bg-white'>
            <div className="flex flex-row items-center justify-between my-4">
                <h2 className="text-xl font-bold">Edit Budget</h2>
                <img src={icon_close} alt="icon close" onClick={handleCloseEditBudget}/>
            </div>
            <p className="text-gray-500 text-sm mb-4">As your budget chnages feel free to update your spending limits</p>

            {error && <p className="text-red-500 text-center font-bold">{error}</p>}

            <label className="flex flex-col mb-4">
                <span>Budget Category</span>
                <select 
                        className="border border-black w-full py-2 px-4 rounded-md bg-white" 
                        defaultValue={budgetCategory}
                    >
                    <option defaultValue={budgetCategory}>{budgetCategory}</option>
                </select>
            </label>
            

            <label>
                <span>Maximum Spending</span>
                <input 
                    type="text" 
                    placeholder="$  e.g. 2000" 
                    className="px-4 border border-black w-full py-2 rounded-md mb-4" 
                    value={maximumSpending} 
                    onChange={(e) =>  {
                    const rawtext = e.target.value.replace(/[^\d.]/g, "")
                    setMaximumSpending("$" + rawtext)}}
                    
                />
            </label>

            <ThemeDropDown 
                data={data} 
                showTheme={showTheme} 
                setShowTheme={setShowTheme}
                budgetTheme={budgetTheme}
                setBudgetTheme={setBudgetTheme}
            />
            {!showTheme && <button className="bg-gray-900 text-white w-full mt-4 p-3 rounded-xl" onClick={handleEditBudget}>Save changes</button>}
           
        </section>
    )
}

export default EditBudgetModal;