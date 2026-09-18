const axios = require('axios');
async function test() {
  try {
    const loginRes = await axios.post('http://localhost:3001/api/v1/auth/login', {
      email: 'admin@seashop.vn',
      password: 'admin123456'
    });
    const token = loginRes.data.accessToken;
    
    // get products to add to cart
    const prodRes = await axios.get('http://localhost:3001/api/v1/products');
    const prodId = prodRes.data.data[0].id;
    
    // clear and add to cart
    await axios.delete('http://localhost:3001/api/v1/cart', { headers: { Authorization: `Bearer ${token}` } });
    await axios.post('http://localhost:3001/api/v1/cart/items', { productId: prodId, quantity: 1 }, { headers: { Authorization: `Bearer ${token}` } });
    
    // place order
    const orderRes = await axios.post('http://localhost:3001/api/v1/orders', {
      shippingAddress: {
        fullName: "Test", phone: "0912345678", address: "123 Test", ward: "W1", district: "D1", province: "P1"
      }
    }, { headers: { Authorization: `Bearer ${token}` } });
    
    console.log("Order Result:", orderRes.data);
  } catch(e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
test();
