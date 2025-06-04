import { EditableContext } from '@/context/editable-context';
import { useContext } from 'react';

const useIsEditable = () => {
    const context = useContext(EditableContext);

    return context;
};

export default useIsEditable;
