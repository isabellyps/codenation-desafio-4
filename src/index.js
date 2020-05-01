const { products } = require("../src/data/products");
const promotions = ["SINGLE LOOK", "DOUBLE LOOK", "TRIPLE LOOK", "FULL LOOK"];
const REGULAR_PRICE = "REGULAR PRICE";

const filterProducts = (ids, productsList) => {
  return productsList.filter((product) => ids.includes(product.id));
};

function isSingleLook(categoriesCount, products) {
  let categoriesSelected = 0;
  for (category in categoriesCount) {
    if (categoriesCount[category] > 0) {
      categoriesSelected++;
    }
  }

  return categoriesSelected == 1 && products.length > 1;
}

function isDoubleLook(categoriesCount) {
  for (category in categoriesCount) {
    if (categoriesCount[category] == 2) {
      return true;
    }
  }

  return false;
}

function isTripleLook(categoriesCount) {
  for (category in categoriesCount) {
    if (categoriesCount[category] == 3) {
      return true;
    }
  }

  return false;
}

function isFullLook(categoriesCount) {
  let countHasFourOrMoreCategories = 0;
  for (category in categoriesCount) {
    if (categoriesCount[category] > 0) {
      countHasFourOrMoreCategories++;
    }
  }

  return countHasFourOrMoreCategories == 4;
}

function selectPromotions(products) {
  const filterCategory = products.map(function (item) {
    return item.category;
  });

  let categoriesCount = {
    "T-SHIRTS": 0,
    PANTS: 0,
    SHOES: 0,
    BAGS: 0,
  };

  filterCategory.forEach((category) => {
    categoriesCount[category]++;
  });

  const singleLook = isSingleLook(categoriesCount, products);
  const doubleLook = isDoubleLook(categoriesCount);
  const tripleLook = isTripleLook(categoriesCount);
  const fullLook = isFullLook(categoriesCount);

  if (fullLook) {
    return promotions[3];
  } else if (tripleLook) {
    return promotions[2];
  } else if (doubleLook) {
    return promotions[1];
  } else if (singleLook) {
    return promotions[0];
  } else {
    return REGULAR_PRICE;
  }
}

function sumTotalPrice(products, promotion) {
  const productsInfo = products.map(function (product) {
    if (promotion == REGULAR_PRICE) {
      let productInfo = {
        regularPrice: product.regularPrice,
        promotionPrice: 0,
      };

      return productInfo;
    }

    let productInfo = null;

    product.promotions.forEach((element) => {
      if (element.looks.includes(promotion)) {
        productInfo = {
          regularPrice: product.regularPrice,
          promotionPrice: element.price,
        };
      }
    });

    if (productInfo == null) {
      productInfo = {
        regularPrice: product.regularPrice,
        promotionPrice: product.regularPrice,
      };
    }

    return productInfo;
  });

  const calcRegularPrice = productsInfo
    .map((item) => item.regularPrice)
    .reduce(function (total, price) {
      return total + price;
    });

  const calcPromotionPrice = productsInfo
    .map((item) => item.promotionPrice)
    .reduce(function (total, price) {
      return total + price;
    });

  const totalRegularPrice = calcRegularPrice.toFixed(2);
  const totalPromotionPrice = calcPromotionPrice.toFixed(2);

  const calcDiscount = totalRegularPrice - totalPromotionPrice;
  const totalDiscount = calcDiscount.toFixed(2);

  const calcPerDiscount =
    totalPromotionPrice > 0
      ? ((totalRegularPrice - totalPromotionPrice) / totalRegularPrice) * 100
      : 0;

  const perDiscount = calcPerDiscount.toFixed(2);

  const calc = {
    totalPrice:
      totalPromotionPrice > 0 ? totalPromotionPrice : totalRegularPrice,
    discountValue: totalPromotionPrice > 0 ? totalDiscount : 0,
    discount: `${perDiscount}%`,
  };

  return calc;
}

function criateProductsCart(products, promotion) {
  const filterProducts = products.map(function (product) {
    return { name: product.name, category: product.category };
  });

  const calcCart = sumTotalPrice(products, promotion);

  const info = {
    products: filterProducts,
    promotion: promotion,
    totalPrice: calcCart.totalPrice,
    discountValue: calcCart.discountValue,
    discount: calcCart.discount,
  };

  return info;
}

function getShoppingCart(ids, productsList) {
  const productsFiltered = filterProducts(ids, productsList);
  const activePromotion = selectPromotions(productsFiltered);
  const totalProductsCart = criateProductsCart(productsFiltered, activePromotion);
  return totalProductsCart;
}

module.exports = { getShoppingCart };
