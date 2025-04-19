import { useState, createContext, useContext } from 'react';


const useIsModalOpen = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const ModalOpenContext = createContext({
        isModalOpen,
        setIsModalOpen
    })

    return useContext(ModalOpenContext);
};

export default useIsModalOpen;
