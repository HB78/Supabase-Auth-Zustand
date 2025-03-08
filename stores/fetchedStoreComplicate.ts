// // stores/useProductStore.ts
// import { create } from "zustand";
// import {
//   Product,
//   ProductCreateInput,
//   ProductUpdateInput,
// } from "../types/product";

// const API_URL = "https://api.example.com/products";

// interface ProductState {
//   // État
//   products: Product[];
//   selectedProduct: Product | null;
//   isLoading: boolean;
//   error: string | null;
//   lastFetched: Date | null;

//   // Actions CRUD
//   fetchProducts: (forceRefresh?: boolean) => Promise<Product[]>;
//   fetchProductById: (id: string) => Promise<Product | null>;
//   addProduct: (product: ProductCreateInput) => Promise<Product | null>;
//   updateProduct: (product: ProductUpdateInput) => Promise<Product | null>;
//   deleteProduct: (id: string) => Promise<boolean>;

//   // Actions de gestion d'état
//   selectProduct: (id: string | null) => void;
//   clearError: () => void;

//   // Actions avancées
//   fetchProductsByCategory: (category: string) => Promise<Product[]>;
//   searchProducts: (query: string) => Promise<Product[]>;
//   bulkDeleteProducts: (ids: string[]) => Promise<boolean>;
// }

// export const useProductStore = create<ProductState>((set, get) => ({
//   // État initial
//   products: [],
//   selectedProduct: null,
//   isLoading: false,
//   error: null,
//   lastFetched: null,

//   // READ - Récupérer tous les produits
//   fetchProducts: async (forceRefresh = false) => {
//     const currentState = get();

//     // Vérifier si les données sont déjà en cache et récentes (moins de 5 minutes)
//     const cacheExpired =
//       !currentState.lastFetched ||
//       new Date().getTime() - currentState.lastFetched.getTime() > 5 * 60 * 1000;

//     if (!forceRefresh && !cacheExpired && currentState.products.length > 0) {
//       return currentState.products;
//     }

//     set({ isLoading: true, error: null });

//     try {
//       const response = await fetch(API_URL);

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message ||
//             `Erreur ${response.status}: Impossible de récupérer les produits`
//         );
//       }

//       const data = await response.json();
//       set({
//         products: data,
//         isLoading: false,
//         lastFetched: new Date(),
//       });

//       return data;
//     } catch (error: any) {
//       set({
//         error: `Erreur lors de la récupération des produits: ${error.message}`,
//         isLoading: false,
//       });
//       return [];
//     }
//   },

//   // READ - Récupérer un produit par ID
//   fetchProductById: async (id: string) => {
//     // D'abord vérifier si le produit est déjà dans notre état
//     const existingProduct = get().products.find((p) => p.id === id);
//     if (existingProduct) {
//       set({ selectedProduct: existingProduct });
//       return existingProduct;
//     }

//     set({ isLoading: true, error: null });

//     try {
//       const response = await fetch(`${API_URL}/${id}`);

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message || `Erreur ${response.status}: Produit non trouvé`
//         );
//       }

//       const product = await response.json();
//       set({
//         selectedProduct: product,
//         isLoading: false,
//       });

//       return product;
//     } catch (error: any) {
//       set({
//         error: `Erreur lors de la récupération du produit: ${error.message}`,
//         isLoading: false,
//         selectedProduct: null,
//       });
//       return null;
//     }
//   },

//   // CREATE - Ajouter un nouveau produit
//   addProduct: async (productData: ProductCreateInput) => {
//     set({ isLoading: true, error: null });

//     try {
//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(productData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message ||
//             `Erreur ${response.status}: Impossible d'ajouter le produit`
//         );
//       }

//       const newProduct = await response.json();

//       set((state) => ({
//         products: [...state.products, newProduct],
//         isLoading: false,
//       }));

//       return newProduct;
//     } catch (error: any) {
//       set({
//         error: `Erreur lors de l'ajout du produit: ${error.message}`,
//         isLoading: false,
//       });
//       return null;
//     }
//   },

//   // UPDATE - Mettre à jour un produit existant
//   updateProduct: async (productData: ProductUpdateInput) => {
//     set({ isLoading: true, error: null });

