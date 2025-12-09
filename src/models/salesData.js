// In-memory data store for sales data
let salesData = [];

const setSalesData = (data) => {
  salesData = data;
};

const getSalesData = () => {
  return salesData;
};

module.exports = {
  setSalesData,
  getSalesData,
};
