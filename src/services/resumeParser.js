import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function parseResume(file) {
  const extension = file.name.split(".").pop().toLowerCase();
  if (extension === "pdf") {
    return await parsePdf(file);
  } else if (extension === "docx") {
    return await parseDocx(file);
  } else {
    throw new Error("Invalid file type. Please upload PDF or DOCX.");
  }
}

async function parsePdf(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let text = "";

        for (let i = 0; i < pdf.numPages; i++) {
          const page = await pdf.getPage(i + 1);
          const content = await page.getTextContent();
          text += content.items.map((item) => item.str).join(" ") + "\n";
        }
        resolve(extractFields(text));
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

async function parseDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return extractFields(result.value);
}

function extractFields(text) {
  const nameMatch = text.match(/([A-Z][a-z]+)/); // Simple name pattern
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
  const phoneMatch = text.match(/(\+?\d{1,4}[\s-]?)?(\d{10})/);
  for(let name of nameMatch){
    console.log(name);
  }
  return {
    name: nameMatch ? nameMatch[0] : null,
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
  };
}
