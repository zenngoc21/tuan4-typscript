import React, { useMemo, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TabBar, TabKey } from './components/TabBar';
import { BookDetailScreen } from './screens/BookDetailScreen';
import { CartScreen } from './screens/CartScreen';
import { CategoryScreen } from './screens/CategoryScreen';
import { AccountScreen } from './screens/AccountScreen';
import { HomeScreen } from './screens/HomeScreen';
import { BOOKS, CartItem, Order } from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const selectedBook = useMemo(
    () => BOOKS.find((book) => book.id === selectedBookId) ?? null,
    [selectedBookId]
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (bookId: number) => {
    setCartItems((current) => {
      const exists = current.find((item) => item.book.id === bookId);
      if (exists) {
        return current.map((item) => item.book.id === bookId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      const book = BOOKS.find((item) => item.id === bookId);
      return book ? [...current, { book, quantity: 1 }] : current;
    });
    Alert.alert('Đã thêm', 'Sách đã được thêm vào giỏ hàng.');
  };

  const updateQuantity = (bookId: number, delta: number) => {
    setCartItems((current) => current
      .map((item) => item.book.id === bookId ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (bookId: number) => {
    setCartItems((current) => current.filter((item) => item.book.id !== bookId));
  };

  const checkout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Giỏ hàng', 'Bạn chưa có sản phẩm để thanh toán.');
      return;
    }

    const total = cartItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
    const order: Order = {
      id: `#BS${String(Date.now()).slice(-6)}`,
      items: cartItems.map((item) => ({ ...item })),
      total,
      createdAt: new Date().toLocaleString('vi-VN'),
      status: 'Chờ xác nhận',
    };

    setOrders((current) => [order, ...current]);
    setCartItems([]);
    Alert.alert('Đặt hàng thành công', `Mã đơn ${order.id} đã được tạo. Bạn có thể xem đơn trong mục Tài khoản.`);
    setActiveTab('account');
  };

  const cancelOrder = (orderId: string) => {
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, status: 'Đã huỷ' } : order));
  };

  const openBook = (id: number) => setSelectedBookId(id);

  const closeDetail = () => setSelectedBookId(null);

  const renderMain = () => {
    if (selectedBook) {
      return <BookDetailScreen book={selectedBook} onBack={closeDetail} onAddToCart={() => addToCart(selectedBook.id)} />;
    }

    switch (activeTab) {
      case 'category':
        return <CategoryScreen onPressBook={openBook} />;
      case 'cart':
        return (
          <CartScreen
            items={cartItems}
            onIncrease={(id) => updateQuantity(id, 1)}
            onDecrease={(id) => updateQuantity(id, -1)}
            onRemove={removeFromCart}
            onCheckout={checkout}
          />
        );
      case 'account':
        return <AccountScreen orders={orders} onCancelOrder={cancelOrder} />;
      default:
        return (
          <HomeScreen
            cartCount={cartCount}
            onPressBook={openBook}
            onPressCart={() => setActiveTab('cart')}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.body}>{renderMain()}</View>
      {!selectedBook && <TabBar active={activeTab} onChange={setActiveTab} cartCount={cartCount} />}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  body: { flex: 1 },
});
