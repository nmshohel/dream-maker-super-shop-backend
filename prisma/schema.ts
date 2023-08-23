// model User{
//   id String @id @default(uuid())
//   mobileNo String
//   password String
//   role String
//   pbsCode String
//   pbs PBS @relation(fields: [pbsCode], references: [id])
//   zonalCode String
//   zonals Zonals @relation(fields: [zonalCode], references: [id])
//   substationCode String
//   substation Substation @relation(fields: [substationCode], references: [id])
//   complainCode String
//   complainCenter ComplainCenter @relation(fields: [complainCode], references: [id])
//   employeeId Employee
//   capitalItem CapitalItem[]
//   revenueItem RevenueItem[]
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   @@map("users")
// }

// model Employee{
//   id String @id @default(uuid())
//   name String
//   designation String
//   phone String
//   address String
//   trgId String
//   photoUrl String
//   signUrl String
//   userInfoId String  @unique
//   user User @relation(fields: [userInfoId], references: [id])
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   @@map("employees")
// }

// model Department{
//   id String @id @default(uuid())
//   title String
//   designation Designation[]
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   @@map("departments")
// }

// model Designation{
//   id String @id @default(uuid())
//   title String
//   departmentId String
//   department Department @relation(fields: [departmentId], references: [id])
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   @@map("designations")
// }

// model ItemType{
//   id String @id @default(uuid())
//   itemType String
//   category Category[]
//   subCategory SubCategory[]
//   capitalItem CapitalItem[]
//   revenueItem RevenueItem[]
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   @@map("item_type")
// }

// model Category{
//   id String @id @default(uuid())
//   categoryName String
//   itemTypeId String
//   capitalItem CapitalItem[]
//   itemType ItemType @relation(fields: [itemTypeId], references: [id])
//   subCategory SubCategory[]
//   revenueItem RevenueItem[]
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   @@map("category")
// }
// model SubCategory{
//   id String @id @default(uuid())
//   subCategoryCame String
//   itemTypeId String
//   itemType ItemType @relation(fields: [itemTypeId], references: [id])
//   categoryId String
//   category Category @relation(fields: [categoryId], references: [id])
//   capitalItem CapitalItem[]
//   revenueItem RevenueItem[]
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   @@map("sub_category")
// }
// model Brand{
//   id String @id @default(uuid())
//   brandName String
//   pbsCode String
//   pbs PBS @relation(fields: [pbsCode], references: [id])
//   zonalCode String
//   zonals Zonals @relation(fields: [zonalCode], references: [id])
//   substationCode String
//   substation Substation @relation(fields: [substationCode], references: [id])
//   complainCode String
//   complainCenter ComplainCenter @relation(fields: [complainCode], references: [id])
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   @@map("brand")
// }
// model Model{
//   id String @id @default(uuid())
//   brandName String
//   pbsCode String
//   pbs PBS @relation(fields: [pbsCode], references: [id])
//   zonalCode String
//   zonals Zonals @relation(fields: [zonalCode], references: [id])
//   substationCode String
//   substation Substation @relation(fields: [substationCode], references: [id])
//   complainCode String
//   complainCenter ComplainCenter @relation(fields: [complainCode], references: [id])
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   @@map("model")
// }

// model CapitalItem{
//   id String @id @default(uuid())
//   itemName String
//   modelNo String
//   brand String
//   serialNo String
//   description String
//   purchaseNate String
//   price String
//   warranty String
//   identificationNo String
//   status String
//   pbsCode String
//   pbs PBS @relation(fields: [pbsCode], references: [id])
//   zonalCode String
//   zonals Zonals @relation(fields: [zonalCode], references: [id])
//   complainId String
//   complainCenter ComplainCenter @relation(fields: [complainId], references: [id])
//   substationId String
//   substation Substation @relation(fields: [substationId], references: [id])
//   itemTypeId String
//   itemType ItemType @relation(fields: [itemTypeId], references: [id])
//   categoryId String
//   category Category @relation(fields: [categoryId], references: [id])
//   subCategoryid String
//   subCategory SubCategory @relation(fields: [subCategoryid], references: [id])
//   assignTo String
//   user User @relation(fields: [assignTo], references: [id])
//   supplierId String
//   supplier Supplier @relation(fields: [supplierId], references: [id])
//   issueById String
//   approveById String
//   receiveById String

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   @@map("capital_item")
// }

// model RevenueItem{
//   id String @id @default(uuid())
//   itemName String
//   modelNo String
//   brand String
//   description String
//   purchaseNate String
//   Price String
//   warranty String
//   status String
//   pbsCode String
//   pbs PBS @relation(fields: [pbsCode], references: [id])
//   zonalCode String
//   zonals Zonals @relation(fields: [zonalCode], references: [id])
//   complainId String
//   complainCenter ComplainCenter @relation(fields: [complainId], references: [id])
//   substationId String
//   substation Substation @relation(fields: [substationId], references: [id])
//   itemTypeId String
//   itemType ItemType @relation(fields: [itemTypeId], references: [id])
//   categoryId String
//   category Category @relation(fields: [categoryId], references: [id])
//   subCategoryid String
//   subCategory SubCategory @relation(fields: [subCategoryid], references: [id])
//   assignTo String
//   user User @relation(fields: [assignTo], references: [id])
//   supplierId String
//   supplier Supplier @relation(fields: [supplierId], references: [id])
//   issueById String
//   approveById String
//   receiveById String

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   @@map("revenue_item")
// }
// model Survicing{
//   id String @id @default(uuid())
//   identificationNo String
//   itemType String
//   category String
//   subCategory String
//   cost String
//   supplier String
//   survicingDate String
//   supervisedBy String
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   @@map("survicing")
// }

// model Supplier{
//   id String @id @default(uuid())
//   name String
//   address String
//   phone String
//   pbsCode String
//   pbs PBS @relation(fields: [pbsCode], references: [id])
//   capitalItem CapitalItem[]
//   revenueItem RevenueItem[]
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   @@map("suppliers")
// }

// model Role{
//   id String @id @default(uuid())
//   employee String
//   storeInCharge String
//   approve String
//   zonalHead String
//   admin String
//   superAdmin String
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   @@map("role")
// }
