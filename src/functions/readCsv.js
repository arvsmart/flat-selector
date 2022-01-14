import Papa from "papaparse";

// for reading local file
async function fetchCsv() {
  const response = await fetch(
    `${process.env.PUBLIC_URL}/Inventory-Belair.csv`
  );
  console.log(response);
  const reader = response.body.getReader();
  const result = await reader.read();
  const decoder = new TextDecoder("utf-8");
  const csv = decoder.decode(result.value);
  return csv;
}

export const getJsonFromCsv = async (onLoad) => {
  Papa.parse(await fetchCsv(), {
    header: true,
    complete: (response) => {
      console.log(response);
      onLoad(response.data);
    },
  });
};