//     try {
//       const response = await fetch(`${API_URL}/${productData.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(productData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message ||
//             `Erreur ${response.status}: Impossible de mettre à jour le produit`
//         );
//       }

//       const updatedProduct = await response.json();

//       // Mettre à jour le produit dans la liste
//       set((state) => ({
//         products: state.products.map((p) =>
//           p.id === updatedProduct.id ? updatedProduct : p
//         ),
//         selectedProduct:
//           state.selectedProduct?.id === updatedProduct.id
//             ? updatedProduct
//             : state.selectedProduct,
//         isLoading: false,
//       }));

//       return updatedProduct;
//     } catch (error: any) {
//       set({
//         error: `Erreur lors de la mise à jour du produit: ${error.message}`,
//         isLoading: false,
//       });
//       return null;
//     }
//   },

//   // DELETE - Supprimer un produit
//   deleteProduct: async (id: string) => {
//     set({ isLoading: true, error: null });

//     try {
//       const response = await fetch(`${API_URL}/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message ||
//             `Erreur ${response.status}: Impossible de supprimer le produit`
//         );
//       }

//       // Supprimer le produit de la liste
//       set((state) => ({
//         products: state.products.filter((p) => p.id !== id),
//         selectedProduct:
//           state.selectedProduct?.id === id ? null : state.selectedProduct,
//         isLoading: false,
//       }));

//       return true;
//     } catch (error: any) {
//       set({
//         error: `Erreur lors de la suppression du produit: ${error.message}`,
//         isLoading: false,
//       });
//       return false;
//     }
//   },

//   // Sélectionner un produit pour l'édition ou les détails
//   selectProduct: (id: string | null) => {
//     if (id === null) {
//       set({ selectedProduct: null });
//       return;
//     }

//     const product = get().products.find((p) => p.id === id) || null;
//     set({ selectedProduct: product });
//   },

//   // Effacer les erreurs
//   clearError: () => {
//     set({ error: null });
//   },

//   // Fonctionnalités avancées

//   // Recherche de produits par catégorie
//   fetchProductsByCategory: async (category: string) => {
//     set({ isLoading: true, error: null });

//     try {
//       const response = await fetch(
//         `${API_URL}?category=${encodeURIComponent(category)}`
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message ||
//             `Erreur ${response.status}: Impossible de récupérer les produits`
//         );
//       }

//       const data = await response.json();

//       // Mettre à jour uniquement les produits filtrés, pas toute la liste
//       set({
//         isLoading: false,
//       });

//       return data;
//     } catch (error: any) {
//       set({
//         error: `Erreur lors de la recherche par catégorie: ${error.message}`,
//         isLoading: false,
//       });
//       return [];
//     }
//   },

//   // Recherche textuelle
//   searchProducts: async (query: string) => {
//     set({ isLoading: true, error: null });

//     try {
//       const response = await fetch(
//         `${API_URL}/search?q=${encodeURIComponent(query)}`
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message ||
//             `Erreur ${response.status}: Impossible d'effectuer la recherche`
//         );
//       }

//       const data = await response.json();

//       // Ne pas mettre à jour l'état complet, juste retourner les résultats
//       set({ isLoading: false });

//       return data;
//     } catch (error: any) {
//       set({
//         error: `Erreur lors de la recherche: ${error.message}`,
//         isLoading: false,
//       });
//       return [];
//     }
//   },

//   // Suppression en masse
//   bulkDeleteProducts: async (ids: string[]) => {
//     if (ids.length === 0) return true;

//     set({ isLoading: true, error: null });

//     try {
//       const response = await fetch(`${API_URL}/bulk-delete`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ids }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message ||
//             `Erreur ${response.status}: Impossible de supprimer les produits`
//         );
//       }

//       // Supprimer les produits de la liste
//       set((state) => ({
//         products: state.products.filter((p) => !ids.includes(p.id)),
//         selectedProduct:
//           state.selectedProduct && ids.includes(state.selectedProduct.id)
//             ? null
//             : state.selectedProduct,
//         isLoading: false,
//       }));

//       return true;
//     } catch (error: any) {
//       set({
//         error: `Erreur lors de la suppression en masse: ${error.message}`,
//         isLoading: false,
//       });
//       return false;
//     }
//   },
// }));
