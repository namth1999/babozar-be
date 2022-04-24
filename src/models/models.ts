export interface Address {
    id?: string;
    title: string;
    default: boolean;
    lat: string;
    lng: string;
    address_formatted: string;
}

export interface Brand {
    id?: string;
    name: string;
    slug: string;
}

export interface Category {
    id?: string;
    name: string;
    slug: string;
    imageName: string;
    icon: string;
}


export interface ChildrenCategory {
    id?: string;
    slug: string;
    name: string;
    categoryID: string;
}

export interface Dietary {
    id?: string;
    name: string;
    slug: string;
}

export interface GalleryProduct {
    id?: string;
    image_name: string;
    product_id: string;
}

export interface Order {
    id?: string;
    trackingNumber: string;
    amount: number;
    total: string;
    deliveryFee: string;
    discount: string;
    status: number;
    deliveryTime: string;
    shippingAddress: string;
}

export interface OrderProduct {
    id?: string;
    productID: string;
    quantity: number;
    orderID: string;
}

export interface Product {
    id?: string;
    slug: string;
    name: string;
    description: string;
    imageName: string;
    quantity: number;
    price: string;
    salePrice: string;
    unit: string;
    totalBuy: number;
    bestSeller: boolean;
    flashSale: boolean;
    categoryID: string;
}

export interface ProductRelatedBody {
    id?: string;
    categoryID: string;
    tags: string[];
}

export interface Shop {
    id?: string;
    ownerID: string;
    ownerName: string;
    isActive: boolean;
    addressID: string;
    imageName: string;
    description: string;
    slug: string;
    name: string;
    phone: string;
    website: string;
    logo: string;
    ratings: string;
}

export interface Tag {
    id?: string;
    name: string;
    slug: string;
}

export interface TagProduct {
    id?: string;
    tag_id: string;
    product_id: string;
}
