const EditAndDeleteModal = ({onClose, onEdit, onDelete, text }) => {

    return (
        <section className="text-sm text-center w-36 border border-black p-4 rounded-xl">
            <button className="text-gray-900 cursor-pointer" onClick={onEdit}>Edit {text}</button>
            <div className="bg-gray-200 w-full h-0.5 my-2"></div>
            <button className="text-red-600 cursor-pointer" onClick={onDelete}>Delete {text}</button>
        </section>
    )
}

export default EditAndDeleteModal;