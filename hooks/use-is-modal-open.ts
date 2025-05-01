import { ModalContext } from '@/context';
import { useContext } from 'react';

const useIsModalOpen = () => {
    const context = useContext(ModalContext)

    return context;
};

export default useIsModalOpen;
