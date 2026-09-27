export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  cover: string;
  category: string;
  discountPercent?: number;
  isNew?: boolean;
  description: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export type OrderStatus = 'Chờ xác nhận' | 'Đang giao' | 'Đã giao' | 'Đã huỷ';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  status: OrderStatus;
}

export const CATEGORIES = [
  'Tất cả',
  'Văn học',
  'Kinh tế',
  'Thiếu nhi',
  'Kỹ năng sống',
  'Truyện tranh',
  'Ngoại ngữ',
  'Lịch sử',
];

export const BOOKS: Book[] = [
  {
    id: 1,
    title: 'Dế Mèn Phiêu Lưu Ký',
    author: 'Tô Hoài',
    price: 45000,
    cover: 'https://picsum.photos/seed/book1/400/560',
    category: 'Thiếu nhi',
    discountPercent: 20,
    description:
      'Cuốn sách kể về hành trình phiêu lưu của chú Dế Mèn, qua đó gửi gắm bài học về lòng dũng cảm, sự trưởng thành và tình bạn. Đây là tác phẩm văn học thiếu nhi kinh điển của Việt Nam.',
  },
  {
    id: 2,
    title: 'Nhà Giả Kim',
    author: 'Paulo Coelho',
    price: 89000,
    cover: 'https://picsum.photos/seed/book2/400/560',
    category: 'Văn học',
    isNew: true,
    description:
      'Câu chuyện ngụ ngôn về chàng chăn cừu Santiago trên hành trình đi tìm kho báu, khám phá ra rằng kho báu lớn nhất chính là những bài học có được trên con đường mình đã đi qua.',
  },
  {
    id: 3,
    title: 'Sapiens: Lược Sử Loài Người',
    author: 'Yuval Noah Harari',
    price: 129000,
    cover: 'https://picsum.photos/seed/book3/400/560',
    category: 'Lịch sử',
    description:
      'Một góc nhìn tổng quan về lịch sử loài người, từ thời kỳ đồ đá cho đến cuộc cách mạng khoa học và công nghệ hiện đại.',
  },
  {
    id: 4,
    title: 'Điều Kỳ Diệu Của Tiệm Tạp Hoá Namiya',
    author: 'Higashino Keigo',
    price: 98000,
    cover: 'https://picsum.photos/seed/book4/400/560',
    category: 'Văn học',
    discountPercent: 15,
    description:
      'Những lá thư gửi đến một tiệm tạp hoá cũ kỹ vượt thời gian, kết nối quá khứ và hiện tại, mang đến câu chuyện ấm áp về sự sẻ chia.',
  },
  {
    id: 5,
    title: 'Muôn Kiếp Nhân Sinh',
    author: 'Nguyên Phong',
    price: 150000,
    cover: 'https://picsum.photos/seed/book5/400/560',
    category: 'Kỹ năng sống',
    description:
      'Hành trình khám phá luân hồi và nhân quả qua nhiều kiếp sống, mở ra nhiều góc nhìn về cách con người nhìn nhận cuộc sống.',
  },
  {
    id: 6,
    title: 'Cách Nghĩ Để Thành Công',
    author: 'Napoleon Hill',
    price: 79000,
    cover: 'https://picsum.photos/seed/book6/400/560',
    category: 'Kinh tế',
    isNew: true,
    description:
      'Đúc kết các nguyên tắc tư duy và hành động hướng đến thành công, được trình bày theo cách dễ đọc và dễ áp dụng.',
  },
];
