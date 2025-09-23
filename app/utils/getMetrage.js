const getMetrage = (resultArray, typeColis) => {
  resultArray.forEach((item) => {
    for (const key in item) {
      if (typeColis.find((value) => value.name === key) && item[key] !== null && item[key] > 0) {
        item.metrage !== undefined 
        ? 
        item.metrage += `\n${typeColis.find((value) => key === value.name).designation} ${item[key]}` 
        : 
        item.metrage = `${typeColis.find((value) => key === value.name).designation} ${item[key]}`;
      } else if (key === 'AutrLarg1' && item[key] > 0){
        item.metrage !== undefined 
        ? 
        item.metrage += `\n${item.AutrLarg1}x${item.AutrLong1}: ${item.AutrQte1}` 
        : 
        item.metrage = `${item.AutrLarg1}x${item.AutrLong1}: ${item.AutrQte1}`;
      }
    }
  });
};

module.exports = getMetrage;