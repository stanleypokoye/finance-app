import icon_close from '../assets/images/icon-close-modal.svg'
import ThemeDropDown from './ThemeDropDown'

const AddBudgetModal = ({handleShowAddBudget, error, categories, maximumSpending, setMaximumSpending, showTheme, setShowTheme, budgetTheme, setBudgetTheme, budgetCategory, setBudgetCategory, handleSubmit, data, themeData }) => {


    return (
        <section>
             <div className="flex flex-row items-center justify-between my-4">
                    <h2 className="text-xl font-bold">Add New Budget</h2>
                    <img src={icon_close} alt="icon close" onClick={handleShowAddBudget}/>
                </div>
                <p className="text-gray-500 text-sm mb-4">Choose a category to set a spending budget. These categories can help you monitor spending</p>

                {error && <p className="text-red-500 text-center font-bold">{error}</p>}

                <label className="flex flex-col mb-4">
                    <span>Budget Category</span>
                    <select className="border border-black w-full py-2 px-4 rounded-md bg-white" onChange={(e) => setBudgetCategory(e.target.value)} value={budgetCategory}>
                        {categories.map((category, index) => (
                            
                            <option 
                                key={index} 
                                value={category}
                                
                            >
                                {category}
                            </option>
                        ))}
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
                    colorTheme={budgetTheme}
                    setColorTheme={setBudgetTheme}
                    themeData={themeData}
                />
                {!showTheme && <button className="bg-gray-900 text-white w-full mt-4 p-3 rounded-xl" onClick={handleSubmit}>Add Budget</button>}
                
        </section>
    )
}

export default AddBudgetModal;