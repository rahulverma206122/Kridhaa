import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/products/add`,
      formData,
      {
        headers: {  // header ko frontend se backend me bhej rhe h kyu ki backend ko pata chale ki ye request me json data aa rha hai, isse backend us data ko sahi se parse kar sakega aur handle kar sakega, agar hum header me "Content-Type": "application/json" nahi bhejte to backend ko pata nahi chalega ki ye data json format me hai aur wo usko sahi se parse nahi kar payega, isse error aa sakta hai ya data ko handle karne me problem aa sakti hai, isliye hume header me content type specify karna zaruri hota hai jab hum json data bhej rahe hote hai
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data; // hum result ke data ko return kar rahe hai taki ye data humare slice ke extraReducers me available ho jaye aur hum uske hisab se apne state ko update kar sake, ye data backend se aayega jab hum product add karenge aur backend hume response me new product ka data bhejega, is data ko hum apne frontend me use kar sakte hai jaise ki product list me naya product dikhane ke liye ya user ko success message dikhane ke liye, etc.
  }  // yha optional chaining (?.) ka use karke hum ensure kar rahe hai ki agar result ya result.data undefined ya null h to ye code error throw nahi karega, instead ye simply undefined return karega, isse hum apne code ko zyada robust bana sakte hai aur potential runtime errors se bach sakte hai jab hum backend se response handle kar rahe hote hai
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/products/get`
    );

    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    const result = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/admin/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/admin/products/delete/${id}`
    );

    return result?.data;
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default AdminProductsSlice.reducer;