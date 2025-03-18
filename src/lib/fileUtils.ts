
import { Category, Question } from "@/types/quiz";

export const parseCSV = (content: string): Question[] | Category[] => {
  try {
    // Divide o CSV em linhas e colunas
    const lines = content.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(value => value.trim());
      const item: Record<string, any> = {};
      
      headers.forEach((header, index) => {
        // Trata arrays (como opções) que estão no formato "[option1;option2;option3]"
        if (values[index]?.startsWith('[') && values[index]?.endsWith(']')) {
          const arrayStr = values[index].substring(1, values[index].length - 1);
          item[header] = arrayStr.split(';').map(val => val.trim());
        } 
        // Trata valores numéricos
        else if (!isNaN(Number(values[index]))) {
          item[header] = Number(values[index]);
        } 
        // Trata strings normais
        else {
          item[header] = values[index];
        }
      });
      
      result.push(item);
    }
    
    return result;
  } catch (error) {
    console.error("Erro ao processar CSV:", error);
    throw new Error("Formato de CSV inválido");
  }
};

export const parseJSON = (content: string): Question[] | Category[] => {
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error("Erro ao processar JSON:", error);
    throw new Error("Formato de JSON inválido");
  }
};

export const downloadJSON = (data: any, filename: string) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadCSV = (data: any[], filename: string) => {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item => {
    return Object.values(item).map(value => {
      if (Array.isArray(value)) {
        return `[${value.join(';')}]`;
      }
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    }).join(',');
  }).join('\n');
  
  const csvContent = `${headers}\n${rows}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
