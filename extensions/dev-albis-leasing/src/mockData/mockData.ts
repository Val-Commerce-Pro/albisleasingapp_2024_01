// export const cartItemIni = {
//   token: "Z2NwLXVzLWNlbnRyYWwxOjAxSFNHNDFRRzNUUjBDQUUyWEQ2Nks2RUtW",
//   currency: "EUR",
//   item_count: 7,
//   total_price: 876175,
//   items: [
//     {
//       discounted_price: 88595,
//       final_price: 88595,
//       handle: "the-videographer-snowboard",
//       id: 47831615996224,
//       image:
//         "https://cdn.shopify.com/s/files/1/0860/1423/0848/files/Main.jpg?v=1707135789",
//       key: "47831615996224:546a9f13ea72c2016cd50ec70c5b300c",
//       line_price: 88595,
//       product_id: 9051247214912,
//       product_title: "The Videographer Snowboard",
//       quantity: 1,
//       title: "The Videographer Snowboard",
//       url: "/products/the-videographer-snowboard?variant=47831615996224",
//       variant_id: 47831615996224,
//     },
//   ],
// };

export type CartItem = {
  discounted_price: number;
  final_price: number;
  handle: string;
  id: number;
  image: string;
  key: string;
  line_price: number;
  product_id: number;
  product_title: string;
  quantity: 1;
  title: string;
  url: string;
  variant_id: number;
};

export type CartItemsData = {
  token: string;
  currency: string;
  item_count: number;
  total_price: number;
  items: CartItem[];
};

export const mockCartItems = {
  token: "Z2NwLXVzLWNlbnRyYWwxOjAxSFNHNDFRRzNUUjBDQUUyWEQ2Nks2RUtW",
  currency: "EUR",
  item_count: 7,
  total_price: 876175,
  items: [
    {
      discounted_price: 88595,
      final_price: 88595,
      handle: "the-videographer-snowboard",
      id: 47831615996224,
      image:
        "https://cdn.shopify.com/s/files/1/0860/1423/0848/files/Main.jpg?v=1707135789",
      key: "47831615996224:546a9f13ea72c2016cd50ec70c5b300c",
      line_price: 88595,
      product_id: 9051247214912,
      product_title: "The Videographer Snowboard",
      quantity: 1,
      title: "The Videographer Snowboard",
      url: "/products/the-videographer-snowboard?variant=47831615996224",
      variant_id: 47831615996224,
    },
    {
      discounted_price: 262995,
      final_price: 262995,
      handle: "the-3p-fulfilled-snowboard",
      id: 47831617470784,
      image:
        "https://cdn.shopify.com/s/files/1/0860/1423/0848/products/Main_b9e0da7f-db89-4d41-83f0-7f417b02831d.jpg?v=1707135789",
      key: "47831617470784:0c508c3aa09bce7ab5b43fd6ddabd42a",
      line_price: 525990,
      product_id: 9051248329024,
      product_title: "The 3p Fulfilled Snowboard",
      quantity: 2,
      title: "The 3p Fulfilled Snowboard",
      url: "/products/the-3p-fulfilled-snowboard?variant=47831617470784",
      variant_id: 47831617470784,
    },
    {
      discounted_price: 62995,
      final_price: 62995,
      handle: "the-multi-managed-snowboard",
      id: 47831617438016,
      image:
        "https://cdn.shopify.com/s/files/1/0860/1423/0848/products/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a.jpg?v=1707135789",
      key: "47831617438016:01b0549b5b07506d11393b98b42929af",
      line_price: 62995,
      product_id: 9051248296256,
      product_title: "The Multi-managed Snowboard",
      quantity: 1,
      title: "The Multi-managed Snowboard",
      url: "/products/the-multi-managed-snowboard?variant=47831617438016",
      variant_id: 47831617438016,
    },
    {
      discounted_price: 60000,
      final_price: 60000,
      handle: "the-collection-snowboard-hydrogen",
      id: 47831616454976,
      image:
        "https://cdn.shopify.com/s/files/1/0860/1423/0848/products/Main_0a40b01b-5021-48c1-80d1-aa8ab4876d3d.jpg?v=1707135788",
      key: "47831616454976:09cc0ef7f0252c646b1d9b23d95fa187",
      line_price: 120000,
      product_id: 9051247673664,
      product_title: "The Collection Snowboard: Hydrogen",
      quantity: 2,
      title: "The Collection Snowboard: Hydrogen",
      url: "/products/the-collection-snowboard-hydrogen?variant=47831616454976",
      variant_id: 47831616454976,
    },
    {
      discounted_price: 78595,
      final_price: 78595,
      handle: "the-compare-at-price-snowboard",
      id: 47831617143104,
      image:
        "https://cdn.shopify.com/s/files/1/0860/1423/0848/products/snowboard_sky.png?v=1707135789",
      key: "47831617143104:6ac0f11189b00be004c71bcc3dd8493c",
      line_price: 78595,
      product_id: 9051248099648,
      product_title: "The Compare at Price Snowboard",
      quantity: 1,
      title: "The Compare at Price Snowboard",
      url: "/products/the-compare-at-price-snowboard?variant=47831617143104",
      variant_id: 47831617143104,
    },
  ],
};
