const getMedian = (values) => {
  // Validar que el array no esté vacío
  if (values.length === 0) {
    return undefined;
  }

  // Ordenar el array de menor a mayor
  values.sort((a, b) => a - b);

  // Calcular la posición del valor central
  const middleIndex = Math.floor((values.length - 1) / 2);

  // Si el array tiene un número impar de elementos, la mediana es el valor central
  if (values.length % 2 === 1) {
    return values[middleIndex];
  }

  // Si el array tiene un número par de elementos, la mediana es la media de los dos valores centrales
  return (values[middleIndex] + values[middleIndex + 1]) / 2;
}


export const calcMedian = (data) => {
  const median = {
    download: 0,
    upload: 0
  };

  const downloadValues = [];
  const uploadValues = [];

  data.forEach((item) => {
    downloadValues.push(Number(item.download));
    uploadValues.push(Number(item.upload));
  });

  median.download = getMedian(downloadValues);
  median.upload = getMedian(uploadValues);

  return median
};

export const calcAvg = (data) => {
  const avg = {
    download: 0,
    upload: 0
  };
  
  data.forEach((item) => {
    if (!isNaN(item.download)) avg.download += Number(item.download);
    if (!isNaN(item.upload)) avg.upload += Number(item.upload);
  });

  avg.download = avg.download / data.length;
  avg.upload = avg.upload / data.length;

  return avg;
};