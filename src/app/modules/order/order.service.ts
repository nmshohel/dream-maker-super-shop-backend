/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { OrderSearchableFields } from './order.constrant';
import { OrderFilterRequest } from './order.interface';
import { generateOrderId } from './order.utils';
const insertIntoDB = async (
  userData: any,
  requestUser: { email: string; role: string }
): Promise<any> => {
  const {product,...others}=userData
  const data=product
  const generatedOrderId=await generateOrderId()
  let userOrderType = others.orderType;
  userOrderType = userOrderType?userOrderType: "cashOnDelivery";
  const authUser = await prisma.user.findFirst({
    where: {
      email: requestUser?.email,
    },
  });
  if (!authUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Found');
  }
  let userShippingAddress=await prisma.shippingAddress.findFirst({
    where:{
      userEmail:requestUser?.email,
    }
  })
  // if(!userShippingAddress?.districtId ||
  //    !userShippingAddress?.postCode ||
  //     !userShippingAddress?.divisionId ||
  //      !userShippingAddress?.thanaId ||
  //      !userShippingAddress?.houseBuildingStreet 

  //   )
  // {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "User Shipping Address Not found")
  // }
  let userOrder: any | undefined;
  let totalPrice:number=0
  let totalDiscount:number=0
  let userOrderedProduct: { orderId: string; productId: string; quantity: string }[] =
    [];
  await prisma.$transaction(async transactionClient => {
    
          // if(userOrderType===undefined)
          // {
          //   throw new ApiError(httpStatus.BAD_REQUEST, "undidiend")
          // }
      userOrder = await transactionClient.order.create({
        data: {
          userEmail: others?.email,
          orderType:userOrderType,
          orderId:generatedOrderId,
          divisionId:others?.divisionId,
          districtId:others?.districtId,
          thanaId:others?.thanaId,
          postCode:others?.postCode,
          houseBuildingStreet:others?.houseBuildingStreet,
          contactNo:others?.contactNo,
          name:others.name,
          totalPrice: totalPrice.toString(), // Add this line
          totaldiscount: totalDiscount.toString(), // Add this line

        },
      });

      
//start loop
    for (let index = 0; index < data.length; index++) {
        const product=await transactionClient.product.findFirst({
          where:{
            id:data[index].productId
          }
        })
        if(!product)
        {
          throw new ApiError(httpStatus.BAD_REQUEST, "Product Not Found")
        }

          //sum of total price and total discount
        if(product.discount)
        {
          totalDiscount=totalDiscount+(parseInt(product.discount)*parseInt(data[index].quantity))
        }
        if(product.price)
        {
          totalPrice=totalPrice+(parseInt(product.price)*parseInt(data[index].quantity))
        }


        const newOrderedProduct = await transactionClient.orderedProduct.create({
          data: {
            orderId: userOrder.orderId,
            productId: data[index].productId,
            quantity: String(data[index].quantity),
            price:product.price,
            discount:product.discount
          },
        });

//   for decrease order quantity
        const productsQuantity = await transactionClient.product.findFirst({
          where: {
            id: newOrderedProduct.productId,
          },
        });

        const products = await transactionClient.product.update({
          where: {
            id: newOrderedProduct.productId,
          },
          data: {
            quantity: (
              Number(productsQuantity?.quantity) - Number(newOrderedProduct.quantity)
            ).toString(),
          },
        });

        userOrderedProduct.push(newOrderedProduct);
 
    }//end loop

    userOrder=await transactionClient.order.update({
      where:{
        id:userOrder?.id
      },
      data:{
        totaldiscount:totalDiscount.toString(),
        totalPrice:totalPrice.toString(),
      }

    })

    const shippingAddress=await transactionClient.shippingAddress.update({
      where:{
        userEmail:requestUser.email
      },
      data:{
        userEmail:others.email,
        divisionId:others.divisionId,
        districtId:others.districtId,
        thanaId:others.thanaId,
        houseBuildingStreet:others.houseBuildingStreet,
        postCode:others.postCode
      }
    })
    const userDataUpdate=await transactionClient.user.update({
      where:{
        email:requestUser.email
      },
      data:{
        name:others.name,
        contactNo:others.contactNo,
      }
    })



  });//end transction
  return { userOrder, userOrderedProduct: userOrderedProduct };
};

const getAllFromDB = async (
  filters: OrderFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Order[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: OrderSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: { OrderedProduct: true },
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.order.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
const getAllFromDBByCustomer = async (
  filters: OrderFilterRequest,
  options: IPaginationOptions,
  requestUser: any
): Promise<IGenericResponse<Order[]>> => {
  const order=await prisma.order.findFirst({
    where:{
      userEmail:requestUser?.email
    }
  })
  if(!order)
  {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order Not Found")
  }
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: OrderSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  console.log('requestUser', requestUser);
  const result = await prisma.order.findMany({
    where: { ...whereConditions, userEmail: requestUser.email },
    skip,
    take: limit,
    include: { OrderedProduct: true,user:true, },
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.order.count({
    where: { userEmail: requestUser.email },
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (
  id: string,
  requestUser: any
): Promise<Order | null> => {
  const order=await prisma.order.findFirst({
    where:{
      orderId:id
    }
  })
  if(!order)
  {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order Not Found")
  }
  console.log('requestUser', requestUser);
  const result = await prisma.order.findUnique({
    where: {
      orderId:id
    },
    include: {
      OrderedProduct: true,
    },
  });
  return result;
};
const deleteById = async (id: string): Promise<Order | null> => {
  const order = await prisma.order.findFirst({
    where: {
      orderId: id
    }
  });

  if (!order) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order Not Found");
  }

  let deletedOrder;

  await prisma.$transaction(async (tc) => {
    // Delete associated orderedProduct records first
    const deletedOrderProduct = await prisma.orderedProduct.deleteMany({
      where: {
        orderId: id
      },
    });

    // Now, delete the order
    deletedOrder = await prisma.order.delete({
      where: {
        orderId: id
      },
      include: {
        OrderedProduct: true,
        division:true,
        district:true,
        thana:true

      }
    });
  });

  return deletedOrder!;
};


const updateIntoDB = async (
  id: string,
  payload: Partial<Order>
): Promise<Order> => {
  const order=await prisma.order.findFirst({
    where:{
      orderId:id
    }
  })
  if(!order)
  {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order Not Found")
  }
  const result = await prisma.order.update({
    where: {
      orderId:id
    },
    include:{OrderedProduct:true},
    data: payload,
  });
  return result;
};
export const OrderService = {
  getAllFromDBByCustomer,
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteById,
};
