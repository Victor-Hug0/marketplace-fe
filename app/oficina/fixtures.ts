import type { ProductCardData } from "@/components/catalog/product-card";
import type { ProductDetailData } from "@/components/catalog/product-detail";
import type { CartStore } from "@/components/commerce/cart-review";
import type { OperationalOrder } from "@/components/admin/orders-table";

const promoStart = "2026-11-01T00:00:00-03:00";
const promoEnd = "2026-11-30T23:59:00-03:00";

export const workshopCards: ProductCardData[] = [
  {
    name: "Fone sem fio",
    image_label: "Fone sem fio, foto de capa",
    has_offer: true,
    offer: {
      price_cents: 199990,
      promotional_price_cents: 179990,
      current_price_cents: 179990,
    },
    promo_starts_at: promoStart,
    promo_ends_at: promoEnd,
    rating_average: 4.6,
    rating_count: 128,
    store_name: "E-mall",
    is_platform: true,
    available_stock: 8,
  },
  {
    name: "Caderno universitário",
    image_label: "Caderno universitário, foto de capa",
    has_offer: true,
    offer: {
      price_cents: 2490,
      promotional_price_cents: null,
      current_price_cents: 2490,
    },
    rating_average: 4.2,
    rating_count: 36,
    store_name: "Papelaria Norte",
    is_platform: false,
    available_stock: 1,
  },
  {
    name: "Mochila urbana",
    image_label: "Mochila urbana, sem foto de oferta",
    has_offer: false,
    offer: null,
    rating_average: null,
    rating_count: 0,
    store_name: "Papelaria Norte",
    is_platform: false,
    available_stock: null,
  },
  {
    name: "Carregador USB-C",
    image_label: "Carregador USB-C, foto de capa",
    has_offer: true,
    offer: {
      price_cents: 8990,
      promotional_price_cents: null,
      current_price_cents: 8990,
    },
    rating_average: 4.8,
    rating_count: 54,
    store_name: "Casa do Cabo",
    is_platform: false,
    available_stock: 12,
  },
];

export const workshopProduct: ProductDetailData = {
  name: "Fone sem fio",
  images: [
    "Fone sem fio, foto de capa",
    "Fone sem fio, detalhe do estojo",
    "Fone sem fio, vista lateral",
  ],
  attributes: [
    { name: "Cor", value: "Azul" },
    { name: "Conexão", value: "Bluetooth" },
  ],
  winner: {
    store_name: "E-mall",
    is_platform: true,
    available_stock: 8,
    promo_starts_at: promoStart,
    promo_ends_at: promoEnd,
    offer: {
      price_cents: 199990,
      promotional_price_cents: 179990,
      current_price_cents: 179990,
    },
  },
  other_offers: [
    {
      store_name: "Papelaria Norte",
      is_platform: false,
      available_stock: 3,
      offer: {
        price_cents: 189990,
        promotional_price_cents: null,
        current_price_cents: 189990,
      },
    },
  ],
};

export const workshopCart: CartStore[] = [
  {
    store_name: "E-mall",
    is_platform: true,
    subtotal_cents: 179990,
    lines: [
      {
        name: "Fone sem fio",
        quantity: 1,
        line_total_cents: 179990,
        offer: {
          price_cents: 199990,
          promotional_price_cents: 179990,
          current_price_cents: 179990,
        },
      },
    ],
  },
  {
    store_name: "Papelaria Norte",
    is_platform: false,
    subtotal_cents: 4980,
    lines: [
      {
        name: "Caderno universitário",
        quantity: 2,
        line_total_cents: 4980,
        offer: {
          price_cents: 2490,
          promotional_price_cents: null,
          current_price_cents: 2490,
        },
      },
    ],
  },
];

export const workshopCartTotalCents = 184970;

export const workshopOrders: OperationalOrder[] = [
  {
    id: "EM-1042",
    buyer: "Maria Souza",
    status: "pending_payment",
    total_cents: 184970,
  },
  {
    id: "EM-1041",
    buyer: "João Lima",
    status: "delivered",
    total_cents: 8990,
  },
];
