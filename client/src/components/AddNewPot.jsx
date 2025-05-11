import icon_close from '../assets/images/icon-close-modal.svg'
import ThemeDropDown from './ThemeDropDown'
import { useState } from 'react'

const AddNewPot = ({handleShowAddPots,  potName, setPotName, potTarget, setPotTarget, potTheme, setPotTheme, showTheme, setShowTheme, themeData, error, handleSubmit}) => {

    const [charCount, setCharCount] = useState(potName.length)
    const maxChar = 30;


    const updateCharCount = (e) => {
        let currentLength = e.target.value.length;
        setCharCount(currentLength);
        setPotName(e.target.value)

    }

    return(
        <section className='bg-white p-4 rounded-2xl absolute z-20 bottom-72 sm:w-[320px] w-[370px] right-4 lg:right-64 lg:w-[560px] lg:top-10 lg:h-[469px]' >
             <div className="flex flex-row items-center justify-between my-4">
                    <h2 className="text-xl font-bold lg:text-[32px]">Add New Pot</h2>
                    <img src={icon_close} alt="icon close" onClick={handleShowAddPots}/>
                </div>
                <p className="text-gray-500 text-sm mb-4 text-left pr-5">Create a pot to set savings targets. These can help help you on track as you save for special purchases</p>

                {error && <p className="text-red-500 text-center font-bold">{error}</p>}

                <label className="flex flex-col mb-4">
                    <span>Pot Name</span>
                    <input 
                        className="border border-black w-full py-2 px-4 rounded-md bg-white" 
                        onChange={updateCharCount} 
                        value={potName}
                        maxLength="30"
                        
                        
                    />
                    <span id='charCount' className='text-xs text-gray-500 text-right'> {charCount} <span className=' md:hidden'>of {maxChar}</span> characters left</span>
                        
                
                </label>
                

                <label>
                    <span>Maximum Spending</span>
                    <input 
                        type="text" 
                        placeholder="$  e.g. 2000" 
                        className="px-4 border border-black w-full py-2 rounded-md mb-4" 
                        value={potTarget} 
                        onChange={(e) =>  {
                        const rawtext = e.target.value.replace(/[^\d.]/g, "")
                        setPotTarget("$" + rawtext)}}
                        
                    />
                </label>

                <ThemeDropDown 
                    themeData={themeData} 
                    showTheme={showTheme} 
                    setShowTheme={setShowTheme}
                    colorTheme={potTheme}
                    setColorTheme={setPotTheme}
                />
                {!showTheme && <button className="bg-gray-900 text-white w-full mt-4 p-3 rounded-xl" onClick={handleSubmit}>Add Pot</button>}
                
        </section>
    )
}

export default AddNewPot;