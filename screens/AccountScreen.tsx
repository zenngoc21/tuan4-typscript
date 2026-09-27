import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Order } from '../data';

interface Props {
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
}

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
}

interface Address {
  id: number;
  label: string;
  receiver: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

type AccountModal = 'profile' | 'orders' | 'addresses' | 'vouchers' | 'password' | 'login' | null;

const INITIAL_PROFILE: UserProfile = {
  fullName: 'Nguyễn Văn An',
  email: 'an.nguyen@example.com',
  phone: '0901 234 567',
};

const INITIAL_ADDRESSES: Address[] = [
  {
    id: 1,
    label: 'Nhà riêng',
    receiver: 'Nguyễn Văn An',
    phone: '0901 234 567',
    address: '12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    isDefault: true,
  },
  {
    id: 2,
    label: 'Công ty',
    receiver: 'Nguyễn Văn An',
    phone: '0901 234 567',
    address: '35 Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh',
    isDefault: false,
  },
];

const VOUCHERS = [
  { code: 'BOOK10', title: 'Giảm 10%', condition: 'Đơn từ 150.000đ', expiry: '31/12/2026' },
  { code: 'FREESHIP', title: 'Miễn phí vận chuyển', condition: 'Đơn từ 200.000đ', expiry: '30/11/2026' },
  { code: 'NEWBOOK', title: 'Giảm 20.000đ', condition: 'Khách hàng mới', expiry: '31/10/2026' },
];

export function AccountScreen({ orders, onCancelOrder }: Props) {
  const [loggedIn, setLoggedIn] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [draftProfile, setDraftProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [modal, setModal] = useState<AccountModal>(null);
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressLabel, setAddressLabel] = useState('');
  const [addressReceiver, setAddressReceiver] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [addressText, setAddressText] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const totalSpent = useMemo(
    () => orders.filter((order) => order.status !== 'Đã huỷ').reduce((sum, order) => sum + order.total, 0),
    [orders]
  );

  const totalBooks = useMemo(
    () => orders.filter((order) => order.status !== 'Đã huỷ').reduce((sum, order) => sum + order.items.reduce((inner, item) => inner + item.quantity, 0), 0),
    [orders]
  );

  const initials = profile.fullName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const openProfile = () => {
    setDraftProfile(profile);
    setModal('profile');
  };

  const saveProfile = () => {
    if (!draftProfile.fullName.trim() || !draftProfile.email.trim() || !draftProfile.phone.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ họ tên, email và số điện thoại.');
      return;
    }
    setProfile({
      fullName: draftProfile.fullName.trim(),
      email: draftProfile.email.trim(),
      phone: draftProfile.phone.trim(),
    });
    setModal(null);
    Alert.alert('Đã lưu', 'Thông tin tài khoản đã được cập nhật.');
  };

  const openNewAddress = () => {
    setEditingAddress(null);
    setAddressFormOpen(true);
    setAddressLabel('');
    setAddressReceiver(profile.fullName);
    setAddressPhone(profile.phone);
    setAddressText('');
    setModal('addresses');
  };

  const openEditAddress = (item: Address) => {
    setEditingAddress(item);
    setAddressFormOpen(true);
    setAddressLabel(item.label);
    setAddressReceiver(item.receiver);
    setAddressPhone(item.phone);
    setAddressText(item.address);
    setModal('addresses');
  };

  const saveAddress = () => {
    if (!addressLabel.trim() || !addressReceiver.trim() || !addressPhone.trim() || !addressText.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ thông tin địa chỉ.');
      return;
    }

    if (editingAddress) {
      setAddresses((current) => current.map((item) => item.id === editingAddress.id ? {
        ...item,
        label: addressLabel.trim(),
        receiver: addressReceiver.trim(),
        phone: addressPhone.trim(),
        address: addressText.trim(),
      } : item));
    } else {
      setAddresses((current) => [
        ...current,
        {
          id: Date.now(),
          label: addressLabel.trim(),
          receiver: addressReceiver.trim(),
          phone: addressPhone.trim(),
          address: addressText.trim(),
          isDefault: current.length === 0,
        },
      ]);
    }
    setAddressFormOpen(false);
    setEditingAddress(null);
    setModal(null);
    Alert.alert('Đã lưu', 'Địa chỉ đã được cập nhật.');
  };

  const deleteAddress = (id: number) => {
    const target = addresses.find((item) => item.id === id);
    if (!target) return;
    Alert.alert('Xoá địa chỉ', `Bạn có chắc muốn xoá địa chỉ "${target.label}"?`, [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: () => {
          setAddresses((current) => {
            const remaining = current.filter((item) => item.id !== id);
            if (target.isDefault && remaining.length > 0) {
              remaining[0] = { ...remaining[0], isDefault: true };
            }
            return remaining;
          });
        },
      },
    ]);
  };

