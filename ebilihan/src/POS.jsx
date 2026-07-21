import React, { useState } from 'react';
import { ShoppingCart, ScanBarcode, Wallet, Plus, Minus, CheckCircle2 } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Marlboro Red', price: 10, type: 'tingi', stock: 50, img: '🚬' },
  { id: 2, name: 'Coca-Cola 8oz', price: 20, type: 'barcode', stock: 24, img: '🥤' },
  { id: 3, name: 'Cooking Oil', price: 25, type: 'tingi', stock: 15, img: '🛢️' },
  { id: 4, name: 'Palmolive Sachet', price: 7, type: 'barcode', stock: 100, img: '🧴' },
  { id: 5, name: 'Bigasan (1kg)', price: 55, type: 'tingi', stock: 50, img: '🍚' },
  { id: 6, name: 'Nissin Cup Noodles', price: 35, type: 'barcode', stock: 20, img: '🍜' },
];

export default function POS() {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Mock Barcode Scanner for the pitch demo
  const mockScan = () => {
    const randomProduct = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
    addToCart(randomProduct);
  };

  if (showCheckout) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Payment Successful!</h2>
          <p className="text-slate-500 mt-2">Transaction logged via eGovPay API.</p>
          <p className="text-3xl font-black text-blue-700 mt-4">₱{cartTotal.toFixed(2)}</p>
        </div>
        <button 
          onClick={() => { setCart([]); setShowCheckout(false); }}
          className="bg-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-lg mt-8 w-full">
          New Transaction
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scanner Action */}
      <button 
        onClick={mockScan}
        className="bg-slate-800 text-white p-3 rounded-xl flex items-center justify-center gap-2 mb-4 shadow-sm active:scale-95 transition-transform">
        <ScanBarcode className="w-5 h-5 text-blue-400" />
        <span className="font-semibold">Tap to Scan Barcode</span>
      </button>

      {/* Product Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {MOCK_PRODUCTS.map((prod) => (
          <button 
            key={prod.id} 
            onClick={() => addToCart(prod)}
            className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-1 active:bg-blue-50">
            <span className="text-2xl">{prod.img}</span>
            <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">{prod.name}</span>
            <span className="text-xs font-black text-blue-600">₱{prod.price}</span>
            <span className={`text-[8px] px-1.5 py-0.5 rounded-sm font-bold mt-1 ${prod.type === 'tingi' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
              {prod.type.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {/* Cart Section */}
      <div className="mt-auto bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col max-h-[40%]">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <ShoppingCart className="w-4 h-4" /> Current Order
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">{cart.length} items</span>
        </div>
        
        <div className="overflow-y-auto p-2 flex-1 space-y-2">
          {cart.length === 0 ? (
            <p className="text-center text-slate-400 text-xs py-4">Cart is empty</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800">{item.name}</p>
                  <p className="text-[10px] text-slate-500">₱{item.price} x {item.qty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black text-slate-800 mr-2">₱{item.price * item.qty}</p>
                  <button onClick={() => removeFromCart(item.id)} className="bg-red-100 p-1 rounded-md text-red-600"><Minus className="w-3 h-3" /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-white border-t border-slate-100">
          <button 
            disabled={cart.length === 0}
            onClick={() => setShowCheckout(true)}
            className="w-full bg-blue-700 disabled:bg-slate-300 text-white py-3 rounded-xl font-bold flex justify-between items-center px-4 shadow-md transition-colors">
            <span className="flex items-center gap-2"><Wallet className="w-5 h-5" /> Pay w/ eGovPay</span>
            <span className="text-lg">₱{cartTotal.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}