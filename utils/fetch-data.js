import Big from "big.js";

export const getProductsPrices = async (cookieHeader, productIds) => {
    console.time('dataFetch');
    const productFetches = productIds.map(productId => fetch(process.env.API, {
        headers: {
            "Accept": "*/*",
            "content-type": "application/json",
            "Cookie": cookieHeader,
        },
        body: `{"operationName":"getProductDetailsWithPrice","variables":{"itemEnabled":true,"locationIds":["266a52f4-0e7a-4729-bc6f-25c6ebaca111"],"retailItemEnabled":true,"targeted":true,"wicEnabled":false,"pickupLocationHasLocker":false,"productId":${productId},"storeId":1759},"query":"query getProductDetailsWithPrice($itemEnabled: Boolean = false, $locationIds: [ID!] = [], $retailItemEnabled: Boolean = false, $productId: Int!, $storeId: Int, $pickupLocationHasLocker: Boolean!, $targeted: Boolean = false, $wicEnabled: Boolean = false) {\\n  product(productId: $productId) {\\n    productId\\n    size\\n    productLockers @include(if: $pickupLocationHasLocker) {\\n      productLockerId\\n      pickupLocationId\\n      isLockerEligible\\n      __typename\\n    }\\n    couponProductV4(targeted: $targeted) {\\n      couponsV4 {\\n        couponId\\n        offerState\\n        __typename\\n      }\\n      __typename\\n    }\\n    item @include(if: $itemEnabled) {\\n      ...IItemFragment\\n      retailItems(locationIds: $locationIds) @include(if: $retailItemEnabled) {\\n        ...IRetailItemFragment\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  storeProducts(where: {productId: $productId, storeId: $storeId, isActive: true}) {\\n    storeProducts {\\n      storeProductId\\n      productId\\n      storeId\\n      onSale\\n      onFuelSaver\\n      isWeighted\\n      isAlcohol\\n      fuelSaver\\n      price\\n      priceMultiple\\n      basePrice\\n      basePriceMultiple\\n      isTagPriceLower\\n      department {\\n        departmentId\\n        __typename\\n      }\\n      storeProductDescriptions {\\n        type\\n        description\\n        __typename\\n      }\\n      subcategoryId\\n      departmentGroup {\\n        departmentGroupId\\n        linkPath\\n        name\\n        __typename\\n      }\\n      department {\\n        departmentId\\n        linkPath\\n        name\\n        __typename\\n      }\\n      category {\\n        categoryId\\n        departmentId\\n        linkPath\\n        name\\n        subcategories {\\n          subcategoryId\\n          linkPath\\n          name\\n          __typename\\n        }\\n        __typename\\n      }\\n      variations {\\n        name\\n        variationsAttributes {\\n          name\\n          variationsProducts {\\n            productId\\n            product {\\n              productId\\n              name\\n              __typename\\n            }\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment IRetailItemFragment on RetailItem {\\n  retailItemId\\n  basePrice\\n  basePriceQuantity\\n  soldByUnitOfMeasure {\\n    code\\n    name\\n    __typename\\n  }\\n  tagPrice\\n  tagPriceQuantity\\n  ecommerceTagPrice\\n  ecommerceTagPriceQuantity\\n  __typename\\n}\\n\\nfragment IWicItemFragment on WicItem {\\n  isCvb\\n  isBroadbandAllowed\\n  wicExchangeRate\\n  wicItemId\\n  wicSubcategory {\\n    categoryCode\\n    categoryDescription\\n    subcategoryCode\\n    subcategoryDescription\\n    unitOfMeasure\\n    isBroadbandSubcategory\\n    __typename\\n  }\\n  upcHyVee\\n  __typename\\n}\\n\\nfragment IItemFragment on Item {\\n  itemId\\n  description\\n  ecommerceStatus\\n  source\\n  images {\\n    imageId\\n    url\\n    isPrimaryImage\\n    __typename\\n  }\\n  source\\n  unitAverageWeight\\n  retailItems(locationIds: $locationIds) @include(if: $retailItemEnabled) {\\n    ...IRetailItemFragment\\n    __typename\\n  }\\n  WicItems(locationIds: $locationIds) @include(if: $wicEnabled) {\\n    ...IWicItemFragment\\n    __typename\\n  }\\n  __typename\\n}"}`,
        method: 'POST'
    }).then(response => response.json()));

    const products = await Promise.all(productFetches);

    let productDetails = [];

    let basketTotal = new Big(0);

    for (const product of products) {
        const productId = Number(product.data.product.productId);
        const description = product.data.product.item.description;
        const price = product.data.storeProducts.storeProducts[0].price;

        basketTotal = basketTotal.plus(price);

        productDetails.push({
            productId,
            description,
            price,
        });
    }

    productDetails.push({
        productId: 0,
        description: 'Basket Total',
        price: basketTotal.toFixed(2)
    });

    console.timeEnd('dataFetch');

    return productDetails;
};
