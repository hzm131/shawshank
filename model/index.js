const { knex } = require('../services/db')

const bookshelf = require('bookshelf')(knex)

bookshelf.plugin('pagination')
bookshelf.plugin('registry')

const User = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'users',
  login_logs: function() {
    return this.hasMany(UserLoginLog, 'user_id')
  },
  person: function() {
    return this.belongsTo(Person, 'person_id')
  }
})

const UserLoginLog = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'user_login_logs',
  user: function() {
    return this.belongsTo(User, 'user_id')
  }
})

const Organization = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'organizations',
  supplier: function() {
    return this.hasOne(Supplier, 'organization_id')
  },
  store: function(){
    return this.hasMany(Store,'organization_id')
  }
})

const OperationRecord = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'operation_records'
})

const PurchaseOrder = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'purchase_orders',
  supplier: function() {
    return this.belongsTo(Supplier, 'supplier_id')
  },
  purchaser: function() {
    return this.belongsTo(Purchaser, 'purchaser_id')
  },
  photos: function() {
    return this.hasMany(PurchaseOrderPhoto, 'purchase_order_id')
  }
})

const Supplier = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'suppliers',
  organization: function() {
    return this.belongsTo(Organization, 'organization_id')
  }
})

const Person = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'people',
  purchaser: function() {
    return this.hasOne(Purchaser, 'person_id')
  },
  user: function() {
    return this.hasOne(User, 'person_id')
  },
  customer: function () {
    return this.hasMany(Customer, 'person_id')
  },
  assembler: function(){
    return this.hasMany(Assembler, 'person_id')
  },
  salesman:function(){
    return this.hasMany(Salesman,'salesman_id')
  }
})

const Purchaser = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'purchasers',
  person: function() {
    return this.belongsTo(Person)
  },
  purchaseOrder: function() {
    return this.hasMany(PurchaseOrder, 'purchaser_id')
  }
})

const Package = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'packages',
  productInstances: function() {
    return this.hasMany(ProductInstance, 'package_id')
  },
  container: function() {
    return this.belongsTo(Container, 'container_id')
  }
})

const ProductInstance = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'product_instances',
  product: function() {
    return this.belongsTo(Product, 'product_id')
  },
  package: function() {
    return this.belongsTo(Package, 'package_id')
  },
  priceTag: function(){
    return this.hasMany(PriceTag, 'product_instance_id')
  },
  orderProductItem: function(){
    return this.hasMany(OrderProductItem, 'product_instance_id')
  }
})

const Product = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'products',
  purchaseOrder: function() {
    return this.belongsTo(PurchaseOrder, 'purchase_order_id')
  },
  productInstances: function() {
    return this.hasMany(ProductInstance, 'product_id')
  },
})

const Prescription = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'prescriptions',
  order: function(){
    return this.hasMany(Order,'prescription_id')
  },
  optometrist: function () {
    return this.belongsTo(Optometrist, 'optometrist_id')
  }
})

const PurchaseOrderPhoto = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'purchase_order_photos',
  purchaseOrder: function() {
    return this.belongsTo(PurchaseOrder, 'purchase_order_id')
  }
})

const Container = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'containers',
  package: function() {
    return this.hasMany(Package, 'container_id')
  }
})

const BeforePosData = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'before_pos_data',
})

const OrderProductItem = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'order_product_items',
  productInstances: function(){
    return this.belongsTo(ProductInstance, 'product_instance_id')
  },
  order: function(){
    return this.belongsTo(Order,'order_id')
  }
})

const Order = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'orders',
  orderProductItem: function(){
    return this.hasMany(OrderProductItem, 'order_product_item')
  },
  prescription: function(){
    return this.belongsTo(Prescription, 'prescription_id')
  },
  customer: function(){
    return this.belongsTo(Customer, 'customer_id')
  },
  assembler: function(){
    return this.belongsTo(Assembler, 'assembler_id')
  },
  salesman:function() {
    return this.belongsTo(Salesman,'salesman_id')
  },
  store:function(){
    return this.belongsTo(Store,'store_id')
  }
})

const Customer = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'customers',
  order: function(){
    return this.hasMany(Order, 'customer_id')
  },
  person: function(){
    return this.belongsTo(Person, 'person_id')
  }
})

const Assembler = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'assemblers',
  order: function(){
    return this.hasMany(Order, 'assembler_id')
  },
  person: function(){
    return this.belongsTo(Person, 'person_id')
  }
})

const Optometrist = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'optometrists',
  prescription: function(){
    return this.hasMany(Prescription, 'optometrist_id')
  },
  person: function(){
    return this.belongsTo(Person, 'person_id')
  }
})

const Salesman = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'salesmen',
  person: function(){
    return this.belongsTo(Person, 'person_id')
  },
  order:function(){
    return this.hasMany(Order, 'salesman_id')
  }
})

const PriceTag = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'price_tags',
  productInstances: function(){
    return this.belongsTo(ProductInstance, 'product_instance_id')
  },
})

const Store = bookshelf.Model.extend({
  hasTimestamps: true,
  tableName: 'stores',
  organization: function (){
    return this.belongsTo(Organization, 'organization_id')
  },
  order:function (){
    return this.hasMany(Order, 'store_id')
  }
})

module.exports = {
  knex,
  User,
  UserLoginLog,
  Organization,
  OperationRecord,
  PurchaseOrder,
  Supplier,
  Person,
  Purchaser,
  Package,
  ProductInstance,
  Product,
  Prescription,
  PurchaseOrderPhoto,
  Container,
  BeforePosData,
  OrderProductItem,
  Customer,
  Assembler,
  Optometrist,
  PriceTag,
  Order,
  Salesman,
  Store
}
