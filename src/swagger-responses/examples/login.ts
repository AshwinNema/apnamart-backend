import {
  AddressType,
  MerchantRegistrationStatus,
  UserRole,
} from '@prisma/client';

export const adminLoginExample = {
  id: 1,
  name: 'Ashwin',
  email: 'ashwinnema06@gmail.com',
  userRoles: [UserRole.admin],
  phoneNo: null,
  photo: null,
  cloudinary_public_id: null,
  isBlackListed: false,
  archive: false,
  role: UserRole.admin,
};

export const addressExample = {
  id: 1,
  userId: 3,
  latitude: '24.6079710847333',
  longtitude: '76.50963025910778',
  addressType: AddressType.home,
  addressLine1: '401,',
  addressLine2: 'D.K. Gold Apartment',
  otherAddress: '',
  createdAt: '2024-12-07T11:07:56.318Z',
  updatedAt: '2024-12-08T09:06:50.674Z',
  archive: false,
};

export const customerLoginResponse = {
  id: 3,
  name: 'Customer',
  email: 'ashwin4589@gmail.com',
  userRoles: [UserRole.customer],
  phoneNo: null,
  photo: null,
  cloudinary_public_id: null,
  isBlackListed: false,
  archive: false,
  address: addressExample,
  role: UserRole.customer,
};

export const merchantRegistrationDetailsExample = {
  id: 2,
  isMerchantBlocked: false,
  registrationStatus: MerchantRegistrationStatus.completed,
  userId: 4,
  latitude: '18.51397865227429',
  longtitude: '73.8360162863335',
  addressLine1: '456 Market Street',
  addressLine2: 'Building 9, Floor 3',
  pinCode: 482002,
  bankAcNo: '86969666863',
  gstIn: '29GGGGG1314R9Z6',
  panCard: 'BAJPC4350M',
  photo:
    'https://res.cloudinary.com/ash006/image/upload/v1730952890/ghhrbyl6etjijcjc0wpt.png',
  cloudinary_public_id: 'ghhrbyl6etjijcjc0wpt',
  name: 'Hira Electronics',
  description:
    "Business Description for an Electronics Store\nStore Name: Tech Haven\nOverview:\nTech Haven is a premier electronics store dedicated to providing customers with the latest and most innovative technology products. Located in the heart of the community, we offer a wide range of electronics, including smartphones, laptops, tablets, smart home devices, audio equipment, and accessories. Our mission is to empower customers with the tools they need to enhance their digital lifestyles while delivering exceptional customer service and expert advice.\nProduct Range:\nAt Tech Haven, we pride ourselves on our diverse selection of high-quality electronics from leading brands. Our inventory includes:\nSmartphones & Accessories: The latest models from top manufacturers, along with cases, chargers, and screen protectors.\nComputers & Laptops: A variety of desktops and laptops suitable for gaming, business, and everyday use, along with peripherals like keyboards, mice, and monitors.\nHome Entertainment: TVs, sound systems, and streaming devices to create the ultimate home theater experience.\nSmart Home Devices: Smart speakers, security cameras, and home automation products to enhance convenience and security.\nWearable Technology: Smartwatches and fitness trackers that help customers stay connected and monitor their health.\nCustomer Experience:\nTech Haven is committed to providing an exceptional shopping experience. Our knowledgeable staff is always on hand to assist customers with product selection, answer questions, and provide demonstrations. We also offer personalized consultations to help customers find the right solutions for their needs.\nServices:\nIn addition to our product offerings, Tech Haven provides a range of services, including:\nTech Support: On-site assistance for troubleshooting and setup of electronic devices.\nRepair Services: Fast and reliable repair services for smartphones, tablets, and laptops.\nWorkshops & Events: Regular workshops and events to educate customers on the latest technology trends and product usage.\nCommunity Engagement:\nTech Haven believes in giving back to the community. We actively participate in local events, sponsor tech education programs, and offer discounts to students and educators.\nConclusion:\nAt Tech Haven, we are passionate about technology and dedicated to helping our customers navigate the ever-evolving world of electronics. Whether you're a tech enthusiast or a casual user, we have the products and expertise to meet your needs. Visit us today and discover the future of technology!",
  createdAt: '2024-11-07T04:14:50.763Z',
  updatedAt: '2024-11-07T04:17:49.690Z',
};

export const merchantLoginResponse = {
  id: 4,
  name: 'Ashwin',
  email: 'ashwin.merchant@gmail.com',
  userRoles: [UserRole.merchant],
  phoneNo: null,
  photo: null,
  cloudinary_public_id: null,
  isBlackListed: false,
  merchantDetails: merchantRegistrationDetailsExample,
  role: UserRole.merchant,
};
