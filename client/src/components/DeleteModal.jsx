import icon_close from '../assets/images/icon-close-modal.svg'

const DeleteBudgetModal = ({onClose, onDelete, displayName, displayText}) => {

    return (
        <section className="bg-white p-4 border border-black rounded-xl absolute z-30 right-9 w-[335px] md:w-[560px] md:right-28 lg:right-0">
            <div className='flex flex-row items-center justify-between my-4'>
                <h2 className='text-xl md:text-[32px] font-bold'>Delete "{displayName}"</h2>
                <button>
                    <img src={icon_close} alt="icon close" onClick={onClose}/>
                </button>
            </div>
            <p className="text-gray-500 text-left ">{displayText}</p>
            
            <button className="text-white bg-red-600 cursor-pointer w-full p-2 rounded-xl my-3" onClick={onDelete}>Yes, Confirm Deletion</button>
            <button className="text-gray-500 cursor-pointer w-full p-2 rounded-xl" onClick={onClose}>No, I want to go back</button>
        </section>
    )
}

export default DeleteBudgetModal;