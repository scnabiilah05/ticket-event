export const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};5

export const formatPriceFromString = (priceString) => {
  // Convert the string to a number
  const price = Number(priceString);
  // Check if the conversion was successful
  if (isNaN(price)) {
    return null;
  }
  // Format the price using the existing formatPrice function
  return formatPrice(price);
};



