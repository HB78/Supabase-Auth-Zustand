import { create } from "zustand";

// types/product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

const API_URL = "https://api.example.com/products";

interface ProductState {
  // État
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;

  // Actions CRUD
  fetchProducts: () => Promise<Product[]>;
  fetchProductById: (id: string) => Promise<Product | null>;
  fetchProductsByCategory: (category: string) => Promise<Product[]>;
  addProduct: (product: Omit<Product, "id">) => Promise<Product | null>;
  updateProduct: (
    id: string,
    product: Partial<Product>
  ) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;

  // Actions supplémentaires
  selectProduct: (id: string | null) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  // État initial
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,

  // READ - Récupérer tous les produits
  fetchProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Erreur ${response.status}: Impossible de récupérer les produits`
        );
      }

      const data = await response.json();
      set({ products: data, isLoading: false });

      return data;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  // READ - Récupérer un produit par ID
  fetchProductById: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/${id}`);

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: Produit non trouvé`);
      }

      const product = await response.json();
      set({ selectedProduct: product, isLoading: false });

      return product;
    } catch (error: any) {
      set({ error: error.message, isLoading: false, selectedProduct: null });
      return null;
    }
  },

  // READ - Récupérer les produits par catégorie
  fetchProductsByCategory: async (category) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}?category=${category}`);

      if (!response.ok) {
        throw new Error(
          `Erreur ${response.status}: Impossible de récupérer les produits`
        );
      }

      const data = await response.json();
      set({ products: data, isLoading: false });

      return data;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  // CREATE - Ajouter un nouveau produit
  addProduct: async (productData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(
          `Erreur ${response.status}: Impossible d'ajouter le produit`
        );
      }

      const newProduct = await response.json();

      // Ajouter le nouveau produit à la liste
      set((state) => ({
        products: [...state.products, newProduct],
        isLoading: false,
      }));

      return newProduct;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // UPDATE - Mettre à jour un produit existant
  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(
          `Erreur ${response.status}: Impossible de mettre à jour le produit`
        );
      }

      const updatedProduct = await response.json();

      // Mettre à jour le produit dans la liste
      set((state) => ({
        // Cette ligne parcourt tous les produits dans le state, et remplace celui qui a l'id correspondant par le produit mis à jour.
        // Si l'id ne correspond pas, on garde le produit original.
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        // Si le produit actuellement sélectionné est celui qu'on vient de mettre à jour, on met également à jour la référence selectedProduct.
        // Sinon, on garde le produit sélectionné actuel.
        selectedProduct:
          state.selectedProduct?.id === id
            ? updatedProduct
            : state.selectedProduct,
        isLoading: false,
      }));

      return updatedProduct;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // DELETE - Supprimer un produit
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `Erreur ${response.status}: Impossible de supprimer le produit`
        );
      }

      // Supprimer le produit de la liste
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        selectedProduct:
          state.selectedProduct?.id === id ? null : state.selectedProduct,
        isLoading: false,
      }));

      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  // Sélectionner un produit
  selectProduct: (id) => {
    if (id === null) {
      set({ selectedProduct: null });
      return;
    }

    const product = get().products.find((p) => p.id === id) || null;
    set({ selectedProduct: product });
  },

  // Effacer les erreurs
  clearError: () => {
    set({ error: null });
  },
}));
