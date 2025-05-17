import { saveAs } from 'file-saver';

export const saveJsonFile = ({ url, fileName = "backup.json" }: { url: string, fileName: string }) => {
    saveAs(url, fileName);
}