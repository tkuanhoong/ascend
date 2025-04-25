export interface SortableListAreaProps<T> {
    items: T[];
    onReorder: (updateData: { id: string; position: number }[]) => void;
}

export interface SortableItemProps<T> {
    data: T;
}

export interface ItemProps<T>
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
    data?: T;
    id: string | undefined;
}