import { Governorate } from '../types';

export const EGYPT_GOVERNORATES: Governorate[] = [
  { id: 'cairo', nameAr: 'القاهرة', nameEn: 'Cairo', shippingCost: 50, deliveryDays: '1 - 2 يوم' },
  { id: 'giza', nameAr: 'الجيزة', nameEn: 'Giza', shippingCost: 50, deliveryDays: '1 - 2 يوم' },
  { id: 'alexandria', nameAr: 'الإسكندرية', nameEn: 'Alexandria', shippingCost: 60, deliveryDays: '2 - 3 أيام' },
  { id: 'qalyubia', nameAr: 'القليوبية', nameEn: 'Qalyubia', shippingCost: 55, deliveryDays: '2 - 3 أيام' },
  { id: 'sharqia', nameAr: 'الشرقية (الزقازيق / العاشر)', nameEn: 'Sharqia', shippingCost: 65, deliveryDays: '2 - 3 أيام' },
  { id: 'dakahlia', nameAr: 'الدقهلية (المنصورة)', nameEn: 'Dakahlia (Mansoura)', shippingCost: 65, deliveryDays: '2 - 3 أيام' },
  { id: 'gharbia', nameAr: 'الغربية (طنطا / المحلة)', nameEn: 'Gharbia (Tanta)', shippingCost: 65, deliveryDays: '2 - 3 أيام' },
  { id: 'monufia', nameAr: 'المنوفية', nameEn: 'Monufia', shippingCost: 65, deliveryDays: '2 - 3 أيام' },
  { id: 'beheira', nameAr: 'البحيرة (دمنهور)', nameEn: 'Beheira', shippingCost: 65, deliveryDays: '2 - 3 أيام' },
  { id: 'kafr_el_sheikh', nameAr: 'كفر الشيخ', nameEn: 'Kafr El-Sheikh', shippingCost: 70, deliveryDays: '3 - 4 أيام' },
  { id: 'damietta', nameAr: 'دمياط', nameEn: 'Damietta', shippingCost: 70, deliveryDays: '2 - 3 أيام' },
  { id: 'port_said', nameAr: 'بورسعيد', nameEn: 'Port Said', shippingCost: 70, deliveryDays: '2 - 3 أيام' },
  { id: 'ismailia', nameAr: 'الإسماعيلية', nameEn: 'Ismailia', shippingCost: 70, deliveryDays: '2 - 3 أيام' },
  { id: 'suez', nameAr: 'السويس', nameEn: 'Suez', shippingCost: 70, deliveryDays: '2 - 3 أيام' },
  { id: 'fayoum', nameAr: 'الفيوم', nameEn: 'Fayoum', shippingCost: 75, deliveryDays: '3 - 4 أيام' },
  { id: 'beni_suef', nameAr: 'بني سويف', nameEn: 'Beni Suef', shippingCost: 75, deliveryDays: '3 - 4 أيام' },
  { id: 'minya', nameAr: 'المنيا', nameEn: 'Minya', shippingCost: 80, deliveryDays: '3 - 5 أيام' },
  { id: 'assiut', nameAr: 'أسيوط', nameEn: 'Assiut', shippingCost: 85, deliveryDays: '3 - 5 أيام' },
  { id: 'sohag', nameAr: 'سوهاج', nameEn: 'Sohag', shippingCost: 90, deliveryDays: '4 - 5 أيام' },
  { id: 'qena', nameAr: 'قنا', nameEn: 'Qena', shippingCost: 95, deliveryDays: '4 - 6 أيام' },
  { id: 'luxor', nameAr: 'الأقصر', nameEn: 'Luxor', shippingCost: 95, deliveryDays: '4 - 6 أيام' },
  { id: 'aswan', nameAr: 'أسوان', nameEn: 'Aswan', shippingCost: 100, deliveryDays: '4 - 6 أيام' },
  { id: 'red_sea', nameAr: 'البحر الأحمر (الغردقة)', nameEn: 'Red Sea (Hurghada)', shippingCost: 100, deliveryDays: '3 - 5 أيام' },
  { id: 'matrouh', nameAr: 'مطروح والساحل الشمالي', nameEn: 'Matrouh / North Coast', shippingCost: 100, deliveryDays: '3 - 5 أيام' },
];

export const FREE_SHIPPING_THRESHOLD = 1000;
