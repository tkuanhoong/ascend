import { generate } from '@pdfme/generator';
import template from '@/public/cert-template/template.json'

export interface CertInputProps {
  recipientName: string,
  courseName: string,
  identificationNo: string;
  date: Date;
}

export async function generateCertPDF({ recipientName, courseName, identificationNo, date }: CertInputProps) {
  const formattedDate = date.toLocaleDateString();
  const details = `Has completed the course "${courseName}" at ${formattedDate}`;
  const inputs = [{ recipientName, details, identificationNo }]
  await generate({ template, inputs }).then((pdf) => {

    // Browser
    const blob = new Blob([pdf], { type: 'application/pdf' });
    window.open(URL.createObjectURL(blob));
  });
}