  const setDefaultAddress = (id: number) => {
    setAddresses((current) => current.map((item) => ({ ...item, isDefault: item.id === id })));
  };

  const handleLogin = () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      Alert.alert('Đăng nhập', 'Vui lòng nhập email và mật khẩu.');
      return;
    }
    setLoggedIn(true);
    setProfile((current) => ({ ...current, email: loginEmail.trim() }));
    setLoginEmail('');
    setLoginPassword('');
    setModal(null);
    Alert.alert('Đăng nhập thành công', 'Chào mừng bạn quay lại BookStore.');
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Đổi mật khẩu', 'Vui lòng nhập đầy đủ các trường.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Đổi mật khẩu', 'Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Đổi mật khẩu', 'Mật khẩu xác nhận không khớp.');
      return;
    }
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setModal(null);
    Alert.alert('Thành công', 'Mật khẩu đã được thay đổi.');
  };

  const handleCancelOrder = (orderId: string) => {
    Alert.alert('Huỷ đơn hàng', `Bạn có chắc muốn huỷ đơn ${orderId}?`, [
      { text: 'Không', style: 'cancel' },
      {
        text: 'Huỷ đơn',
        style: 'destructive',
        onPress: () => {
          onCancelOrder(orderId);
          setSelectedOrder(null);
          Alert.alert('Đã huỷ', `Đơn ${orderId} đã chuyển sang trạng thái Đã huỷ.`);
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có muốn đăng xuất khỏi tài khoản?', [
      { text: 'Ở lại', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: () => setLoggedIn(false) },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Xoá tài khoản',
      'Đây là chức năng demo. Bạn có chắc muốn xoá tài khoản trên thiết bị này?',
      [
        { text: 'Huỷ', style: 'cancel' },
        { text: 'Xoá', style: 'destructive', onPress: () => {
          setLoggedIn(false);
          Alert.alert('Đã xoá', 'Dữ liệu tài khoản demo đã được đăng xuất.');
        } },
      ]
    );
  };

  const showHelp = () => Alert.alert('Trung tâm hỗ trợ', 'Hotline: 1900 1234\nEmail: support@bookstore.vn\nThời gian: 8:00 - 22:00 hàng ngày.');
  const showTerms = () => Alert.alert('Điều khoản sử dụng', 'BookStore là giao diện demo phục vụ bài học. Khi triển khai thực tế cần bổ sung backend, xác thực tài khoản và chính sách dữ liệu.');

  if (!loggedIn) {
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.loggedOutContainer}>
          <View style={styles.loginIcon}><Text style={styles.loginIconText}>👤</Text></View>
          <Text style={styles.loginTitle}>Đăng nhập BookStore</Text>
          <Text style={styles.loginSubtitle}>Đăng nhập để quản lý đơn hàng, địa chỉ và ưu đãi.</Text>
          <Pressable style={styles.primaryButton} onPress={() => setModal('login')}>
            <Text style={styles.primaryButtonText}>Đăng nhập</Text>
          </Pressable>
          <Pressable style={styles.outlineButton} onPress={() => Alert.alert('Tạo tài khoản', 'Trong bài demo, bạn có thể dùng chức năng Đăng nhập để mô phỏng tài khoản mới.')}>
            <Text style={styles.outlineButtonText}>Tạo tài khoản mới</Text>
          </Pressable>
          <Text style={styles.demoHint}>Tài khoản demo: nhập bất kỳ email và mật khẩu.</Text>
        </ScrollView>
        <LoginModal />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.pageTitle}>Tài khoản</Text>
            <Text style={styles.pageSubtitle}>Quản lý hồ sơ và mua sắm của bạn</Text>
          </View>
          <Pressable style={styles.settingsButton} onPress={() => Alert.alert('Cài đặt', 'Các cài đặt tài khoản đã được đặt trong các mục bên dưới.')}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </Pressable>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{initials || 'NA'}</Text></View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.fullName}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
            <Text style={styles.profilePhone}>{profile.phone}</Text>
          </View>
          <Pressable style={styles.editButton} onPress={openProfile}>
            <Text style={styles.editButtonText}>Sửa</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <StatBox value={`${orders.length}`} label="Đơn hàng" />
          <StatBox value={`${totalBooks}`} label="Sách đã mua" />
          <StatBox value={`${totalSpent.toLocaleString('vi-VN')}đ`} label="Đã chi" compact />
        </View>

        <Text style={styles.sectionTitle}>Đơn hàng & mua sắm</Text>
        <MenuCard icon="📦" title="Đơn hàng của tôi" subtitle={orders.length ? `${orders.length} đơn hàng` : 'Chưa có đơn hàng'} onPress={() => setModal('orders')} />
        <MenuCard icon="📍" title="Địa chỉ nhận hàng" subtitle={`${addresses.length} địa chỉ đã lưu`} onPress={() => { setEditingAddress(null); setAddressFormOpen(false); setModal('addresses'); }} />
        <MenuCard icon="🎟️" title="Mã giảm giá" subtitle={`${VOUCHERS.length} ưu đãi khả dụng`} onPress={() => setModal('vouchers')} />

        <Text style={styles.sectionTitle}>Thông báo & cài đặt</Text>
        <SettingRow icon="🔔" title="Thông báo đơn hàng" subtitle="Nhận cập nhật trạng thái giao hàng" value={notifications} onValueChange={setNotifications} />
        <SettingRow icon="📧" title="Email khuyến mãi" subtitle="Nhận sách mới và chương trình ưu đãi" value={newsletter} onValueChange={setNewsletter} />
        <MenuCard icon="🔐" title="Đổi mật khẩu" subtitle="Cập nhật mật khẩu bảo mật" onPress={() => setModal('password')} />

        <Text style={styles.sectionTitle}>Hỗ trợ</Text>
        <MenuCard icon="💬" title="Trung tâm hỗ trợ" subtitle="Liên hệ với BookStore" onPress={showHelp} />
        <MenuCard icon="📄" title="Điều khoản & chính sách" subtitle="Thông tin sử dụng dịch vụ" onPress={showTerms} />

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>↪</Text>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </Pressable>
        <Pressable style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteAccountText}>Xoá tài khoản</Text>
        </Pressable>

        <Text style={styles.version}>BookStore Online • Version 1.0.0</Text>
      </ScrollView>

      <ProfileModal />
      <OrdersModal />
      <AddressesModal />
      <VoucherModal />
      <PasswordModal />
    </View>
  );

  function ProfileModal() {
    return (
      <Modal visible={modal === 'profile'} animationType="slide" transparent onRequestClose={() => setModal(null)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalCard}>
            <ModalHeader title="Chỉnh sửa hồ sơ" onClose={() => setModal(null)} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Field label="Họ và tên" value={draftProfile.fullName} onChangeText={(value) => setDraftProfile({ ...draftProfile, fullName: value })} placeholder="Nhập họ tên" />
              <Field label="Email" value={draftProfile.email} onChangeText={(value) => setDraftProfile({ ...draftProfile, email: value })} placeholder="example@email.com" keyboardType="email-address" />
              <Field label="Số điện thoại" value={draftProfile.phone} onChangeText={(value) => setDraftProfile({ ...draftProfile, phone: value })} placeholder="090..." keyboardType="phone-pad" />
              <Pressable style={styles.primaryButton} onPress={saveProfile}><Text style={styles.primaryButtonText}>Lưu thay đổi</Text></Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  function OrdersModal() {
    return (
      <Modal visible={modal === 'orders'} animationType="slide" transparent onRequestClose={() => setModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardLarge}>
            <ModalHeader title="Đơn hàng của tôi" onClose={() => setModal(null)} />
            {orders.length === 0 ? (
              <View style={styles.emptyState}><Text style={styles.emptyIcon}>📦</Text><Text style={styles.emptyTitle}>Chưa có đơn hàng</Text><Text style={styles.emptySubtitle}>Đơn hàng sau khi thanh toán sẽ xuất hiện ở đây.</Text></View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
                {orders.map((order) => (
                  <Pressable key={order.id} style={styles.orderCard} onPress={() => setSelectedOrder(order)}>
                    <View style={styles.orderHeaderRow}>
                      <Text style={styles.orderId}>{order.id}</Text>
                      <StatusPill status={order.status} />
                    </View>
                    <Text style={styles.orderDate}>{order.createdAt}</Text>
                    <Text style={styles.orderItems}>{order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm</Text>
                    <View style={styles.orderFooterRow}>
                      <Text style={styles.orderTotal}>{order.total.toLocaleString('vi-VN')} đ</Text>
                      <Text style={styles.viewDetail}>Xem chi tiết ›</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            )}
            {selectedOrder && (
              <Modal visible={Boolean(selectedOrder)} animationType="fade" transparent onRequestClose={() => setSelectedOrder(null)}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalCard}>
                    <ModalHeader title={`Chi tiết ${selectedOrder.id}`} onClose={() => setSelectedOrder(null)} />
                    <ScrollView>
                      <StatusPill status={selectedOrder.status} />
                      {selectedOrder.items.map((item) => (
                        <View key={item.book.id} style={styles.orderItemRow}>
                          <View style={styles.orderItemInfo}>
                            <Text style={styles.orderItemTitle}>{item.book.title}</Text>
                            <Text style={styles.orderItemMeta}>SL: {item.quantity}</Text>
                          </View>
                          <Text style={styles.orderItemPrice}>{(item.book.price * item.quantity).toLocaleString('vi-VN')} đ</Text>
                        </View>
                      ))}
                      <View style={styles.detailTotal}><Text style={styles.detailTotalLabel}>Tổng cộng</Text><Text style={styles.detailTotalValue}>{selectedOrder.total.toLocaleString('vi-VN')} đ</Text></View>
                      {selectedOrder.status === 'Chờ xác nhận' && (
                        <Pressable style={styles.cancelOrderButton} onPress={() => handleCancelOrder(selectedOrder.id)}>
                          <Text style={styles.cancelOrderText}>Huỷ đơn hàng</Text>
                        </Pressable>
                      )}
                    </ScrollView>
                  </View>
                </View>
              </Modal>
            )}
          </View>
        </View>
      </Modal>
    );
  }

  function AddressesModal() {
    return (
      <Modal visible={modal === 'addresses'} animationType="slide" transparent onRequestClose={() => setModal(null)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalCardLarge}>
            <ModalHeader title="Địa chỉ nhận hàng" onClose={() => { setAddressFormOpen(false); setEditingAddress(null); setModal(null); }} />
            <ScrollView showsVerticalScrollIndicator={false}>
              {addressFormOpen && (
                <View style={styles.addressForm}>
                  <Text style={styles.formTitle}>{editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</Text>
                  <Field label="Nhãn" value={addressLabel} onChangeText={setAddressLabel} placeholder="Nhà riêng / Công ty" />
                  <Field label="Người nhận" value={addressReceiver} onChangeText={setAddressReceiver} placeholder="Họ tên người nhận" />
                  <Field label="Số điện thoại" value={addressPhone} onChangeText={setAddressPhone} placeholder="090..." keyboardType="phone-pad" />
                  <Field label="Địa chỉ" value={addressText} onChangeText={setAddressText} placeholder="Số nhà, đường, quận/huyện..." multiline />
                  <View style={styles.formActions}>
                    <Pressable style={styles.secondaryButton} onPress={() => { setAddressFormOpen(false); setEditingAddress(null); }}><Text style={styles.secondaryButtonText}>Huỷ</Text></Pressable>
                    <Pressable style={styles.primaryButtonSmall} onPress={saveAddress}><Text style={styles.primaryButtonText}>Lưu</Text></Pressable>
                  </View>
                </View>
              )}

              {!addressFormOpen && addresses.map((item) => (
                <View key={item.id} style={styles.addressCard}>
                  <View style={styles.addressTopRow}>
                    <View style={styles.addressLabelRow}><Text style={styles.addressIcon}>📍</Text><Text style={styles.addressLabel}>{item.label}</Text>{item.isDefault && <View style={styles.defaultPill}><Text style={styles.defaultPillText}>Mặc định</Text></View>}</View>
                    <Pressable onPress={() => openEditAddress(item)}><Text style={styles.linkText}>Sửa</Text></Pressable>
                  </View>
                  <Text style={styles.addressReceiver}>{item.receiver} • {item.phone}</Text>
                  <Text style={styles.addressText}>{item.address}</Text>
                  <View style={styles.addressActions}>
                    {!item.isDefault && <Pressable onPress={() => setDefaultAddress(item.id)}><Text style={styles.linkText}>Đặt mặc định</Text></Pressable>}
                    <Pressable onPress={() => deleteAddress(item.id)}><Text style={styles.deleteText}>Xoá</Text></Pressable>
                  </View>
                </View>
              ))}

              {!addressFormOpen && (
                <Pressable style={styles.addAddressButton} onPress={openNewAddress}>
                  <Text style={styles.addAddressIcon}>＋</Text>
                  <Text style={styles.addAddressText}>Thêm địa chỉ mới</Text>
                </Pressable>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  function PasswordModal() {
    return (
      <Modal visible={modal === 'password'} animationType="slide" transparent onRequestClose={() => setModal(null)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalCard}>
            <ModalHeader title="Đổi mật khẩu" onClose={() => setModal(null)} />
            <Field label="Mật khẩu hiện tại" value={oldPassword} onChangeText={setOldPassword} placeholder="Nhập mật khẩu hiện tại" />
            <Field label="Mật khẩu mới" value={newPassword} onChangeText={setNewPassword} placeholder="Tối thiểu 6 ký tự" />
            <Field label="Nhập lại mật khẩu mới" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Nhập lại mật khẩu" />
            <Text style={styles.passwordNote}>Không sử dụng thông tin cá nhân dễ đoán làm mật khẩu.</Text>
            <Pressable style={styles.primaryButton} onPress={handleChangePassword}><Text style={styles.primaryButtonText}>Đổi mật khẩu</Text></Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  function VoucherModal() {
    return (
      <Modal visible={modal === 'vouchers'} animationType="slide" transparent onRequestClose={() => setModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardLarge}>
            <ModalHeader title="Mã giảm giá" onClose={() => setModal(null)} />
            <ScrollView showsVerticalScrollIndicator={false}>
              {VOUCHERS.map((voucher) => (
                <View key={voucher.code} style={styles.voucherCard}>
                  <View style={styles.voucherLeft}><Text style={styles.voucherIcon}>🎟️</Text><View><Text style={styles.voucherTitle}>{voucher.title}</Text><Text style={styles.voucherCondition}>{voucher.condition}</Text><Text style={styles.voucherExpiry}>HSD: {voucher.expiry}</Text></View></View>
                  <Pressable style={styles.applyButton} onPress={() => Alert.alert('Mã giảm giá', `Đã chọn mã ${voucher.code}. Mã sẽ được áp dụng tại bước thanh toán.`)}><Text style={styles.applyButtonText}>Dùng mã</Text></Pressable>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  function LoginModal() {
    return (
      <Modal visible={modal === 'login'} animationType="slide" transparent onRequestClose={() => setModal(null)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalCard}>
            <ModalHeader title="Đăng nhập" onClose={() => setModal(null)} />
            <Field label="Email" value={loginEmail} onChangeText={setLoginEmail} placeholder="email@example.com" keyboardType="email-address" />
            <Text style={styles.fieldLabel}>Mật khẩu</Text>
            <View style={styles.passwordWrap}>
              <TextInput value={loginPassword} onChangeText={setLoginPassword} placeholder="Nhập mật khẩu" placeholderTextColor="#94A3B8" secureTextEntry={!showPassword} style={styles.fieldInputPassword} />
              <Pressable onPress={() => setShowPassword((value) => !value)}><Text style={styles.showPassword}>{showPassword ? 'Ẩn' : 'Hiện'}</Text></Pressable>
            </View>
            <Pressable onPress={() => Alert.alert('Quên mật khẩu', 'Trong bài demo, chức năng này chỉ mô phỏng giao diện.')}><Text style={styles.forgotText}>Quên mật khẩu?</Text></Pressable>
            <Pressable style={styles.primaryButton} onPress={handleLogin}><Text style={styles.primaryButtonText}>Đăng nhập</Text></Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
}

function StatBox({ value, label, compact = false }: { value: string; label: string; compact?: boolean }) {
  return <View style={styles.statBox}><Text style={[styles.statValue, compact && styles.statValueCompact]} numberOfLines={1}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

function MenuCard({ icon, title, subtitle, onPress }: { icon: string; title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.menuCard, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.menuIcon}><Text style={styles.menuIconText}>{icon}</Text></View>
      <View style={styles.menuInfo}><Text style={styles.menuTitle}>{title}</Text><Text style={styles.menuSubtitle}>{subtitle}</Text></View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

function SettingRow({ icon, title, subtitle, value, onValueChange }: { icon: string; title: string; subtitle: string; value: boolean; onValueChange: (value: boolean) => void }) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.menuIcon}><Text style={styles.menuIconText}>{icon}</Text></View>
      <View style={styles.menuInfo}><Text style={styles.menuTitle}>{title}</Text><Text style={styles.menuSubtitle}>{subtitle}</Text></View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return <View style={styles.modalHeader}><Text style={styles.modalTitle}>{title}</Text><Pressable onPress={onClose} style={styles.closeButton}><Text style={styles.closeText}>✕</Text></Pressable></View>;
}

function Field({ label, value, onChangeText, placeholder, keyboardType, multiline = false }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; keyboardType?: 'default' | 'email-address' | 'phone-pad'; multiline?: boolean }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#94A3B8" keyboardType={keyboardType} multiline={multiline} style={[styles.fieldInput, multiline && styles.multilineInput]} />
    </View>
  );
}

function StatusPill({ status }: { status: Order['status'] }) {
  const tone = status === 'Đã giao' ? styles.statusDone : status === 'Đang giao' ? styles.statusShipping : status === 'Đã huỷ' ? styles.statusCancelled : styles.statusPending;
  return <View style={[styles.statusPill, tone]}><Text style={styles.statusText}>{status}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 110 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: '#111827' },
  pageSubtitle: { marginTop: 4, color: '#64748B', fontSize: 12 },
  settingsButton: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  settingsIcon: { fontSize: 19 },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4338CA', borderRadius: 18, padding: 15, marginBottom: 12 },
  avatar: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#4338CA', fontSize: 20, fontWeight: '900' },
  profileInfo: { flex: 1, marginLeft: 12 },
  profileName: { color: '#FFFFFF', fontSize: 17, fontWeight: '900' },
  profileEmail: { marginTop: 4, color: '#E0E7FF', fontSize: 12 },
  profilePhone: { marginTop: 2, color: '#E0E7FF', fontSize: 12 },
  editButton: { borderRadius: 9, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#FFFFFF' },
  editButtonText: { color: '#4338CA', fontWeight: '800', fontSize: 12 },
  statsRow: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  statBox: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#E2E8F0' },
  statValue: { fontSize: 18, fontWeight: '900', color: '#111827' },
  statValueCompact: { fontSize: 13 },
  statLabel: { marginTop: 4, color: '#64748B', fontSize: 10 },
  sectionTitle: { marginTop: 4, marginBottom: 9, fontSize: 13, fontWeight: '900', color: '#334155' },
  menuCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', padding: 12, marginBottom: 9 },
  settingRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', padding: 12, marginBottom: 9 },
  pressed: { opacity: 0.8 },
  menuIcon: { width: 42, height: 42, borderRadius: 11, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  menuIconText: { fontSize: 19 },
  menuInfo: { flex: 1, marginHorizontal: 12 },
  menuTitle: { color: '#111827', fontWeight: '800', fontSize: 14 },
  menuSubtitle: { marginTop: 3, color: '#64748B', fontSize: 11 },
  chevron: { color: '#94A3B8', fontSize: 27, lineHeight: 27 },
  logoutButton: { marginTop: 12, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#FCA5A5', backgroundColor: '#FEF2F2', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  logoutIcon: { color: '#DC2626', fontSize: 19, marginRight: 7 },
  logoutText: { color: '#DC2626', fontWeight: '900' },
  deleteAccountButton: { marginTop: 10, alignItems: 'center', paddingVertical: 7 },
  deleteAccountText: { color: '#94A3B8', fontSize: 11 },
  version: { marginTop: 4, textAlign: 'center', color: '#CBD5E1', fontSize: 10 },
  loggedOutContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loginIcon: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#E0E7FF', alignItems: 'center', justifyContent: 'center' },
  loginIconText: { fontSize: 40 },
  loginTitle: { marginTop: 18, fontSize: 23, fontWeight: '900', color: '#111827' },
  loginSubtitle: { marginTop: 7, color: '#64748B', textAlign: 'center', lineHeight: 19 },
  primaryButton: { marginTop: 18, borderRadius: 12, backgroundColor: '#4338CA', minHeight: 46, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '900' },
  outlineButton: { marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: '#4338CA', minHeight: 46, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  outlineButtonText: { color: '#4338CA', fontWeight: '900' },
  demoHint: { marginTop: 14, color: '#94A3B8', fontSize: 11, textAlign: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,23,42,0.45)' },
  modalCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 18, maxHeight: '90%' },
  modalCardLarge: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 18, maxHeight: '92%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { fontSize: 19, fontWeight: '900', color: '#111827' },
  closeButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  closeText: { color: '#475569', fontSize: 14 },
  fieldWrap: { marginBottom: 12 },
  fieldLabel: { marginBottom: 6, color: '#334155', fontSize: 12, fontWeight: '800' },
  fieldInput: { minHeight: 44, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 11, paddingHorizontal: 12, color: '#111827', backgroundColor: '#FFFFFF' },
  multilineInput: { minHeight: 82, textAlignVertical: 'top', paddingTop: 11 },
  passwordWrap: { minHeight: 44, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 11, flexDirection: 'row', alignItems: 'center', paddingLeft: 12, paddingRight: 9, marginBottom: 8 },
  fieldInputPassword: { flex: 1, color: '#111827' },
  showPassword: { color: '#4338CA', fontWeight: '800', padding: 5 },
  forgotText: { color: '#4338CA', fontSize: 12, fontWeight: '800', textAlign: 'right' },
  orderCard: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 13, marginBottom: 10, backgroundColor: '#FFFFFF' },
  orderHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderId: { color: '#111827', fontWeight: '900', fontSize: 13 },
  orderDate: { marginTop: 5, color: '#94A3B8', fontSize: 10 },
  orderItems: { marginTop: 8, color: '#64748B', fontSize: 11 },
  orderFooterRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderTotal: { color: '#4338CA', fontWeight: '900' },
  viewDetail: { color: '#4338CA', fontSize: 11, fontWeight: '800' },
  statusPill: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 5 },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusShipping: { backgroundColor: '#DBEAFE' },
  statusDone: { backgroundColor: '#DCFCE7' },
  statusCancelled: { backgroundColor: '#FEE2E2' },
  statusText: { color: '#334155', fontSize: 10, fontWeight: '900' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 38 },
  emptyTitle: { marginTop: 10, color: '#111827', fontWeight: '900' },
  emptySubtitle: { marginTop: 5, color: '#64748B', textAlign: 'center', fontSize: 12 },
  orderItemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  orderItemInfo: { flex: 1, paddingRight: 10 },
  orderItemTitle: { color: '#111827', fontWeight: '800', fontSize: 12 },
  orderItemMeta: { marginTop: 3, color: '#64748B', fontSize: 10 },
  orderItemPrice: { color: '#334155', fontWeight: '800', fontSize: 11 },
  detailTotal: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14 },
  detailTotalLabel: { color: '#64748B' },
  detailTotalValue: { color: '#4338CA', fontWeight: '900', fontSize: 17 },
  addressForm: { padding: 12, borderRadius: 14, backgroundColor: '#F8FAFC', marginBottom: 12 },
  formTitle: { marginBottom: 12, color: '#111827', fontWeight: '900' },
  formActions: { flexDirection: 'row', gap: 8 },
  secondaryButton: { flex: 1, minHeight: 44, borderRadius: 11, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { color: '#475569', fontWeight: '800' },
  primaryButtonSmall: { flex: 1, minHeight: 44, borderRadius: 11, backgroundColor: '#4338CA', alignItems: 'center', justifyContent: 'center' },
  addressCard: { padding: 13, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, marginBottom: 10 },
  addressTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addressLabelRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  addressIcon: { fontSize: 15, marginRight: 6 },
  addressLabel: { color: '#111827', fontWeight: '900' },
  defaultPill: { marginLeft: 7, backgroundColor: '#EEF2FF', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 4 },
  defaultPillText: { color: '#4338CA', fontSize: 9, fontWeight: '900' },
  addressReceiver: { marginTop: 8, color: '#334155', fontSize: 12, fontWeight: '700' },
  addressText: { marginTop: 4, color: '#64748B', lineHeight: 18, fontSize: 11 },
  addressActions: { marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end', gap: 16 },
  linkText: { color: '#4338CA', fontSize: 11, fontWeight: '900' },
  deleteText: { color: '#DC2626', fontSize: 11, fontWeight: '900' },
  addAddressButton: { borderWidth: 1, borderStyle: 'dashed', borderColor: '#A5B4FC', minHeight: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  addAddressIcon: { color: '#4338CA', fontSize: 20, marginRight: 5 },
  addAddressText: { color: '#4338CA', fontWeight: '900', fontSize: 12 },
  cancelOrderButton: { marginTop: 14, minHeight: 44, borderRadius: 11, borderWidth: 1, borderColor: '#FCA5A5', backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center' },
  cancelOrderText: { color: '#DC2626', fontWeight: '900' },
  passwordNote: { marginTop: 2, color: '#94A3B8', fontSize: 10, lineHeight: 16 },
  voucherCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 12, marginBottom: 10, backgroundColor: '#FFFFFF' },
  voucherLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  voucherIcon: { fontSize: 24, marginRight: 9 },
  voucherTitle: { color: '#111827', fontWeight: '900', fontSize: 13 },
  voucherCondition: { marginTop: 2, color: '#64748B', fontSize: 10 },
  voucherExpiry: { marginTop: 2, color: '#94A3B8', fontSize: 9 },
  applyButton: { borderRadius: 9, backgroundColor: '#4338CA', paddingHorizontal: 10, paddingVertical: 8 },
  applyButtonText: { color: '#FFFFFF', fontWeight: '900', fontSize: 10 },
});
