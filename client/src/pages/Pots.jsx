import { useState } from "react"
import { useEffect } from "react"
import elipsis from '../assets/images/icon-ellipsis.svg'
import AddNewPot from "../components/AddNewPot"
import { addNewRecords, updateRecords, deleteRecords } from "../api/Api"
import EditPotModal from "../components/EditPotModal"
import DeleteModal from "../components/DeleteModal"
import EditAndDeleteModal from "../components/EditAndDeleteModal"
import AddToPotModal from "../components/AddToPotModal"
import WithdrawFromPot from "../components/WithdrawFromPot"


const Pots = ({data, showTheme, setShowTheme}) => {

    const [pots, setPots] = useState([]);
    const [showAddPots, setShowAddPots] = useState(false);
    const [showEditPots, setShowEditPots] = useState(false);
    const [potName, setPotName] = useState("");
    const [potTarget, setPotTarget] = useState("");
    const [potTheme, setPotTheme] = useState("");
    const potNames = pots.map(tx => tx.name)
    const [potId, setPotId] = useState("")
    const [error, setError] = useState("")
    const [showEditandDelete, setShowEditandDelete] = useState(false)
    const [activeEditPotId, setActiveEditPotId] = useState(null);
    const [showDeletePot, setShowDeletePot] = useState(false)
    const [showAddToPot, setShowAddToPot] = useState(false);
    const [showWithdrawFromPot, setShowWithdrawFromPot] = useState(false);
    
    useEffect(() => {
        if (data.pots){
            setPots([...data.pots])
        }
    }, [data.pots])

    const handleShowAddPots = () => {
        setShowAddPots(!showAddPots)
    }

    const addPot = async (newPot) => {
    
            try {
                const response = await addNewRecords({
                    type: 'pots',
                    name: newPot.potName,
                    target: newPot.target,
                    theme: newPot.potTheme
    
                })
    
                console.log("data", response)
    
                setPots( prev => [...prev, response])
                setPotName('');
                setPotTarget('$');
                setPotTheme('');
                setError("")
                setShowAddPots(false);
    
            } catch (error) {
                console.error('Failed to catch error', error)
            }
    
        }
    
    const handleSubmit = () => {
    
        const target = parseFloat(potTarget.replace("$", ""));
    
        if (!potName || !target || !potTheme){
            setError("Please fill all fields")
            return
        }
    
        if (potNames.includes(potName)){
            setError("Pot already exists")
            return
        }
        const newPot = {
    
            potName,
            target,
            potTheme
    
        }
    
        console.log("new Pot", newPot)
    
        addPot(newPot);
    }

    const handleShowEditPot = (tx) => {
        setShowEditPots(true)
        setPotName(tx.name)
        setPotTarget(tx.target)
        setPotTheme(tx.theme)
        setPotId(tx.id)
    }

    const editPot = async(id, newPot) => {
            try {
                const response = await updateRecords('pots', id, {
                    name: newPot.potName,
                    target: newPot.target,
                    theme: newPot.potTheme})
    
                setPots( prev => prev.map(pot => pot.id === id ?
                    {...pot, name:newPot.potName,
                        target: newPot.target,
                        theme: newPot.potTheme,
                        total: response.total || pot.total} : pot
                ))
                setPotName('');
                setPotTarget('$');
                setPotTheme('');
                setError("")
                setShowEditPots(false);
    
            }  catch (error) {
                console.error('Failed to catch error', error)
            }
    }
    
    const handleEditSubmit = () => {
    
        const target = parseFloat(potTarget.replace("$", ""));
    
        if (!potName || !target || !potTheme){
            setError("Please fill all fields")
            return
        }
    
        const otherPotNames = potNames.filter((_, index) => pots[index].id !== potId);
            if (otherPotNames.includes(potName)){
                setError("Pot name does not exists")
                return
        }
        const newPot = {
    
            potName,
            target,
            potTheme
    
        }
        console.log("Pot id", potId)
    
        editPot(potId, newPot);
            
    
    
    }
    
    const handleCloseEditPot = () => {
        setShowEditPots(false)
        setPotName('');
        setPotTarget('$');
        setPotTheme('');
        setError("")
    }

    const handleShowDeleteBudget = () => {
        setShowDeletePot(true)
    }
    
        
    
    const deletePot = async (id) => {
        try { await deleteRecords('pots', id)
            setPots(prev => prev.filter( pot => pot.id !== id))
            setShowDeletePot(false)
        } catch (error) {
            console.error('Failed to catch error', error)
        }
    }

    const handleShowAddToPot = (pot) => {
        setShowAddToPot(true);
        setPotId(pot.id)
    }

    const handleCloseAddToPots = () => {
        setShowAddToPot(false)
        setPotId(null)
    }

    const handleShowWithdrawFromPot = (pot) => {
        setShowWithdrawFromPot(true);
        setPotId(pot.id)
    }

    const handleCloseWithdrawfromPots = () => {
        setShowWithdrawFromPot(false)
        setPotId(null)
    }
    
   

    const updatePotAndBalance = (potId, newTotal) => {
        setPots(prev =>
            prev.map(pot =>
              pot.id === potId ? { ...pot, total: Number(newTotal) } : pot
            )
        );
          
    }

    
    
    return (
        <section  className="relative min-h-screen p-4 bg-[#F8f4f0] overflow-hidden lg:w-full md:p-10 ">
            <div className={`${(showAddPots || showEditPots || showAddToPot || showWithdrawFromPot || showDeletePot) ? "fixed inset-0 bg-black opacity-70 z-20" : ""}`}></div>
            <div className="flex flex-row justify-between  w-full">
                <h1 className="font-bold text-[32px]">Pots</h1>

                <button 
                    className=" text-sm text-white border border-gray-400 bg-gray-900 cursor-pointer rounded-xl py-2 px-4 mb-6 md:h-14" 
                    onClick={handleShowAddPots}
                > 
                    + Add New Pot
                </button>
            </div>
            <div className="lg:grid lg:grid-cols-2 lg:gap-6 ">
            {pots.map((pot, index) => (
                <div key={index} className="bg-white mb-4 rounded-2xl p-5 relative">
                    <div className="flex flex-row items-center justify-between my-6">
                        <div className="flex flex-row items-center">
                            <div className="w-3 h-3 rounded-full mr-4" style={{backgroundColor: pot.theme}}></div>
                            <p className="font-bold text-xl">{pot.name}</p>
                        </div>
                        <button 
                            className="cursor-pointer"
                            onClick={() => {
                                setActiveEditPotId(pot.id === activeEditPotId ? null : pot.id), setShowEditandDelete(!showEditandDelete)
                            }}
                        ><img src={elipsis} alt="" /></button>
                    </div>
                    {activeEditPotId === pot.id && showEditandDelete && !showDeletePot && !showEditPots && 
                            <div className="absolute right-7 z-20 bg-white">
                                <EditAndDeleteModal onEdit={() => handleShowEditPot(pot)} onDelete={() => handleShowDeleteBudget()} text={"Pot"}/>

                            </div>
                            }
                            {activeEditPotId === pot.id && showDeletePot && 
                            <div>
                                <DeleteModal  
                                    displayName={pot.name} 
                                    onDelete={() => deletePot(pot.id)}
                                    onClose={() => setShowDeletePot(false)}
                                    displayText={"Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever"}
                                />
                            </div>}
                            {activeEditPotId === pot.id && showEditPots && 
                            <EditPotModal handleCloseEditPot={handleCloseEditPot} potName={potName} setPotName={setPotName} potTarget={potTarget} setPotTarget={setPotTarget} potTheme={potTheme} setPotTheme={setPotTheme} themeData={pots} showTheme={showTheme} setShowTheme={setShowTheme}  handleEditSubmit={ handleEditSubmit}/>
                            }
                            {activeEditPotId === pot.id && showAddToPot && <AddToPotModal pots={pots} potId={potId} handleCloseAddToPots={handleCloseAddToPots} updatePotAndBalance={updatePotAndBalance}/>}
                            {activeEditPotId === pot.id && showWithdrawFromPot && <WithdrawFromPot  pots={pots} potId={potId} handleCloseWithdrawFromPots={handleCloseWithdrawfromPots} updatePotAndBalance={updatePotAndBalance}/>}

                    <div className="flex flex-row justify-between items-center mb-3">
                        <p className="text-gray-500 text-sm">Total Saved</p>
                        <p className="font-bold text-[32px]">
                            ${pot?.total != null ? Number(pot.total).toFixed(2) : '0.00'}
                        </p>

                    </div>
                    <div className="mb-8">
                        <div className="bg-[#F8f4f0] p-1 rounded-2xl mb-3">
                            <div style={{backgroundColor: pot.theme, width: `${pot.total/pot.target * 100}%`}} className="h-2 w-2 rounded-2xl"></div>

                        </div>
                        
                        <div className="flex flex-row justify-between items-center text-gray-500">
                            <p className="font-bold">{pot.total != null ? (pot.total/pot.target * 100).toFixed(2) : "0.00"}%</p>
                            <p>Target of {pot.target}</p>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center text-sm font-bold mb-4">
                        <button 
                            className="bg-[#F8f4f0] py-6 px-10 rounded-2xl md:w-full md:mr-2" 
                            onClick={() => {handleShowAddToPot(pot), setActiveEditPotId(pot.id)}}
                        > 
                            + Add Money
                        </button>
                        <button className="bg-[#F8f4f0] py-6 px-10 rounded-2xl md:w-full md:ml-2" onClick={() => {handleShowWithdrawFromPot(pot), setActiveEditPotId(pot.id)}}>Withdraw</button>
                    </div>
                </div>
                
            ))}
            </div>
            {showAddPots && <AddNewPot handleShowAddPots={handleShowAddPots} potName={potName} setPotName={setPotName} potTarget={potTarget} setPotTarget={setPotTarget} potTheme={potTheme} setPotTheme={setPotTheme} themeData={pots} showTheme={showTheme} setShowTheme={setShowTheme} handleSubmit={handleSubmit} error={error}/>}

            
            
            

        </section>
    )
}

export default Pots;